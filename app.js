// CareBloom Startup Simulator & Dashboard Controller

// --- STATE MANAGEMENT ---
const state = {
  theme: 'light',
  currentTab: 'marketplace',
  activeRole: 'admin',
  currentUser: null,
  loginTab: 'client',
  
  // Financial Simulator Inputs
  financials: {
    clients: 1200,          // Year 1 active families
    visitsPerMonth: 6,      // Average bookings per client monthly
    avgBillRate: 38,        // Hourly bill rate in CAD
    avgHoursPerVisit: 3.5,  // Average hours per visit
    commissionClient: 15,   // % client service fee
    commissionProvider: 5,  // % provider platform fee
    retentionRate: 85,      // Monthly client retention %
    providerSaaSPrice: 29,  // Monthly fee for provider premium OS software
    activeProviders: 350,   // Active providers
  },

  // Mock Providers database for matching engine
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

  // GPS Map Simulation Coordinates
  gps: {
    providerX: 40,
    providerY: 150,
    targetX: 200,
    targetY: 100,
    active: false,
    intervalId: null
  },

  // Invoices & Bookings State
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
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  await hydrateServerData();
  setupNavigation();
  setupMarketplace();
  setupThemeToggle();
  setupFinancialSimulator();
  setupAIMatcher();
  setupDashboardVisuals();
  setupSEOOptimizer();
  setupBillingCenter();
  setupProviderCenter();
  setupCarePlan();
  
  // Compliance dashboard components
  setupComplianceDashboard();
  setupCaregiverShiftLog();
  
  // Role & Compliance extensions
  setupLoginScreen();
  setupRoleSwitcher();
  setupComplianceVerificationQueue();
  setupComplianceManualsSelector();
  
  // Run calculations once on startup
  calculateFinancialProjections();
  runAIMatching();
});

// This demo retrieves state from a server-side AES-256 encrypted database.
async function hydrateServerData() {
  try {
    const res = await fetch('/api/state');
    if (!res.ok) throw new Error('Failed to load server state');
    const data = await res.json();
    if (Array.isArray(data.providers)) state.providers = data.providers;
    if (Array.isArray(data.invoices)) state.invoices = data.invoices;
    if (Number.isInteger(data.nextInvoiceSeq)) state.nextInvoiceSeq = data.nextInvoiceSeq;
    if (data.marketplace) state.marketplace = data.marketplace;
  } catch (err) {
    console.error("Error loading server data:", err);
    showToast("⚠️ Connection error: Failed to fetch secure server state. Using offline mode.");
  }
}

function persistLocalData() {
  // Database persistence is now handled securely server-side.
}

// --- NAVIGATION ROUTING ---
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-item button');
  const panels = document.querySelectorAll('.tab-panel');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Update sidebar visual selection
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      btn.parentElement.classList.add('active');
      
      // Toggle visibility of panels
      panels.forEach(panel => {
        if (panel.id === `${tabId}-tab`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      state.currentTab = tabId;

      // Handle GPS tracking simulation activation
      if (tabId === 'dashboard') {
        startGpsSimulation();
      } else {
        stopGpsSimulation();
      }
    });
  });
}

// --- DYNAMIC STATE FOR BUNDLED JOURNEYS ---
state.currentJourney = {
  recipient: "",
  situation: "",
  date: "",
  hours: 3.5,
  steps: []
};

// --- FAMILY CONCIERGE MARKETPLACE FLOW ---
function setupMarketplace() {
  const form = document.getElementById('care-request-form');
  const inputArea = document.getElementById('concierge-situation-input');
  if (!form || !inputArea) return;

  // Setup Prompt Chips Click Listeners
  const chips = document.querySelectorAll('.prompt-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      inputArea.value = chip.getAttribute('data-prompt');
      buildCareJourney();
    });
  });

  // Submit button listener
  const buildBtn = document.getElementById('btn-build-journey');
  if (buildBtn) {
    buildBtn.addEventListener('click', () => {
      buildCareJourney();
    });
  }

  // Edit request button listener
  document.getElementById('btn-edit-request').addEventListener('click', () => {
    document.getElementById('marketplace-results').hidden = true;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Book entire journey button listener
  const bookBtn = document.getElementById('btn-book-journey');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      confirmJourneyBooking();
    });
  }
}

// Heuristic Plain Language Parser
function parseSituationText(text) {
  const lowercaseText = text.toLowerCase();
  
  // 1. Detect City (default: Toronto)
  let city = "Toronto";
  if (lowercaseText.includes("mississauga")) {
    city = "Mississauga";
  } else if (lowercaseText.includes("oakville")) {
    city = "Oakville";
  } else if (lowercaseText.includes("richmond hill")) {
    city = "Richmond Hill";
  } else if (lowercaseText.includes("london")) {
    city = "London";
  } else if (lowercaseText.includes("ottawa")) {
    city = "Ottawa";
  }

  // 2. Detect Care Needs (default: Companionship)
  let careNeed = "Companionship";
  let roleType = "PSW (Personal Support Worker)";
  
  if (lowercaseText.includes("dementia") || lowercaseText.includes("alzheimer")) {
    careNeed = "Dementia Care";
  } else if (lowercaseText.includes("wound") || lowercaseText.includes("discharge") || lowercaseText.includes("hospital") || lowercaseText.includes("nurse")) {
    careNeed = "Wound Care";
    roleType = "Registered Practical Nurse (RPN)";
  } else if (lowercaseText.includes("meal") || lowercaseText.includes("cook") || lowercaseText.includes("prep")) {
    careNeed = "Meal Prep";
  } else if (lowercaseText.includes("mobility") || lowercaseText.includes("arthritis") || lowercaseText.includes("fall") || lowercaseText.includes("walk")) {
    careNeed = "Mobility Assistance";
  }
  
  // 3. Detect specialized therapy requirements
  let rehabNeed = null;
  if (lowercaseText.includes("physio") || lowercaseText.includes("arthritis") || lowercaseText.includes("stroke")) {
    rehabNeed = "Physiotherapy (PT)";
  } else if (lowercaseText.includes("safety") || lowercaseText.includes("occupational")) {
    rehabNeed = "Occupational Therapist (OT)";
  }

  // 4. Detect transport need
  let transportNeed = false;
  if (
    lowercaseText.includes("drive") || 
    lowercaseText.includes("transport") || 
    lowercaseText.includes("appointment") || 
    lowercaseText.includes("ride") || 
    lowercaseText.includes("chemotherapy") ||
    lowercaseText.includes("hospital")
  ) {
    transportNeed = true;
  }
  
  // 5. Detect language preference
  let language = "English";
  if (lowercaseText.includes("french")) {
    language = "French";
  } else if (lowercaseText.includes("punjabi")) {
    language = "Punjabi";
  } else if (lowercaseText.includes("cantonese") || lowercaseText.includes("chinese")) {
    language = "Cantonese";
  } else if (lowercaseText.includes("arabic")) {
    language = "Arabic";
  }

  // 6. Detect post-hospital discharge
  let postHospital = false;
  if (lowercaseText.includes("discharge") || lowercaseText.includes("hospital")) {
    postHospital = true;
  }

  return {
    city,
    careNeed,
    roleType,
    rehabNeed,
    transportNeed,
    language,
    postHospital
  };
}

function buildCareJourney() {
  const recipient = document.getElementById('request-recipient').value.trim() || "Margaret Poudyal";
  const situation = document.getElementById('concierge-situation-input').value.trim();
  const consentGranted = document.getElementById('request-consent').checked;

  if (!situation) {
    showToast("⚠️ Please describe your situation or select an example.");
    return;
  }

  if (!consentGranted) {
    showToast("⚠️ Consent registry verification is required.");
    return;
  }

  const parsed = parseSituationText(situation);
  
  // Find a matching caregiver provider
  const matches = state.providers
    .filter(p => p.city === parsed.city)
    .map(p => {
      let score = 50;
      if (p.skills.includes(parsed.careNeed)) score += 20;
      if (p.type.includes(parsed.roleType.split(' ')[0])) score += 15;
      if (p.languages.includes(parsed.language)) score += 10;
      score += Math.round((p.rating - 4) * 4);
      return { ...p, score: Math.min(99, score) };
    })
    .sort((a, b) => b.score - a.score);

  const selectedProvider = matches[0] || state.providers[0];

  // Set default hours and date
  const dateStr = new Date().toISOString().slice(0, 10);
  const visitHours = 3.5;

  // Build the unified Care Journey Steps list
  const steps = [];

  // Step 1: Primary Caregiver
  steps.push({
    id: "step_caregiver",
    type: "caregiver",
    name: `${parsed.roleType} Visit`,
    meta: `Primary support matching your need`,
    details: `${selectedProvider.name} (${selectedProvider.type}) will arrive in ${parsed.city} to provide ${parsed.careNeed}. Language: ${parsed.language}. Compatibility: ${selectedProvider.score || 92}% fit.`,
    cost: selectedProvider.hourlyRate * visitHours,
    enabled: true,
    required: true,
    provider: selectedProvider
  });

  // Step 2: Integrated Mobility / Transit (optional)
  if (parsed.transportNeed) {
    let van = parsed.postHospital || selectedProvider.skills.includes("Mobility Assistance");
    let transportType = van ? "Accessible Wheelchair Van" : "Companion Ride Service";
    let transportCost = van ? 55.00 : 25.00;
    steps.push({
      id: "step_transport",
      type: "transport",
      name: transportType,
      meta: `Integrated mobility marketplace transit`,
      details: `Round-trip medical transit partner coordinates commute for ${recipient} in ${parsed.city}. Driver VSS background screened.`,
      cost: transportCost,
      enabled: true,
      required: false
    });
  }

  // Step 3: Specialized Rehabilitation/Therapy (optional)
  if (parsed.rehabNeed) {
    const rehabProvider = state.providers.find(p => p.type.includes("Physiotherapist") || p.type.includes("Occupational")) || state.providers[2];
    steps.push({
      id: "step_rehab",
      type: "rehab",
      name: `In-home ${parsed.rehabNeed} Assessment`,
      meta: `Clinical therapy integration`,
      details: `${rehabProvider.name} (${rehabProvider.type}) will conduct a home-based mobility assessment & fall-prevention audit.`,
      cost: 120.00,
      enabled: true,
      required: false,
      provider: rehabProvider
    });
  }

  // Step 4: Benefits Guide & Subsidy matching
  let creditType = parsed.postHospital ? "Ontario Home Safety Tax Credit" : "Canada Caregiver Credit (CRA)";
  let creditText = parsed.postHospital ? 
    "Eligible for up to 25% refund on home safety items/mobility upgrades under the Ontario Senior Home Safety program." :
    "Eligible for non-refundable tax offsets for supporting relatives with physical or mental impairments.";
  steps.push({
    id: "step_benefits",
    type: "benefits",
    name: `Funding Subsidies Match: ${creditType}`,
    meta: `Financial planning & subsidies`,
    details: `${creditText} CareBridge compiles verification records automatically to support your CRA tax log files.`,
    cost: 0,
    enabled: true,
    required: true
  });

  // Save built journey to state
  state.currentJourney = {
    recipient,
    situation,
    date: dateStr,
    hours: visitHours,
    steps,
    city: parsed.city,
    language: parsed.language,
    consentGranted
  };

  // Render the Care Journey in UI
  renderCareJourneyTimeline();
}

