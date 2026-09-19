const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const svgBuffer = fs.readFileSync('public/favicon.svg');
  
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');
    
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile('public/favicon-16x16.png');
    
  console.log('Successfully generated PNG favicons!');
}
run();
