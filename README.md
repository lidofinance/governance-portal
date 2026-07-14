# Governance Portal UI

Web interface for Lido protocol governance: Aragon voting, Dual Governance
proposals and state, and Easy Track motions.

- Event cache internals: [`docs/events-cache.md`](docs/events-cache.md)
- Security policy and disclosure: [`SECURITY.md`](SECURITY.md)

## Stack

- Next.js 12 (pages router), React 18
- wagmi 2 + viem 2, @tanstack/react-query 5
- styled-components 5, @lidofinance/lido-ui

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- Yarn v1

This project requires a `.env.local`, distributed via private communication
channels. A sample can be found in `.env.example`.

## Development

Step 1. Copy the sample env file:

```bash
cp .env.example .env.local
```

Step 2. Fill out `.env.local`. You will need to provide RPC provider URLs with
keys included.

Step 3. Install dependencies:

```bash
yarn
```

Step 4. Start the development server:

```bash
yarn dev
```

PRs target the `develop` branch. Commits follow
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) —
versioning is derived from them.

## Event cache

Lifecycle events for Dual Governance proposals and Aragon votes are pre-fetched
at build time, committed to `public/` as static JSON, and served instead of a
per-item `getLogs` scan at runtime. Non-terminal items still fetch fresh from
RPC. Full design: [`docs/events-cache.md`](docs/events-cache.md).

Build (reads `SUPPORTED_CHAINS` and `EL_RPC_URLS_<chainId>` from `.env.local`):

```bash
yarn build-all-events    # proposals + votes
```

Verify:

```bash
yarn check-all-cache     # structural + completeness via keyless public RPC (runs in CI)
yarn validate-all-events # deep field-by-field diff against chain (local, uses .env.local)
```

CI runs `check-all-cache` on PRs to `develop`/`main`. On failure, rebuild with
`yarn build-all-events` and commit the result — never hand-edit chunk files.

## Production

```bash
yarn build && yarn start
```

## Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.
