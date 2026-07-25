# 15 - Regulatory Compliance Matrix (Ontario MVP)

## 1. Compliance Mapping
This matrix tracks the laws and regulatory acts applicable to CareBloom's operations:

### PIPEDA (Personal Information Protection and Electronic Documents Act)
* **Summary:** Federal privacy act for commercial entities.
* **Business Impact:** Governs billing details, name registries, and marketplace transactions.
* **Actions Required:** Implement consent checkpoints, data deletion capabilities, and key-based encryption.
* **Risk Level:** High.

### PHIPA (Personal Health Information Protection Act)
* **Summary:** Ontario health-specific privacy law.
* **Business Impact:** Applies to caregiver shift logs containing symptoms, care plans, and clinical notes.
* **Actions Required:** Restrict PHI read access; lock views if family consent is missing; log every view action in audit files.
* **Risk Level:** Critical.

### AODA (Accessibility for Ontarians with Disabilities Act)
* **Summary:** Ontario accessibility standards.
* **Business Impact:** Direct influence on web application user interface (layout, contrast, font options).
* **Actions Required:** Implement aria labels, tab indexing, and high contrast CSS.
* **Risk Level:** Medium.

### Employment Standards Act (ESA)
* **Summary:** Governs worker classification.
* **Business Impact:** Caregivers are independent contractors, not employees.
* **Actions Required:** Do not set fixed working hours, do not restrict external employment, and provide a digital invoice for every shift.
* **Risk Level:** High.
