import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// The file might be slightly garbled at the bottom.
// Let's strip from `if (!process.env.VERCEL) {` onwards, or just fix it.
const badEndIndex = code.indexOf('if (!process.env.VERCEL) {');
if (badEndIndex !== -1) {
    code = code.substring(0, badEndIndex);
    code += `  if (!process.env.VERCEL) {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(\`My Cyber Lab server listening on http://0.0.0.0:\${PORT}\`);
    });
  }
}
startServer();
export default app;
`;
}
fs.writeFileSync('server.ts', code);
