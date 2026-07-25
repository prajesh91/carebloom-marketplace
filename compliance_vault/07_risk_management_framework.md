# 07 - Risk Management Framework (Ontario MVP)

## 1. Risk Matrix & Scoring
We categorize operational risks into four levels:

| Risk Domain | Potential Event | Severity | Mitigation Strategy | Risk Score |
| :--- | :--- | :--- | :--- | :--- |
| **Safety** | Patient fall or injury | Critical | Mandate CPR and mobility training checks; log reports | High |
| **Privacy** | Health data breach (PHI) | Critical | AES-256 local database encryption, automatic timeouts | High |
| **Legal** | Contractor misclassification | High | Clear terms of service, flexible schedules, no exclusive contracts | Medium |
| **Operational** | Caregiver no-show | Medium | Dynamic notification loops, automated backup caregiver alerts | Low |

## 2. Severity Thresholds & Response
* **Low (Score < 3):** Standard review. Documented in logs.
* **Medium (Score 3-6):** Warning message dispatched. Requires resolution within 48 hours.
* **High/Critical (Score > 6):** Immediate temporary profile suspension. Investigated by the Chief Compliance Officer.
