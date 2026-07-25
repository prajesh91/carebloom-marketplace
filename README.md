# CareBloom - Senior Care Marketplace & Operating System (Canada)

Welcome to the founding strategy portal and interactive simulator for **CareBloom**—Canada's largest digital marketplace and operating system for senior care, launching initially in Ontario (Toronto, Mississauga, Oakville, and Richmond Hill).

This prototype is built using a premium, warm, light/dark responsive design system that demonstrates the business logic, AI matching algorithm, and core features of the platform.

---

## 🚀 Startup Vision
CareBloom is a technology business that operates in senior care—not a care agency. By connecting families directly with verified independent caregivers, we eliminate high agency markups, increase caregiver earnings, and provide families with choice, transparency, and peace of mind.

### Launch Market (Phase 1)
*   **Toronto** (Dense, medical integration)
*   **Mississauga** (Suburban volume)
*   **Oakville** (Affluent private pay)
*   **Richmond Hill** (Multi-lingual / multi-generational family structures)

---

## 🛠️ Codebase Structure
*   [index.html](file:///Users/prajeshpoudyal/.gemini/antigravity/scratch/carebloom-marketplace/index.html) - Main strategic deck, simulator, matching panel, and mockup widgets.
*   [styles.css](file:///Users/prajeshpoudyal/.gemini/antigravity/scratch/carebloom-marketplace/styles.css) - Custom design system combining light/dark themes, glassmorphism, map pulse animations, and grid structures.
*   [app.js](file:///Users/prajeshpoudyal/.gemini/antigravity/scratch/carebloom-marketplace/app.js) - Financial modeling calculations, AI matching algorithm, calendar state controller, and GPS en-route markers.

---

## 📈 Economic Model & Financials
CareBloom utilizes a multi-tiered monetization strategy:
1.  **Dual-sided Transaction Fees:** 15% client service fee + 5% provider platform fee.
2.  **Provider SaaS Subscription:** $29/month premium tier for advanced schedule optimization, automatic Canadian tax filing integration, and featured rankings.
3.  **Future Fintech:** Shared family payment splits, care insurance reimbursement tracking.

*Test this using the interactive **Revenue Simulator** tab in the application.*

---

## 🔒 Trust & Regulatory Compliance
We prioritize Canadian healthcare regulations out-of-the-box:
*   **PIPEDA (Federal):** Governs commercial personal data.
*   **PHIPA (Ontario):** Health-specific privacy law. Daily care notes and logs are classified as PHI.
*   **Security:** Canadian hosting (AWS Canada Central) and AES-256 encryption are enforced.
*   **Safety:** Mandatory upfront Vulnerable Sector Screening (VSS) police checks and weekly college registration verification (e.g., CNO verification for RNs/RPNs).

---

## ✍️ AI SEO & Content Generation Suite
To build CareBloom's organic traffic dominance, we integrated an **Inbuilt AI SEO & Content Engine**:
1.  **Semantic Self-Generator:** Select target Ontario cities (Toronto, Mississauga, Oakville, Richmond Hill, London, Ottawa), target keyword domains, and brand tones to self-generate complete, local-specific services pages and educational blog guides.
2.  **Real-Time Heuristic Scoring Auditor:** Computes a live optimization score (0-100%) checking keyword density, word count, Title & Meta tag length compliance, and H1/H2 structured markup.
3.  **One-Click "Auto-Optimize":** A programmatic script that automatically restructures headers, drafts optimized meta tags, and injects optimal keyword distribution to lift search health instantly.

---

## 💻 Running the App
1. Start the local server by running `npm start` in this folder.
2. Open `http://localhost:4173` in your browser.
3. The app connects to a secure local Node.js server that uses **AES-256-CBC** to encrypt state in `.data/db.json.enc`.

### Tested Interactive Flows:
*   **Family Care Booking:** Go to **Find care**, fill the request, and click **See verified matches**. Click **Book Care** to trigger a server-side booking. This creates a pending invoice in **Billing** and starts the GPS visit transit tracker in the **Dashboard**.
*   **Revenue Simulator:** Adjust sliders in the **Revenue** tab to watch MRR, ARR, and Year 1-5 regional scaling valuations re-calculate dynamically based on CareBloom's platform fees.
*   **Provider Profile Editor:** Under **Providers**, load any caregiver, adjust their hourly rate, and save. It updates the database and automatically re-calculates their projected net monthly payouts.
*   **Clinical Escalations & Care Logs:** Caregivers can submit daily shift logs in the **Providers** tab. Check the **Symptom Flags**—submitting symptoms like confusion or medication refusal automatically triggers an active **Clinical Escalation** visible to coordinators in the **Compliance** tab, prompting for resolution notes.
*   **PHIPA Compliance Audit:** Open the **Compliance** tab to view the live database audit logs, capturing every READ/WRITE/UPDATE action with timestamp, action type, resource, details, and client IP. You can also view and toggle consent profiles (Grant/Revoke) for PHI sharing.
*   **AI SEO & Content Generation:** Open the **SEO content** tab. Select an Ontario city (e.g. Richmond Hill), choosing a brand voice and focus. Self-generate standard copy, then click **Auto-Optimize Content** to watch the heuristic scoring engine instantly lift the page score to 100%.

## 🛡️ Production Security & Framework Compliance
CareBloom is designed around strict Canadian regulatory standards out-of-the-box:
*   **PHIPA (Ontario):** Daily shift logs and care plans are classified as Personal Health Information (PHI). We verify patient consent before exposing PHI. If consent is revoked in the Compliance dashboard, care plan access is programmatically blocked.
*   **Audit Logging:** A tamper-resistant JSON audit file keeps track of every single data access transaction to satisfy regulatory security reviews.
*   **Data Residency:** All data is persisted locally and encrypted using state-managed key generation, preparing CareBloom for deployment to AWS Canada (Central) data centers.
