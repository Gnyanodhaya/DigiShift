import {
  MaturityPillarId,
  PillarScore,
  ProcessBottleneck,
  RoadmapMilestone,
  SMEProfile,
  ExecutiveMemo,
  ProjectedMaturityState,
  ProjectedPillarScore,
} from '../types/advisor';
import { MATURITY_QUESTIONS, PILLARS_CONFIG, INDUSTRY_BENCHMARKS, getMaturityStage } from '../data/maturityFramework';

export function calculateMaturityScores(
  answers: Record<string, number>,
  industry: string
): {
  pillarScores: PillarScore[];
  overallScore: number;
  maturityStage: ReturnType<typeof getMaturityStage>;
} {
  const benchmarks = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default;

  const pillarScores: PillarScore[] = PILLARS_CONFIG.map((pillar) => {
    const questions = MATURITY_QUESTIONS.filter((q) => q.pillarId === pillar.id);
    let totalScore = 0;
    const gaps: string[] = [];

    questions.forEach((q) => {
      const selectedLevel = answers[q.id] || 2;
      const option = q.options.find((opt) => opt.level === selectedLevel) || q.options[1];
      totalScore += option.scoreWeight;

      if (selectedLevel <= 2) {
        gaps.push(q.context);
      }
    });

    const avgScore = Math.round(totalScore / questions.length);

    return {
      pillarId: pillar.id,
      name: pillar.name,
      score: avgScore,
      peerBenchmark: benchmarks[pillar.id] || 50,
      maturityStage: getMaturityStage(avgScore).badge,
      keyGaps: gaps,
    };
  });

  const overallScore = Math.round(
    pillarScores.reduce((acc, curr) => acc + curr.score, 0) / pillarScores.length
  );

  return {
    pillarScores,
    overallScore,
    maturityStage: getMaturityStage(overallScore),
  };
}

