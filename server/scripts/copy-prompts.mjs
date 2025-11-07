import { cp, access, mkdir } from 'fs/promises';
import { constants } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const sourceDir = resolve(rootDir, 'src', 'llm', 'prompts');
const targetDir = resolve(rootDir, 'dist', 'src', 'llm', 'prompts');

async function copyPrompts() {
  try {
    await access(sourceDir, constants.F_OK);
  } catch {
    console.log('No prompts directory found, skipping copy.');
    return;
  }

  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true });
  console.log(`Prompts copied from ${sourceDir} to ${targetDir}`);
}

copyPrompts().catch(error => {
  console.error('Failed to copy prompts', error);
  process.exitCode = 1;
});