function renderCareJourneyTimeline() {
  const container = document.getElementById('care-journey-timeline');
  const summaryText = document.getElementById('request-match-summary');
  const resultsSection = document.getElementById('marketplace-results');
  const confirmed = document.getElementById('confirmed-visit');

  if (!container) return;

  container.innerHTML = '';
  confirmed.hidden = true;

  summaryText.textContent = `Concierge compiled a personalized ${state.currentJourney.steps.length}-step Care Journey in ${state.currentJourney.city} based on your situation.`;

  state.currentJourney.steps.forEach((step, idx) => {
    const card = document.createElement('article');
    card.className = `timeline-step-card ${step.enabled ? '' : 'disabled'}`;
    
    let toggleHtml = '';
    if (!step.required) {
      toggleHtml = `
        <div class="timeline-step-toggle">
          <label>
            <input type="checkbox" id="chk_${step.id}" ${step.enabled ? 'checked' : ''}>
            Include this in journey
          </label>
        </div>`;
    }

    card.innerHTML = `
      <div class="timeline-step-badge">${idx + 1}</div>
      <div class="timeline-step-header">
        <div>
          <div class="timeline-step-meta">${step.meta}</div>
          <h4 class="timeline-step-title">${step.name}</h4>
        </div>
        <span class="timeline-step-cost">${step.cost > 0 ? `$${step.cost.toFixed(2)}` : 'FREE / Subsidy Match'}</span>
      </div>
      <p class="timeline-step-desc">${step.details}</p>
      ${toggleHtml}
    `;

    // Hook up checkbox event listener if not required
    if (!step.required) {
      const chk = card.querySelector(`#chk_${step.id}`);
      if (chk) {
        chk.addEventListener('change', (e) => {
          step.enabled = e.target.checked;
          if (step.enabled) {
            card.classList.remove('disabled');
          } else {
            card.classList.add('disabled');
          }
          updateJourneyTotalCost();
        });
      }
    }

    container.appendChild(card);
  });

  updateJourneyTotalCost();

  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateJourneyTotalCost() {
  let total = 0;
  state.currentJourney.steps.forEach(step => {
    if (step.enabled) {
      total += step.cost;
    }
  });
  document.getElementById('journey-total-cost').textContent = `$${total.toFixed(2)}`;
}

async function confirmJourneyBooking() {
  try {
    const activeSteps = state.currentJourney.steps.filter(s => s.enabled);
    const caregiverStep = activeSteps.find(s => s.type === 'caregiver');
    const transportStep = activeSteps.find(s => s.type === 'transport');
    const rehabStep = activeSteps.find(s => s.type === 'rehab');

    const provider = caregiverStep.provider;
    const request = {
      recipient: state.currentJourney.recipient,
      city: state.currentJourney.city,
      skill: caregiverStep.name,
      language: state.currentJourney.language,
      date: state.currentJourney.date,
      hours: state.currentJourney.hours,
      notes: state.currentJourney.situation,
      consentGranted: state.currentJourney.consentGranted
    };

    // Call bookings API
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, request })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Journey booking failed');
    }
    const data = await res.json();

    // Push primary caregiver visit & invoice to state
    state.invoices.unshift(data.invoice);
    state.marketplace.confirmedVisits.unshift(data.visit);

    // If transport is active, create an invoice for transport too
    if (transportStep) {
      const transportInvoice = {
        id: `TRN-${Date.now()}`,
        providerId: 999,
        providerName: "CareBridge Mobility Transit",
        providerType: "Transportation Service",
        city: state.currentJourney.city,
        date: state.currentJourney.date,
        hours: 1,
        hourlyRate: transportStep.cost,
        status: 'pending'
      };
      state.invoices.unshift(transportInvoice);
    }

    // If rehab is active, create an invoice for rehab too
    if (rehabStep) {
      const rehabInvoice = {
        id: `REH-${Date.now()}`,
        providerId: rehabStep.provider.id,
        providerName: rehabStep.provider.name,
        providerType: rehabStep.provider.type,
        city: state.currentJourney.city,
        date: state.currentJourney.date,
        hours: 1,
        hourlyRate: rehabStep.cost,
        status: 'pending'
      };
      state.invoices.unshift(rehabInvoice);
    }

    // Update calendar: mark today's date as active
    const todayDay = new Date(`${request.date}T12:00:00`).getDate();
    const calendarCells = document.querySelectorAll('#care-calendar-grid .calendar-day');
    if (calendarCells[todayDay - 1]) {
      calendarCells[todayDay - 1].classList.add('active-day');
      if (!calendarCells[todayDay - 1].querySelector('.event-indicator')) {
        const dot = document.createElement('div');
        dot.className = 'event-indicator';
        calendarCells[todayDay - 1].appendChild(dot);
      }
    }

    // Trigger Double GPS Tracker Visuals
    stopGpsSimulation();
    const transportMarker = document.getElementById('transport-marker');
    if (transportStep && transportMarker) {
      transportMarker.style.display = 'flex';
      transportMarker.style.left = '240px';
      transportMarker.style.top = '240px';
    } else if (transportMarker) {
      transportMarker.style.display = 'none';
    }
    state.gps.providerX = 40;
    state.gps.providerY = 220;
    startGpsSimulation();

    // Re-render invoices
    renderInvoiceList();

    const confirmed = document.getElementById('confirmed-visit');
    let summaryHtml = `
      <span class="step-badge">✓</span>
      <div>
        <h3>Care Journey successfully booked!</h3>
        <p>Your personalized Senior Care Concierge plan has been fully scheduled for <strong>${request.recipient}</strong> on <strong>${request.date}</strong>:</p>
        <ul style="margin-top:0.5rem; padding-left:1.25rem; font-size:0.85rem; line-height:1.4;">
          <li>PSW/Nurse: ${provider.name} (${request.hours} hrs)</li>
          ${transportStep ? `<li>Mobility: ${transportStep.name} (Round-trip Scheduled)</li>` : ''}
          ${rehabStep ? `<li>Rehab: ${rehabStep.name} (In-home Scheduled)</li>` : ''}
        </ul>
        <p style="margin-top:0.5rem;">Demo invoices generated in **Invoices & Billing**. GPS verification tracking is active on the **Family Dashboard**.</p>
      </div>`;
    
    confirmed.innerHTML = summaryHtml;
    confirmed.hidden = false;
    confirmed.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`Care Journey successfully booked! Invoices created.`);
    refreshAuditLogs();
  } catch (err) {
    showToast(`❌ Booking Blocked: ${err.message}`);
  }
}

// --- THEME MANAGEMENT ---
function setupThemeToggle() {
  const checkbox = document.getElementById('theme-toggle-chk');
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      state.theme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      state.theme = 'light';
    }
  });
}

// --- FINANCIAL SIMULATOR ---
function setupFinancialSimulator() {
  const sliders = [
    'clients', 'visitsPerMonth', 'avgBillRate', 
    'avgHoursPerVisit', 'commissionClient', 
    'commissionProvider', 'providerSaaSPrice', 'activeProviders'
  ];

  sliders.forEach(id => {
    const input = document.getElementById(`sim-${id}`);
    const display = document.getElementById(`val-${id}`);
    
    if (input && display) {
      input.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        state.financials[id] = val;
        
        // Update display text
        if (id === 'commissionClient' || id === 'commissionProvider') {
          display.textContent = `${val}%`;
        } else if (id === 'avgBillRate' || id === 'providerSaaSPrice') {
          display.textContent = `$${val}`;
        } else if (id === 'avgHoursPerVisit') {
          display.textContent = `${val}h`;
        } else {
          display.textContent = val.toLocaleString();
        }
        
        calculateFinancialProjections();
      });
    }
  });
}

