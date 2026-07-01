# Events Cache

We pre-fetch on-chain events for Dual Governance proposals and Aragon votes, store them as static JSON shipped with the app, and verify that the committed cache is structurally sound and consistent with the chain.

Proposals and votes are two independent copies of the same pattern. The proposals section below is the reference; the votes section only describes where it differs.

## Why a cache exists

To render a proposal or a vote we need its lifecycle events (`Submitted` / `Scheduled` / `Executed` for proposals, `StartVote` / `CastVote` / `ExecuteVote` for votes). Fetching them at runtime requires a `getLogs` scan per item, which is slow and spends RPC rate-limit budget on data that no longer changes once the item is terminal.

So we fetch those events at build time, commit the result to `public/`, and serve it as a static asset. The runtime uses the same `isCachedProposalComplete` / `isCachedVoteComplete` predicates as the builder (see [Incremental rebuilds](#incremental-rebuilds)). A live item (open vote, non-final proposal) fails the predicate, so the runtime ignores the static cache for that id and fetches fresh events from RPC instead.

The cache holds terminal items only. An entry is written and frozen once the item reaches a final, immutable state; anything still in flight is left out so the runtime always re-fetches it.

Terminal means:

- Proposals: `Executed` (status 3) or `Cancelled` (status 4)
- Votes: `open === false` and (`executed === true` or no longer enactable)

## On-disk layout

```
public/proposals-events/<chainId>/
  manifest.json
  chunk-0.<hash>.json
  chunk-1.<hash>.json
  ...

public/votes-events/<chainId>/<votingAddress>/
  manifest.json
  descriptions.json
  chunk-0.<hash>.json
  ...
```

- Entries are partitioned into chunks of 10 (`PROPOSALS_PER_CHUNK` / `VOTES_PER_CHUNK`). The chunk index for id `N` is `floor((N - firstId) / 10)`.
- Each chunk filename embeds a content hash: the first 10 hex chars of `sha256` over the serialized chunk. Identical content produces an identical filename, so an unchanged chunk is left untouched on rebuild (less git churn). Changed content gets a new filename, and the old file is removed as an orphan.
- `manifest.json` records `{ chunkSize, firstId, lastId, chunks: { <index>: <filename> } }`, which maps each chunk index to its file.
- Votes also ship `descriptions.json` (`id -> { creator, metadata, description }`) so the dashboard and search can read titles without loading full chunks.

## Building the cache

```bash
yarn build-dg-events       # proposals  -> public/proposals-events/
yarn build-vote-events     # votes      -> public/votes-events/
yarn build-all-events      # both, sequentially
```

Both read `SUPPORTED_CHAINS` and a per-chain `EL_RPC_URLS_<chainId>` from `.env.local` (via `node --env-file=.env.local`). If no RPC client can be created for any supported chain, the build throws instead of emitting an empty cache.

### Proposals build (`scripts/proposals/build-proposals-events.mjs`)

Per chain:

1. Read `getProposalsCount()` from the `EmergencyProtectedTimelock` (EPT). The address comes from `constants/historical-addresses.mjs`. If the count is `0` but the cache has entries (a possible devnet reset), the build warns and wipes.
2. Fetch `getProposalDetails(id)` for every id `1..count` (parallel, `Promise.allSettled`).
3. Load the existing cache from disk (`readExistingChainData`).
4. Seed the next cache with prior entries whose on-chain `status` is unchanged. Entries whose status moved are dropped and re-fetched.
5. For each proposal, decide whether to skip (see [Incremental rebuilds](#incremental-rebuilds)). If not skipped, fetch the three lifecycle events:
   - `proposalSubmittedEvent` from the governance addresses, located by timestamp then block range.
   - `proposalScheduledEvent` from EPT.
   - `proposalExecutedEvent` from EPT, a chunked scan from the scheduled block to head, only when status is `Executed`.
6. Write chunks and manifest, removing orphaned chunk files.

### Votes build (`scripts/votes/build-votes-events.mjs`)

Per chain, per voting contract address (`VOTING_ADDRESSES`; mainnet has one, Hoodi has two):

1. Read `votesLength()` from the Aragon `Voting` contract.
2. Compute the vote-phase window in blocks: `(voteTime + objectionPhaseTime) / 12s + 100-block buffer` (`fetchVotePhaseBlocks`). This bounds the `CastVote` scan.
3. Fetch `getVote(id)` and `canExecute(id)` for every id (batched, `BUILD_FETCH_CONCURRENCY = 10`).
4. Carry forward cached entries for ids not seen on-chain this run. For each fetched vote, skip or re-fetch (see below).
5. For a vote being (re)built, fetch:
   - `startVoteEvent`: a single `getLogs` at the snapshot block (`StartVote`, `voteId` indexed).
   - `executeVoteEvent`: a chunked scan, only when `executed`.
   - `CastVote` and `AttemptCastVoteAsDelegate`: scanned over `[snapshotBlock, snapshotBlock + votePhaseBlocks]`, then reduced into a per-voter list (latest vote wins; delegated votes nested under the delegate). See `processCastVoteEvents`.
   - `description`: resolved from IPFS via the `StartVote` metadata CID.
6. Write chunks, manifest, and `descriptions.json`.

### `getLogs` chunking

RPC providers cap `getLogs` block ranges. Both domains scan in windows of `CHUNK_SIZE = 4999` blocks, with at most `CONCURRENT_LIMIT = 3` windows in flight and a 100 ms pause between batches (`processChunksInBatches`). The vote `CastVote` fetcher tries one full-range call first (cheap, since `voteId` is indexed) and only falls back to chunked scanning if the RPC rejects the range.

Proposal `Submitted` and `Scheduled` events are located by timestamp. `getBlockByTimestamp` asks Etherscan for the block at the event's timestamp (validating `data.status === '1'`), falls back to an on-chain binary search if Etherscan fails, then scans a `±2499`-block window around it.

## Incremental rebuilds

Rebuilds are incremental: a terminal, fully-cached entry is not re-fetched. The predicate that decides "terminal and complete" lives in `utils/cache/status.mjs` and is shared by the builders and the runtime. If it is wrong, the build either freezes stale data or re-fetches everything on every run.

### Proposals

```js
isCachedProposalFinal(cached); // status in {Executed(3), Cancelled(4)}
// AND proposalSubmittedEvent present
// AND (not Executed OR proposalExecutedEvent present)

isCachedProposalComplete(cached, proposal); // isCachedProposalFinal AND cached.status === fresh.status
```

The builder skips a proposal only when `isCachedProposalComplete(cached, proposal)` holds: the cached status is terminal, the required events are present, and it equals the freshly-fetched status. The skip is keyed on the cached numeric status enum plus event presence, never on the fresh status alone. A proposal that turns terminal after being cached, or an older-schema entry missing an event, is re-fetched rather than frozen.

### Votes

```js
isCachedVoteComplete(cached);
// requires voteDetails + startVoteEvent, then:
// if executed   -> executeVoteEvent must be present
// else          -> open === false AND canExecute === false
```

A closed-but-still-enactable vote (`open === false`, `canExecute === true`) is not complete: someone can still enact it, so it stays out of the frozen set until it is executed or no longer executable.

Note: `isCachedVoteComplete` ties completeness to the volatile `canExecute` flag. That is correct for the runtime (a passed-but-unenacted vote must keep hitting RPC), but it makes the build re-fetch such votes on every run. The CI completeness check (below) uses its own event-presence predicate for this reason; the two should stay separate.

### The empty-result trap

A build-time event fetcher that returns `[]` on a transient RPC failure makes a failed scan indistinguishable from a genuinely empty result. If the skip predicate trusted "cache exists and is non-empty", it could either freeze a partial entry or force a re-fetch of legitimately empty terminal entries on every build. The rule is to signal failure at the source (throw or sentinel) so the per-item processor skips persisting a partial entry and retries next run, rather than handle it in the skip predicate.

## Validating the cache

There are two layers.

### 1. CI structural and completeness check (`yarn check-all-cache`)

```bash
yarn check-dg-cache      # scripts/proposals/check-proposals-cache.mjs
yarn check-vote-cache    # scripts/votes/check-votes-cache.mjs
yarn check-all-cache
```

Runs in CI on pull requests targeting `develop` or `main` (`.github/workflows/cache-check.yml`). It uses no secrets: keyless public RPC endpoints (`utils/public-rpc.mjs`) and ABIs read via `readFileSync` so it stays Node-version-agnostic. Two passes, with shared mechanics in `scripts/cache-base-check.mjs`.

Pass A, structural (`checkManifestStructure`), for each chain/address with a manifest:

- every manifest-referenced chunk file exists and parses as JSON;
- each chunk's content hash is reproduced from its data (using the same serializer the builder used) and matches the filename, which detects a hand-edited or stale chunk;
- every id sits in the chunk its position dictates (`floor((id - firstId) / 10)`);
- per-entry shape is valid (`checkEntryShape`): proposals need `submittedEvent`, a numeric `status`, and an address `executor`; votes need `voteDetails` with boolean `open`/`executed`, a `startVoteEvent`, and an array `voteEvents`;
- no orphan `chunk-*.json` exists that the manifest does not reference.

Pass B, completeness against chain: read `getProposalsCount` / `votesLength` from public RPC, then for every id the cache does not already mark terminal-and-complete, read its on-chain status. If the chain reports it terminal (proposal status final, vote closed) but the cache is missing or incomplete, the check fails with a "rebuild with `yarn build-...`" message.

Pass B uses its own event-presence predicates: `isCachedProposalFinal` for proposals, and a local `hasCachedVoteEvents` for votes (which checks `executeVoteEvent` only when on-chain `executed`, ignoring `canExecute`). Using the build-time `isCachedVoteComplete` here would force a perpetual re-fetch of passed-but-unenacted votes.

### 2. Deep on-chain validation (`yarn validate-all-events`)

```bash
yarn validate-dg-events     # scripts/proposals/validate-proposals-events.mjs
yarn validate-vote-events   # scripts/votes/validate-votes-events.mjs
yarn validate-all-events    # both; exits non-zero if either fails
```

Heavier and secret-bearing (`--env-file=.env.local`, your own `EL_RPC_URLS_*`), with a 1 s pause between items. Run it locally after a rebuild, not in CI. For every cached entry it diffs the cache against the chain field by field (`scripts/cache-entry-diff.mjs`):

- Details: re-read `getProposalDetails` / `getVote` + `canExecute` and diff every field (`canExecute` is ignored for votes, it is volatile).
- Events: fetch each cached event's transaction receipt, locate the matching log, and verify `blockNumber`, decoded args (`creator`, `metadata`, `proposerAccount`, etc.), and block timestamp where applicable.
- Vote tallies: re-scan `CastVote`, confirm the cached per-voter list matches the chain (no missing or extra voters, matching `supports`/`stake`) and that the yea/nay sums equal `getVote.yea` / `nay`.
- Flags votes that are open on-chain but present in cache (which should not happen, since the cache is terminal-only).

|          | `check-*-cache`                            | `validate-*-events`             |
| -------- | ------------------------------------------ | ------------------------------- |
| Runs in  | CI (pull requests to `develop`/`main`)     | locally, after rebuild          |
| Secrets  | none (public RPC)                          | yes (`.env.local`)              |
| Cost     | light                                      | heavy (per-receipt, 1 s/item)   |
| Verifies | manifest, hashes, shape, terminal coverage | full field-level chain equality |

## Runtime consumption

The app reads the static manifest and chunks for terminal items, and falls back to RPC for live ones, gated by the same `utils/cache/status.mjs` predicates the build uses. This is why a closed-but-enactable vote keeps updating in the UI after enactment: it is never served from the frozen cache.

## When CI `check-all-cache` fails

The check runs on pull requests targeting `develop` or `main` (`.github/workflows/cache-check.yml`). A failure is one of two kinds.

Structural / hash mismatch:

- Cause: a chunk file was edited by hand, or the builder's serializer produced a different hash than the check expects.
- Fix: run the matching `yarn build-*` locally and commit the result. Do not hand-edit chunk files.

Completeness failure:

- Cause: the chain has terminal items not yet in the cache (for example a vote closed and was enacted since the last build).
- Fix: run `yarn build-all-events`, commit the generated files, push.

Do not suppress the check. Skipping it means the runtime spends RPC rate-limit on the uncovered terminal items until the cache is rebuilt.

## File map

| File                                              | Role                                                            |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `scripts/proposals/build-proposals-events.mjs`    | Build proposals cache                                           |
| `scripts/votes/build-votes-events.mjs`            | Build votes cache                                               |
| `scripts/proposals/check-proposals-cache.mjs`     | CI structural and completeness check (proposals)                |
| `scripts/votes/check-votes-cache.mjs`             | CI structural and completeness check (votes)                    |
| `scripts/cache-base-check.mjs`                    | Shared check mechanics (manifest, hash, shape, batching)        |
| `scripts/proposals/validate-proposals-events.mjs` | Deep on-chain field validation (proposals)                      |
| `scripts/votes/validate-votes-events.mjs`         | Deep on-chain field validation (votes)                          |
| `scripts/cache-entry-diff.mjs`                    | Recursive field diff used by validators                         |
| `utils/cache/status.mjs`                          | Shared terminal/complete predicates (build and runtime)         |
| `utils/canonical-stringify.mjs`                   | Deterministic, key-sorted, bigint-safe stringify                |
| `utils/proposals/fetch-proposal-events.mjs`       | Proposal event fetchers (chunked `getLogs`, timestamp to block) |
| `utils/votes/fetch-vote-events.mjs`               | Vote event fetchers and CastVote chunked scan                   |
| `utils/public-rpc.mjs`                            | Keyless public RPC clients for the CI check                     |
| `utils/{proposals,votes}/constants.mjs`           | Chunk sizes, addresses, ABIs, scan limits                       |
| `.github/workflows/cache-check.yml`               | CI workflow running `check-all-cache`                           |
