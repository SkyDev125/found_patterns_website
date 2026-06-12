import fs from 'fs';
import path from 'path';

const assetsDir = path.join(import.meta.dirname, '../static/assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const imagesToDownload = [
  { url: 'https://ren-patterns.carrd.co/assets/images/bg.jpg', filename: 'bg.jpg' },
  { url: 'https://ren-patterns.carrd.co/assets/images/image01.png', filename: 'image01.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/gallery01/38b512b6.png', filename: 'gallery01_38b512b6.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/gallery01/cf19dd77.png', filename: 'gallery01_cf19dd77.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/gallery01/e797ed15.png', filename: 'gallery01_e797ed15.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/gallery02/4bfa3f0b.png', filename: 'gallery02_4bfa3f0b.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/gallery02/b1aa6620.png', filename: 'gallery02_b1aa6620.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/gallery02/8c008a2c.png', filename: 'gallery02_8c008a2c.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/image03.png', filename: 'image03.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/image04.jpg', filename: 'image04.jpg' },
  { url: 'https://ren-patterns.carrd.co/assets/images/image06.jpg', filename: 'image06.jpg' },
  { url: 'https://ren-patterns.carrd.co/assets/images/image05.png', filename: 'image05.png' },
  { url: 'https://ren-patterns.carrd.co/assets/images/image07.jpg', filename: 'image07.jpg' }
];

async function downloadImage(url, dest) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(dest, buffer);
    console.log(`Successfully downloaded: ${url} -> ${dest}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

async function run() {
  console.log('Starting assets download...');
  for (const img of imagesToDownload) {
    const dest = path.join(assetsDir, img.filename);
    await downloadImage(img.url, dest);
  }
  console.log('Assets download completed!');
}

run();