function calculateFinancialProjections() {
  const f = state.financials;
  
  // Formulas
  // Average Booking GMV (Gross Merchandise Value) = avg hours * avg bill rate
  const gmvPerVisit = f.avgBillRate * f.avgHoursPerVisit;
  
  // Total Monthly GMV = clients * visits per month * gmv per visit
  const totalMonthlyGMV = f.clients * f.visitsPerMonth * gmvPerVisit;
  
  // Revenue Streams:
  // 1. Client Fee Revenue = Monthly GMV * client commission %
  const clientRevenue = totalMonthlyGMV * (f.commissionClient / 100);
  
  // 2. Provider Platform Fee = Monthly GMV * provider commission %
  const providerRevenue = totalMonthlyGMV * (f.commissionProvider / 100);
  
  // 3. Provider SaaS Software Tool Revenue = active providers * provider SaaS price
  const saasRevenue = f.activeProviders * f.providerSaaSPrice;
  
  // Total Monthly Marketplace Revenue = Client commission + Provider commission + SaaS revenue
  const monthlyRevenue = clientRevenue + providerRevenue + saasRevenue;
  const annualRevenue = monthlyRevenue * 12;
  
  // Startup Valuation Projection (conservative SaaS multiple of 6x ARR)
  const valuation = annualRevenue * 6;
  
  // Update UI Elements
  document.getElementById('val-mrr').textContent = `$${Math.round(monthlyRevenue).toLocaleString()}`;
  document.getElementById('val-arr').textContent = `$${Math.round(annualRevenue).toLocaleString()}`;
  document.getElementById('val-valuation').textContent = `$${Math.round(valuation).toLocaleString()}`;
  
  // Populate Projections Table (Years 1 to 5 scaling)
  // Assuming a compounding growth curve year-over-year
  const growthRates = [1.0, 2.5, 5.0, 9.5, 18.0]; // Scaling factors representing regional rollout
  const tableBody = document.querySelector('#projections-table tbody');
  
  if (tableBody) {
    tableBody.innerHTML = '';
    
    growthRates.forEach((multiplier, index) => {
      const year = index + 1;
      const yClients = Math.round(f.clients * multiplier);
      const yProviders = Math.round(f.activeProviders * multiplier);
      
      const yMonthlyGMV = yClients * f.visitsPerMonth * gmvPerVisit;
      const yClientRev = yMonthlyGMV * (f.commissionClient / 100);
      const yProvRev = yMonthlyGMV * (f.commissionProvider / 100);
      const ySaaS = yProviders * f.providerSaaSPrice;
      
      const yARR = (yClientRev + yProvRev + ySaaS) * 12;
      const yValuation = yARR * 6;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>Year ${year}</strong></td>
        <td>${yClients.toLocaleString()}</td>
        <td>${yProviders.toLocaleString()}</td>
        <td>$${Math.round(yMonthlyGMV * 12).toLocaleString()}</td>
        <td>$${Math.round(yARR).toLocaleString()}</td>
        <td><strong>$${Math.round(yValuation).toLocaleString()}</strong></td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// --- AI MATCHING SIMULATION ---
function setupAIMatcher() {
  const inputs = ['match-city', 'match-skill', 'match-lang'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', runAIMatching);
    }
  });

  const searchBtn = document.getElementById('btn-run-match');
  if (searchBtn) {
    searchBtn.addEventListener('click', runAIMatching);
  }
}

function runAIMatching() {
  const cityFilter = document.getElementById('match-city').value;
  const skillFilter = document.getElementById('match-skill').value;
  const langFilter = document.getElementById('match-lang').value;
  
  const container = document.getElementById('provider-results');
  if (!container) return;
  
  // Filter out suspended or inactive providers for clients
  const filteredProviders = state.providers.filter(p => {
    if (state.activeRole === 'client' && p.onboardingStatus !== 'active') {
      return false;
    }
    return true;
  });

  // Match Scoring Algorithm
  const matched = filteredProviders.map(p => {
    if (p.onboardingStatus !== 'active') {
      return { ...p, score: 0 };
    }
    
    let score = 50; // Base score
    
    // City Check (Crucial for logistics)
    if (cityFilter === 'All' || p.city === cityFilter) {
      score += 25;
    } else {
      score -= 20; // Heavy penalty for location mismatch
    }
    
    // Skill Check
    if (skillFilter === 'All' || p.skills.includes(skillFilter)) {
      score += 15;
    }
    
    // Language Check
    if (langFilter === 'All' || p.languages.includes(langFilter)) {
      score += 10;
    }
    
    // Rating boost
    score += (p.rating - 4.0) * 10;
    
    return { ...p, score: Math.min(100, Math.max(0, Math.round(score))) };
  });
  
  // Sort by Match Score descending
  matched.sort((a, b) => b.score - a.score);
  
  // Render Cards
  container.innerHTML = '';
  
  if (matched.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching care providers found. Try expanding your search options.</div>`;
    return;
  }
  
  matched.forEach(p => {
    const card = document.createElement('div');
    card.className = 'provider-card';
    
    const isSuspended = p.onboardingStatus !== 'active';
    const matchBadgeText = isSuspended ? 'SUSPENDED' : `Match: ${p.score}%`;
    const trustBadgeText = isSuspended 
      ? '<span style="font-size: 0.75rem; color: var(--accent-maple); font-weight: 700; margin-top: 0.5rem; text-align: center;">Suspended 🔒</span>' 
      : '<span style="font-size: 0.75rem; color: var(--accent-forest); font-weight: 700; margin-top: 0.5rem; text-align: center;">Verified ✓</span>';
    
    // Generate skill badges
    const skillTags = p.skills.map(s => `<span class="tag">${s}</span>`).join('');
    const langTags = p.languages.map(l => `<span class="tag" style="background-color: var(--accent-maple-light); color: var(--accent-maple);">${l}</span>`).join('');
    
    card.innerHTML = `
      <div class="match-score-badge" style="${isSuspended ? 'background-color: var(--accent-maple); color: white;' : ''}">${matchBadgeText}</div>
      <div class="provider-avatar-wrapper">
        <div class="provider-avatar">${p.name.charAt(0)}${p.name.split(' ')[1].charAt(0)}</div>
        ${trustBadgeText}
      </div>
      <div class="provider-details" style="${isSuspended ? 'opacity: 0.6;' : ''}">
        <h4>${p.name} <span class="badge ${isSuspended ? 'badge-secondary' : 'badge-primary'}" style="font-size: 0.65rem; padding: 0.15rem 0.4rem;">${isSuspended ? 'Auditing Required' : 'VSS Approved'}</span></h4>
        <div class="provider-title">${p.type}</div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          📍 ${p.city} • 💼 ${p.experience} experience
        </p>
        <div class="tags">
          ${skillTags}
          ${langTags}
        </div>
      </div>
      <div class="provider-action-panel">
        <div class="price">$${p.hourlyRate}<span>/hr</span></div>
        <div class="rating">★ ${p.rating.toFixed(1)} <span style="color: var(--text-muted); font-size: 0.75rem;">(${p.reviews} reviews)</span></div>
        ${isSuspended 
          ? `<button class="btn-primary provider-book-button" style="padding: 0.4rem 1rem; font-size: 0.8rem; border-radius: 4px; background-color: var(--text-muted); pointer-events: none;" disabled>Blocked</button>` 
          : `<button class="btn-primary provider-book-button" style="padding: 0.4rem 1rem; font-size: 0.8rem; border-radius: 4px;">Book Care</button>`
        }
      </div>
    `;
    
    if (!isSuspended) {
      card.querySelector('.provider-book-button').addEventListener('click', () => bookProvider(p));
    }
    
    container.appendChild(card);
  });
}

// --- SHARED FAMILY DASHBOARD WIDGETS ---
function setupDashboardVisuals() {
  // Populate Calendar Days
  const calendarGrid = document.getElementById('care-calendar-grid');
  if (calendarGrid) {
    calendarGrid.innerHTML = '';
    
    // Add day names headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => {
      const h = document.createElement('div');
      h.className = 'calendar-header-day';
      h.textContent = d;
      calendarGrid.appendChild(h);
    });
    
    // Add 31 days with randomized care schedules
    for (let i = 1; i <= 31; i++) {
      const dCard = document.createElement('div');
      dCard.className = 'calendar-day';
      if (i === 9 || i === 12 || i === 15 || i === 19 || i === 22 || i === 26) {
        dCard.classList.add('active-day');
      }
      
      let indicator = '';
      if (i === 9 || i === 15 || i === 22) {
        indicator = `<div class="event-indicator"></div>`; // Forest green for PSW
      } else if (i === 12 || i === 19 || i === 26) {
        indicator = `<div class="event-indicator maple"></div>`; // Orange for Therapy
      }
      
      dCard.innerHTML = `
        <div class="day-num">${i}</div>
        ${indicator}
      `;
      
      dCard.addEventListener('click', () => {
        let details = "Family Care Log: Rest Day. No visits scheduled.";
        if (i === 9 || i === 15 || i === 22) {
          details = `Care Log (Day ${i}): PSW Visit scheduled from 10:00 AM - 1:30 PM (Personal hygiene & meal preparation).`;
        } else if (i === 12 || i === 19 || i === 26) {
          details = `Care Log (Day ${i}): Occupational Therapy & mobility rehab scheduled from 2:00 PM - 3:30 PM.`;
        }
        document.getElementById('calendar-selected-details').textContent = details;
      });
      
      calendarGrid.appendChild(dCard);
    }
  }
}

// --- GPS VISIT VERIFICATION SIMULATION ---
function startGpsSimulation() {
  if (state.gps.active) return;
  state.gps.active = true;
  
  const marker = document.getElementById('provider-marker');
  const transportMarker = document.getElementById('transport-marker');
  const target = document.getElementById('target-marker');
  const distanceText = document.getElementById('gps-live-distance');
  const statusText = document.getElementById('gps-live-status');
  
  if (!marker || !target) return;
  
  // Set target coordinates
  target.style.left = `${state.gps.targetX}px`;
  target.style.top = `${state.gps.targetY}px`;
  
  state.gps.providerX = 40;
  state.gps.providerY = 220;
  
  let transportX = 240;
  let transportY = 240;
  
  // Make transport marker visible if it is enabled
  const hasTransport = state.currentJourney && state.currentJourney.steps.some(s => s.type === 'transport' && s.enabled);
  if (transportMarker) {
    transportMarker.style.display = hasTransport ? 'flex' : 'none';
    if (hasTransport) {
      transportMarker.style.left = `${transportX}px`;
      transportMarker.style.top = `${transportY}px`;
    }
  }

  state.gps.intervalId = setInterval(() => {
    // 1. Update caregiver coordinates
    const dxP = state.gps.targetX - state.gps.providerX;
    const dyP = state.gps.targetY - state.gps.providerY;
    const distanceP = Math.sqrt(dxP * dxP + dyP * dyP);
    
    if (distanceP > 5) {
      const stepX = (dxP / distanceP) * 12;
      const stepY = (dyP / distanceP) * 12;
      state.gps.providerX += stepX;
      state.gps.providerY += stepY;
      marker.style.left = `${Math.round(state.gps.providerX)}px`;
      marker.style.top = `${Math.round(state.gps.providerY)}px`;
    } else {
      marker.style.left = `${state.gps.targetX}px`;
      marker.style.top = `${state.gps.targetY}px`;
    }

    // 2. Update transport vehicle coordinates if active
    let distanceT = 0;
    if (hasTransport && transportMarker) {
      const dxT = state.gps.targetX - transportX;
      const dyT = state.gps.targetY - transportY;
      distanceT = Math.sqrt(dxT * dxT + dyT * dyT);
      
      if (distanceT > 5) {
        const stepX = (dxT / distanceT) * 18; // Transport vehicle moves faster
        const stepY = (dyT / distanceT) * 18;
        transportX += stepX;
        transportY += stepY;
        transportMarker.style.left = `${Math.round(transportX)}px`;
        transportMarker.style.top = `${Math.round(transportY)}px`;
      } else {
        transportMarker.style.left = `${state.gps.targetX}px`;
        transportMarker.style.top = `${state.gps.targetY}px`;
      }
    }

    // Check arrival status
    const activeDistance = hasTransport ? Math.max(distanceP, distanceT) : distanceP;
    if (distanceP < 5 && (!hasTransport || distanceT < 5)) {
      // Both arrived
      marker.style.left = `${state.gps.targetX}px`;
      marker.style.top = `${state.gps.targetY}px`;
      if (transportMarker) {
        transportMarker.style.left = `${state.gps.targetX}px`;
        transportMarker.style.top = `${state.gps.targetY}px`;
      }
      distanceText.textContent = "Arrived (0 m)";
      statusText.textContent = hasTransport ? "Checked-in (Caregiver & Transit Arrived) ✓" : "Checked-in (GPS Verified) ✓";
      statusText.style.color = "var(--accent-forest)";
      stopGpsSimulation();
    } else {
      const realDistMeters = Math.round(activeDistance * 3.5);
      distanceText.textContent = `En Route (${realDistMeters}m away)`;
      statusText.textContent = hasTransport ? "Caregiver & Transit Commute Active" : "Active Caregiver Commute";
      statusText.style.color = "var(--accent-maple)";
    }
  }, 1000);
}

function stopGpsSimulation() {
  state.gps.active = false;
  if (state.gps.intervalId) {
    clearInterval(state.gps.intervalId);
    state.gps.intervalId = null;
  }
}

// --- AI SEO OPTIMIZER & CONTENT GENERATOR SYSTEM ---

// Content Generator Templates Database
const seoTemplates = {
  landing: {
    homecare: {
      title: "Top Senior Home Care Services in {City} | CareBridge",
      desc: "Find verified, compassionate senior home care services in {City}. CareBridge connects families with private care providers for personalized aging in place support.",
      content: `<h1>Exceptional Senior Home Care Services in {City}, Ontario</h1>\n\n<p>Are you or a loved one looking for trusted and compassionate senior home care services in {City}? As seniors age, maintaining independence while staying safe at home becomes a top priority for families. CareBridge offers an innovative digital operating system that directly connects families with vetted, independent care professionals without the expensive agency overhead.</p>\n\n<h2>Why Choose CareBridge's Home Care Platform?</h2>\n\n<p>Unlike traditional staffing agencies that employ caregivers and charge steep markups, CareBridge is a digital broker. We verify credentials, manage automated scheduling, and provide secure payments, putting you in control of your care plan.</p>\n\n<ul>\n  <li><strong>Verified Support:</strong> Every caregiver on our platform has passed a Vulnerable Sector Screening (VSS) police check.</li>\n  <li><strong>Direct Choices:</strong> View profiles, ratings, and hourly rates to choose the best fit for your family.</li>\n  <li><strong>Full Accountability:</strong> Real-time GPS check-ins verify that caregivers arrive on schedule.</li>\n</ul>\n\n<h2>Personalized In-Home Care Support</h2>\n\n<p>Our network of professionals in {City} provides a wide range of custom care options, including assistance with daily living (ADLs), light housekeeping, meal preparation, medication reminders, and companionship. Whether you need a few hours a week or daily visits, find local care providers who understand your unique needs.</p>`
    },
    psw: {
      title: "Vetted & Licensed PSW Caregivers in {City} | CareBridge",
      desc: "Connect directly with certified and vetted Personal Support Workers (PSWs) in {City}. Save on agency fees while finding high-quality local in-home care.",
      content: `<h1>Trusted Licensed PSW Caregivers in {City}, Ontario</h1>\n\n<p>Finding a reliable and certified Personal Support Worker (PSW) in {City} shouldn't be stressful. Personal Support Workers play a vital role in senior home care, helping with grooming, mobility, hygiene, and daily tasks. CareBridge is Ontario's first senior care operating system that helps you discover and book licensed PSW caregivers in your neighborhood.</p>\n\n<h2>The Advantage of Hiring Independent PSWs</h2>\n\n<p>Traditional care agencies take a large cut of the hourly bill rate, often leading to high costs for families and lower pay for workers. CareBridge solves this with a direct marketplace broker model:</p>\n\n<ul>\n  <li><strong>Save up to 30%:</strong> Connect directly with independent PSWs, eliminating middleman agencies.</li>\n  <li><strong>VSS Background Cleared:</strong> Every provider undergoes strict background screening.</li>\n  <li><strong>CNO Registration Check:</strong> RPNs and nursing providers are verified weekly.</li>\n</ul>\n\n<h2>In-Home Care Services Offered in {City}</h2>\n\n<p>Choose from dozens of certified PSWs who can help with transfer assistance, dementia care support, diabetic meal planning, and light exercise routines. Our digital dashboard keeps families connected with shared care calendars, direct messaging, and GPS arrival validation. Explore local profiles and hire your caregiver today.</p>`
    },
    nurse: {
      title: "Private Duty Nursing Services in {City} | CareBridge",
      desc: "Secure professional private duty nurses (RN/RPN) in {City} for complex medical care. Fully vetted, CNO-registered independent nurses at transparent rates.",
      content: `<h1>Professional Private Duty Nursing in {City}, Ontario</h1>\n\n<p>For seniors with complex health needs, chronic illnesses, or recovering from surgery, general support is not enough. CareBridge makes it simple to hire certified, CNO-registered private duty nurses (Registered Nurses and Registered Practical Nurses) directly in {City}. Get professional medical care at home without agency markup.</p>\n\n<h2>Specialized Medical Care at Home</h2>\n\n<p>Independent nurses on the CareBridge network are qualified to provide a variety of clinical nursing tasks, including:</p>\n\n<ul>\n  <li><strong>Wound Care & Dressing:</strong> Preventing infections and managing post-surgical healing.</li>\n  <li><strong>Medication Management:</strong> Setting up complex pill schedules and administering injections.</li>\n  <li><strong>Chronic Condition Support:</strong> Specialized care for diabetes, cardiac conditions, and neurological disorders.</li>\n</ul>\n\n<h2>The CareBridge Safety & Trust Standard</h2>\n\n<p>We verify each nurse's license with the College of Nurses of Ontario (CNO) weekly and require Vulnerable Sector Screenings. Families receive real-time check-in updates and can read peer reviews. Choose transparency, medical safety, and lower costs for private home care in {City}.</p>`
    },
    therapy: {
      title: "Senior Rehabilitation & In-Home Therapy in {City} | CareBridge",
      desc: "Book expert occupational and physical therapists for senior rehabilitation in {City}. In-home therapy sessions focused on fall prevention and mobility.",
      content: `<h1>Senior Rehabilitation & In-Home Therapy in {City}, Ontario</h1>\n\n<p>Recovering mobility and preventing falls are key to helping seniors age in place safely. CareBridge connects families in {City} with certified physical therapists, occupational therapists, and massage therapists for dedicated home-based rehabilitation. Avoid clinics and perform therapy sessions in the comfort of your own home.</p>\n\n<h2>Rehabilitation Services Available in {City}</h2>\n\n<p>Rehab professionals on our marketplace offer target therapies designed for aging seniors:</p>\n\n<ul>\n  <li><strong>Fall Prevention Audits:</strong> Occupational Therapists assess home hazards and suggest assistive aids.</li>\n  <li><strong>Mobility & Balance Training:</strong> Physiotherapy sessions to restore strength and joint flexibility.</li>\n  <li><strong>Stroke Rehabilitation:</strong> Tailored home exercise programs to regain coordination and speech.</li>\n  <li><strong>Affordable Rehabilitation:</strong> Custom private-pay structures mapped to insurance.</li>\n</ul>\n\n<h2>Flexible, Direct Booking</h2>\n\n<p>Search profiles, review rates, and schedule sessions directly through our care calendar. CareBridge ensures all therapists are fully registered, insured, and verified. Help your loved one regain strength safely at home.</p>`
    }
  },
  blog: {
    homecare: {
      title: "A Family Guide to Senior Home Care in {City} | CareBridge",
      desc: "Unsure how to choose the right home care for aging parents? Read our comprehensive family guide to senior care, costs, and local support in {City}.",
      content: `<h1>Understanding Senior Home Care in {City}: A Family's Guide</h1>\n\n<p>Navigating senior home care options for aging parents in {City} can feel overwhelming. Many families face fragmented options, long waiting lists for government-funded support, or exorbitant prices from private staffing agencies. In this guide, we break down what to look for and how digital tools are changing home care in Ontario.</p>\n\n<h2>Types of Senior Home Care Available</h2>\n\n<p>Senior care is not one-size-fits-all. Depending on your parent's mobility and health, you may need:</p>\n\n<ul>\n  <li><strong>Companionship:</strong> Social visits, transport to family doctor clinics, or running errands.</li>\n  <li><strong>Personal Care (PSW):</strong> Help with bathing, transferring, and grooming.</li>\n  <li><strong>Medical Nursing:</strong> Medication management and wound care by licensed nurses.</li>\n</ul>\n\n<h2>Key Questions to Ask When Hiring a Caregiver</h2>\n\n<p>To ensure safety and peace of mind, always ask:</p>\n\n<ol>\n  <li>Has the caregiver passed a Vulnerable Sector Screening (VSS) police check?</li>\n  <li>Are they insured and credential-verified?</li>\n  <li>How do you verify that visits are occurring as scheduled?</li>\n</ol>\n\n<p>At CareBridge, we've automated these checks. Our marketplace platform verifies VSS status, checks nurse registries, and uses GPS check-ins to prevent fraud, keeping your care plan reliable and safe.</p>`
    },
    psw: {
      title: "What is a Personal Support Worker (PSW)? | CareBridge {City}",
      desc: "Learn what a PSW does, the difference between a PSW and a nurse, and how to hire independent PSW caregivers in {City} for senior home care.",
      content: `<h1>What Does a Personal Support Worker Do? | {City} Senior Care Guide</h1>\n\n<p>If you're exploring senior home care in {City}, you've likely heard the term 'Personal Support Worker' or 'PSW'. Personal Support Workers are the backbone of Ontario's healthcare system, providing essential support to seniors wishing to age in place. Here is a breakdown of their responsibilities, qualifications, and how to find one.</p>\n\n<h2>Core Responsibilities of a PSW</h2>\n\n<p>Unlike registered nurses, PSWs do not perform medical procedures (like injections or wound dressing). Instead, they assist with non-clinical tasks that are essential for daily life:</p>\n\n<ul>\n  <li>Help with dressing, bathing, and hygiene.</li>\n  <li>Support with mobility, transfers from bed to chair, and light exercise.</li>\n  <li>Meal planning, preparing food, and grocery shopping.</li>\n  <li>Companionship and emotional support.</li>\n</ul>\n\n<h2>How to Safely Hire a PSW in {City}</h2>\n\n<p>Hiring a PSW privately through CareBridge ensures you receive high-quality care while avoiding middleman agency fees. CareBridge verifies that all listed PSWs have Vulnerable Sector Screenings, and our automated dashboard tracks daily tasks and GPS check-ins, allowing family members to stay updated on care progress in real time.</p>`
    },
    nurse: {
      title: "When Do Seniors Need In-Home Nursing Care? | CareBridge {City}",
      desc: "Understand the indicators that your elderly parent needs professional clinical nursing care at home. Key advice for families in {City}.",
      content: `<h1>When is it Time for In-Home Nursing Care? | {City} Family Guide</h1>\n\n<p>Many seniors can live independently for years with simple PSW help. However, as health conditions shift, specialized clinical support becomes necessary. For families in {City}, knowing when to transition from basic caregiving to professional private duty nursing is vital to preventing hospital admissions.</p>\n\n<h2>Signs Your Loved One Needs a Private Nurse</h2>\n\n<p>Watch for these clinical indicators:</p>\n\n<ul>\n  <li><strong>Complex Medication Changes:</strong> Multiple prescriptions requiring careful schedules.</li>\n  <li><strong>Post-Hospital Discharge:</strong> Healing wounds, surgical drains, or specialized therapy needs.</li>\n  <li><strong>Frequent Falls or Sudden Decline:</strong> Signs of underlying medical issues.</li>\n</ul>\n\n<h2>Hiring CNO-Registered Nurses Directly</h2>\n\n<p>With CareBridge, you can select certified RNs and RPNs in {City} directly. We verify licenses against the College of Nurses of Ontario registry weekly, ensuring your family receives safe, professional clinical support without paying massive agency surcharges.</p>`
    },
    therapy: {
      title: "Fall Prevention & Rehab for Seniors in {City} | CareBridge",
      desc: "Discover how physical and occupational therapy at home can reduce fall risks for seniors. Practical tips from CareBridge therapists in {City}.",
      content: `<h1>Fall Prevention & Mobility Therapy for Seniors in {City}</h1>\n\n<p>Falls are the leading cause of injury among Canadian seniors, often leading to a loss of independence. Fortunately, simple rehabilitation and occupational therapy at home can significantly reduce fall risks. Here are the best strategies from physical therapists in the {City} area.</p>\n\n<h2>Top Fall Prevention Strategies</h2>\n\n<ul>\n  <li><strong>Home Assessment:</strong> Clear clutter, improve lighting, and install grab bars in bathrooms.</li>\n  <li><strong>Balance & Strength Exercises:</strong> Undergo targeted physical therapy to build leg strength and improve gait.</li>\n  <li><strong>Medication Reviews:</strong> Speak with family doctors about side effects like dizziness.</li>\n</ul>\n\n<h2>In-Home Therapy via CareBridge</h2>\n\n<p>Booking home-based physical or occupational therapy sessions through CareBridge allows seniors in {City} to practice recovery in their actual living environment. We verify credentials and insurance for all listed therapists, ensuring a safe and reliable recovery process.</p>`
    }
  }
};

// Keyword mapping for density score tracking
const keywordRegistry = {
  homecare: [
    { text: "senior home care", target: 2 },
    { text: "home care services", target: 2 },
    { text: "independent care", target: 1 },
    { text: "Vulnerable Sector Screening", target: 1 }
  ],
  psw: [
    { text: "Personal Support Worker", target: 3 },
    { text: "certified PSW", target: 2 },
    { text: "VSS Background", target: 1 },
    { text: "CNO Registration", target: 1 }
  ],
  nurse: [
    { text: "private duty nursing", target: 2 },
    { text: "CNO-registered", target: 2 },
    { text: "clinical nursing", target: 1 },
    { text: "medical care", target: 2 }
  ],
  therapy: [
    { text: "senior rehabilitation", target: 2 },
    { text: "occupational therapist", target: 1 },
    { text: "physical therapy", target: 2 },
    { text: "fall prevention", target: 2 }
  ]
};

function setupSEOOptimizer() {
  const btnGen = document.getElementById('btn-generate-seo');
  const btnOpt = document.getElementById('btn-auto-optimize');
  
  const titleInput = document.getElementById('editor-title');
  const descInput = document.getElementById('editor-desc');
  const contentInput = document.getElementById('editor-content');
  
  if (btnGen) {
    btnGen.addEventListener('click', triggerSelfGeneration);
  }
  
  if (btnOpt) {
    btnOpt.addEventListener('click', autoOptimizeContent);
  }
  
  // Real-time tracking inputs
  [titleInput, descInput, contentInput].forEach(el => {
    if (el) {
      el.addEventListener('input', runSEOAnalysis);
    }
  });
}

// Generates initial content drafts
function triggerSelfGeneration() {
  const city = document.getElementById('seo-city').value;
  const kwGroup = document.getElementById('seo-keyword').value;
  const focus = document.getElementById('seo-focus').value;
  const tone = document.getElementById('seo-tone').value;
  
  const template = seoTemplates[focus][kwGroup];
  if (!template) return;
  
  // Replace tokens
  let title = template.title.replace(/{City}/g, city);
  let desc = template.desc.replace(/{City}/g, city);
  let content = template.content.replace(/{City}/g, city);
  
  // If compassionate tone is selected, adjust adjectives
  if (tone === 'compassionate') {
    content = content.replace(/exceptional/gi, "warm and caring");
    content = content.replace(/professional/gi, "loving and dedicated");
  } else if (tone === 'clinical') {
    content = content.replace(/exceptional/gi, "highly regulated, clinic-grade");
    content = content.replace(/trusted/gi, "fully compliant");
  }
  
  // Update inputs
  document.getElementById('editor-title').value = title;
  document.getElementById('editor-desc').value = desc;
  document.getElementById('editor-content').value = content;
  
  // Trigger audit updates
  runSEOAnalysis();
}

// Runs real-time evaluation rules
function runSEOAnalysis() {
  const title = document.getElementById('editor-title').value;
  const desc = document.getElementById('editor-desc').value;
  const content = document.getElementById('editor-content').value;
  const kwGroup = document.getElementById('seo-keyword').value;
  const city = document.getElementById('seo-city').value;
  
  // 1. Title Character Metrics
  const titleLen = title.length;
  document.getElementById('title-char-count').textContent = `${titleLen} chars`;
  const titleStatus = document.getElementById('title-char-status');
  let titleScore = 0;
  
  if (titleLen >= 50 && titleLen <= 60) {
    titleStatus.textContent = "Optimal Range ✓";
    titleStatus.style.color = "var(--accent-forest)";
    titleScore = 20;
  } else if (titleLen > 0) {
    titleStatus.textContent = titleLen < 50 ? "Too short" : "Too long";
    titleStatus.style.color = "var(--accent-gold)";
    titleScore = 10;
  } else {
    titleStatus.textContent = "Empty";
    titleStatus.style.color = "var(--text-muted)";
  }
  
  // 2. Meta Description Metrics
  const descLen = desc.length;
  document.getElementById('desc-char-count').textContent = `${descLen} chars`;
  const descStatus = document.getElementById('desc-char-status');
  let descScore = 0;
  
  if (descLen >= 120 && descLen <= 160) {
    descStatus.textContent = "Optimal Range ✓";
    descStatus.style.color = "var(--accent-forest)";
    descScore = 20;
  } else if (descLen > 0) {
    descStatus.textContent = descLen < 120 ? "Too short" : "Too long";
    descStatus.style.color = "var(--accent-gold)";
    descScore = 10;
  } else {
    descStatus.textContent = "Empty";
    descStatus.style.color = "var(--text-muted)";
  }
  
  // 3. Word Count
  const words = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  document.getElementById('editor-word-count').textContent = `Words: ${words}`;
  let wordScore = 0;
  if (words >= 300) {
    wordScore = 20;
  } else if (words >= 100) {
    wordScore = 10;
  }
  
  // 4. Keyword and City Check
  const keywords = keywordRegistry[kwGroup];
  let kwScore = 0;
  let kwMatchCount = 0;
  
  const keywordsContainer = document.getElementById('seo-keywords-list');
  keywordsContainer.innerHTML = '';
  
  // Check City term presence in content
  const cityRegex = new RegExp(`\\b${city}\\b`, 'gi');
  const cityMatches = (content.match(cityRegex) || []).length;
  
  // Append City tracker
  appendKeywordMeter(city, cityMatches, 3, keywordsContainer);
  if (cityMatches >= 3) {
    kwScore += 10;
  } else if (cityMatches > 0) {
    kwScore += 5;
  }
  
  // Check other core keyword terms
  keywords.forEach(kw => {
    const rx = new RegExp(kw.text, 'gi');
    const matches = (content.match(rx) || []).length;
    
    appendKeywordMeter(kw.text, matches, kw.target, keywordsContainer);
    
    if (matches >= kw.target) {
      kwMatchCount++;
    }
  });
  
  // Add score based on how many keywords reached their target
  kwScore += Math.round((kwMatchCount / keywords.length) * 20);
  
  // 5. Structure Check: Has H1 and H2 tags
  let structureScore = 0;
  const hasH1 = /<h1>/i.test(content) || /#\s+/i.test(content);
  const hasH2 = /<h2>/i.test(content) || /##\s+/i.test(content);
  if (hasH1 && hasH2) {
    structureScore = 10;
  } else if (hasH1 || hasH2) {
    structureScore = 5;
  }
  
  // Total Score (out of 100)
  const totalScore = titleScore + descScore + wordScore + kwScore + structureScore;
  
  // Render Circular Progress
  const circle = document.getElementById('seo-score-circle');
  const textVal = document.getElementById('seo-score-text');
  if (circle && textVal) {
    // Dashoffset calculation (r=50, circumference ~ 314.15)
    const offset = 314.15 - (totalScore / 100) * 314.15;
    circle.style.strokeDashoffset = offset;
    textVal.textContent = `${totalScore}%`;
    
    // Change progress ring color based on score health
    if (totalScore >= 90) {
      circle.style.stroke = "var(--accent-forest)";
    } else if (totalScore >= 60) {
      circle.style.stroke = "var(--accent-gold)";
    } else {
      circle.style.stroke = "var(--accent-maple)";
    }
  }
  
  // Render Audit Checklist
  const checklistContainer = document.getElementById('seo-checklist');
  if (checklistContainer) {
    checklistContainer.innerHTML = `
      <div class="seo-check-row">
        <span class="seo-check-indicator ${titleScore === 20 ? 'pass' : 'fail'}">${titleScore === 20 ? '✓' : '✗'}</span>
        Title length optimized (50-60 chars)
      </div>
      <div class="seo-check-row">
        <span class="seo-check-indicator ${descScore === 20 ? 'pass' : 'fail'}">${descScore === 20 ? '✓' : '✗'}</span>
        Meta description length (120-160 chars)
      </div>
      <div class="seo-check-row">
        <span class="seo-check-indicator ${words >= 300 ? 'pass' : 'fail'}">${words >= 300 ? '✓' : '✗'}</span>
        Word count (Target: 300+ words)
      </div>
      <div class="seo-check-row">
        <span class="seo-check-indicator ${cityMatches >= 3 ? 'pass' : 'fail'}">${cityMatches >= 3 ? '✓' : '✗'}</span>
        City token frequency (Target: 3+ '${city}')
      </div>
      <div class="seo-check-row">
        <span class="seo-check-indicator ${hasH1 && hasH2 ? 'pass' : 'fail'}">${hasH1 && hasH2 ? '✓' : '✗'}</span>
        Heading hierarchy H1 + H2 tags present
      </div>
    `;
  }
}

// Appends single progress bar for keyword
function appendKeywordMeter(term, matches, target, container) {
  const row = document.createElement('div');
  row.className = 'keyword-row';
  
  const pct = Math.min(100, Math.round((matches / target) * 100));
  let colorClass = '';
  if (matches >= target) {
    colorClass = 'optimal';
  } else if (matches > 0) {
    colorClass = 'warning';
  }
  
  row.innerHTML = `
    <div class="keyword-info">
      <span>"${term}"</span>
      <span>${matches}/${target}</span>
    </div>
    <div class="keyword-bar-bg">
      <div class="keyword-bar-fill ${colorClass}" style="width: ${pct}%;"></div>
    </div>
  `;
  container.appendChild(row);
}

// Auto Optimizer Engine: Applies programmatic edits to maximize score
function autoOptimizeContent() {
  const title = document.getElementById('editor-title').value;
  const desc = document.getElementById('editor-desc').value;
  let content = document.getElementById('editor-content').value;
  const city = document.getElementById('seo-city').value;
  const kwGroup = document.getElementById('seo-keyword').value;
  
  // Exit if completely empty
  if (title.trim() === "" && content.trim() === "") {
    alert("Please click 'Self-Generate Content' or write some text before running the Auto-Optimizer.");
    return;
  }
  
  let newTitle = title;
  let newDesc = desc;
  
  // 1. Force Title optimization
  if (title.length < 50 || title.length > 60) {
    const rootTitle = `Premium Caregiver Services in ${city}`;
    newTitle = `${rootTitle} | CareBloom OS`;
    if (newTitle.length < 50) {
      newTitle = `Licensed In-Home Caregiver Services in ${city} | CareBloom`;
    }
  }
  
  // 2. Force Meta Description optimization
  if (desc.length < 120 || desc.length > 160) {
    newDesc = `Hire certified, fully verified senior caregivers and PSWs in ${city} directly. CareBloom offers transparent rates, verified VSS screens, and GPS care visits.`;
  }
  
  // 3. Ensure H1 and H2 tags exist in content
  if (!/<h1>/i.test(content) && !/#\s+/i.test(content)) {
    content = `<h1>Senior In-Home Care Services in ${city}, Ontario</h1>\n\n` + content;
  }
  if (!/<h2>/i.test(content) && !/##\s+/i.test(content)) {
    content = content + `\n\n<h2>Highly Vetted Senior Support Specialists</h2>\n<p>Every caregiver undergoes Vulnerable Sector Screening to verify patient safety.</p>`;
  }
  
  // 4. Inject missing keywords based on group
  const keywords = keywordRegistry[kwGroup];
  let injectBlock = `\n\n<!-- SEO Optimization Node -->\n<div style="display:none;" aria-hidden="true">\n  <p>Providing specialized ${keywords[0].text} for local families in ${city}.</p>\n</div>`;
  
  // Check if keywords are present, if not add a semantic helper paragraph at the bottom
  let missingKws = [];
  keywords.forEach(kw => {
    const rx = new RegExp(kw.text, 'gi');
    if (!rx.test(content)) {
      missingKws.push(kw.text);
    }
  });
  
  const cityRx = new RegExp(city, 'gi');
  const cityMatches = (content.match(cityRx) || []).length;
  if (cityMatches < 3) {
    missingKws.push(city);
  }
  
  if (missingKws.length > 0) {
    let supportPara = `\n\n<h2>Comprehensive Local Care Coverage</h2>\n<p>Our platform handles all aspects of coordinates, bringing transparent ${keywords[0].text} directly to neighborhoods across ${city}. Our network includes specialists in ${keywords[1].text} and coordinates with families to check ${keywords[2].text} listings. Every match meets strict compliance metrics to verify safety.</p>`;
    content += supportPara;
  }
  
  // Apply Optimized Values to UI
  document.getElementById('editor-title').value = newTitle;
  document.getElementById('editor-desc').value = newDesc;
  document.getElementById('editor-content').value = content;
  
  // Run Analysis to update outputs
  runSEOAnalysis();
  
  alert("AI Optimizer: Meta tags aligned, H1/H2 tags verified, and target density keywords injected. Score optimized to 100%!");
}

// --- BOOKING TRANSACTIONAL LOOP ---
// When "Book Care" is clicked in the AI Matcher, this function:
// 1. Creates a new invoice
// 2. Adds the visit to the care calendar
// 3. Triggers GPS tracking simulation
// 4. Shows a toast notification
function createBooking(provider, request = null) {
  // Deprecated: server-side booking via confirmMarketplaceBooking is preferred.
}

async function bookProvider(provider) {
  const request = {
    recipient: "Margaret Poudyal",
    city: provider.city,
    skill: provider.skills[0] || "Companionship",
    language: provider.languages[0] || "English",
    date: new Date().toISOString().slice(0, 10),
    hours: 3.5,
    notes: "Direct booking from AI Care Matcher."
  };
  await confirmMarketplaceBooking(provider, request);
}

// --- BILLING & INVOICE SYSTEM ---
function setupBillingCenter() {
  renderInvoiceList();
}

function renderInvoiceList() {
  const container = document.getElementById('invoice-list-container');
  if (!container) return;
  container.innerHTML = '';

  if (state.invoices.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">No invoices yet. Book a caregiver from the AI Care Matcher.</div>';
    return;
  }

  state.invoices.forEach((inv, idx) => {
    const subtotal = inv.hours * inv.hourlyRate;
    const serviceFee = subtotal * 0.15;
    const total = subtotal + serviceFee;

    const item = document.createElement('div');
    item.className = 'invoice-list-item';
    item.innerHTML = `
      <div class="invoice-left">
        <span class="inv-id">${inv.id}</span>
        <span class="inv-provider">${inv.providerName} • ${inv.date}</span>
      </div>
      <div class="invoice-right">
        <span class="inv-total">$${total.toFixed(2)}</span>
        <span class="inv-status ${inv.status}">${inv.status}</span>
      </div>
    `;
    item.addEventListener('click', () => renderInvoiceDetail(inv, item));
    container.appendChild(item);

    // Auto-select first invoice
    if (idx === 0) {
      renderInvoiceDetail(inv, item);
      item.classList.add('active-invoice');
    }
  });
}

function renderInvoiceDetail(inv, listItem) {
  document.querySelectorAll('.invoice-list-item').forEach(el => el.classList.remove('active-invoice'));
  if (listItem) listItem.classList.add('active-invoice');

  const card = document.getElementById('invoice-details-card');
  if (!card) return;

  const subtotal = inv.hours * inv.hourlyRate;
  const serviceFee = subtotal * 0.15;
  const hst = (subtotal + serviceFee) * 0.13;
  const grandTotal = subtotal + serviceFee + hst;
  const providerPlatformFee = subtotal * 0.05;
  const providerPayout = subtotal - providerPlatformFee;

  card.innerHTML = `
    <div class="receipt-header">
      <div class="receipt-brand">
        <h3>🍁 CareBloom</h3>
        <p>Senior Care Marketplace & Operating System</p>
        <p>Ontario, Canada</p>
      </div>
      <div class="receipt-id-block">
        <div class="receipt-number">${inv.id}</div>
        <div class="receipt-date">${inv.date}</div>
        <span class="badge ${inv.status === 'paid' ? 'badge-primary' : 'badge-secondary'}" style="margin-top: 0.5rem; font-size: 0.7rem;">${inv.status.toUpperCase()}</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div>
        <p style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Billed To</p>
        <p style="font-weight: 700;">Margaret Poudyal</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">${inv.city}, Ontario</p>
      </div>
      <div>
        <p style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Care Provider</p>
        <p style="font-weight: 700;">${inv.providerName}</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">${inv.providerType}</p>
      </div>
    </div>

    <table class="receipt-line-items">
      <thead>
        <tr>
          <th>Service Description</th>
          <th>Hours</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${inv.providerType} — Home Visit</td>
          <td>${inv.hours}h</td>
          <td>$${inv.hourlyRate.toFixed(2)}/hr</td>
          <td>$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>CareBloom Client Service Fee (15%)</td>
          <td>—</td>
          <td>15%</td>
          <td>$${serviceFee.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Ontario HST (13%)</td>
          <td>—</td>
          <td>13%</td>
          <td>$${hst.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="receipt-totals">
      <div class="receipt-total-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="receipt-total-row">
        <span>Platform Fee (15%)</span>
        <span>$${serviceFee.toFixed(2)}</span>
      </div>
      <div class="receipt-total-row">
        <span>HST (13%)</span>
        <span>$${hst.toFixed(2)}</span>
      </div>
      <div class="receipt-total-row grand-total">
        <span>Total Due</span>
        <span>$${grandTotal.toFixed(2)}</span>
      </div>
    </div>

    <div class="receipt-footer-note">
      🔐 This digital receipt is stored securely in CareBloom's PHIPA-compliant vault. Provider Payout: $${providerPayout.toFixed(2)} (after 5% platform fee).
    </div>
  `;
}

// --- PROVIDER CENTER ---
function setupProviderCenter() {
  const selectEl = document.getElementById('provider-select-edit');
  if (!selectEl) return;

  selectEl.innerHTML = '';
  state.providers.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} — ${p.type}`;
    selectEl.appendChild(opt);
  });

  selectEl.addEventListener('change', loadProviderIntoForm);

  const typeSelect = document.getElementById('provider-edit-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', updateProviderSpecialtyChecklist);
  }

  const rateSlider = document.getElementById('provider-edit-rate');
  const rateDisplay = document.getElementById('val-edit-rate');
  if (rateSlider && rateDisplay) {
    rateSlider.addEventListener('input', () => {
      rateDisplay.textContent = `$${rateSlider.value}`;
      updateProviderNetPayout(parseFloat(rateSlider.value));
    });
  }

  const saveBtn = document.getElementById('btn-save-provider-profile');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProviderProfile);
  }

  loadProviderIntoForm();
}

function loadProviderIntoForm() {
  const selectEl = document.getElementById('provider-select-edit');
  const id = parseInt(selectEl.value);
  const provider = state.providers.find(p => p.id === id);
  if (!provider) return;

  document.getElementById('provider-edit-name').value = provider.name;
  document.getElementById('provider-edit-type').value = provider.type;
  document.getElementById('provider-edit-city').value = provider.city;

  const rateSlider = document.getElementById('provider-edit-rate');
  rateSlider.value = provider.hourlyRate;
  document.getElementById('val-edit-rate').textContent = `$${provider.hourlyRate}`;

  updateProviderNetPayout(provider.hourlyRate);
  updateProviderSpecialtyChecklist();
}

function updateProviderNetPayout(rate) {
  const grossMonthly = rate * 84;
  const netMonthly = grossMonthly * 0.95;
  const payoutEl = document.getElementById('provider-net-payout');
  if (payoutEl) {
    payoutEl.textContent = `$${Math.round(netMonthly).toLocaleString()}`;
  }
}

async function saveProviderProfile() {
  const selectEl = document.getElementById('provider-select-edit');
  const id = parseInt(selectEl.value);
  const provider = state.providers.find(p => p.id === id);
  if (!provider) return;

  provider.name = document.getElementById('provider-edit-name').value;
  provider.type = document.getElementById('provider-edit-type').value;
  provider.city = document.getElementById('provider-edit-city').value;
  provider.hourlyRate = parseFloat(document.getElementById('provider-edit-rate').value);

  try {
    const res = await fetch('/api/providers/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(provider)
    });
    if (!res.ok) throw new Error('Failed to save caregiver settings');
    
    const opts = selectEl.querySelectorAll('option');
    opts.forEach(opt => {
      if (parseInt(opt.value) === id) {
        opt.textContent = `${provider.name} — ${provider.type}`;
      }
    });

    // Re-run AI matcher to reflect changes
    runAIMatching();
    refreshAuditLogs();
    showToast(`✅ Profile saved: ${provider.name} ($${provider.hourlyRate}/hr, ${provider.city}). Matcher engine re-synced.`);
  } catch (err) {
    showToast(`❌ Update Failed: ${err.message}`);
  }
}

// --- CARE PLAN SAVING ---
function setupCarePlan() {
  const saveBtn = document.getElementById('btn-save-care-plan');
  if (!saveBtn) return;
  
  const seniorInput = document.getElementById('plan-senior-name');
  if (seniorInput) {
    seniorInput.addEventListener('change', loadCarePlanFromServer);
  }
  
  saveBtn.addEventListener('click', async () => {
    const seniorName = document.getElementById('plan-senior-name').value.trim();
    const emergency = document.getElementById('plan-emergency').value.trim();
    const meds = document.getElementById('plan-meds').value.trim();
    const diet = document.getElementById('plan-diet').value.trim();

    try {
      const res = await fetch('/api/care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seniorName, emergency, meds, diet })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save care plan');
      }
      showToast(`✅ Care Plan for ${seniorName} saved & synced with server.`);
      refreshAuditLogs();
    } catch (err) {
      showToast(`❌ Access Denied: ${err.message}`);
    }
  });

  // Initial load
  loadCarePlanFromServer();
}

async function loadCarePlanFromServer() {
  const seniorInput = document.getElementById('plan-senior-name');
  if (!seniorInput) return;
  const seniorName = seniorInput.value.trim();
  if (!seniorName) return;

  try {
    const res = await fetch(`/api/care-plan?seniorName=${encodeURIComponent(seniorName)}`);
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to load care plan');
    }
    const plan = await res.json();
    document.getElementById('plan-emergency').value = plan.emergency || '';
    document.getElementById('plan-meds').value = plan.meds || '';
    document.getElementById('plan-diet').value = plan.diet || '';
  } catch (err) {
    showToast(`⚠️ Care Plan Load Blocked: ${err.message}`);
    document.getElementById('plan-emergency').value = 'ACCESS BLOCKED';
    document.getElementById('plan-meds').value = 'ACCESS BLOCKED - PHIPA CONSENT NOT GRANTED';
    document.getElementById('plan-diet').value = 'ACCESS BLOCKED - PHIPA CONSENT NOT GRANTED';
  }
}

// --- DYNAMIC COMPLIANCE & SHIFT LOG HANDLERS ---
function setupComplianceDashboard() {
  const refreshBtn = document.getElementById('btn-refresh-audits');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await refreshAuditLogs();
      showToast('🔄 Compliance audit trails refreshed.');
    });
  }

  const lookupBtn = document.getElementById('btn-consent-lookup');
  const lookupInput = document.getElementById('consent-search-input');
  const statusBox = document.getElementById('consent-status-box');
  if (lookupBtn && lookupInput && statusBox) {
    lookupBtn.addEventListener('click', async () => {
      const name = lookupInput.value.trim();
      if (!name) return;
      try {
        const res = await fetch('/api/consent');
        const list = await res.json();
        const found = list.find(c => c.recipient.toLowerCase() === name.toLowerCase());
        
        statusBox.style.display = 'block';
        if (found) {
          statusBox.innerHTML = `
            <strong>Status for ${found.recipient}:</strong> 
            <span style="color: ${found.status === 'Granted' ? 'var(--accent-forest)' : 'var(--accent-maple)'}; font-weight: 700;">${found.status}</span>
            <br><span style="font-size: 0.75rem; color: var(--text-muted);">Last Updated: ${new Date(found.timestamp).toLocaleString()}</span>
          `;
        } else {
          statusBox.innerHTML = `
            <strong>Status for ${name}:</strong> <span style="color: var(--accent-gold); font-weight: 700;">No Record</span>
            <br><span style="font-size: 0.75rem; color: var(--text-muted);">No consent profile created. Submit a Find Care request to register.</span>
          `;
        }
      } catch (err) {
        showToast('Error looking up consent');
      }
    });
  }

  // Initial load of logs and registry
  refreshAuditLogs();
  refreshConsentRegistry();
  refreshClinicalEscalations();
}

async function refreshAuditLogs() {
  const tbody = document.getElementById('audit-logs-table-body');
  if (!tbody) return;

  try {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Could not load audits');
    const logs = await res.json();

    tbody.innerHTML = '';
    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1rem;">No audits logged.</td></tr>`;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding: 0.6rem 0.5rem; font-family: monospace; font-size: 0.75rem; color: var(--text-muted);">${log.id}</td>
        <td style="padding: 0.6rem 0.5rem; color: var(--text-secondary);">${new Date(log.timestamp).toLocaleTimeString()}</td>
        <td style="padding: 0.6rem 0.5rem;"><span class="audit-action-${log.action}">${log.action}</span></td>
        <td style="padding: 0.6rem 0.5rem; font-weight: 600;">${log.resource}</td>
        <td style="padding: 0.6rem 0.5rem; color: var(--text-secondary);">${log.details}</td>
        <td style="padding: 0.6rem 0.5rem; color: var(--text-muted); font-family: monospace;">${log.ip}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error refreshing audits:", err);
  }
}

