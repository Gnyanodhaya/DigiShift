import { ProcessBottleneck } from '../types/advisor';

export const BOTTLENECK_PRESETS: ProcessBottleneck[] = [
  {
    id: 'bn_retype_orders',
    title: 'Duplicate Data Entry & Retyping Orders into Accounting',
    department: 'Finance & Invoicing',
    description: 'Staff manually retypes customer orders or handwritten job sheets from CRM/paper into the accounting software, causing delays and transposed numbers.',
    currentTool: 'Paper & Manual Keyboard Entry',
    wastedHoursWeekly: 14,
    errorRate: 'High',
    revenueImpactScore: 3,
    customerFrictionScore: 4,
    urgency: 'Immediate',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Direct QuickBooks / Xero API sync', 'Zapier automated order parser', 'Digital quote-to-invoice pipeline'],
  },
  {
    id: 'bn_stock_blindness',
    title: 'Stock Blindness & Unplanned Stockouts',
    department: 'Operations & Fulfillment',
    description: 'Lack of real-time inventory count causes staff to commit to delivery dates only to discover materials or goods are out of stock, halting jobs.',
    currentTool: 'Local Excel Spreadsheets',
    wastedHoursWeekly: 18,
    errorRate: 'Severe',
    revenueImpactScore: 5,
    customerFrictionScore: 5,
    urgency: 'Immediate',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Katana Cloud Manufacturing / Unleashed', 'Barcode mobile scanning', 'Automated minimum reorder triggers'],
  },
  {
    id: 'bn_whatsapp_chaos',
    title: 'Customer Inquiries & Job Dispatch Buried in WhatsApp / SMS',
    department: 'Sales & Intake',
    description: 'Work assignments, technician dispatch notes, and customer change requests are exchanged over individual phone texts, leading to lost messages and dropped deadlines.',
    currentTool: 'Personal WhatsApp & SMS Threads',
    wastedHoursWeekly: 12,
    errorRate: 'High',
    revenueImpactScore: 4,
    customerFrictionScore: 4,
    urgency: 'Immediate',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Centralized shared inbox (Front / Missive)', 'Dedicated job management dispatch board (Jobber / ServiceTitan / Asana)', 'Automated WhatsApp Business API with ticketing'],
  },
  {
    id: 'bn_delayed_invoicing',
    title: 'Delayed Invoicing & Slow Payment Chasing',
    department: 'Finance & Invoicing',
    description: 'Invoices are issued 14-25 days after completion because paperwork sits on desks; receivables are chased manually via sporadic phone calls.',
    currentTool: 'Paper Folders & Word Docs',
    wastedHoursWeekly: 10,
    errorRate: 'Medium',
    revenueImpactScore: 5,
    customerFrictionScore: 3,
    urgency: 'Immediate',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Instant point-of-completion mobile invoicing', 'Embedded Stripe/Square 1-click payment links', 'Automated Chaser / Xero payment reminder triggers'],
  },
  {
    id: 'bn_paper_travelers',
    title: 'Physical Paper Travelers & Clipboards on Shop / Field Floor',
    department: 'Operations & Fulfillment',
    description: 'Work instructions and job specs are carried on paper clipboards that get smudged, misplaced, or modified without central office knowing job status.',
    currentTool: 'Physical Clipboards & Binders',
    wastedHoursWeekly: 16,
    errorRate: 'High',
    revenueImpactScore: 3,
    customerFrictionScore: 4,
    urgency: 'Medium',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Rugged tablet digital traveler stations', 'Cloud checklists with photo timestamp proof', 'Monday.com / Notion work tracking'],
  },
  {
    id: 'bn_lost_leads',
    title: 'Unfollowed Inbound Quotes & Abandoned Proposals',
    department: 'Sales & Intake',
    description: 'Prospective clients who request quotes are not followed up systematically after initial proposal email, resulting in 30%+ lost deal leakage.',
    currentTool: 'Email Sent Folder & Memory',
    wastedHoursWeekly: 8,
    errorRate: 'Medium',
    revenueImpactScore: 5,
    customerFrictionScore: 3,
    urgency: 'Medium',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['HubSpot Starter / Pipedrive pipeline stages', 'Automated 3-day and 7-day quote follow-up sequences', 'PandaDoc / Proposify view analytics'],
  },
  {
    id: 'bn_manual_timesheets',
    title: 'Manual Timesheet Tabulation & Overtime Disputes',
    department: 'Team & Workforce',
    description: 'Office manager spends full Mondays transcribing handwritten paper timesheets, calculating overtime rates, and arguing over punch times.',
    currentTool: 'Paper Cards & Excel Overtime Math',
    wastedHoursWeekly: 9,
    errorRate: 'Medium',
    revenueImpactScore: 2,
    customerFrictionScore: 1,
    urgency: 'Medium',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Gusto / QuickBooks Time with GPS geofencing', 'Mobile clock-in app with biometric/facial verify', 'Direct payroll API synchronization'],
  },
  {
    id: 'bn_single_pc_backup',
    title: 'Critical Files Stored on Unbacked-Up Local Desktop PCs',
    department: 'Team & Workforce',
    description: 'Customer contracts, CAD drawings, and accounting records sit on local desktop C: drives with zero off-site automated backup.',
    currentTool: 'Local Desktop Folders',
    wastedHoursWeekly: 4,
    errorRate: 'Severe',
    revenueImpactScore: 4,
    customerFrictionScore: 2,
    urgency: 'Immediate',
    annualFinancialDrain: 0,
    priorityScore: 0,
    recommendedSolutions: ['Enterprise Google Workspace / Microsoft 365 cloud drive migration', 'Automated Backblaze computer backup agent', 'Role-based folder permissions'],
  },
];

export function calculateBottleneckMetrics(
  bottleneck: ProcessBottleneck,
  avgHourlyWage: number
): { annualCost: number; priorityScore: number } {
  // Labor waste: hours * wage * 52 weeks
  const directLaborAnnual = bottleneck.wastedHoursWeekly * avgHourlyWage * 52;

  // Error penalty multiplier based on rework frequency
  const errorMultiplier = {
    Low: 1.1,
    Medium: 1.25,
    High: 1.45,
    Severe: 1.7,
  }[bottleneck.errorRate];

  // Revenue attrition factor (e.g. lost customers, delayed cashflow)
  const revenueImpactValue = bottleneck.revenueImpactScore * 3500;
  const customerFrictionValue = bottleneck.customerFrictionScore * 2000;

  const totalFinancialDrain = Math.round(
    directLaborAnnual * errorMultiplier + revenueImpactValue + customerFrictionValue
  );

  // Priority formula normalized to 0-100:
  // Weighted: 40% hours wasted, 30% revenue impact, 20% error rate, 10% customer friction
  const hoursFactor = Math.min(bottleneck.wastedHoursWeekly / 25, 1) * 40;
  const revFactor = (bottleneck.revenueImpactScore / 5) * 30;
  const errFactor = { Low: 5, Medium: 10, High: 15, Severe: 20 }[bottleneck.errorRate];
  const custFactor = (bottleneck.customerFrictionScore / 5) * 10;

  const score = Math.round(hoursFactor + revFactor + errFactor + custFactor);

  return {
    annualCost: totalFinancialDrain,
    priorityScore: Math.min(100, Math.max(10, score)),
  };
}
