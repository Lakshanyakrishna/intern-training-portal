const fs = require('fs');

const path = 'C:\\Users\\priya\\.gemini\\antigravity\\brain\\3dc7c021-a84f-4455-acef-7e0246327b5c\\.system_generated\\logs\\transcript_full.jsonl';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

let fileContent = '';

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    
    // 1. Get base file from user prompt
    if (obj.type === 'USER_INPUT' && obj.content.includes('Replace src/pages/public/About.tsx with the new content below')) {
      const text = obj.content;
      const startIdx = text.indexOf('// @ts-nocheck');
      if (startIdx !== -1) {
        fileContent = text.substring(startIdx);
      }
    }
    
    // 2. Apply multi_replace_file_content calls
    if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.function.name === 'default_api:multi_replace_file_content' || call.function.name === 'multi_replace_file_content') {
          const args = JSON.parse(call.function.arguments);
          if (args.TargetFile && args.TargetFile.endsWith('About.tsx')) {
            // apply chunks
            const chunks = args.ReplacementChunks || [];
            // sort chunks by start line descending so we don't mess up offsets
            chunks.sort((a, b) => b.StartLine - a.StartLine);
            
            let fileLines = fileContent.split('\n');
            for (const chunk of chunks) {
              const startIdx = chunk.StartLine - 1;
              const endIdx = chunk.EndLine - 1;
              const replacement = chunk.ReplacementContent.split('\n');
              fileLines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
            }
            fileContent = fileLines.join('\n');
          }
        }
      }
    }

    // 3. Apply user manual edits (diff blocks)
    if (obj.type === 'USER_INPUT' && obj.content.includes('The following changes were made by the USER to:')) {
      // User manual diffs might be hard to parse exactly, but we can try to extract the chunks or we can manually apply Radar and Dither later.
      // Actually, if we just reconstruct up to the last AI edit, it's 99% there!
    }

  } catch(e) {}
}

fs.writeFileSync('About_reconstructed.tsx', fileContent);
console.log('Reconstructed size:', fileContent.length);
