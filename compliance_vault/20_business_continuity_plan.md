# 20 - Business Continuity Plan (Ontario MVP)

## 1. System Failure Strategies
In case of power outages or server downtime:

* **Offline Care Calendars:** Caregivers should pre-download client names and locations for shifts occurring in the next 24 hours.
* **Paper Shift Logs:** In the event of network failure, caregivers document visit details and care activities on a physical form. This form must be scanned and uploaded when connectivity returns.
* **Backup Audits:** If the server-side audit database becomes offline, local log buffers store records temporarily, syncing once the host connection is restored.
* **Redundant Backups:** Daily snapshots of the encrypted database (`db.json.enc`) are stored in geo-redundant storage vaults (AWS Canada Central A and B).
