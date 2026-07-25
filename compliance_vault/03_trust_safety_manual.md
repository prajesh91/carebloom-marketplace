# 03 - Trust & Safety Manual (Ontario MVP)

## 1. Identity & Provider Verification
To establish trust on CareBloom, we implement a multi-layered verification check:
* **Government ID Verification:** Automated scanning of Ontario Photo Card, Driver's License, or Canadian Passport. Checks for holograms, MRZ integrity, and facial matches.
* **Liveness Selfie Check:** Prevents spoofing using 3D depth-map face match against the uploaded ID photo.
* **Registry Match:** Professional license lookup (e.g. CNO, CPO) checking for matching spelling and status ("Entitled to Practice").

## 2. Fraud Detection & Risk Scoring
CareBloom calculates a real-time risk score for each caregiver profile based on:
1. **GPS Discrepancy:** Check-in location compared to client address coordinates.
2. **Contact Drift:** Frequent changes in phone or bank details.
3. **Behavior Flags:** Words in messages indicating requests to bypass the marketplace (disintermediation, direct cash payments).

## 3. Incident Management & Safety Escalations
* **Level 1 (Routine):** Late arrival or client complaint. Resolved via review.
* **Level 2 (Compliance Alert):** Missing document renewal. Triggers temporary pause.
* **Level 3 (Emergency / Safety Risk):** Clinical flags (e.g., patient fall, suspected abuse, or physical injury). Triggers immediate suspension.

## 4. Suspension & Appeal Policy
* **Temporary Suspension:** Enforced while an incident is investigated. The caregiver's profile is hidden from matching searches.
* **Permanent Ban:** Enforced for physical abuse, drug diversion, check-in falsification, or contract disintermediation.
* **Appeals:** Caregivers can appeal permanent bans by submitting a written case with evidence within 14 business days. Decisions are audited by the Clinical Advisory Panel.
