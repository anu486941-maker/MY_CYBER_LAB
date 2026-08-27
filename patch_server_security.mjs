import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// Add imports
code = code.replace(
  "import express from 'express';",
  "import express from 'express';\nimport cors from 'cors';\nimport rateLimit from 'express-rate-limit';"
);

// Add middleware
const middlewareInjection = `
  app.set('trust proxy', 1);
  app.use(cors());

  // Global rate limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    validate: { forwardedHeader: false },
  });
  app.use(globalLimiter);

  // Stricter rate limiter for AI / terminal execution routes
  const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute
    message: 'Too many high-cost requests, please slow down.',
    validate: { forwardedHeader: false },
  });
  app.use('/api/aman', strictLimiter);
  app.use('/api/terminal', strictLimiter);
  app.use('/api/investigate', strictLimiter);
`;

code = code.replace(
  "app.use(express.json());",
  `app.use(express.json());\n${middlewareInjection}`
);

fs.writeFileSync('server.ts', code);
