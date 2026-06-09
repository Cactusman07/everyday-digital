const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const themePath = path.join(root, 'wpTheme');
const outPath = path.join(root, 'EverydayDigitalTheme.zip');

execSync(
  `powershell -Command "Compress-Archive -Path '${themePath}' -DestinationPath '${outPath}' -Force"`,
  { stdio: 'inherit' }
);

console.log('Created EverydayDigitalTheme.zip');
