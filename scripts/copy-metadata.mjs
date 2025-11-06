import { copyFile, access } from 'fs/promises';
import { constants } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const source = resolve(rootDir, 'contracts', 'interfaces', 'metadata.json');
const destination = resolve(rootDir, 'src', 'metadata.json');

async function copyMetadata() {
  try {
    await access(source, constants.F_OK);
  } catch {
    // Source file does not exist; nothing to copy
    return;
  }

  try {
    await copyFile(source, destination);
    console.log(`metadata.json copied to ${destination}`);
  } catch (error) {
    console.error('Failed to copy metadata.json', error);
    process.exitCode = 1;
  }
}

copyMetadata();
