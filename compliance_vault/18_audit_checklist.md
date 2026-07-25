# 18 - Audit Checklist (Ontario MVP)

## 1. Compliance Audit Protocols
A compliance auditor must verify these system requirements quarterly:

- [ ] **Access Logs Review:** Check that all reads to patient care plans (`/api/care-plan`) are accompanied by a valid log entry in the audit database.
- [ ] **Consent Verifications:** Cross-reference 10 random active care plans against the consent registry file to verify that the patient has granted active consent.
- [ ] **Encryption Key Rotation:** Confirm that the database encryption key (`key.txt`) is rotated annually and stored on a separate volume.
- [ ] **College License Re-Verification:** Check that a sample of 20 active nurses are currently listed as "Entitled to Practice" on the CNO public directory.
- [ ] **Expired Document Check:** Verify that the compliance engine automatically suspends any provider whose insurance or VSS certificate is expired.
