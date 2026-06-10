const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const themePath = path.join(root, 'wpTheme');
const outPath = path.join(root, 'EverydayDigitalTheme.zip');
const archiveRoot = 'EverydayDigitalTheme';

// Verify wpTheme/style.css exists before zipping
const styleCssPath = path.join(themePath, 'style.css');
if (!fs.existsSync(styleCssPath)) {
  console.error(`ERROR: wpTheme/style.css not found at ${styleCssPath}`);
  process.exit(1);
}
console.log(`✓ Found wpTheme/style.css`);
console.log(`✓ Packaging theme as ${archiveRoot}/...`);

const output = fs.createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

let fileCount = 0;
archive.on('entry', (entry) => {
  fileCount++;
  if (entry.name.endsWith('style.css')) {
    console.log(`✓ Including: ${entry.name}`);
  }
});

output.on('close', () => {
  console.log(`✓ Created EverydayDigitalTheme.zip (${(archive.pointer() / 1024).toFixed(1)} KB, ${fileCount} files)`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);
archive.directory(themePath, archiveRoot);
archive.finalize();
