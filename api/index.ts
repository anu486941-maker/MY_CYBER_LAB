import app from '../server';

export default function handler(req: any, res: any) {
  // Ensure req.url starts with /api if rewritten by Vercel
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
}
