import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');
// Check if StrictMode is present
if (!code.includes('<StrictMode>')) {
  code = code.replace(
    'import { createRoot } from \'react-dom/client\';',
    'import { StrictMode } from \'react\';\nimport { createRoot } from \'react-dom/client\';'
  );
  code = code.replace(
    '<App />',
    '<StrictMode>\n    <App />\n  </StrictMode>'
  );
  fs.writeFileSync('src/main.tsx', code);
  console.log('Added StrictMode');
} else {
  console.log('StrictMode already exists');
}
