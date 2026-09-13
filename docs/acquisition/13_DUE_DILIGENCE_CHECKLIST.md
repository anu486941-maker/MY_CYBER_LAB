# 13 — Due Diligence Checklist

This checklist is provided to streamline technical and operational due diligence for prospective acquirers.

---

### 1. Source Code & Engineering
- [x] Full Git source repository access
- [x] Complete TypeScript codebase (`tsc --noEmit` verified clean)
- [x] Automated test suite passing (38 test files, 362 passing tests)
- [x] Production build pipeline verified (`npm run build`)
- [x] Clean dependency tree without deprecated or conflicting npm packages
- [ ] Confirmation of transfer of all Git branches, tags, and commit history *(Founder confirmation required)*

---

### 2. Infrastructure & Cloud Services
- [x] Server-side secrets isolated from client build artifacts
- [x] Google Gemini API integration verified with deterministic offline fallback
- [x] Firebase Authentication and Firestore security rules verified
- [ ] Transfer of Firebase / Google Cloud Project ownership *(Founder confirmation required)*
- [ ] Transfer of production domain registrar and DNS records *(Founder confirmation required)*

---

### 3. Intellectual Property & Assets
- [x] 100% proprietary code written for the platform
- [x] Open-source dependencies governed by permissive licenses (MIT, Apache 2.0, ISC)
- [x] No proprietary third-party commercial SDKs requiring recurring license fees
- [ ] Confirmation of assignment of all intellectual property, trademarks, and branding assets *(Founder confirmation required)*
- [ ] Execution of standard Asset Purchase Agreement (APA) *(Founder confirmation required)*

---

### 4. Operational & Financial Verification
- [x] Platform operation verified on zero-cost free tiers (Gemini Free Tier + Firebase Spark)
- [ ] Delivery of historical web traffic or analytics data, if collected *(Founder confirmation required)*
- [ ] Confirmation of any existing paid user records or billing accounts *(Founder confirmation required)*
