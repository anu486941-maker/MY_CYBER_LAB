# 18 — Founder Handover Checklist

This operational checklist outlines the structured process for closing the transaction and transferring CyberForge AI to the new owner.

*Disclaimer: This checklist is for operational guidance only and does not constitute formal legal advice. Parties should execute an Asset Purchase Agreement (APA) with qualified legal counsel.*

---

### Phase 1: Pre-Closing & Due Diligence Verification
- [ ] Deliver full source code access or repository invitation to the buyer for code inspection.
- [ ] Confirm automated test suite execution passes 100% on the target environment (`npm run test`).
- [ ] Verify production build compiles without warnings (`npm run build`).
- [ ] Deliver this complete 22-document Acquisition Data Room to the buyer.
- [ ] Confirm all environment variable requirements and secret configurations in `.env.example`.

---

### Phase 2: Transaction Execution & Escrow
- [ ] Finalize and execute standard Asset Purchase Agreement (APA).
- [ ] Secure escrow funding via a recognized escrow platform (e.g. Escrow.com / Acquire Escrow).
- [ ] Confirm release condition milestones agreed upon by both parties.

---

### Phase 3: Technical Asset Handover
- [ ] **GitHub / GitLab Repository**:
  - [ ] Add buyer's administrative account as repository Owner.
  - [ ] Remove seller write permissions and confirm buyer administrative control.
- [ ] **Firebase / Google Cloud Project**:
  - [ ] Grant buyer's Google account the **Owner** role in Firebase Console.
  - [ ] Confirm buyer has full administrative access to Firestore and Firebase Authentication.
  - [ ] Remove seller account access.
- [ ] **Domain & DNS Transfer** *(if included)*:
  - [ ] Unlock domain at registrar and provide EPP/Auth transfer code, or update DNS nameservers to buyer's DNS host.
- [ ] **API Secrets & Credential Rotation**:
  - [ ] Instruct buyer to generate a fresh Google Gemini API key in Google AI Studio.
  - [ ] Update production hosting environment variables with new keys and purge historical logs.

---

### Phase 4: Final Verification & Post-Sale Support
- [ ] Buyer performs successful test deployment on their hosting infrastructure (e.g. Cloud Run, Vercel, VPS).
- [ ] Buyer verifies user sign-in, AMAN AI chat responses, and interactive lab functionality.
- [ ] Mutual confirmation to release escrow funds.
- [ ] Complete agreed-upon post-closing transition support period (e.g., 14–30 days of asynchronous email/Slack handover Q&A).
