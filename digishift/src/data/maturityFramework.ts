import { MaturityPillarId, MaturityQuestion } from '../types/advisor';

export interface PillarMeta {
  id: MaturityPillarId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

export const PILLARS_CONFIG: PillarMeta[] = [
  {
    id: 'customer_sales',
    name: 'Customer & Revenue Channels',
    tagline: 'Lead intake, CRM, payment portals & digital touchpoints',
    description: 'How seamlessly prospects discover, purchase, and interact with your business online vs offline phone/paper hurdles.',
    icon: 'Users',
  },
  {
    id: 'operations_supply',
    name: 'Operations & Supply Chain',
    tagline: 'Order routing, inventory control & task fulfillment',
    description: 'Digitization of work orders, real-time inventory visibility, warehouse tracking, and vendor procurement.',
    icon: 'Package',
  },
  {
    id: 'financials_admin',
    name: 'Financials, Cashflow & Admin',
    tagline: 'Invoicing, bookkeeping automation & cash visibility',
    description: 'Transition from shoe-box receipts and manual spreadsheets to real-time cloud ledger reconciliation and automated billing.',
    icon: 'DollarSign',
  },
  {
    id: 'workforce_collab',
    name: 'Workforce & Collaboration',
    tagline: 'Communication, shift dispatch & knowledge sharing',
    description: 'How internal staff share documents, assign daily jobs, communicate updates, and track hours digitally.',
    icon: 'Briefcase',
  },
  {
    id: 'data_security',
    name: 'Data, Security & Analytics',
    tagline: 'Backups, cyber resilience & decision dashboards',
    description: 'Access rights, cloud automated backups, cyber protection, and ability to make decisions from live metrics rather than gut feel.',
    icon: 'ShieldCheck',
  },
];

export const MATURITY_QUESTIONS: MaturityQuestion[] = [
  // 1. Customer & Revenue Channels
  {
    id: 'cs_1',
    pillarId: 'customer_sales',
    question: 'How do customers discover your business and submit service requests or orders?',
    context: 'Assesses digital customer acquisition friction and inbound lead capturing.',
    options: [
      {
        level: 1,
        title: 'Manual Phone & Word of Mouth',
        description: 'Orders received via phone calls, voicemail, paper slips or walk-in. No online booking or web catalog.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Basic Website & General Email Inbox',
        description: 'Informational website with a contact form forwarding to a shared info@ email. Manual reply within 24-48 hours.',
        scoreWeight: 45,
      },
      {
        level: 3,
        title: 'Online Booking / E-Commerce Storefront',
        description: 'Functional web ordering or calendar scheduling tool (e.g. Shopify, Calendly, Square Online) capturing payments.',
        scoreWeight: 70,
      },
      {
        level: 4,
        title: 'Automated CRM & Multi-Channel Lead Capture',
        description: 'Leads auto-funnel into a CRM (HubSpot/Pipedrive) with instant SMS/email confirmations and scheduled follow-ups.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Self-Service Customer Portal & Dynamic Quoting',
        description: '24/7 client portal for instant custom quotes, reorders, live tracking, and personalized recommendation workflows.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'cs_2',
    pillarId: 'customer_sales',
    question: 'How are customer relationships, sales histories, and communications tracked?',
    context: 'Assesses single source of customer truth and retention capability.',
    options: [
      {
        level: 1,
        title: 'Sticky Notes & Individual Memory',
        description: 'Key details stored in individual staff heads, notebooks, or scattered phone text messages.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Shared Excel or Google Spreadsheet',
        description: 'Manual spreadsheet updated irregularly. Frequent duplicates, outdated contacts, and no interaction logging.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Standard Cloud CRM with Contact History',
        description: 'Centralized customer database with logged emails, past purchase records, and assigned account owners.',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Automated Sales Pipeline & Milestone Triggers',
        description: 'Visual stage tracking with automated task reminders, abandoned quote drips, and deal stage analytics.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Predictive Churn & LTV Optimization',
        description: 'System automatically flags dormant accounts, alerts account reps for contract renewals, and forecasts revenue.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'cs_3',
    pillarId: 'customer_sales',
    question: 'How do you collect payments and issue customer quotes?',
    context: 'Assesses sales transaction velocity and checkout friction.',
    options: [
      {
        level: 1,
        title: 'Paper Checks, Cash & Hand-Typed Word Docs',
        description: 'Quotes written in Word, saved as PDF or printed; payment accepted by physical check, bank deposit slips, or cash.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Email PDF Quotes with Manual Bank Transfers',
        description: 'Estimates emailed; customers reply manually to accept; invoices paid via manual ACH or wire transfers.',
        scoreWeight: 45,
      },
      {
        level: 3,
        title: 'Click-to-Accept Digital Quotes with Card Gateways',
        description: 'Digital estimates with 1-click customer signature and instant credit card / payment gateway link (Stripe/Square).',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Automated Recurring Subscriptions & Milestone Billing',
        description: 'Automated recurring billing, milestone escrow deposits, and self-serve payment updates without back-office calls.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Algorithmic Dynamic Pricing & Instant Financing',
        description: 'Live supplier cost-plus quote calculations, automated B2B Net-30 credit underwriting, and financing integration.',
        scoreWeight: 100,
      },
    ],
  },

  // 2. Operations & Supply Chain
  {
    id: 'op_1',
    pillarId: 'operations_supply',
    question: 'How are daily work orders, projects, or jobs dispatched and tracked?',
    context: 'Measures operational throughput and execution bottlenecks.',
    options: [
      {
        level: 1,
        title: 'Whiteboards, Clipboards & Physical Travelers',
        description: 'Work assigned in morning huddles or paper folders carried across the shop floor/field vans.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Group WhatsApp / SMS & Shared Calendars',
        description: 'Ad-hoc group chats and static calendar appointments. Updates get buried in message noise.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Cloud Project / Job Management Tool',
        description: 'Dedicated digital board (e.g. Asana, Monday, ServiceTitan, Jobber, Trello) with assigned owners and status tags.',
        scoreWeight: 70,
      },
      {
        level: 4,
        title: 'Integrated Field-to-Shop Workflow Automation',
        description: 'Mobile app for staff with digital checklists, photo attachments, barcode scanning, and auto-notification on job completion.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Real-Time Capacity Balancing & Algorithmic Dispatch',
        description: 'Automated route optimization, dynamic machine load scheduling, and predictive maintenance trigger alerts.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'op_2',
    pillarId: 'operations_supply',
    question: 'How is stock, raw materials, or supplies inventory monitored?',
    context: 'Assesses capital lockup, stockouts, and physical count overhead.',
    options: [
      {
        level: 1,
        title: 'Visual Checks & Emergency Reorders',
        description: 'Stock checked when looking on shelves; items run out unexpectedly causing project delays or customer cancellations.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'Periodic Spreadsheet Audits',
        description: 'Manual counts performed bi-weekly or monthly in Excel. Discrepancies common due to untracked shrinkage/waste.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Cloud Inventory System with Min-Level Alerts',
        description: 'Dedicated inventory software (e.g. Katana, Unleashed, Fishbowl, Shopify Inventory) with minimum stock warnings.',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Barcode / QR Scanning & Auto-PO Generation',
        description: 'Staff scan items in/out on mobile; purchase orders auto-draft when inventory falls below dynamic safety stock.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Multi-Location Supplier EDI & Predictive Demand',
        description: 'Real-time API sync with major vendors for drop-shipping, batch lot traceability, and automated seasonal buffer stock.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'op_3',
    pillarId: 'operations_supply',
    question: 'How do you handle supplier procurement and delivery verification?',
    context: 'Assesses supply chain friction and receiving accuracy.',
    options: [
      {
        level: 1,
        title: 'Paper Packing Slips & Phone Calls',
        description: 'Vendor orders placed over phone; paper packing slips stapled and filed in physical cabinets.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Vendor Emails & Manual Receiving Matching',
        description: 'Orders sent by email; staff manually cross-checks paper bills of lading against vendor invoices.',
        scoreWeight: 45,
      },
      {
        level: 3,
        title: 'Digital Purchase Orders with 2-Way Match',
        description: 'Electronic POs linked to supplier accounts; receiving logged digitally to confirm full or partial deliveries.',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Automated 3-Way Match & Supplier Scorecards',
        description: 'Software verifies PO, receiving ticket, and bill automatically; flags price variances and tracks supplier on-time rates.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Autonomous Re-procurement & Vendor APIs',
        description: 'Direct API integrations with vendor ERPs; real-time fulfillment telemetry and automated dispute handling.',
        scoreWeight: 100,
      },
    ],
  },

  // 3. Financials, Cashflow & Admin
  {
    id: 'fa_1',
    pillarId: 'financials_admin',
    question: 'How is bookkeeping and transaction categorization handled?',
    context: 'Assesses financial visibility, tax readiness, and accounting lag.',
    options: [
      {
        level: 1,
        title: 'Paper Receipts in Folders / Shoe-box',
        description: 'Receipts handed to external bookkeeper once a year or quarter. Management has zero real-time cash visibility.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'Desktop Accounting Software (Local PC Only)',
        description: 'Single-computer QuickBooks Desktop with manual bank statement entry and periodic manual backups.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Cloud Accounting with Direct Bank Feeds',
        description: 'Cloud software (QuickBooks Online, Xero) with daily automated bank transaction feeds and cloud receipt capture.',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Automated Expense Rules & OCR Invoice Extraction',
        description: 'Dext/Hubdoc AI extracts line items from invoices; automated rules reconcile 85%+ of monthly entries automatically.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Continuous Close & Automated Job Costing',
        description: 'Real-time gross margin and job-level profitability updated continuously without end-of-month accounting scrambles.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'fa_2',
    pillarId: 'financials_admin',
    question: 'How does your business issue customer invoices and chase unpaid accounts?',
    context: 'Measures Days Sales Outstanding (DSO) and cashflow leakage.',
    options: [
      {
        level: 1,
        title: 'Manual End-of-Month Batch Invoicing',
        description: 'Invoices created weeks after work is completed. Staff spends days calling clients to ask for check payments.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Emailing Invoices with Manual Chasing Notes',
        description: 'Invoices emailed individually; receivables tracked via an aging Excel sheet; ad-hoc reminder emails sent irregularly.',
        scoreWeight: 45,
      },
      {
        level: 3,
        title: 'Cloud Invoicing with Embedded Payment Links',
        description: 'Invoices sent immediately upon work completion with instant "Pay Now" links and basic 7-day payment reminder emails.',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Automated Escalation Workflows & Auto-Pay Mandates',
        description: 'Automated credit control sequences (friendly reminder, late fee warning); customers on recurring auto-debit.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Algorithmic Cashflow Forecasting & Early Pay Discounts',
        description: 'Predictive cashflow models projecting 90-day liquidity; automated dynamic discounting for rapid payment.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'fa_3',
    pillarId: 'financials_admin',
    question: 'How are employee hours, timesheets, and payroll processed?',
    context: 'Assesses payroll overhead, time leakage, and compliance risk.',
    options: [
      {
        level: 1,
        title: 'Paper Timesheets / Punch Cards with Manual Math',
        description: 'Employees write hours on paper cards; office manager retypes numbers into spreadsheets to compute gross pay.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Spreadsheet Submissions & Manual Payroll Portal Entry',
        description: 'Employees email weekly spreadsheets; manager calculates overtime manually and logs into bank/payroll system.',
        scoreWeight: 45,
      },
      {
        level: 3,
        title: 'GPS-Enabled Digital Time Clock & Cloud Payroll',
        description: 'Mobile clock-in app (e.g. Gusto, Deputy, QuickBooks Time) syncing approved hours straight into automated payroll.',
        scoreWeight: 80,
      },
      {
        level: 4,
        title: 'Direct Job-Cost Code Allocation & Shift Swapping',
        description: 'Staff logs hours directly against specific job/client codes; automated wage compliance and overtime warning alerts.',
        scoreWeight: 92,
      },
      {
        level: 5,
        title: 'Labor Yield Optimization & Performance Incentives',
        description: 'Real-time labor efficiency metrics tied to daily output; automated performance bonus calculations.',
        scoreWeight: 100,
      },
    ],
  },

  // 4. Workforce & Collaboration
  {
    id: 'wc_1',
    pillarId: 'workforce_collab',
    question: 'How do team members share documents, contracts, and operating procedures (SOPs)?',
    context: 'Assesses institutional knowledge preservation and version control.',
    options: [
      {
        level: 1,
        title: 'Paper Binders & Local Desktop Folders',
        description: 'Documents printed or saved on individual hard drives. Files lost when employee is absent or computer crashes.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'Emailing Attachments & USB Drives',
        description: 'Multiple conflicting versions (e.g. Contract_v3_final_FINAL.docx) circulating via email threads.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Cloud Drive (Google Workspace / OneDrive / Dropbox)',
        description: 'Centralized cloud folders with real-time collaborative editing and folder-level permission controls.',
        scoreWeight: 75,
      },
      {
        level: 4,
        title: 'Searchable Internal Knowledge Base (Notion / Confluence)',
        description: 'Structured company wiki with step-by-step video/text SOPs, onboarding check-lists, and instant search.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'AI-Indexed Company Brain & Semantic Search',
        description: 'Internal documentation queried via AI assistant to instantly answer employee operational and technical questions.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'wc_2',
    pillarId: 'workforce_collab',
    question: 'What platform is used for internal team communication and operational updates?',
    context: 'Assesses noise ratio, searchability, and communication speed.',
    options: [
      {
        level: 1,
        title: 'Shouting Across Floor & Scattered Phone Calls',
        description: 'Zero structured channel; instructions forgotten; off-duty staff interrupted by calls.',
        scoreWeight: 20,
      },
      {
        level: 2,
        title: 'Unstructured Consumer WhatsApp / Text Chains',
        description: 'Mixed work and personal chats; files and important decisions lost in continuous scrolling banter.',
        scoreWeight: 45,
      },
      {
        level: 3,
        title: 'Organized Workspace Channels (Slack / Microsoft Teams)',
        description: 'Dedicated channels by department, project, and shift with threaded conversations and searchable archive.',
        scoreWeight: 80,
      },
      {
        level: 4,
        title: 'Automated Bot Alerts & Channel Integrations',
        description: 'Channels receive auto-alerts on new orders, high-priority support tickets, or machine downtime notifications.',
        scoreWeight: 92,
      },
      {
        level: 5,
        title: 'Asynchronous Video Briefs & Meeting-Light Culture',
        description: 'Loom screen recordings, automated meeting summaries with action items, and transparent cross-functional alignment.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'wc_3',
    pillarId: 'workforce_collab',
    question: 'What is the digital culture and ongoing tech training support for staff?',
    context: 'Assesses team change readiness and resistance to digital tooling.',
    options: [
      {
        level: 1,
        title: 'High Tech Resistance & "We Always Did It This Way"',
        description: 'Staff actively resists software changes; management fears employees will quit if modern tools are introduced.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'Trial-by-Fire with No Training',
        description: 'Tools purchased by management without input; staff given logins with zero training and abandons them in weeks.',
        scoreWeight: 35,
      },
      {
        level: 3,
        title: 'Basic Onboarding Tutorials & Tech Champions',
        description: 'Designated tech-savvy employees guide colleagues through recorded tutorials and lunch-and-learns.',
        scoreWeight: 70,
      },
      {
        level: 4,
        title: 'Structured Upskilling Program & Feedback Loops',
        description: 'Regular monthly training time; staff rewarded for identifying and digitizing manual friction points.',
        scoreWeight: 90,
      },
      {
        level: 5,
        title: 'Continuous Innovation Labs & Citizen Developers',
        description: 'Non-technical staff empowered to build their own no-code Zapier/Make automations to solve daily pain points.',
        scoreWeight: 100,
      },
    ],
  },

  // 5. Data, Security & Analytics
  {
    id: 'ds_1',
    pillarId: 'data_security',
    question: 'How are business records, customer files, and software data backed up?',
    context: 'Assesses disaster recovery preparedness and business continuity.',
    options: [
      {
        level: 1,
        title: 'No Formal Backups (Single PC Hard Drive)',
        description: 'Data exists on one computer or local server. A ransomware attack or hardware failure would be catastrophic.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'Occasional Manual Copy to External USB Hard Drive',
        description: 'Backup done only when someone remembers every couple of months; drive kept in the same physical office.',
        scoreWeight: 35,
      },
      {
        level: 3,
        title: 'Automated Daily Cloud Backups (3-2-1 Rule)',
        description: 'Automated continuous cloud syncing (Backblaze, AWS, Google Cloud) with tested disaster recovery plan.',
        scoreWeight: 80,
      },
      {
        level: 4,
        title: 'Immutable Versioned Backups & Ransomware Shielding',
        description: 'Air-gapped / immutable snapshots with hourly recovery point objectives (RPO) and point-in-time restore.',
        scoreWeight: 92,
      },
      {
        level: 5,
        title: 'Enterprise Multi-Region Hot-Failover & Disaster Drills',
        description: 'Automated failover systems with annual simulated restoration tests and zero single points of failure.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'ds_2',
    pillarId: 'data_security',
    question: 'What password management and cybersecurity access controls are enforced?',
    context: 'Assesses credential theft risk and unauthorized access prevention.',
    options: [
      {
        level: 1,
        title: 'Same Password on Sticky Notes Shared by All Staff',
        description: 'Universal password shared across employees; no two-factor authentication (2FA); ex-staff keep access.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'Personal Passwords with Occasional 2FA',
        description: 'Staff pick their own passwords; 2FA enabled only when forced by banks; no central revoking when staff leaves.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Mandatory Company Password Manager (1Password/Bitwarden) & 2FA',
        description: 'Enforced 2FA across all business logins, role-based access control, and 1-click credential offboarding.',
        scoreWeight: 80,
      },
      {
        level: 4,
        title: 'Single Sign-On (SSO) & Managed Device MDM',
        description: 'Google/Microsoft SSO with remote device wipe policies and endpoint antivirus security across all company laptops.',
        scoreWeight: 92,
      },
      {
        level: 5,
        title: 'Zero-Trust Architecture & Automated Phishing Drills',
        description: 'Continuous device posture verification, automated simulated phishing tests, and SOC2/ISO27001 readiness.',
        scoreWeight: 100,
      },
    ],
  },
  {
    id: 'ds_3',
    pillarId: 'data_security',
    question: 'How does leadership review key performance indicators (KPIs) and operational metrics?',
    context: 'Assesses speed of executive decision-making and data visibility.',
    options: [
      {
        level: 1,
        title: 'Gut Feel & Checking Bank Account Balance',
        description: 'Decisions made by checking cash in checking account; zero operational metric tracking.',
        scoreWeight: 15,
      },
      {
        level: 2,
        title: 'End-of-Month Spreadsheet Compilation',
        description: 'Manager spends 10+ hours each month pulling numbers into a manual spreadsheet; data is 30 days old when seen.',
        scoreWeight: 40,
      },
      {
        level: 3,
        title: 'Live SaaS Dashboards with Weekly Reviews',
        description: 'Key metrics (revenue, leads, open orders, cash runway) visible in real-time dashboards reviewed in weekly team sync.',
        scoreWeight: 80,
      },
      {
        level: 4,
        title: 'Consolidated Executive BI Dashboard (PowerBI/Looker)',
        description: 'Unified cross-department reporting combining CRM, accounting, and production data with automatic email digests.',
        scoreWeight: 92,
      },
      {
        level: 5,
        title: 'Predictive Prescriptive Analytics & Early Anomaly Alerts',
        description: 'System automatically flags margin erosion on specific customer contracts and alerts team before issues escalate.',
        scoreWeight: 100,
      },
    ],
  },
];

export const INDUSTRY_BENCHMARKS: Record<string, Record<MaturityPillarId, number>> = {
  retail: {
    customer_sales: 58,
    operations_supply: 52,
    financials_admin: 54,
    workforce_collab: 48,
    data_security: 42,
  },
  manufacturing: {
    customer_sales: 42,
    operations_supply: 62,
    financials_admin: 50,
    workforce_collab: 44,
    data_security: 46,
  },
  services: {
    customer_sales: 52,
    operations_supply: 48,
    financials_admin: 58,
    workforce_collab: 60,
    data_security: 50,
  },
  hospitality: {
    customer_sales: 64,
    operations_supply: 46,
    financials_admin: 52,
    workforce_collab: 42,
    data_security: 40,
  },
  healthcare: {
    customer_sales: 48,
    operations_supply: 44,
    financials_admin: 60,
    workforce_collab: 52,
    data_security: 68,
  },
  default: {
    customer_sales: 52,
    operations_supply: 50,
    financials_admin: 54,
    workforce_collab: 49,
    data_security: 48,
  },
};

export function getMaturityStage(score: number): { title: string; badge: string; color: string; description: string } {
  if (score < 30) {
    return {
      title: 'Stage 1: Traditional Manual',
      badge: 'Manual / Ad-hoc',
      color: 'rose',
      description: 'Heavy reliance on physical paper, phone calls, and individual memory. Severe vulnerability to employee turnover and human error.',
    };
  }
  if (score < 50) {
    return {
      title: 'Stage 2: Fragmented Digital',
      badge: 'Siloed Tools',
      color: 'amber',
      description: 'Using isolated modern tools (WhatsApp, individual spreadsheets, basic email) that do not communicate, causing double-entry and dropped balls.',
    };
  }
  if (score < 72) {
    return {
      title: 'Stage 3: Connected SME',
      badge: 'Cloud Connected',
      color: 'emerald',
      description: 'Core cloud business applications in place (QuickBooks, CRM, project tracking). Team is comfortable with digital workflows.',
    };
  }
  if (score < 88) {
    return {
      title: 'Stage 4: Automated & Data-Driven',
      badge: 'Automated Operations',
      color: 'blue',
      description: 'Cross-functional software integrations running via webhooks/Zapier. Operations guided by real-time dashboards and exception alerts.',
    };
  }
  return {
    title: 'Stage 5: Intelligent & Scaled Leader',
    badge: 'Industry Benchmark',
    color: 'indigo',
    description: 'Digital-first operating model. Predictive analytics, automated customer self-service, and high organizational agility.',
  };
}
