# 08 — Deployment & Handover Guide

This guide details the technical procedures required to deploy, configure, and transfer CyberForge AI to a new engineering owner.

---

## 1. Prerequisites & Environment

- **Node.js**: v20+ LTS runtime
- **Package Manager**: `npm` v10+
- **Google Cloud / Firebase Project**: With Authentication and Firestore provisioned
- **Google Gemini API Key**: Free or Paid Tier key from Google AI Studio

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example Placeholder |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Yes (Server) | API key for AMAN LLM responses | `<GEMINI_API_KEY>` |
| `VITE_FIREBASE_API_KEY` | Yes (Client) | Firebase project API key | `<VITE_FIREBASE_API_KEY>` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes (Client) | Firebase Auth domain | `<PROJECT_ID>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes (Client) | Firebase Cloud Project ID | `<FIREBASE_PROJECT_ID>` |
| `VITE_FIREBASE_STORAGE_BUCKET`| No (Client) | Cloud Storage bucket | `<PROJECT_ID>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No (Client) | Cloud messaging ID | `<MESSAGING_SENDER_ID>` |
| `VITE_FIREBASE_APP_ID` | Yes (Client) | Firebase Web App ID | `<FIREBASE_APP_ID>` |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID`| No (Client) | Named Firestore database | `(default)` or `<DATABASE_ID>` |

---

## 3. Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript type check
npm run lint

# 3. Run automated test suite
npm run test

# 4. Start local development server (binds to http://localhost:3000)
npm run dev
```

---

## 4. Production Build & Deployment

The application is built using a unified command that compiles both the frontend SPA and the self-contained backend server bundle:

```bash
# Build production client and bundled server
npm run build

# Start production server
npm run start
```

### Docker / Cloud Run Deployment:
A standard Node.js Dockerfile can be used for containerized hosting:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 5. Technical Handover & Account Transfer Protocol

When executing the transfer of CyberForge AI to a new owner:

1. **Repository Transfer**:
   - Grant Admin access on GitHub/GitLab repository to the buyer's organization.
   - Transfer repository ownership.

2. **Google Cloud / Firebase Ownership**:
   - Navigate to **Firebase Console > Project Settings > Users and Permissions**.
   - Add buyer's Google account with the **Owner** role.
   - Once confirmed, remove seller accounts.

3. **Secrets Rotation**:
   - Generate a fresh Google Gemini API key in Google AI Studio under the buyer's account.
   - Update production environment variables and invalidate old keys.

4. **Domain & DNS Transfer**:
   - Unlock custom domain at the registrar (e.g., Namecheap / GoDaddy / Cloudflare).
   - Initiate registrar transfer or update DNS A/CNAME records to point to buyer's ingress load balancer.

5. **Data Backup & Verification**:
   - Export Firestore collections via `gcloud firestore export` to a secure Cloud Storage bucket prior to final handover.
