const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const port = Number(process.env.PORT) || 4173;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

// --- PHIPA COMPLIANCE STORAGE SETUP ---
const DATA_DIR = path.join(root, '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json.enc');
const KEY_FILE = path.join(DATA_DIR, 'key.txt');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_log.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Key Management for AES-256-CBC
let encryptionKey;
if (fs.existsSync(KEY_FILE)) {
  encryptionKey = Buffer.from(fs.readFileSync(KEY_FILE, 'utf8'), 'hex');
} else {
  encryptionKey = crypto.randomBytes(32);
  fs.writeFileSync(KEY_FILE, encryptionKey.toString('hex'), 'utf8');
}

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Initial state matching app.js defaults to prevent broken layout on first launch
const defaultState = {
  providers: [
    {
      id: 1,
      name: "Sonia Gauthier",
      type: "PSW (Personal Support Worker)",
      city: "Mississauga",
      rating: 4.9,
      reviews: 142,
      hourlyRate: 32,
      languages: ["English", "French"],
      skills: ["Dementia Care", "Meal Prep", "Mobility Assistance"],
      vetted: true,
      experience: "8 years",
      vssStatus: "Approved"
    },
    {
      id: 2,
      name: "Amandeep Singh",
      type: "Registered Practical Nurse (RPN)",
      city: "Toronto",
      rating: 5.0,
      reviews: 98,
      hourlyRate: 46,
      languages: ["English", "Punjabi", "Hindi"],
      skills: ["Wound Care", "Medication Management", "Dementia Care"],
      vetted: true,
      experience: "5 years",
      vssStatus: "Approved"
    },
    {
      id: 3,
      name: "Olivia Henderson",
      type: "Physiotherapist (PT)",
      city: "Oakville",
      rating: 4.8,
      reviews: 64,
      hourlyRate: 65,
      languages: ["English"],
      skills: ["Stroke Rehab", "Mobility Assistance", "Fall Prevention"],
      vetted: true,
      experience: "12 years",
      vssStatus: "Approved"
    },
    {
      id: 4,
      name: "Marcus Vance",
      type: "PSW (Personal Support Worker)",
      city: "Richmond Hill",
      rating: 4.7,
      reviews: 110,
      hourlyRate: 30,
      languages: ["English", "Cantonese"],
      skills: ["Palliative Care", "Companionship", "Housekeeping"],
      vetted: true,
      experience: "6 years",
      vssStatus: "Approved"
    },
    {
      id: 5,
      name: "Chantal Levesque",
      type: "Occupational Therapist (OT)",
      city: "Toronto",
      rating: 4.9,
      reviews: 53,
      hourlyRate: 70,
      languages: ["English", "French"],
      skills: ["Home Safety Assessment", "Cognitive Therapy"],
      vetted: true,
      experience: "10 years",
      vssStatus: "Approved"
    },
    {
      id: 6,
      name: "Farah Al-Jamil",
      type: "Foot Care Nurse (LPN)",
      city: "Mississauga",
      rating: 4.9,
      reviews: 87,
      hourlyRate: 42,
      languages: ["English", "Arabic"],
      skills: ["Diabetic Foot Care", "Wound Care"],
      vetted: true,
      experience: "7 years",
      vssStatus: "Approved"
    }
  ],
  invoices: [
    {
      id: "INV-20260701-001",
      providerId: 1,
      providerName: "Sonia Gauthier",
      providerType: "PSW (Personal Support Worker)",
      city: "Mississauga",
      date: "2026-07-01",
      hours: 3.5,
      hourlyRate: 32,
      status: "paid"
    },
    {
      id: "INV-20260705-002",
      providerId: 3,
      providerName: "Olivia Henderson",
      providerType: "Physiotherapist (PT)",
      city: "Oakville",
      date: "2026-07-05",
      hours: 1.5,
      hourlyRate: 65,
      status: "paid"
    }
  ],
  nextInvoiceSeq: 3,
  marketplace: {
    requests: [],
    confirmedVisits: []
  },
  consent: [
    { recipient: "Margaret Poudyal", status: "Granted", timestamp: new Date().toISOString() }
  ],
  escalations: [],
  carePlans: {
    "Margaret Poudyal": {
      seniorName: "Margaret Poudyal",
      emergency: "John Poudyal (416-555-0192)",
      meds: "1. Metformin - 500mg (8:00 AM with breakfast)\n2. Lisinopril - 10mg (8:00 PM before sleep)",
      diet: "Gluten-free diet. Prefers walker for outdoor commutes. Stand-by assistance needed for bathing."
    }
  }
};