export function calculateProjectedMaturityScores(
  baselinePillars: PillarScore[],
  baselineOverallScore: number,
  roadmap: RoadmapMilestone[],
  horizon: 'baseline' | 'phase1' | 'phase2' | 'full' = 'full',
  avgHourlyWage = 30
): ProjectedMaturityState {
  if (horizon === 'baseline') {
    return {
      horizon: 'baseline',
      horizonLabel: 'Current Baseline Assessment',
      timeframe: 'Day 0 (Pre-Transformation)',
      projectedOverallScore: baselineOverallScore,
      baselineOverallScore,
      overallDelta: 0,
      projectedStage: getMaturityStage(baselineOverallScore),
      pillars: baselinePillars.map((p) => ({
        pillarId: p.pillarId,
        name: p.name,
        baselineScore: p.score,
        projectedScore: p.score,
        peerBenchmark: p.peerBenchmark,
        delta: 0,
        percentageLift: 0,
        baselineStage: p.maturityStage,
        projectedStage: p.maturityStage,
        unlockedCapabilities: ['Current legacy operational baseline'],
      })),
      annualHoursSavedCumulative: 0,
      annualValueRecapturedCumulative: 0,
    };
  }

  // Capability unlock definitions per pillar across horizons
  const capabilityMap: Record<MaturityPillarId, Record<'phase1' | 'phase2' | 'full', string[]>> = {
    customer_sales: {
      phase1: ['Digital click-to-accept quote proposals', 'Instant credit card & ACH payment links'],
      phase2: ['Visual CRM pipeline (HubSpot/Pipedrive)', 'Automated 3-day and 7-day quote follow-up drips'],
      full: ['24/7 B2B self-service reorder portal', 'Automated 1-click customer feedback loop'],
    },
    operations_supply: {
      phase1: ['Digital photo checklists & work attachments', 'Shared central operational schedule'],
      phase2: ['Mobile barcode scanner inventory tracking', 'Automated safety stock reorder triggers'],
      full: ['Real-time capacity balancing & machine dispatch', 'Automated supplier PO receiving verification'],
    },
    financials_admin: {
      phase1: ['Cloud general ledger (QuickBooks/Xero)', 'Daily automated bank feed reconciliation'],
      phase2: ['Immediate mobile point-of-completion invoicing', 'Automated debtor chasing reminders'],
      full: ['Job-level real-time gross margin tracking', 'Continuous month-end automated close'],
    },
    workforce_collab: {
      phase1: ['Migrated local C: drive files to Google Workspace / M365', 'Structured department channels (Slack/Teams)'],
      phase2: ['GPS-verified mobile time tracking', 'Searchable internal SOP company wiki'],
      full: ['Automated inter-department webhook alerts', 'Meeting-light asynchronous video briefs'],
    },
    data_security: {
      phase1: ['Enforced Two-Factor Authentication (2FA)', '1Password team credential management vault'],
      phase2: ['Automated daily off-site cloud backups (3-2-1 rule)', 'Role-based folder permissions'],
      full: ['Executive live PowerBI/Looker KPI dashboard', 'Automated ransomware protection & disaster drills'],
    },
  };

  // Lifts depending on horizon
  const liftRatios: Record<'phase1' | 'phase2' | 'full', Record<MaturityPillarId, number>> = {
    phase1: {
      financials_admin: 32,
      data_security: 28,
      workforce_collab: 22,
      customer_sales: 12,
      operations_supply: 10,
    },
    phase2: {
      financials_admin: 36,
      data_security: 34,
      workforce_collab: 32,
      customer_sales: 34,
      operations_supply: 38,
    },
    full: {
      financials_admin: 42,
      data_security: 45,
      workforce_collab: 40,
      customer_sales: 44,
      operations_supply: 46,
    },
  };

  const timeframeMap = {
    phase1: 'Months 1–3 (Quick Wins)',
    phase2: 'Months 4–8 (Core Integration)',
    full: 'Months 9–14 (Full Scale & Intelligence)',
  };

  const labelMap = {
    phase1: 'Projected Post-Phase 1',
    phase2: 'Projected Post-Phase 2',
    full: 'Projected Target State (Full Roadmap)',
  };

  const activeMilestones = roadmap.filter((m) => {
    if (horizon === 'phase1') return m.phase === 1;
    if (horizon === 'phase2') return m.phase <= 2;
    return true; // full
  });

  const weeklyHours = activeMilestones.reduce((acc, m) => acc + m.expectedWeeklyHoursSaved, 0);
  const annualHours = weeklyHours * 52;
  const annualValue = Math.round(annualHours * avgHourlyWage);

  const projectedPillars: ProjectedPillarScore[] = baselinePillars.map((p) => {
    const rawLift = liftRatios[horizon][p.pillarId] || 25;
    // Projected score capped realistically at 94
    const projectedScore = Math.min(94, Math.round(p.score + rawLift));
    const delta = projectedScore - p.score;
    const percentageLift = p.score > 0 ? Math.round((delta / p.score) * 100) : 100;

    // Collect capabilities up to this horizon
    let unlocked: string[] = [];
    if (horizon === 'phase1') {
      unlocked = capabilityMap[p.pillarId].phase1;
    } else if (horizon === 'phase2') {
      unlocked = [...capabilityMap[p.pillarId].phase1, ...capabilityMap[p.pillarId].phase2];
    } else {
      unlocked = [
        ...capabilityMap[p.pillarId].phase1,
        ...capabilityMap[p.pillarId].phase2,
        ...capabilityMap[p.pillarId].full,
      ];
    }

    return {
      pillarId: p.pillarId,
      name: p.name,
      baselineScore: p.score,
      projectedScore,
      peerBenchmark: p.peerBenchmark,
      delta,
      percentageLift,
      baselineStage: p.maturityStage,
      projectedStage: getMaturityStage(projectedScore).badge,
      unlockedCapabilities: unlocked,
    };
  });

  const projectedOverallScore = Math.round(
    projectedPillars.reduce((acc, p) => acc + p.projectedScore, 0) / projectedPillars.length
  );

  return {
    horizon,
    horizonLabel: labelMap[horizon],
    timeframe: timeframeMap[horizon],
    projectedOverallScore,
    baselineOverallScore,
    overallDelta: projectedOverallScore - baselineOverallScore,
    projectedStage: getMaturityStage(projectedOverallScore),
    pillars: projectedPillars,
    annualHoursSavedCumulative: annualHours,
    annualValueRecapturedCumulative: annualValue,
  };
}


