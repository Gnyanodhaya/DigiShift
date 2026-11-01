export type MaturityPillarId = 
  | 'customer_sales'
  | 'operations_supply'
  | 'financials_admin'
  | 'workforce_collab'
  | 'data_security';

export interface MaturityRubricOption {
  level: number; // 1 to 5
  title: string;
  description: string;
  scoreWeight: number; // 20 to 100
}

export interface MaturityQuestion {
  id: string;
  pillarId: MaturityPillarId;
  question: string;
  context: string;
  options: MaturityRubricOption[];
}

export interface PillarScore {
  pillarId: MaturityPillarId;
  name: string;
  score: number; // 0 to 100
  peerBenchmark: number; // 0 to 100
  maturityStage: string;
  keyGaps: string[];
}

export interface SMEProfile {
  name: string;
  industry: string;
  archetypeId: string;
  revenue: string;
  revenueNumeric: number;
  employees: number;
  avgHourlyWage: number;
  businessModel: string;
  primaryGoal: string;
  monthlyBudget: number;
}

export interface ProcessBottleneck {
  id: string;
  title: string;
  department: 'Sales & Intake' | 'Operations & Fulfillment' | 'Finance & Invoicing' | 'Team & Workforce' | 'Customer Care';
  description: string;
  currentTool: string;
  wastedHoursWeekly: number;
  errorRate: 'Low' | 'Medium' | 'High' | 'Severe';
  revenueImpactScore: number; // 1 to 5
  customerFrictionScore: number; // 1 to 5
  urgency: 'Immediate' | 'Medium' | 'Low';
  annualFinancialDrain: number; // Calculated
  priorityScore: number; // 0 to 100 algorithm
  recommendedSolutions: string[];
}

export interface RoadmapMilestone {
  id: string;
  phase: 1 | 2 | 3;
  phaseName: string;
  timeframe: string;
  startMonth: number;
  durationMonths: number;
  title: string;
  category: string;
  description: string;
  expectedWeeklyHoursSaved: number;
  estimatedCostMonthly: number;
  implementationCostOneTime: number;
  riskLevel: 'Low' | 'Medium' | 'Moderate';
  recommendedStack: {
    name: string;
    type: string;
    monthlyPricePerUser: string;
  }[];
  avoidTools: string[];
  successKpi: string;
}

export interface ExecutiveMemo {
  executiveDiagnosis: string;
  topStrategicRisks: string[];
  highImpactRecommendations: {
    priority: string;
    initiative: string;
    rationale: string;
    recommendedTools: string[];
    toolsToAvoid: string[];
    estimatedHoursSavedWeekly: number;
    changeManagementTip: string;
  }[];
  quickWinActions: string[];
  culturalChangePlaybook: string;
  estimatedAnnualSavings: string;
}

export interface ProjectedPillarScore {
  pillarId: MaturityPillarId;
  name: string;
  baselineScore: number;
  projectedScore: number;
  peerBenchmark: number;
  delta: number;
  percentageLift: number;
  baselineStage: string;
  projectedStage: string;
  unlockedCapabilities: string[];
}

export interface ProjectedMaturityState {
  horizon: 'baseline' | 'phase1' | 'phase2' | 'full';
  horizonLabel: string;
  timeframe: string;
  projectedOverallScore: number;
  baselineOverallScore: number;
  overallDelta: number;
  projectedStage: {
    title: string;
    badge: string;
    color: string;
    description: string;
  };
  pillars: ProjectedPillarScore[];
  annualHoursSavedCumulative: number;
  annualValueRecapturedCumulative: number;
}