function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    saveDatabase(defaultState);
    return defaultState;
  }
  try {
    const encryptedData = fs.readFileSync(DB_FILE, 'utf8');
    const decryptedData = decrypt(encryptedData);
    const db = JSON.parse(decryptedData);
    
    // Ensure all providers are compliance-hydrated
    let modified = false;
    if (Array.isArray(db.providers)) {
      db.providers.forEach(p => {
        if (!p.onboardingStatus) {
          p.onboardingStatus = "active";
          p.complianceScore = 100;
          p.verificationFlags = { idVerified: true, vssVetted: true, licenseVerified: true, insuranceVerified: true };
          p.documents = [
            { type: "CNO_LICENSE", status: "approved", expiryDate: "2027-12-31" },
            { type: "POLICE_VSS", status: "approved", expiryDate: "2027-06-30" },
            { type: "INS_CERTIFICATE", status: "approved", expiryDate: "2027-05-15" }
          ];
          modified = true;
        }
      });
    }
    if (modified) {
      saveDatabase(db);
    }
    return db;
  } catch (err) {
    console.error("Error reading database, resetting to default:", err);
    saveDatabase(defaultState);
    return defaultState;
  }
}

function saveDatabase(data) {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const encryptedData = encrypt(jsonStr);
    fs.writeFileSync(DB_FILE, encryptedData, 'utf8');
  } catch (err) {
    console.error("Error saving database:", err);
  }
}

