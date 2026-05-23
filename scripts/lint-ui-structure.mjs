import { readdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = path.join(process.cwd(), 'src');
const COMPONENT_EXTENSIONS = new Set(['.tsx']);
const BARREL_FILES = new Set(['index.ts', 'index.tsx']);
const IGNORED_SUFFIXES = ['.test', '.spec', '.stories'];

const errors = [];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function isInsideUiDirectory(filePath) {
  return path.relative(SRC_DIR, filePath).split(path.sep).includes('ui');
}

function isIgnoredComponentFile(filePath) {
  const extension = path.extname(filePath);
  const basename = path.basename(filePath, extension);
  return IGNORED_SUFFIXES.some((suffix) => basename.endsWith(suffix));
}

function lintUiFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const filename = path.basename(filePath);

  if (BARREL_FILES.has(filename)) {
    if (relativePath === path.join('src', 'shared', 'ui', filename)) {
      return;
    }

    errors.push(`${relativePath}: barrel files are not allowed inside ui component folders`);
    return;
  }

  const extension = path.extname(filePath);
  if (!COMPONENT_EXTENSIONS.has(extension) || isIgnoredComponentFile(filePath)) {
    return;
  }

  const componentName = path.basename(filePath, extension);
  const parentName = path.basename(path.dirname(filePath));

  if (parentName !== componentName) {
    errors.push(
      `${relativePath}: ui component file must live in a same-named folder, expected ui/${componentName}/${componentName}${extension}`,
    );
  }
}

const files = (await collectFiles(SRC_DIR)).filter(isInsideUiDirectory);

for (const file of files) {
  lintUiFile(file);
}

if (errors.length > 0) {
  console.error('UI structure lint failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`UI structure lint passed: ${files.length} ui file(s) checked.`);
