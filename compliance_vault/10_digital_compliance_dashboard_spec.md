# 10 - Digital Compliance Dashboard Specification (Ontario MVP)

## 1. Compliance Engine Architecture
The automated compliance engine monitors document states and triggers automatic state changes in the database.

## 2. Database Constraints
```json
{
  "providerId": "integer",
  "onboardingStatus": "draft | pending | active | suspended",
  "complianceScore": "integer (0-100)",
  "verificationFlags": {
    "idVerified": "boolean",
    "vssVetted": "boolean",
    "licenseVerified": "boolean",
    "insuranceVerified": "boolean"
  },
  "documents": [
    {
      "type": "CNO_LICENSE | POLICE_VSS | INS_CERTIFICATE | CPR_CARD",
      "status": "pending | approved | rejected | expired",
      "expiryDate": "string (YYYY-MM-DD)",
      "fileUrl": "string"
    }
  ]
}
```

## 3. Compliance Score Triggers
* **Score = 100:** All verified. Profile active.
* **Score < 100:** Missing non-critical documents. Profile active but flagged with warning.
* **Critical Document Expired:** (e.g., CNO License or General Liability Insurance expires). Immediately sets `onboardingStatus = "suspended"` and filters provider out from the AI Care Matcher.