function getAuditLogs() {
  if (!fs.existsSync(AUDIT_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(AUDIT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function logAuditEntry(action, resource, details, ip = '127.0.0.1') {
  const logs = getAuditLogs();
  const entry = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    resource,
    details,
    ip
  };
  logs.unshift(entry);
  if (logs.length > 100) logs.pop(); // Keep file size in check
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing audit log:", err);
  }
  return entry;
}

// POST request body parser helper
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// --- SERVER INSTANCE ---
const server = http.createServer(async (request, response) => {
  const clientIp = request.headers['x-forwarded-for'] || request.socket.remoteAddress || '127.0.0.1';
  const urlObj = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  const setApiHeaders = (res, status = 200) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  };

  // CORS preflight support
  if (request.method === 'OPTIONS') {
    setApiHeaders(response);
    return response.end();
  }

  // --- API BACKEND SYSTEM ---
  if (pathname.startsWith('/api/')) {
    try {
      const db = loadDatabase();

      if (pathname === '/api/state' && request.method === 'GET') {
        logAuditEntry('READ', 'State', 'Full application state fetched by client browser', clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify({
          providers: db.providers,
          invoices: db.invoices,
          nextInvoiceSeq: db.nextInvoiceSeq,
          marketplace: db.marketplace
        }));
      }

      if (pathname === '/api/auth/login' && request.method === 'POST') {
        const { email } = await getRequestBody(request);

        const users = {
          'client@carebridge.ca': {
            email: 'client@carebridge.ca',
            name: 'Margaret Poudyal',
            role: 'client',
            roleLabel: 'Family Client',
            specialty: 'Client',
            status: 'Active'
          },
          'sonia@carebridge.ca': {
            email: 'sonia@carebridge.ca',
            name: 'Sonia Gauthier',
            role: 'compliance',
            roleLabel: 'PSW Caregiver',
            specialty: 'PSW (Personal Support Worker)',
            status: 'Active'
          },
          'olivia@carebridge.ca': {
            email: 'olivia@carebridge.ca',
            name: 'Olivia Henderson',
            role: 'compliance',
            roleLabel: 'Physiotherapist',
            specialty: 'Physiotherapist (PT)',
            status: 'Suspended (Expired Insurance)'
          },
          'alex@carebridge.ca': {
            email: 'alex@carebridge.ca',
            name: 'Alex Mercer',
            role: 'compliance',
            roleLabel: 'Wheel-Trans Driver',
            specialty: 'Wheel-Trans / Accessible Medical Transport',
            status: 'Draft Onboarding'
          },
          'admin@carebridge.ca': {
            email: 'admin@carebridge.ca',
            name: 'Platform Operator',
            role: 'admin',
            roleLabel: 'Super Admin (Me)',
            specialty: 'Super Admin',
            status: 'Active'
          }
        };

        const targetEmail = (email || '').toLowerCase().trim();
        const user = users[targetEmail];

        if (!user) {
          logAuditEntry('AUTH_FAILED', 'User Login', `Failed login attempt for unknown email: ${email}`, clientIp);
          setApiHeaders(response, 401);
          return response.end(JSON.stringify({ error: "Invalid email credentials." }));
        }

        logAuditEntry('AUTH_SUCCESS', 'User Login', `User authenticated as ${user.name} (${user.roleLabel})`, clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify({ success: true, user }));
      }

      if (pathname === '/api/care-requests' && request.method === 'POST') {
        const { recipient, city, skill, language, date, hours, notes, consentGranted } = await getRequestBody(request);
        
        if (!consentGranted) {
          logAuditEntry('ACCESS_BLOCKED', 'Care Request', `Blocked creation of request for ${recipient} (No Consent)`, clientIp);
          setApiHeaders(response, 400);
          return response.end(JSON.stringify({ error: "Consent must be explicitly checked." }));
        }

        // Add or update consent entry in registry
        const consentIndex = db.consent.findIndex(c => c.recipient.toLowerCase() === recipient.toLowerCase());
        const consentEntry = { recipient, status: "Granted", timestamp: new Date().toISOString() };
        if (consentIndex >= 0) {
          db.consent[consentIndex] = consentEntry;
        } else {
          db.consent.push(consentEntry);
        }

        const newRequest = {
          id: `REQ-${Date.now()}`,
          recipient,
          city,
          skill,
          language,
          date,
          hours,
          notes,
          createdAt: new Date().toISOString()
        };
        
        db.marketplace.requests.unshift(newRequest);
        saveDatabase(db);

        logAuditEntry('WRITE', 'Care Request / Consent', `Created care request & granted consent for ${recipient}`, clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify({ success: true, request: newRequest }));
      }

      if (pathname === '/api/bookings' && request.method === 'POST') {
        const { provider, request: careReq } = await getRequestBody(request);

        // Consent Check
        const consent = db.consent.find(c => c.recipient.toLowerCase() === careReq.recipient.toLowerCase());
        if (consent && consent.status === 'Revoked') {
          logAuditEntry('ACCESS_BLOCKED', 'Booking', `Blocked booking request for ${careReq.recipient} (Consent Revoked)`, clientIp);
          setApiHeaders(response, 403);
          return response.end(JSON.stringify({ error: "PHIPA Access Blocked: Patient has revoked consent" }));
        }

        const visitDate = careReq.date;
        const dateStr = visitDate.replace(/-/g, '');
        const seq = String(db.nextInvoiceSeq).padStart(3, '0');
        const invoiceId = `INV-${dateStr}-${seq}`;
        db.nextInvoiceSeq++;

        const newInvoice = {
          id: invoiceId,
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          city: provider.city,
          date: visitDate,
          hours: careReq.hours,
          hourlyRate: provider.hourlyRate,
          status: 'pending'
        };

        const visit = {
          providerName: provider.name,
          recipient: careReq.recipient,
          date: visitDate,
          hours: careReq.hours,
          invoiceId: newInvoice.id
        };

        db.invoices.unshift(newInvoice);
        db.marketplace.confirmedVisits.unshift(visit);
        saveDatabase(db);

        logAuditEntry('WRITE', 'Booking / Invoice', `Booked ${provider.name} for ${careReq.recipient}. Invoice ${invoiceId} generated.`, clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify({ success: true, invoice: newInvoice, visit }));
      }

      if (pathname === '/api/providers/update' && request.method === 'POST') {
        const updatedProvider = await getRequestBody(request);
        const idx = db.providers.findIndex(p => p.id === updatedProvider.id);
        if (idx >= 0) {
          db.providers[idx] = updatedProvider;
          saveDatabase(db);
          logAuditEntry('WRITE', 'Provider Profile', `Updated profile settings for ${updatedProvider.name}`, clientIp);
          setApiHeaders(response);
          return response.end(JSON.stringify({ success: true }));
        } else {
          setApiHeaders(response, 404);
          return response.end(JSON.stringify({ error: "Provider not found" }));
        }
      }

      if (pathname === '/api/consent/update' && request.method === 'POST') {
        const { recipient, status } = await getRequestBody(request);
        const consentIndex = db.consent.findIndex(c => c.recipient.toLowerCase() === recipient.toLowerCase());
        const consentEntry = { recipient, status, timestamp: new Date().toISOString() };
        
        if (consentIndex >= 0) {
          db.consent[consentIndex] = consentEntry;
        } else {
          db.consent.push(consentEntry);
        }
        saveDatabase(db);

        logAuditEntry('WRITE', 'Consent Registry', `Modified consent status for ${recipient} to ${status}`, clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify({ success: true, consent: db.consent }));
      }

      if (pathname === '/api/consent' && request.method === 'GET') {
        logAuditEntry('READ', 'Consent Registry', 'Fetched active consents registry list', clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify(db.consent));
      }

      if (pathname === '/api/audit-logs' && request.method === 'GET') {
        logAuditEntry('READ', 'Audit Log', 'Audit log requested by compliance module', clientIp);
        const logs = getAuditLogs();
        setApiHeaders(response);
        return response.end(JSON.stringify(logs));
      }

      if (pathname === '/api/care-plan' && request.method === 'GET') {
        const seniorName = urlObj.searchParams.get('seniorName');
        if (!seniorName) {
          setApiHeaders(response, 400);
          return response.end(JSON.stringify({ error: "seniorName query param required" }));
        }

        // Consent Enforcement
        const consent = db.consent.find(c => c.recipient.toLowerCase() === seniorName.toLowerCase());
        if (consent && consent.status === 'Revoked') {
          logAuditEntry('ACCESS_BLOCKED', 'Care Plan', `Read blocked for ${seniorName}'s Digital Care Plan (Consent Revoked)`, clientIp);
          setApiHeaders(response, 403);
          return response.end(JSON.stringify({ error: "PHIPA Access Blocked: Patient has revoked consent" }));
        }

        const plan = db.carePlans[seniorName] || {
          seniorName,
          emergency: "",
          meds: "",
          diet: ""
        };

        logAuditEntry('READ', 'Care Plan', `Read Digital Care Plan for ${seniorName}`, clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify(plan));
      }

      if (pathname === '/api/care-plan' && request.method === 'POST') {
        const { seniorName, emergency, meds, diet } = await getRequestBody(request);
        
        // Consent Enforcement
        const consent = db.consent.find(c => c.recipient.toLowerCase() === seniorName.toLowerCase());
        if (consent && consent.status === 'Revoked') {
          logAuditEntry('ACCESS_BLOCKED', 'Care Plan', `Update blocked for ${seniorName}'s Care Plan (Consent Revoked)`, clientIp);
          setApiHeaders(response, 403);
          return response.end(JSON.stringify({ error: "PHIPA Access Blocked: Patient has revoked consent" }));
        }

        db.carePlans[seniorName] = { seniorName, emergency, meds, diet };
        saveDatabase(db);

        logAuditEntry('WRITE', 'Care Plan', `Updated Digital Care Plan details for ${seniorName}`, clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify({ success: true }));
      }

      if (pathname === '/api/care-notes' && request.method === 'POST') {
        const { providerName, recipient, date, notes, symptoms } = await getRequestBody(request);
        
        const criticalFlags = [];
        if (symptoms.fall) criticalFlags.push("Patient Fall / Physical Trauma");
        if (symptoms.fever) criticalFlags.push("High Fever (> 38.5°C)");
        if (symptoms.bp) criticalFlags.push("Hypertensive Crisis / High Blood Pressure");
        if (symptoms.medsRefusal) criticalFlags.push("Critical Medication Refusal");
        if (symptoms.confusion) criticalFlags.push("Sudden Disorientation / Confusion");

        let escalation = null;
        if (criticalFlags.length > 0) {
          escalation = {
            id: `ESC-${Date.now()}`,
            recipient,
            providerName,
            date,
            notes,
            symptoms: criticalFlags,
            status: 'Active',
            escalatedAt: new Date().toISOString()
          };
          db.escalations.unshift(escalation);
          saveDatabase(db);
          logAuditEntry('WRITE', 'Clinical Escalation', `🔴 CRITICAL symptom flagged for ${recipient} by ${providerName}. Escalation workflow started.`, clientIp);
        } else {
          logAuditEntry('WRITE', 'Care Note', `Routine care shift log submitted for ${recipient} by ${providerName}`, clientIp);
        }

        setApiHeaders(response);
        return response.end(JSON.stringify({ success: true, escalation }));
      }

      if (pathname === '/api/escalations' && request.method === 'GET') {
        logAuditEntry('READ', 'Clinical Escalation', 'Fetched active clinical escalations feed', clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify(db.escalations));
      }

      if (pathname === '/api/escalations/resolve' && request.method === 'POST') {
        const { escalationId, resolutionNotes } = await getRequestBody(request);
        const idx = db.escalations.findIndex(e => e.id === escalationId);
        if (idx >= 0) {
          db.escalations[idx].status = 'Resolved';
          db.escalations[idx].resolvedAt = new Date().toISOString();
          db.escalations[idx].resolutionNotes = resolutionNotes;
          saveDatabase(db);
          logAuditEntry('WRITE', 'Clinical Escalation', `Resolved escalation ${escalationId} for patient ${db.escalations[idx].recipient}`, clientIp);
          setApiHeaders(response);
          return response.end(JSON.stringify({ success: true, escalation: db.escalations[idx] }));
        } else {
          setApiHeaders(response, 404);
          return response.end(JSON.stringify({ error: "Escalation log not found" }));
        }
      }

      if (pathname === '/api/compliance/providers' && request.method === 'GET') {
        logAuditEntry('READ', 'Compliance Registry', 'Fetched provider onboarding & compliance statuses', clientIp);
        setApiHeaders(response);
        return response.end(JSON.stringify(db.providers));
      }

      if (pathname === '/api/compliance/update-status' && request.method === 'POST') {
        const { providerId, onboardingStatus, complianceScore, verificationFlags, documents } = await getRequestBody(request);
        const idx = db.providers.findIndex(p => p.id === Number(providerId));
        if (idx >= 0) {
          db.providers[idx].onboardingStatus = onboardingStatus;
          db.providers[idx].complianceScore = complianceScore;
          db.providers[idx].verificationFlags = verificationFlags || db.providers[idx].verificationFlags;
          db.providers[idx].documents = documents || db.providers[idx].documents;
          
          saveDatabase(db);
          logAuditEntry('WRITE', 'Compliance Registry', `Updated compliance status for ${db.providers[idx].name} to ${onboardingStatus} (Score: ${complianceScore}%)`, clientIp);
          setApiHeaders(response);
          return response.end(JSON.stringify({ success: true, provider: db.providers[idx] }));
        } else {
          setApiHeaders(response, 404);
          return response.end(JSON.stringify({ error: "Provider not found" }));
        }
      }

      setApiHeaders(response, 404);
      return response.end(JSON.stringify({ error: "Endpoint not found" }));

    } catch (err) {
      console.error("Backend processing failed:", err);
      setApiHeaders(response, 500);
      return response.end(JSON.stringify({ error: "Server processing error", details: err.message }));
    }
  }

  // --- STATIC FILES SYSTEM ---
  const requestPath = request.url.split('?')[0] === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = path.resolve(root, `.${decodeURIComponent(requestPath)}`);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    return response.end('Forbidden');
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      return response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(data);
  });
});

server.on('error', error => {
  console.error(`CareBloom could not start on port ${port}: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => console.log(`CareBloom is running at http://localhost:${port}`));
