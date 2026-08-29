import app from '../server';

export default function handler(req: any, res: any) {
  // Extract real requested path from Vercel edge proxy headers if rewritten
  let targetUrl = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'] || req.headers['x-original-url'] || req.url || '';
  if (typeof targetUrl !== 'string') {
    targetUrl = req.url || '';
  }

  // Ensure req.url matches full Express API path (e.g., /api/aman/chat, /api/health)
  if (targetUrl.startsWith('/api')) {
    req.url = targetUrl;
  } else if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}