export function generatePhasedRoadmap(
  profile: SMEProfile,
  bottlenecks: ProcessBottleneck[],
  pillarScores: PillarScore[]
): RoadmapMilestone[] {
  const milestones: RoadmapMilestone[] = [];
  const topBottlenecks = [...bottlenecks].sort((a, b) => b.priorityScore - a.priorityScore);

  // Check specific weaknesses
  const customerPillar = pillarScores.find((p) => p.pillarId === 'customer_sales');
  const opsPillar = pillarScores.find((p) => p.pillarId === 'operations_supply');
  const financePillar = pillarScores.find((p) => p.pillarId === 'financials_admin');
  const collabPillar = pillarScores.find((p) => p.pillarId === 'workforce_collab');
  const securityPillar = pillarScores.find((p) => p.pillarId === 'data_security');

  // --- PHASE 1: Quick Wins & Foundational Hygiene (Months 1–3) ---
  milestones.push({
    id: 'm1_cloud_foundation',
    phase: 1,
    phaseName: 'Phase 1: Foundations & Quick Wins',
    timeframe: 'Months 1–3',
    startMonth: 1,
    durationMonths: 2,
    title: 'Cloud Document Migration & Password Security Baseline',
    category: 'Workforce & Security',
    description: 'Consolidate local C: drive files into managed cloud storage with 2-Factor Authentication (2FA) and password manager for all employees.',
    expectedWeeklyHoursSaved: 5,
    estimatedCostMonthly: 12 * profile.employees,
    implementationCostOneTime: 400,
    riskLevel: 'Low',
    recommendedStack: [
      { name: 'Google Workspace Business Standard', type: 'Cloud Productivity & Storage', monthlyPricePerUser: '$12/user' },
      { name: '1Password Teams', type: 'Credential Vault & 2FA', monthlyPricePerUser: '$4/user' },
    ],
    avoidTools: ['Self-hosted local NAS without offsite backup', 'Consumer DropBox shared logins'],
    successKpi: '100% of staff onboarded with 2FA; zero critical files stored solely on individual desktop hard drives.',
  });

  if ((financePillar && financePillar.score < 60) || topBottlenecks.some(b => b.department === 'Finance & Invoicing')) {
    milestones.push({
      id: 'm1_instant_invoicing',
      phase: 1,
      phaseName: 'Phase 1: Foundations & Quick Wins',
      timeframe: 'Months 1–3',
      startMonth: 1,
      durationMonths: 3,
      title: 'Point-of-Completion Invoicing & Direct Bank Feeds',
      category: 'Finance & Cashflow',
      description: 'Upgrade from desktop spreadsheets to cloud accounting. Issue quotes with 1-click digital signatures and instant credit card checkout links.',
      expectedWeeklyHoursSaved: 11,
      estimatedCostMonthly: 85,
      implementationCostOneTime: 750,
      riskLevel: 'Low',
      recommendedStack: [
        { name: 'QuickBooks Online Plus / Xero Growing', type: 'Cloud General Ledger', monthlyPricePerUser: '$60/mo flat' },
        { name: 'Stripe Invoicing / Square Pay Links', type: 'Card & ACH Checkout', monthlyPricePerUser: '2.9% + 30¢ / transaction' },
      ],
      avoidTools: ['SAP Business One (Over-engineered for sub-$10M SME)', 'Custom on-premise ERP modules'],
      successKpi: 'Reduce Days Sales Outstanding (DSO) by 14 days; save 11 hours/wk in manual transcription.',
    });
  }

  // --- PHASE 2: Core Integration & Workflow Automation (Months 4–8) ---
  if ((opsPillar && opsPillar.score < 70) || profile.industry.toLowerCase().includes('manufacturing') || profile.industry.toLowerCase().includes('retail')) {
    milestones.push({
      id: 'm2_inventory_tracking',
      phase: 2,
      phaseName: 'Phase 2: Core Integration & Automation',
      timeframe: 'Months 4–7',
      startMonth: 4,
      durationMonths: 4,
      title: 'Digital Stock Barcoding & Minimum Stock Alerts',
      category: 'Operations & Supply Chain',
      description: 'Replace physical clipboard stock counts with mobile barcode scanners. Configure automated reorder thresholds synced to supplier PO drafts.',
      expectedWeeklyHoursSaved: 16,
      estimatedCostMonthly: 199,
      implementationCostOneTime: 1800,
      riskLevel: 'Medium',
      recommendedStack: [
        { name: 'Katana Cloud Manufacturing / Unleashed', type: 'SME Inventory & Shop Floor', monthlyPricePerUser: '$199/mo' },
        { name: 'Socket Mobile / Zebra Bluetooth Scanner', type: 'Rugged Handheld Barcode hardware', monthlyPricePerUser: '$250 one-time' },
      ],
      avoidTools: ['Oracle NetSuite ($15,000+ setup fees)', 'Custom Excel macros with broken formulas'],
      successKpi: 'Zero stockout-induced production halts; 99% inventory count accuracy.',
    });
  } else {
    milestones.push({
      id: 'm2_field_dispatch',
      phase: 2,
      phaseName: 'Phase 2: Core Integration & Automation',
      timeframe: 'Months 4–7',
      startMonth: 4,
      durationMonths: 3,
      title: 'Mobile Work Order Dispatch & Client Booking Portal',
      category: 'Operations & Sales',
      description: 'Eliminate chaotic phone/WhatsApp dispatch with a centralized mobile dispatch board. Technicians log job photos, customer signatures, and parts used on mobile.',
      expectedWeeklyHoursSaved: 14,
      estimatedCostMonthly: 149,
      implementationCostOneTime: 1200,
      riskLevel: 'Medium',
      recommendedStack: [
        { name: 'Jobber / ServiceTitan Starter / Monday.com', type: 'Field Service & Task Dispatch', monthlyPricePerUser: '$129/mo' },
        { name: 'Front / Missive Shared Inbox', type: 'Central Customer Communication', monthlyPricePerUser: '$19/user' },
      ],
      avoidTools: ['Fragmented personal SMS threads', 'Manual printed work orders'],
      successKpi: '30% faster response time to inbound quote requests; eliminate lost dispatch records.',
    });
  }

  milestones.push({
    id: 'm2_crm_automation',
    phase: 2,
    phaseName: 'Phase 2: Core Integration & Automation',
    timeframe: 'Months 5–8',
    startMonth: 5,
    durationMonths: 3,
    title: 'Automated CRM Pipeline & Quote Follow-Up Sequences',
    category: 'Sales & Marketing',
    description: 'Funnel web and phone inquiries into a visual sales pipeline. Trigger automated 3-day and 7-day polite follow-up emails for pending proposals.',
    expectedWeeklyHoursSaved: 8,
    estimatedCostMonthly: 75,
    implementationCostOneTime: 600,
    riskLevel: 'Low',
    recommendedStack: [
      { name: 'HubSpot Sales Starter / Pipedrive', type: 'Visual Deal Pipeline', monthlyPricePerUser: '$20/user' },
      { name: 'Zapier Professional', type: 'No-Code Webhook Automation', monthlyPricePerUser: '$39/mo' },
    ],
    avoidTools: ['Salesforce Sales Cloud Enterprise ($150+/user/mo + consultants)', 'Unstructured sticky notes'],
    successKpi: 'Increase proposal win rate by 18%; zero qualified leads forgotten in sent mail.',
  });

  // --- PHASE 3: Advanced Optimization & Scaled Intelligence (Months 9–14) ---
  milestones.push({
    id: 'm3_executive_dashboards',
    phase: 3,
    phaseName: 'Phase 3: Intelligence & Scaled Optimization',
    timeframe: 'Months 9–12',
    startMonth: 9,
    durationMonths: 4,
    title: 'Executive Real-Time Margin & Cashflow BI Dashboard',
    category: 'Analytics & Strategy',
    description: 'Unify sales, labor costs, and job profitability into live weekly dashboards. Replace 10-hour end-of-month manual spreadsheet assembly.',
    expectedWeeklyHoursSaved: 10,
    estimatedCostMonthly: 60,
    implementationCostOneTime: 1500,
    riskLevel: 'Medium',
    recommendedStack: [
      { name: 'Microsoft Power BI Pro / Google Looker Studio', type: 'Business Intelligence & Reporting', monthlyPricePerUser: '$10/user or Free' },
      { name: 'Fathom / Jirav', type: 'Financial Forecasting for SMEs', monthlyPricePerUser: '$55/mo' },
    ],
    avoidTools: ['Multi-million dollar data warehouses (Snowflake enterprise tiers)', '30-day delayed retrospective accounting'],
    successKpi: 'Leadership reviews live weekly gross margins every Monday morning in under 15 minutes.',
  });

  milestones.push({
    id: 'm3_customer_portal',
    phase: 3,
    phaseName: 'Phase 3: Intelligence & Scaled Optimization',
    timeframe: 'Months 11–14',
    startMonth: 11,
    durationMonths: 3,
    title: 'Customer Self-Service Reordering & Automated Feedback Loop',
    category: 'Customer Experience',
    description: 'Give repeat B2B accounts direct self-service access to past invoice history, live job milestones, and 1-click reorder capabilities.',
    expectedWeeklyHoursSaved: 7,
    estimatedCostMonthly: 120,
    implementationCostOneTime: 2000,
    riskLevel: 'Low',
    recommendedStack: [
      { name: 'Softr / Noloco on Airtable or Postgres', type: 'Low-Code Client Portal', monthlyPricePerUser: '$79/mo' },
      { name: 'Customer Thermometer / Delighted', type: 'Automated 1-Click NPS Survey', monthlyPricePerUser: '$45/mo' },
    ],
    avoidTools: ['Custom from-scratch React/Node app development ($40k+ agency bills)', 'Paper surveys'],
    successKpi: '25% of repeat orders placed autonomously without office staff phone intervention.',
  });

  return milestones;
}

