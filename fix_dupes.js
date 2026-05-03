const fs = require('fs');
const path = './src/lib/nutritionEngine.ts';

const content = fs.readFileSync(path, 'utf-8');

const lines = content.split('\n');
const seenKeys = new Set();
const newLines = [];

let insideObject = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('export const mealCalibrations: Record<string, MacroBase> = {')) {
    insideObject = true;
    newLines.push(line);
    continue;
  }
  
  if (insideObject && line.startsWith('};')) {
    insideObject = false;
    newLines.push(line);
    continue;
  }
  
  if (insideObject) {
    // Match line like: 'apple': { cals: 95, p: 0.5, c: 25, f: 0.3 },
    const match = line.match(/^\s*'([^']+)'\s*:/);
    if (match) {
      const key = match[1];
      if (seenKeys.has(key)) {
        console.log(`Removed duplicate key: ${key}`);
        continue; // Skip this line
      } else {
        seenKeys.add(key);
      }
    }
  }
  
  newLines.push(line);
}

fs.writeFileSync(path, newLines.join('\n'), 'utf-8');
console.log('Done removing duplicates!');
