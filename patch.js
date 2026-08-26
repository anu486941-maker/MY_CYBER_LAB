const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/if \(!process\.env\.VERCEL\) \{ httpServer\.listen/g, 'httpServer.listen');
code = code.replace(/http:\/\/0\.0\.0\.0:\$\{PORT\}\\`\); \}/g, 'http://0.0.0.0:${PORT}\\`);');
fs.writeFileSync('server.ts', code);
