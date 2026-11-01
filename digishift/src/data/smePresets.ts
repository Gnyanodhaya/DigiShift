import { SMEProfile, ProcessBottleneck } from '../types/advisor';
import { BOTTLENECK_PRESETS, calculateBottleneckMetrics } from './bottlenecksCatalog';

export interface SMEPreset {
  id: string;
  name: string;
  industry: string;
  archetype: string;
  description: string;
  profile: SMEProfile;
  defaultAnswers: Record<string, number>; // questionId -> level (1-5)
  activeBottlenecks: ProcessBottleneck[];
}

export const SME_PRESETS: SMEPreset[] = [
  {
    id: 'manufacturing',
    name: 'Apex Precision CNC Fabricators',
    industry: 'manufacturing',
    archetype: 'Custom Job Shop & Metal Fabrication',
    description: 'Precision machining shop with 26 skilled machinists and welders. Orders managed through physical work binders and whiteboards.',
    profile: {
      name: 'Apex Precision CNC Fabricators',
      industry: 'Manufacturing & Machining',
      archetypeId: 'manufacturing',
      revenue: '$3.8M / year',
      revenueNumeric: 3800000,
      employees: 26,
      avgHourlyWage: 34,
      businessModel: 'B2B Custom Job Shop / Make-to-Order',
      primaryGoal: 'Eliminate shop floor traveler clipboards, reduce material stockouts, and digitize quote estimates',
      monthlyBudget: 1200,
    },
    defaultAnswers: {
      cs_1: 2, // Website contact form + email
      cs_2: 2, // Shared Excel customer sheet
      cs_3: 1, // Word doc quotes, mailed checks
      op_1: 1, // Physical clipboards & whiteboards
      op_2: 1, // Visual checks, frequent stockouts
      op_3: 2, // Email orders, paper packing slips
      fa_1: 2, // Desktop QuickBooks on single PC
      fa_2: 2, // Emailed invoices, manual chasing
      fa_3: 1, // Paper punch cards with manual math
      wc_1: 1, // Printed binders & local desktop folders
      wc_2: 2, // Floor shouting & personal WhatsApp
      wc_3: 1, // Resistance to tech change
      ds_1: 1, // No automated backup (local hard drive)
      ds_2: 1, // Shared password on sticky note
      ds_3: 1, // Gut feel & bank balance
    },
    activeBottlenecks: [
      {
        ...BOTTLENECK_PRESETS[1], // stock blindness
        wastedHoursWeekly: 22,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[1], 34),
      },
      {
        ...BOTTLENECK_PRESETS[4], // paper travelers
        wastedHoursWeekly: 18,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[4], 34),
      },
      {
        ...BOTTLENECK_PRESETS[0], // duplicate order retyping
        wastedHoursWeekly: 12,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[0], 34),
      },
      {
        ...BOTTLENECK_PRESETS[6], // manual timesheets
        wastedHoursWeekly: 8,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[6], 34),
      },
      {
        ...BOTTLENECK_PRESETS[7], // local PC backups
        wastedHoursWeekly: 3,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[7], 34),
      },
    ],
  },
  {
    id: 'field_services',
    name: 'Vanguard Climate & HVAC Solutions',
    industry: 'services',
    archetype: 'Commercial & Residential Field Contracting',
    description: '14 licensed HVAC technicians and 3 office dispatchers. Technicians text job updates; invoices delayed by 3 weeks while waiting for paper job sheets.',
    profile: {
      name: 'Vanguard Climate & HVAC Solutions',
      industry: 'Field Services & Trade Contracting',
      archetypeId: 'field_services',
      revenue: '$2.1M / year',
      revenueNumeric: 2100000,
      employees: 17,
      avgHourlyWage: 32,
      businessModel: 'Dispatch Field Service & Preventative Maintenance',
      primaryGoal: 'Fast mobile dispatch, paperless job sign-offs, and instant on-site invoicing',
      monthlyBudget: 950,
    },
    defaultAnswers: {
      cs_1: 2, // Website form + phone calls
      cs_2: 2, // Outdated spreadsheet of customer properties
      cs_3: 2, // Emailed PDF estimates, slow sign-off
      op_1: 2, // WhatsApp dispatch & shared Google Calendar
      op_2: 2, // Periodic van stock count in Excel
      op_3: 2, // Supplier counter pickup receipts
      fa_1: 2, // QuickBooks Desktop in the front office
      fa_2: 1, // Paper job slips turned in on Fridays, delayed billing
      fa_3: 2, // Techs text weekly hours to admin
      wc_1: 2, // PDF manual attachments via email
      wc_2: 2, // WhatsApp group with constant phone alerts
      wc_3: 2, // Trial-by-fire
      ds_1: 2, // External USB drive backup occasionally
      ds_2: 2, // Personal passwords
      ds_3: 2, // End of month spreadsheet review
    },
    activeBottlenecks: [
      {
        ...BOTTLENECK_PRESETS[2], // whatsapp chaos
        wastedHoursWeekly: 16,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[2], 32),
      },
      {
        ...BOTTLENECK_PRESETS[3], // delayed invoicing
        wastedHoursWeekly: 14,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[3], 32),
      },
      {
        ...BOTTLENECK_PRESETS[5], // unfollowed quotes
        wastedHoursWeekly: 10,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[5], 32),
      },
      {
        ...BOTTLENECK_PRESETS[6], // manual timesheets
        wastedHoursWeekly: 7,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[6], 32),
      },
    ],
  },
  {
    id: 'retail',
    name: 'Metro Building & Hardware Supplies',
    industry: 'retail',
    archetype: 'Omnichannel B2B / B2C Building Merchant',
    description: 'Wholesale and retail distributor of fasteners, tools, and lumber with physical trade counter and budding phone/email ordering.',
    profile: {
      name: 'Metro Building & Hardware Supplies',
      industry: 'Retail & Wholesale Trade',
      archetypeId: 'retail',
      revenue: '$4.2M / year',
      revenueNumeric: 4200000,
      employees: 21,
      avgHourlyWage: 25,
      businessModel: 'Counter Sales + Contractor Net-30 Accounts',
      primaryGoal: 'Synchronize POS counter and warehouse inventory, automate contractor invoicing',
      monthlyBudget: 1500,
    },
    defaultAnswers: {
      cs_1: 2, // Phone orders & walk-in counter
      cs_2: 2, // Disconnected counter POS customer list
      cs_3: 2, // Net-30 paper invoices mailed to contractors
      op_1: 2, // Paper picking tickets in warehouse
      op_2: 2, // Weekend inventory cycle counts in Excel
      op_3: 3, // Digital POs to primary distributors
      fa_1: 3, // QuickBooks Online with bank feeds
      fa_2: 2, // Monthly paper statements with slow collections
      fa_3: 2, // Clock-in machine with manual export
      wc_1: 2, // Shared local server network share
      wc_2: 2, // PA speaker announcements & texts
      wc_3: 2, // Moderate resistance
      ds_1: 2, // NAS drive in back office
      ds_2: 2, // Shared staff PINs on POS terminals
      ds_3: 2, // Monthly sales sheet
    },
    activeBottlenecks: [
      {
        ...BOTTLENECK_PRESETS[1], // stock blindness
        wastedHoursWeekly: 20,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[1], 25),
      },
      {
        ...BOTTLENECK_PRESETS[0], // duplicate data entry
        wastedHoursWeekly: 15,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[0], 25),
      },
      {
        ...BOTTLENECK_PRESETS[3], // delayed invoicing & slow chasing
        wastedHoursWeekly: 12,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[3], 25),
      },
    ],
  },
  {
    id: 'hospitality',
    name: 'Harborview Bistro & Event Catering',
    industry: 'hospitality',
    archetype: 'Multi-Venue Restaurant & Event Catering',
    description: 'Bistro restaurant plus off-site catering operations. Menus and event bookings managed via handwritten binders and personal text messages.',
    profile: {
      name: 'Harborview Bistro & Event Catering',
      industry: 'Food & Hospitality',
      archetypeId: 'hospitality',
      revenue: '$1.7M / year',
      revenueNumeric: 1700000,
      employees: 24,
      avgHourlyWage: 22,
      businessModel: 'Dining + Private Event Catering Contracts',
      primaryGoal: 'Online event booking deposits, recipe costing inventory, and automated shift scheduling',
      monthlyBudget: 800,
    },
    defaultAnswers: {
      cs_1: 2, // Phone reservation calls & paper diary
      cs_2: 1, // Business cards in plastic box
      cs_3: 2, // Cash/card in restaurant, paper checks for weddings
      op_1: 2, // Kitchen whiteboard prep lists
      op_2: 1, // Visual fridge inspections, food spoilage waste
      op_3: 2, // Phone calls to food purveyors
      fa_1: 2, // Paper invoices dropped off at CPA office
      fa_2: 2, // Event deposits tracked in notebook
      fa_3: 2, // Paper shift rota posted on breakroom fridge
      wc_1: 1, // Recipe binders with sauce-stained pages
      wc_2: 2, // Chaotic group text for shift covers
      wc_3: 2, // High staff turnover
      ds_1: 1, // Toast POS cloud data, but catering on laptop
      ds_2: 1, // 1234 PIN on POS
      ds_3: 2, // Weekly sales tally
    },
    activeBottlenecks: [
      {
        ...BOTTLENECK_PRESETS[2], // whatsapp chaos
        wastedHoursWeekly: 14,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[2], 22),
      },
      {
        ...BOTTLENECK_PRESETS[5], // unfollowed leads / event quotes
        wastedHoursWeekly: 11,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[5], 22),
      },
      {
        ...BOTTLENECK_PRESETS[6], // manual timesheets / scheduling chaos
        wastedHoursWeekly: 10,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[6], 22),
      },
    ],
  },
  {
    id: 'healthcare',
    name: 'Oakridge Family Dental & Aesthetics',
    industry: 'healthcare',
    archetype: 'Private Dental & Specialty Wellness Clinic',
    description: 'Modern clinical equipment but archaic front-office intake: patients fill clipboards by hand; staff spends 3 hours a day making confirmation phone calls.',
    profile: {
      name: 'Oakridge Family Dental & Aesthetics',
      industry: 'Healthcare & Wellness',
      archetypeId: 'healthcare',
      revenue: '$1.4M / year',
      revenueNumeric: 1400000,
      employees: 9,
      avgHourlyWage: 28,
      businessModel: 'Appointment-Based Clinical & Cosmetic Services',
      primaryGoal: 'Digitize patient intake clipboards, automate 2-way SMS confirmations, online deposit payments',
      monthlyBudget: 900,
    },
    defaultAnswers: {
      cs_1: 2, // Phone booking & brochure site
      cs_2: 2, // Dental practice management system (on-prem)
      cs_3: 2, // Counter card terminal, paper insurance claims
      op_1: 2, // Front desk paper clipboard handoffs
      op_2: 2, // Monthly dental supplies cabinet audit
      op_3: 2, // Supplier catalog reordering
      fa_1: 3, // Cloud accounting linked to bank
      fa_2: 2, // Paper patient co-pay balance statements
      fa_3: 3, // Digital timeclock for hygienists
      wc_1: 2, // Laminated sterilization checklists
      wc_2: 2, // Front desk intercom & sticky notes
      wc_3: 3, // Staff open to improvements
      ds_1: 3, // Encrypted HIPAA cloud backup
      ds_2: 3, // Individual logins
      ds_3: 2, // Monthly recall reports
    },
    activeBottlenecks: [
      {
        ...BOTTLENECK_PRESETS[0], // retyping clipboard data into practice management
        wastedHoursWeekly: 15,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[0], 28),
      },
      {
        ...BOTTLENECK_PRESETS[2], // phone confirmation tag
        wastedHoursWeekly: 12,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[2], 28),
      },
      {
        ...BOTTLENECK_PRESETS[3], // delayed co-pay invoicing
        wastedHoursWeekly: 8,
        ...calculateBottleneckMetrics(BOTTLENECK_PRESETS[3], 28),
      },
    ],
  },
];
