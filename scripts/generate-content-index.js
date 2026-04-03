const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const contentFolders = ['blogs', 'portfolio'];
const watchEnabled = process.argv.includes('--watch');
const debounceTimers = new Map();

function getMarkdownFiles(folderPath) {
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function writeIndexFile(folderName) {
  const folderPath = path.join(rootDir, folderName);
  const indexPath = path.join(folderPath, 'index.json');
  const files = getMarkdownFiles(folderPath);
  const nextContent = `${JSON.stringify({ files }, null, 2)}\n`;
  const currentContent = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, 'utf8')
    : null;

  if (currentContent === nextContent) {
    console.log(`No changes for ${folderName}/index.json`);
    return;
  }

  fs.writeFileSync(indexPath, nextContent, 'utf8');
  console.log(`Updated ${folderName}/index.json with ${files.length} file(s)`);
}

function generateAllIndexes() {
  for (const folderName of contentFolders) {
    writeIndexFile(folderName);
  }
}

function scheduleFolderUpdate(folderName) {
  clearTimeout(debounceTimers.get(folderName));
  const timer = setTimeout(() => {
    writeIndexFile(folderName);
    debounceTimers.delete(folderName);
  }, 100);
  debounceTimers.set(folderName, timer);
}

function startWatchMode() {
  generateAllIndexes();

  for (const folderName of contentFolders) {
    const folderPath = path.join(rootDir, folderName);

    fs.watch(folderPath, (eventType, fileName) => {
      if (!fileName) {
        scheduleFolderUpdate(folderName);
        return;
      }

      const normalizedName = fileName.toLowerCase();
      if (!normalizedName.endsWith('.md')) {
        return;
      }

      console.log(`Detected ${eventType} in ${folderName}/${fileName}`);
      scheduleFolderUpdate(folderName);
    });

    console.log(`Watching ${folderName} for Markdown changes...`);
  }
}

if (watchEnabled) {
  startWatchMode();
} else {
  generateAllIndexes();
}
