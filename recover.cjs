const fs = require('fs');

const path = 'C:\\Users\\priya\\.gemini\\antigravity\\brain\\3dc7c021-a84f-4455-acef-7e0246327b5c\\.system_generated\\logs\\transcript_full.jsonl';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

for (let line of lines) {
  if (line.includes('Replace src/pages/public/About.tsx with the new content below')) {
    try {
      const obj = JSON.parse(line);
      const text = obj.content;
      const startIdx = text.indexOf('// @ts-nocheck');
      if (startIdx !== -1) {
        fs.writeFileSync('About_recovered.tsx', text.substring(startIdx));
        console.log('Recovered!');
        process.exit(0);
      }
    } catch(e) {}
  }
}
console.log('Not found');
