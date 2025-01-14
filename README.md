# Dual Governance UI

Provides information on the current state of Dual Governance.

### Prerequisites

- Node.js ^20.0.0
- Yarn package manager v1

This project requires an .env file which is distributed via private communication channels. A sample can be found in .env.example

### Development

Step 1. Copy the contents of `.env.example` to `.env.local`

```bash
cp .env.local.example .env.local.local
```

Step 2. Fill out the `.env.local`. You will need to provide RPC provider urls with keys included.

Step 3. Install dependencies

```bash
yarn
```

Step 4. Start the development server

```bash
yarn dev
```

for IPFS mode below:

```bash
yarn dev:ipfs ## will start with HMR
```

# Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.

Learn more about [App Release Flow](https://www.notion.so/App-Release-Flow-f8a3484deecb40cb9d8da4d82c1afe96).