export function calculateFinancialROI(
  profile: SMEProfile,
  roadmap: RoadmapMilestone[],
  bottlenecks: ProcessBottleneck[]
): {
  weeklyHoursSaved: number;
  annualHoursSaved: number;
  annualLaborValueSaved: number;
  annualErrorWasteReduction: number;
  totalAnnualBenefit: number;
  monthlySoftwareCost: number;
  annualSoftwareCost: number;
  oneTimeImplementationCost: number;
  firstYearNetBenefit: number;
  threeYearNetBenefit: number;
  paybackMonths: number;
  roiPercentage: number;
} {
  const weeklyHoursSaved = roadmap.reduce((acc, m) => acc + m.expectedWeeklyHoursSaved, 0);
  const annualHoursSaved = weeklyHoursSaved * 52;
  const annualLaborValueSaved = Math.round(annualHoursSaved * profile.avgHourlyWage);

  // Error & scrap reduction estimated from bottlenecks resolved
  const totalBottleneckDrain = bottlenecks.reduce((acc, b) => acc + b.annualFinancialDrain, 0);
  const annualErrorWasteReduction = Math.round(totalBottleneckDrain * 0.45); // 45% conservative capture rate

  const totalAnnualBenefit = annualLaborValueSaved + annualErrorWasteReduction;

  const monthlySoftwareCost = roadmap.reduce((acc, m) => acc + m.estimatedCostMonthly, 0);
  const annualSoftwareCost = monthlySoftwareCost * 12;
  const oneTimeImplementationCost = roadmap.reduce((acc, m) => acc + m.implementationCostOneTime, 0);

  const firstYearTotalCost = annualSoftwareCost + oneTimeImplementationCost;
  const firstYearNetBenefit = totalAnnualBenefit - firstYearTotalCost;
  const threeYearTotalBenefit = totalAnnualBenefit * 3;
  const threeYearTotalCost = oneTimeImplementationCost + annualSoftwareCost * 3;
  const threeYearNetBenefit = threeYearTotalBenefit - threeYearTotalCost;

  // Payback period in months: One-time Cost / (Monthly Net Savings)
  const monthlyGrossBenefit = totalAnnualBenefit / 12;
  const monthlyNetBenefit = monthlyGrossBenefit - monthlySoftwareCost;
  const paybackMonths = monthlyNetBenefit > 0
    ? Math.max(1.2, Math.round((oneTimeImplementationCost / monthlyNetBenefit) * 10) / 10)
    : 18;

  const roiPercentage = Math.round((threeYearNetBenefit / threeYearTotalCost) * 100);

  return {
    weeklyHoursSaved,
    annualHoursSaved,
    annualLaborValueSaved,
    annualErrorWasteReduction,
    totalAnnualBenefit,
    monthlySoftwareCost,
    annualSoftwareCost,
    oneTimeImplementationCost,
    firstYearNetBenefit,
    threeYearNetBenefit,
    paybackMonths,
    roiPercentage,
  };
}

