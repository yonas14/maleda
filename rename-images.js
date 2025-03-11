const fs = require('fs');
const path = require('path');

const oldToNewNames = {
  'tech news; reading tablet computer at cafe, copy space 10-03-2025 at 22-52-51.jpeg': 'tech-news-reading-tablet-computer-at-cafe-22-52-51.jpeg',
  'tech articles_ 10-03-2025 at 22-49-21.jpeg': 'tech-articles-22-49-21.jpeg',
  'tech articles_ 10-03-2025 at 22-49-19.jpeg': 'tech-articles-22-49-19.jpeg',
  'tech articles_ 10-03-2025 at 22-49-18.jpeg': 'tech-articles-22-49-18.jpeg',
  'tech articles_ 10-03-2025 at 22-49-16.jpeg': 'tech-articles-22-49-16.jpeg',
  'tech news; reading tablet computer at cafe, copy space 10-03-2025 at 22-52-50.jpeg': 'tech-news-reading-tablet-computer-at-cafe-22-52-50.jpeg',
  'self help; young beautiful woman doing yoga on the beach 10-03-2025 at 22-51-36.jpeg': 'self-help-yoga-on-beach-22-51-36.jpeg',
  'tech news; reading tablet computer at cafe, copy space 10-03-2025 at 22-52-48.jpeg': 'tech-news-reading-tablet-computer-at-cafe-22-52-48.jpeg',
  'a fantasy portrait illustration of otherworldly beauty being herself and surrounded by fog 10-03-2025 at 22-51-02.jpeg': 'fantasy-portrait-otherworldly-beauty-22-51-02.jpeg',
  'self help; young beautiful woman doing yoga on the beach 10-03-2025 at 22-51-30.jpeg': 'self-help-yoga-on-beach-22-51-30.jpeg'
};

const publicDir = path.join(process.cwd(), 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Rename files
Object.entries(oldToNewNames).forEach(([oldName, newName]) => {
  const oldPath = path.join(publicDir, oldName);
  const newPath = path.join(publicDir, newName);
  
  try {
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renamed: ${oldName} -> ${newName}`);
    } else {
      console.log(`⚠️ File not found: ${oldName}`);
    }
  } catch (error) {
    console.error(`❌ Error renaming ${oldName}:`, error.message);
  }
}); 