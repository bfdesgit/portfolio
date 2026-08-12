const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('Sharp library is not available yet. Please run `npm install sharp` first.');
  process.exit(1);
}

const TARGET_DIR = path.join(__dirname, 'assets');

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, filesList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext) && !file.endsWith('.webp')) {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

async function convertToWebp() {
  const images = getFiles(TARGET_DIR);
  console.log(`Found ${images.length} images to process in ${TARGET_DIR}...`);

  let convertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const imgPath of images) {
    const ext = path.extname(imgPath);
    const webpPath = imgPath.substring(0, imgPath.length - ext.length) + '.webp';

    // Check if webp exists and is newer than source
    if (fs.existsSync(webpPath)) {
      const srcStat = fs.statSync(imgPath);
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtimeMs >= srcStat.mtimeMs && webpStat.size > 0) {
        skippedCount++;
        continue;
      }
    }

    try {
      await sharp(imgPath)
        .webp({ quality: 85, effort: 4 })
        .toFile(webpPath);
      console.log(`✓ Converted: ${path.relative(__dirname, imgPath)} -> ${path.relative(__dirname, webpPath)}`);
      convertedCount++;
    } catch (err) {
      console.error(`✗ Error converting ${imgPath}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\nWebP conversion summary:`);
  console.log(`- Converted: ${convertedCount}`);
  console.log(`- Up to date (skipped): ${skippedCount}`);
  console.log(`- Errors: ${errorCount}`);
}

convertToWebp();