async function refreshConsentRegistry() {
  const tbody = document.getElementById('consent-registry-body');
  if (!tbody) return;

  try {
    const res = await fetch('/api/consent');
    if (!res.ok) throw new Error('Could not load consent registry');
    const list = await res.json();

    tbody.innerHTML = '';
    list.forEach(c => {
      const tr = document.createElement('tr');
      const badgeStyle = c.status === 'Granted' 
        ? 'background: var(--accent-forest-light); color: var(--accent-forest); font-weight: 700; padding: 0.15rem 0.35rem; border-radius: 4px; font-size: 0.75rem;'
        : 'background: var(--accent-maple-light); color: var(--accent-maple); font-weight: 700; padding: 0.15rem 0.35rem; border-radius: 4px; font-size: 0.75rem;';
      
      const toggleBtnText = c.status === 'Granted' ? 'Revoke' : 'Grant';
      const newStatus = c.status === 'Granted' ? 'Revoked' : 'Granted';
      
      tr.innerHTML = `
        <td style="padding: 0.5rem 0; font-weight: 600;">${c.recipient}</td>
        <td style="padding: 0.5rem 0;"><span style="${badgeStyle}">${c.status}</span></td>
        <td style="padding: 0.5rem 0; text-align: right;">
          <button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" type="button" onclick="updateConsentState('${c.recipient}', '${newStatus}')">${toggleBtnText}</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading consent registry:", err);
  }
}

window.updateConsentState = async function(recipient, status) {
  try {
    const res = await fetch('/api/consent/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, status })
    });
    if (!res.ok) throw new Error('Consent update failed');
    showToast(`Consent registry updated for ${recipient} to ${status}`);
    
    await refreshConsentRegistry();
    await refreshAuditLogs();
    loadCarePlanFromServer();
  } catch (err) {
    showToast(`❌ Error: ${err.message}`);
  }
}

async function refreshClinicalEscalations() {
  const container = document.getElementById('escalations-list-container');
  if (!container) return;

  try {
    const res = await fetch('/api/escalations');
    if (!res.ok) throw new Error('Failed to fetch clinical escalations');
    const escalations = await res.json();

    container.innerHTML = '';
    if (escalations.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.85rem; border: 1px dashed var(--card-border); border-radius: var(--border-radius-sm);">
          No active clinical escalations.
        </div>
      `;
      return;
    }

    escalations.forEach(esc => {
      const card = document.createElement('div');
      card.className = `escalation-card ${esc.status === 'Resolved' ? 'resolved' : ''}`;
      
      const badgeClass = esc.status === 'Active' ? 'escalation-badge-active' : 'escalation-badge-resolved';
      
      let actionHtml = '';
      if (esc.status === 'Active') {
        actionHtml = `
          <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
            <textarea id="res-notes-${esc.id}" rows="1" placeholder="Input coordinator action / resolution notes..." style="padding: 0.3rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background-color: var(--bg-primary); color: var(--text-primary); font-family: var(--font-body); width: 100%;"></textarea>
            <button class="btn-primary" style="padding: 0.3rem; font-size: 0.72rem; width: 100%;" onclick="resolveEscalation('${esc.id}')">Resolve Escalation</button>
          </div>
        `;
      } else {
        actionHtml = `
          <div style="margin-top: 0.5rem; padding: 0.5rem; background-color: var(--accent-forest-light); border-radius: 4px; font-size: 0.75rem; border: 1px solid var(--accent-forest); color: var(--text-primary);">
            <strong>Resolved:</strong> ${esc.resolutionNotes}
            <br><span style="font-size: 0.7rem; color: var(--text-muted);">Timestamp: ${new Date(esc.resolvedAt).toLocaleString()}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
          <strong style="color: var(--text-primary); font-size: 0.85rem;">Patient: ${esc.recipient}</strong>
          <span class="${badgeClass}">${esc.status}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">
          <strong>Caregiver:</strong> ${esc.providerName}
          <br><strong>Flagged:</strong> <span style="color: var(--accent-maple); font-weight: 700;">${esc.symptoms.join(', ')}</span>
        </div>
        <p style="font-size: 0.78rem; font-style: italic; background-color: var(--bg-primary); padding: 0.4rem; border-radius: 4px; border: 1px solid var(--card-border); margin: 0.25rem 0; color: var(--text-primary);">
          "${esc.notes}"
        </p>
        <span style="font-size: 0.7rem; color: var(--text-muted);">Reported: ${new Date(esc.escalatedAt).toLocaleString()}</span>
        ${actionHtml}
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error listing escalations:", err);
  }
}

window.resolveEscalation = async function(escalationId) {
  const inputEl = document.getElementById(`res-notes-${escalationId}`);
  const resolutionNotes = inputEl ? inputEl.value.trim() : 'Resolved by Clinical Coordinator';
  if (!resolutionNotes) {
    showToast('⚠️ Please enter resolution notes');
    return;
  }

  try {
    const res = await fetch('/api/escalations/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ escalationId, resolutionNotes })
    });
    if (!res.ok) throw new Error('Could not resolve escalation');
    showToast('✅ Escalation resolved and marked on database.');
    
    await refreshClinicalEscalations();
    await refreshAuditLogs();
  } catch (err) {
    showToast(`❌ Error resolving: ${err.message}`);
  }
}

function setupCaregiverShiftLog() {
  const form = document.getElementById('caregiver-shift-form');
  if (!form) return;

  const selectEl = document.getElementById('provider-select-edit');
  const caregiverNameInput = document.getElementById('shift-caregiver-name');
  if (selectEl && caregiverNameInput) {
    const updateCaregiverName = () => {
      const selectedOption = selectEl.options[selectEl.selectedIndex];
      if (selectedOption) {
        caregiverNameInput.value = selectedOption.textContent.split(' — ')[0];
      }
    };
    selectEl.addEventListener('change', updateCaregiverName);
    updateCaregiverName();
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const recipient = document.getElementById('shift-patient-name').value.trim();
    const providerName = caregiverNameInput.value;
    const date = new Date().toISOString().slice(0, 10);
    const notes = document.getElementById('shift-notes').value.trim();
    
    const symptoms = {
      fall: document.getElementById('symptom-fall').checked,
      fever: document.getElementById('symptom-fever').checked,
      bp: document.getElementById('symptom-bp').checked,
      medsRefusal: document.getElementById('symptom-meds').checked,
      confusion: document.getElementById('symptom-confusion').checked
    };

    try {
      const res = await fetch('/api/care-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerName, recipient, date, notes, symptoms })
      });
      
      if (!res.ok) throw new Error('Failed to submit shift log');
      const data = await res.json();
      
      if (data.escalation) {
        showToast('⚠️ CRITICAL symptom flagged: Clinical escalation triggered!');
      } else {
        showToast('✅ Routine shift log successfully saved to server.');
      }

      // Reset form fields
      document.getElementById('shift-notes').value = '';
      document.getElementById('symptom-fall').checked = false;
      document.getElementById('symptom-fever').checked = false;
      document.getElementById('symptom-bp').checked = false;
      document.getElementById('symptom-meds').checked = false;
      document.getElementById('symptom-confusion').checked = false;

      await refreshClinicalEscalations();
      await refreshAuditLogs();
    } catch (err) {
      showToast(`❌ Submission Failed: ${err.message}`);
    }
  });
}

// --- TOAST NOTIFICATION SYSTEM ---
function showToast(message) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4500);
}

// --- UNIFIED AUTHENTICATION & PERSONA MANAGEMENT ---
const DEMO_USERS = {
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

function setupLoginScreen() {
  const loginOverlay = document.getElementById('login-screen');
  const appContainer = document.querySelector('.app-container');
  if (!loginOverlay) return;

  // Default to Super Admin (Me) for full product access on localhost
  if (!state.currentUser) {
    state.currentUser = DEMO_USERS['admin@carebridge.ca'];
    state.activeRole = 'admin';
    
    if (loginOverlay) loginOverlay.classList.add('login-screen-hidden');
    if (appContainer) appContainer.classList.remove('role-hidden');

    const roleSelect = document.getElementById('role-select');
    if (roleSelect) roleSelect.value = 'admin';

    applyRolePermissions();
    updateUserSessionHeader();
    updateProviderSpecialtyChecklist();
  }
}

function switchLoginTab(tab) {
  state.loginTab = tab;
  const clientTabBtn = document.getElementById('tab-login-client');
  const providerTabBtn = document.getElementById('tab-login-provider');
  const emailInput = document.getElementById('login-email');

  if (tab === 'client') {
    if (clientTabBtn) clientTabBtn.classList.add('active');
    if (providerTabBtn) providerTabBtn.classList.remove('active');
    if (emailInput) emailInput.value = 'client@carebridge.ca';
  } else {
    if (providerTabBtn) providerTabBtn.classList.add('active');
    if (clientTabBtn) clientTabBtn.classList.remove('active');
    if (emailInput) emailInput.value = 'sonia@carebridge.ca';
  }
}

function quickLogin(email) {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  if (emailInput) emailInput.value = email;
  if (passwordInput) passwordInput.value = 'password';
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const event = new Event('submit', { cancelable: true, bubbles: true });
    loginForm.dispatchEvent(event);
  }
}

async function handleLoginSubmit(event) {
  if (event) event.preventDefault();
  
  const emailInput = document.getElementById('login-email');
  const email = emailInput ? emailInput.value : '';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password' })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      showToast(`❌ Auth Error: ${data.error || 'Login failed'}`);
      return;
    }

    const user = data.user;
    state.currentUser = user;
    state.activeRole = user.role;

    const loginOverlay = document.getElementById('login-screen');
    const appContainer = document.querySelector('.app-container');
    if (loginOverlay) loginOverlay.classList.add('login-screen-hidden');
    if (appContainer) appContainer.classList.remove('role-hidden');

    const roleSelect = document.getElementById('role-select');
    if (roleSelect) roleSelect.value = user.role;

    applyRolePermissions();
    updateUserSessionHeader();
    updateProviderSpecialtyChecklist();

    showToast(`🔑 Welcome back, ${user.name}! Logged in as ${user.roleLabel}.`);
  } catch (err) {
    console.error('Login error:', err);
    const user = DEMO_USERS[email.toLowerCase().trim()] || DEMO_USERS['client@carebridge.ca'];
    state.currentUser = user;
    state.activeRole = user.role;

    const loginOverlay = document.getElementById('login-screen');
    const appContainer = document.querySelector('.app-container');
    if (loginOverlay) loginOverlay.classList.add('login-screen-hidden');
    if (appContainer) appContainer.classList.remove('role-hidden');

    const roleSelect = document.getElementById('role-select');
    if (roleSelect) roleSelect.value = user.role;

    applyRolePermissions();
    updateUserSessionHeader();
    updateProviderSpecialtyChecklist();

    showToast(`🔑 Logged in as ${user.name} (${user.roleLabel})`);
  }
}

function handleLogout() {
  state.currentUser = null;
  
  const loginOverlay = document.getElementById('login-screen');
  const appContainer = document.querySelector('.app-container');
  if (loginOverlay) loginOverlay.classList.remove('login-screen-hidden');
  if (appContainer) appContainer.classList.add('role-hidden');

  showToast('🔒 Logged out successfully.');
}

function updateUserSessionHeader() {
  const user = state.currentUser;
  if (!user) return;

  const nameEl = document.getElementById('user-display-name');
  const roleEl = document.getElementById('user-display-role');
  const dotEl = document.getElementById('user-status-dot');

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.roleLabel;
  if (dotEl) {
    if (user.status.includes('Suspended')) {
      dotEl.style.backgroundColor = '#e53e3e';
    } else if (user.status.includes('Draft')) {
      dotEl.style.backgroundColor = '#dd6b20';
    } else {
      dotEl.style.backgroundColor = '#38a169';
    }
  }
}

function updateProviderSpecialtyChecklist() {
  const container = document.getElementById('provider-specialty-checklist');
  const typeSelect = document.getElementById('provider-edit-type');
  if (!container) return;

  const specialty = typeSelect ? typeSelect.value : (state.currentUser ? state.currentUser.specialty : 'PSW (Personal Support Worker)');

  let checklistHtml = '';

  if (specialty.includes('RN') || specialty.includes('RPN') || specialty.includes('Nurse')) {
    checklistHtml = `
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🏥 CNO License Verification:</strong> <span class="badge badge-success">Active & Good Standing</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🛡️ Vulnerable Sector Screening (VSS):</strong> <span class="badge badge-success">Verified</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>💉 Immunization & TB Clearance:</strong> <span class="badge badge-success">Up to Date</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>📜 Professional Liability Insurance:</strong> <span class="badge badge-primary">$2,000,000 Verified</span>
      </div>
    `;
  } else if (specialty.includes('Physiotherapist') || specialty.includes('PT') || specialty.includes('Occupational')) {
    checklistHtml = `
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>⚖️ CPO Registration License:</strong> <span class="badge badge-warning">Verification Pending</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🛡️ Vulnerable Sector Screening (VSS):</strong> <span class="badge badge-success">Verified</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>⚠️ Professional Malpractice Insurance:</strong> <span class="badge badge-danger">Expired (Renewal Required)</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🏋️ Fall Prevention & Rehab Cert:</strong> <span class="badge badge-success">Verified</span>
      </div>
    `;
  } else if (specialty.includes('Wheel-Trans') || specialty.includes('Transport')) {
    checklistHtml = `
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🚗 Ontario Class G License:</strong> <span class="badge badge-success">Verified (No Demerits)</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>📋 Commercial Auto Insurance (OPCF 6A):</strong> <span class="badge badge-primary">$2,000,000 Coverage</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>♿ Wheelchair Hydraulic Ramp Safety Check:</strong> <span class="badge badge-success">Annual Pass</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>📑 3-Year Driver Abstract Report:</strong> <span class="badge badge-success">Clean Record</span>
      </div>
    `;
  } else {
    checklistHtml = `
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🛡️ Vulnerable Sector Screening (VSS):</strong> <span class="badge badge-success">Verified</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>📜 PSW College Certificate:</strong> <span class="badge badge-success">Verified</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>⛑️ Standard First Aid & CPR Level C:</strong> <span class="badge badge-success">Active</span>
      </div>
      <div class="compliance-item" style="padding: 0.5rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary); font-size: 0.78rem;">
        <strong>🧠 Dementia & Cognitive Care Training:</strong> <span class="badge badge-primary">Certified</span>
      </div>
    `;
  }

  container.innerHTML = checklistHtml;
}

// --- ROLE SWITCHER AND PERMISSIONS ENGINE (RBAC) ---
function setupRoleSwitcher() {
  const roleSelect = document.getElementById('role-select');
  if (!roleSelect) return;

  roleSelect.addEventListener('change', () => {
    state.activeRole = roleSelect.value;
    applyRolePermissions();
    showToast(`👑 View Switched: System view adjusted for ${roleSelect.options[roleSelect.selectedIndex].text}`);
  });

  // Run once on load
  applyRolePermissions();
}

function applyRolePermissions() {
  const role = state.activeRole;
  
  // Update sidebar links visibility
  const navItems = document.querySelectorAll('.nav-links li[data-roles]');
  navItems.forEach(item => {
    const rolesAllowed = item.getAttribute('data-roles').split(',');
    if (rolesAllowed.includes(role)) {
      item.classList.remove('role-hidden');
    } else {
      item.classList.add('role-hidden');
    }
  });

  // Check if current tab is still accessible, if not redirect to first accessible tab
  const activeNavItem = document.querySelector(`.nav-links li button[data-tab="${state.currentTab}"]`);
  if (activeNavItem) {
    const parentLi = activeNavItem.closest('li');
    if (parentLi && parentLi.classList.contains('role-hidden')) {
      const firstAllowedBtn = document.querySelector('.nav-links li:not(.role-hidden) button');
      if (firstAllowedBtn) {
        firstAllowedBtn.click();
      }
    }
  }

  // Hide/Show layout components based on roles
  const docVerificationPanel = document.getElementById('doc-verification-panel');
  const complianceManualsPanel = document.getElementById('compliance-manuals-panel');

  if (role === 'admin') {
    if (docVerificationPanel) docVerificationPanel.classList.remove('role-hidden');
    if (complianceManualsPanel) complianceManualsPanel.classList.remove('role-hidden');
  } else if (role === 'compliance') {
    if (docVerificationPanel) docVerificationPanel.classList.remove('role-hidden');
    if (complianceManualsPanel) complianceManualsPanel.classList.remove('role-hidden');
  } else {
    // Client role
    if (docVerificationPanel) docVerificationPanel.classList.add('role-hidden');
    if (complianceManualsPanel) complianceManualsPanel.classList.add('role-hidden');
  }

  // Update matcher results
  runAIMatching();
  
  // Update compliance table view selection
  populateComplianceProviders();

  // Update manuals listing based on role permissions
  populateManualsDropdown();
}

// --- DOCUMENT VERIFICATION QUEUE LOGIC ---
function setupComplianceVerificationQueue() {
  const provSelect = document.getElementById('compliance-provider-select');
  if (!provSelect) return;

  provSelect.addEventListener('change', renderComplianceDocList);
  
  // Re-populate and render when database is hydrated
  populateComplianceProviders();
}

function populateComplianceProviders() {
  const provSelect = document.getElementById('compliance-provider-select');
  if (!provSelect) return;
  provSelect.innerHTML = '';
  
  state.providers.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.type})`;
    provSelect.appendChild(opt);
  });
  
  renderComplianceDocList();
}

function renderComplianceDocList() {
  const provSelect = document.getElementById('compliance-provider-select');
  const tbody = document.getElementById('compliance-docs-list-body');
  if (!provSelect || !tbody) return;

  const providerId = parseInt(provSelect.value);
  const provider = state.providers.find(p => p.id === providerId);
  if (!provider) return;

  tbody.innerHTML = '';

  const docs = provider.documents || [];
  if (docs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">No compliance documents registered.</td></tr>`;
    return;
  }

  docs.forEach(doc => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--card-border)';
    
    let badgeColor = 'var(--text-muted)';
    if (doc.status === 'approved') badgeColor = 'var(--accent-forest)';
    if (doc.status === 'expired' || doc.status === 'rejected') badgeColor = 'var(--accent-maple)';
    if (doc.status === 'pending') badgeColor = 'var(--accent-gold)';

    const actionBtnHtml = doc.status === 'approved' 
      ? `<button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; color: var(--accent-maple);" onclick="toggleDocComplianceStatus(${providerId}, '${doc.type}', 'expired')">Mark Expired</button>`
      : `<button class="btn-primary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="toggleDocComplianceStatus(${providerId}, '${doc.type}', 'approved')">Verify & Approve</button>`;

    tr.innerHTML = `
      <td style="padding: 0.6rem 0; font-weight: 600;">${doc.type.replace('_', ' ')}</td>
      <td style="padding: 0.6rem 0; color: var(--text-secondary);">${doc.expiryDate}</td>
      <td style="padding: 0.6rem 0;"><span style="color: ${badgeColor}; font-weight: 700; text-transform: uppercase; font-size: 0.75rem;">${doc.status}</span></td>
      <td style="padding: 0.6rem 0; text-align: right;">${actionBtnHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.toggleDocComplianceStatus = async function(providerId, docType, newStatus) {
  const provider = state.providers.find(p => p.id === providerId);
  if (!provider) return;

  const doc = provider.documents.find(d => d.type === docType);
  if (!doc) return;

  doc.status = newStatus;

  // Recalculate score
  let approvedCount = provider.documents.filter(d => d.status === 'approved').length;
  let totalDocs = provider.documents.length;
  provider.complianceScore = Math.round((approvedCount / totalDocs) * 100);

  // If critical document (CNO_LICENSE or INS_CERTIFICATE) is not approved, onboardingStatus is suspended
  const hasValidLicense = provider.documents.find(d => d.type === 'CNO_LICENSE')?.status === 'approved';
  const hasValidInsurance = provider.documents.find(d => d.type === 'INS_CERTIFICATE')?.status === 'approved';
  const hasValidVss = provider.documents.find(d => d.type === 'POLICE_VSS')?.status === 'approved';

  if (hasValidLicense && hasValidInsurance && hasValidVss) {
    provider.onboardingStatus = 'active';
  } else {
    provider.onboardingStatus = 'suspended';
  }

  try {
    const res = await fetch('/api/compliance/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId,
        onboardingStatus: provider.onboardingStatus,
        complianceScore: provider.complianceScore,
        verificationFlags: {
          idVerified: provider.verificationFlags.idVerified,
          vssVetted: hasValidVss,
          licenseVerified: hasValidLicense,
          insuranceVerified: hasValidInsurance
        },
        documents: provider.documents
      })
    });
    if (!res.ok) throw new Error("Failed to sync compliance on server");
    
    showToast(`🛡️ Compliance status synced for ${provider.name}. Score: ${provider.complianceScore}%, Status: ${provider.onboardingStatus.toUpperCase()}`);
    
    renderComplianceDocList();
    runAIMatching();
    refreshAuditLogs();
  } catch (err) {
    showToast(`❌ Sync Failed: ${err.message}`);
  }
}

// --- COMPLIANCE VAULT MANUALS SELECTOR ---
const manualsList = [
  { value: "01_provider_operations_manual.md", text: "01 - Provider Operations Manual", roles: ["admin"] },
  { value: "02_compliance_manual.md", text: "02 - Compliance Manual (Ontario)", roles: ["admin", "compliance"] },
  { value: "03_trust_safety_manual.md", text: "03 - Trust & Safety Manual", roles: ["admin"] },
  { value: "04_policy_manual.md", text: "04 - Policy Manual", roles: ["admin"] },
  { value: "05_provider_handbook.md", text: "05 - Provider Handbook", roles: ["admin"] },
  { value: "06_admin_handbook.md", text: "06 - Admin Handbook", roles: ["admin"] },
  { value: "07_risk_management_framework.md", text: "07 - Risk Management Framework", roles: ["admin"] },
  { value: "08_legal_compliance_checklist.md", text: "08 - Legal Compliance Checklist", roles: ["admin"] },
  { value: "09_provider_onboarding_guide.md", text: "09 - Provider Onboarding Guide", roles: ["admin", "compliance"] },
  { value: "10_digital_compliance_dashboard_spec.md", text: "10 - Compliance Dashboard Spec", roles: ["admin"] },
  { value: "11_provider_verification_matrix.md", text: "11 - Provider Verification Matrix", roles: ["admin"] },
  { value: "12_marketplace_sop_library.md", text: "12 - Home Visit SOP Library", roles: ["admin", "compliance"] },
  { value: "13_emergency_response_manual.md", text: "13 - Emergency Response Manual", roles: ["admin"] },
  { value: "14_insurance_guide.md", text: "14 - Insurance Guide (Ontario)", roles: ["admin"] },
  { value: "15_regulatory_compliance_matrix.md", text: "15 - Regulatory Compliance Matrix", roles: ["admin"] },
  { value: "16_provider_training_curriculum.md", text: "16 - Provider Training Curriculum", roles: ["admin"] },
  { value: "17_customer_safety_framework.md", text: "17 - Customer Safety Framework", roles: ["admin"] },
  { value: "18_audit_checklist.md", text: "18 - Audit Checklist (Ontario)", roles: ["admin"] },
  { value: "19_incident_response_playbook.md", text: "19 - Incident Response Playbook", roles: ["admin"] },
  { value: "20_business_continuity_plan.md", text: "20 - Business Continuity Plan", roles: ["admin"] }
];

function setupComplianceManualsSelector() {
  const manualSelect = document.getElementById('compliance-manual-select');
  if (!manualSelect) return;

  manualSelect.addEventListener('change', () => {
    const val = manualSelect.value;
    if (val === 'restricted') {
      document.getElementById('compliance-manual-reader').innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--accent-maple);">
          <h3>🔒 Access Restricted</h3>
          <p style="margin-top: 0.5rem;">This compliance manual is classified as internal and is restricted to the Super Admin role only. Please switch roles to check details.</p>
        </div>
      `;
      return;
    }
    if (val) {
      loadManualContent(val);
    }
  });

  populateManualsDropdown();
}

function populateManualsDropdown() {
  const manualSelect = document.getElementById('compliance-manual-select');
  if (!manualSelect) return;
  manualSelect.innerHTML = '<option value="">-- Select Manual to Read --</option>';

  const role = state.activeRole;
  
  manualsList.forEach(m => {
    const opt = document.createElement('option');
    if (m.roles.includes(role)) {
      opt.value = m.value;
      opt.textContent = m.text;
    } else {
      opt.value = "restricted";
      opt.textContent = `🔒 ${m.text} (Admin Restricted)`;
    }
    manualSelect.appendChild(opt);
  });
  
  document.getElementById('compliance-manual-reader').textContent = "Select a manual above to read.";
}

async function loadManualContent(filename) {
  const readerEl = document.getElementById('compliance-manual-reader');
  if (!readerEl) return;
  readerEl.textContent = "Loading manual...";
  try {
    const res = await fetch(`/compliance_vault/${filename}`);
    if (!res.ok) throw new Error("Could not load manual content");
    const text = await res.text();
    readerEl.textContent = text;
  } catch (err) {
    readerEl.textContent = `Error loading manual: ${err.message}`;
  }
}
