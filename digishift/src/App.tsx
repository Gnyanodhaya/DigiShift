import React, { useState, useMemo } from 'react';
import { SME_PRESETS, SMEPreset } from './data/smePresets';
import {
  calculateMaturityScores,
  generatePhasedRoadmap,
  calculateFinancialROI,
  calculateProjectedMaturityScores,
} from './utils/roadmapEngine';
import { Header } from './components/Header';
import { SMEProfileBanner } from './components/SMEProfileBanner';
import { MaturityDiagnostic } from './components/MaturityDiagnostic';
import { MaturityComparisonView } from './components/MaturityComparisonView';
import { BottleneckRanker } from './components/BottleneckRanker';
import { RoadmapTimeline } from './components/RoadmapTimeline';
import { FinancialCalculator } from './components/FinancialCalculator';
import { ExecutiveMemoView } from './components/ExecutiveMemoView';
import { ExportModal } from './components/ExportModal';
import { PrintDossier } from './components/PrintDossier';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { AIChatBot } from './components/AIChatBot';

export default function App() {
  const initialPreset = SME_PRESETS[0];

  const [activePreset, setActivePreset] = useState<SMEPreset>(initialPreset);
  const [profile, setProfile] = useState(initialPreset.profile);
  const [answers, setAnswers] = useState<Record<string, number>>(initialPreset.defaultAnswers);
  const [bottlenecks, setBottlenecks] = useState(initialPreset.activeBottlenecks);
  const [activeTab, setActiveTab] = useState<string>('diagnostic');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Switch preset
  const handleSelectPreset = (preset: SMEPreset) => {
    setActivePreset(preset);
    setProfile(preset.profile);
    setAnswers(preset.defaultAnswers);
    setBottlenecks(preset.activeBottlenecks);
  };

  // Update answer for a question
  const handleAnswerChange = (questionId: string, level: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: level,
    }));
  };

  // Reactive calculations
  const { pillarScores, overallScore, maturityStage } = useMemo(() => {
    return calculateMaturityScores(answers, profile.archetypeId);
  }, [answers, profile.archetypeId]);

  const roadmap = useMemo(() => {
    return generatePhasedRoadmap(profile, bottlenecks, pillarScores);
  }, [profile, bottlenecks, pillarScores]);

  const financialROI = useMemo(() => {
    return calculateFinancialROI(profile, roadmap, bottlenecks);
  }, [profile, roadmap, bottlenecks]);

  // Projected maturity scores calculation
  const projectedScoresArray = useMemo(() => {
    const full = calculateProjectedMaturityScores(pillarScores, overallScore, roadmap, 'full', profile.avgHourlyWage);
    return full.pillars.map((p) => ({ pillarId: p.pillarId, score: p.projectedScore }));
  }, [pillarScores, overallScore, roadmap, profile.avgHourlyWage]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors overflow-x-hidden w-full max-w-full">
      {/* 3-Zone Sticky Header with Theme & Profile Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setExportModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        overallScore={overallScore}
      />

      {/* SME Profile & High-Level KPIs */}
      <SMEProfileBanner
        profile={profile}
        setProfile={setProfile}
        onSelectPreset={handleSelectPreset}
        overallScore={overallScore}
        maturityStage={maturityStage}
        weeklyHoursSaved={financialROI.weeklyHoursSaved}
        annualLaborValueSaved={financialROI.annualLaborValueSaved}
        paybackMonths={financialROI.paybackMonths}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-3.5 sm:py-4.5">
        {activeTab === 'diagnostic' && (
          <MaturityDiagnostic
            answers={answers}
            onAnswerChange={handleAnswerChange}
            pillarScores={pillarScores}
            projectedScores={projectedScoresArray}
            overallScore={overallScore}
            maturityStage={maturityStage}
            onProceedToBottlenecks={() => setActiveTab('bottlenecks')}
            onNavigateToComparison={() => setActiveTab('comparison')}
          />
        )}

        {activeTab === 'comparison' && (
          <MaturityComparisonView
            pillarScores={pillarScores}
            overallScore={overallScore}
            profile={profile}
            roadmap={roadmap}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            onNavigateToDiagnostic={() => setActiveTab('diagnostic')}
          />
        )}

        {activeTab === 'bottlenecks' && (
          <BottleneckRanker
            bottlenecks={bottlenecks}
            setBottlenecks={setBottlenecks}
            profile={profile}
            onProceedToRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapTimeline
            roadmap={roadmap}
            profile={profile}
            onProceedToROI={() => setActiveTab('roi')}
          />
        )}

        {activeTab === 'roi' && (
          <FinancialCalculator
            profile={profile}
            setProfile={setProfile}
            roadmap={roadmap}
            bottlenecks={bottlenecks}
            onProceedToMemo={() => setActiveTab('memo')}
          />
        )}

        {activeTab === 'memo' && (
          <ExecutiveMemoView
            profile={profile}
            overallScore={overallScore}
            pillarScores={pillarScores}
            bottlenecks={bottlenecks}
            roadmap={roadmap}
            onOpenExport={() => setExportModalOpen(true)}
          />
        )}
      </main>

      {/* Conversational AI Advisory Chatbot */}
      <AIChatBot
        profile={profile}
        overallScore={overallScore}
        pillarScores={pillarScores}
        bottlenecks={bottlenecks}
        roadmap={roadmap}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">DigiShift</span>
            <span>·</span>
            <span>SME Digital Maturity & Process Bottleneck Assessment Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Framework: 5-Pillar SME Modernization Index</span>
            <span>·</span>
            <span className="text-slate-400 dark:text-slate-500">Exportable to Pandas & Excel</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        profile={profile}
        overallScore={overallScore}
        maturityStage={maturityStage}
        pillarScores={pillarScores}
        projectedScores={projectedScoresArray}
        bottlenecks={bottlenecks}
        roadmap={roadmap}
        annualSavings={financialROI.totalAnnualBenefit}
        paybackMonths={financialROI.paybackMonths}
      />

      {/* Settings Modal (User Profile & Theme Preferences) */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal (Sign In / Registration with Rate Limits) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Pristine Full Printable Executive Transformation Dossier (rendered only during print/PDF export) */}
      <PrintDossier
        profile={profile}
        overallScore={overallScore}
        maturityStage={maturityStage}
        pillarScores={pillarScores}
        projectedScores={projectedScoresArray}
        bottlenecks={bottlenecks}
        roadmap={roadmap}
        annualSavings={financialROI.totalAnnualBenefit}
        paybackMonths={financialROI.paybackMonths}
      />
    </div>
  );
}
