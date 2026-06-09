const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const themePath = path.join(root, 'wpTheme');
const outPath = path.join(root, 'EverydayDigitalTheme.zip');

const output = fs.createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created EverydayDigitalTheme.zip (${(archive.pointer() / 1024).toFixed(1)} KB)`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);
archive.directory(themePath, 'wpTheme');
archive.finalize();