export function generateDeterministicMemo(
  profile: SMEProfile,
  overallScore: number,
  pillarScores: PillarScore[],
  bottlenecks: ProcessBottleneck[],
  roadmap: RoadmapMilestone[]
): ExecutiveMemo {
  const stage = getMaturityStage(overallScore);
  const topBn = [...bottlenecks].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);
  const roi = calculateFinancialROI(profile, roadmap, bottlenecks);

  return {
    executiveDiagnosis: `${profile.name} is currently operating at ${stage.title} (Digital Maturity Score: ${overallScore}/100). The enterprise exhibits strong operational craft but suffers from systemic administrative latency caused by disconnected tools, manual retyping, and reliance on physical paperwork. At an estimated ${profile.employees} employees, manual coordination overhead is leaking approximately ${roi.weeklyHoursSaved} productive hours weekly—equivalent to $${roi.annualLaborValueSaved.toLocaleString()} in annual wasted payroll.

The most acute risk is not a lack of software, but fragmented digital silos: team members communicate across personal WhatsApp threads and paper job travelers while financial bookkeeping lags by weeks. Modernizing through phased, low-disruption SaaS adoption will unlock predictable cashflow, eliminate costly rework, and deliver a projected payback period of just ${roi.paybackMonths} months.`,
    topStrategicRisks: [
      `Key Person Vulnerability: Critical job specs and customer history reside in individual staff heads or unbacked-up local drives.`,
      `Cashflow Friction: Invoices issued weeks after work completion result in high Days Sales Outstanding (DSO) and avoidable debt strain.`,
      `Capacity Ceiling: Management cannot scale revenue without linearly adding administrative overhead and office headcount.`,
    ],
    highImpactRecommendations: [
      {
        priority: 'Immediate (Days 1-30)',
        initiative: 'Centralize Cloud Ledger & Enable 1-Click Mobile Payments',
        rationale: 'Stops delayed billing cycles immediately and injects predictable cashflow.',
        recommendedTools: ['QuickBooks Online / Xero', 'Stripe Invoicing / Square'],
        toolsToAvoid: ['Oracle NetSuite', 'SAP Business One'],
        estimatedHoursSavedWeekly: 11,
        changeManagementTip: 'Frame digital invoices as a convenience for customers so staff feel proud rather than burdened by the change.',
      },
      {
        priority: 'Near-term (Days 31-90)',
        initiative: 'Digitize Work Order Dispatch & Mobile Checklists',
        rationale: 'Eliminates lost clipboards, smudged travelers, and chaotic phone calls.',
        recommendedTools: ['Jobber / Monday.com / Katana', 'Google Workspace Drive'],
        toolsToAvoid: ['Custom bespoke ERP software developed by local dev agencies'],
        estimatedHoursSavedWeekly: 16,
        changeManagementTip: 'Give field/shop leads rugged, easy-to-read tablets with pre-configured big buttons—never make them type lengthy text on mobile.',
      },
      {
        priority: 'Strategic (Days 91-180)',
        initiative: 'Automated CRM Pipeline & Quote Follow-Up Sequences',
        rationale: 'Recovers 15-25% of abandoned proposals that slip through the cracks.',
        recommendedTools: ['HubSpot Sales Starter', 'Pipedrive', 'Zapier'],
        toolsToAvoid: ['Salesforce Enterprise with costly multi-year consulting locks'],
        estimatedHoursSavedWeekly: 8,
        changeManagementTip: 'Celebrate the first closed deal generated by an automated follow-up email in front of the entire sales team.',
      },
    ],
    quickWinActions: [
      'Enable Two-Factor Authentication (2FA) and 1Password across all company email and banking accounts this Friday.',
      'Stop printing paper estimates: transition to click-to-accept digital PDF estimates with embedded payment deposits.',
      'Set up a single centralized "Operations" Slack or Teams channel to replace scattered SMS & WhatsApp chatter.',
    ],
    culturalChangePlaybook: 'Introduce new software as "giving back your Friday afternoons" rather than surveillance. Assign one enthusiastic staff champion per department and celebrate early time-saving milestones publicly.',
    estimatedAnnualSavings: `$${roi.totalAnnualBenefit.toLocaleString()}`,
  };
}
