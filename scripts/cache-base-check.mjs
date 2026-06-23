import { readFileSync, existsSync, readdirSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'node:path';

const CHUNK_FILE_REGEX = /^chunk-(\d+)\.([0-9a-f]{10})\.json$/;

export const createReporter = () => {
  const failures = [];
  const fail = (scope, message) => failures.push(`${scope}: ${message}`);
  return { failures, fail };
};

const hashChunk = (content) =>
  createHash('sha256').update(content).digest('hex').slice(0, 10);

export const checkManifestStructure = ({
  dir,
  scope,
  perChunk,
  serialize,
  checkEntryShape,
  fail,
}) => {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  } catch (error) {
    fail(scope, `cannot read/parse manifest.json: ${error.message}`);
    return null;
  }

  const { chunkSize, firstId, lastId, chunks } = manifest;
  if (chunkSize !== perChunk) {
    fail(scope, `chunkSize ${chunkSize} !== ${perChunk}`);
  }
  if (typeof firstId !== 'number' || typeof lastId !== 'number') {
    fail(scope, `firstId/lastId not numbers`);
  }
  if (!chunks || typeof chunks !== 'object') {
    fail(scope, `manifest.chunks missing`);
    return null;
  }

  const referencedFiles = new Set(Object.values(chunks));
  const entriesById = {};

  for (const [chunkIndex, fileName] of Object.entries(chunks)) {
    const chunkPath = join(dir, fileName);
    if (!existsSync(chunkPath)) {
      fail(scope, `manifest references missing chunk ${fileName}`);
      continue;
    }
    const match = fileName.match(CHUNK_FILE_REGEX);
    if (!match) {
      fail(scope, `chunk filename ${fileName} malformed`);
      continue;
    }
    const raw = readFileSync(chunkPath, 'utf8');
    let chunkData;
    try {
      chunkData = JSON.parse(raw);
    } catch (error) {
      fail(scope, `chunk ${fileName} invalid JSON: ${error.message}`);
      continue;
    }
    const actualHash = hashChunk(serialize(chunkData));
    if (actualHash !== match[2]) {
      fail(
        scope,
        `chunk ${fileName} hash mismatch (content hashes to ${actualHash})`,
      );
    }

    for (const [idStr, entry] of Object.entries(chunkData)) {
      const expectedIndex = Math.floor((Number(idStr) - firstId) / perChunk);
      if (String(expectedIndex) !== String(chunkIndex)) {
        fail(
          scope,
          `id ${idStr} sits in chunk ${chunkIndex}, expected ${expectedIndex}`,
        );
      }
      checkEntryShape(scope, idStr, entry);
      entriesById[idStr] = entry;
    }
  }

  for (const fileName of readdirSync(dir)) {
    if (
      fileName.startsWith('chunk-') &&
      fileName.endsWith('.json') &&
      !referencedFiles.has(fileName)
    ) {
      fail(scope, `orphan chunk ${fileName} not referenced by manifest`);
    }
  }

  return entriesById;
};

export const processInBatches = async (ids, batchSize, handler) => {
  for (let start = 0; start < ids.length; start += batchSize) {
    await Promise.all(ids.slice(start, start + batchSize).map(handler));
  }
};

export const reportAndExit = (label, failures) => {
  if (failures.length > 0) {
    console.error(`\n❌ ${label} failed (${failures.length}):`);
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }
  console.info(`\n✅ ${label} passed`);
  process.exit(0);
};
