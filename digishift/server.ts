import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Advisor Endpoint for in-depth executive SME transformation memo
app.post('/api/ai/advisor', async (req, res) => {
  try {
    const { profile, maturityScores, bottlenecks, currentRoadmap } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'SME profile is required' });
    }

    if (!process.env.GEMINI_API_KEY || !geminiClient) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY detected. Using deterministic business advisory engine.',
      });
    }

    const prompt = `You are a Principal SME Digital Transformation Advisor & Management Consultant specializing in small-to-medium enterprise modernization.
Analyze the following SME assessment data and provide a concise, highly pragmatic strategic executive brief.

SME PROFILE:
- Business Name: ${profile.name || 'Small Business Enterprise'}
- Industry / Archetype: ${profile.industry} (${profile.archetype})
- Annual Revenue: ${profile.revenue}
- Team Size: ${profile.employees} employees
- Primary Model: ${profile.businessModel}
- Tech Budget: ${profile.budget}

DIGITAL MATURITY PILLAR SCORES (0-100 scale):
${JSON.stringify(maturityScores, null, 2)}

IDENTIFIED PROCESS BOTTLENECKS (ranked by friction):
${JSON.stringify(bottlenecks, null, 2)}

CURRENT PROPOSED ROADMAP HIGHLIGHTS:
${JSON.stringify(currentRoadmap, null, 2)}

Please provide a JSON response with the following exact keys:
{
  "executiveDiagnosis": "A punchy, honest 2-3 paragraph executive summary of their current digital maturity vs industry peers, where their profit leaks, and what is holding them back.",
  "topStrategicRisks": ["Risk 1 with business impact", "Risk 2", "Risk 3"],
  "highImpactRecommendations": [
    {
      "priority": "Immediate (Days 1-30)" | "Near-term (Days 31-90)" | "Strategic (Days 91-180)",
      "initiative": "Short title",
      "rationale": "Why this creates immediate cashflow or time savings",
      "recommendedTools": ["Specific tool 1 (e.g. QuickBooks Online)", "Specific tool 2"],
      "toolsToAvoid": ["Tool that is too complex/expensive for their size (e.g. SAP/Salesforce Enterprise)"],
      "estimatedHoursSavedWeekly": number,
      "changeManagementTip": "How to get non-technical staff to actually adopt it without rebellion"
    }
  ],
  "quickWinActions": ["Action 1 this week", "Action 2 next week", "Action 3"],
  "culturalChangePlaybook": "2 sentences on handling staff anxiety about digital automation.",
  "estimatedAnnualSavings": "$XX,XXX"
}

Format strictly as valid JSON without markdown fences.`;

    let rawText = '';
    let success = false;
    let attempts = 0;
    const maxAttempts = 2;

    while (!success && attempts < maxAttempts) {
      attempts++;
      try {
        const geminiPromise = geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: 'LOW' as any },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI advisor timeout')), 8000)
        );

        const aiResponse: any = await Promise.race([geminiPromise, timeoutPromise]);
        rawText = aiResponse.text?.trim() || '{}';
        if (rawText && rawText !== '{}') {
          success = true;
        }
      } catch (geminiErr: any) {
        console.warn(`Gemini attempt ${attempts} failed:`, geminiErr?.message || geminiErr);
        if (attempts >= maxAttempts) {
          // Graceful fallback to deterministic advisory output
          return res.status(200).json({
            fallback: true,
            message: 'Gemini service temporarily busy. Switched to deterministic SME advisory model.',
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({ success: true, advisorMemo: parsedData });
  } catch (error: any) {
    console.error('Error generating AI advisory brief:', error);
    res.status(200).json({
      fallback: true,
      message: 'Operating with high-fidelity deterministic SME advisory model.',
    });
  }
});

// Conversational AI Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const latestMessage = messages[messages.length - 1]?.content || '';

    if (!process.env.GEMINI_API_KEY || !geminiClient) {
      return res.status(200).json({
        fallback: true,
        reply: generateLocalAdvisoryReply(latestMessage, context),
      });
    }

    const systemInstruction = `You are DigiShift AI, an executive-level Digital Transformation Advisor specifically focused on Small & Medium Enterprises (SMEs).
You help business owners, operations managers, and accountants modernize their workflows without drowning in enterprise complexity or wasting money.

CURRENT CLIENT CONTEXT:
- Company Name: ${context?.profile?.name || 'SME Client'}
- Industry: ${context?.profile?.industry || 'General SME'}
- Headcount: ${context?.profile?.employees || 20} employees
- Annual Revenue: ${context?.profile?.revenue || 'Unknown'}
- Digital Maturity Score: ${context?.overallScore || 45}/100
- Top Bottlenecks: ${JSON.stringify(context?.topBottlenecks?.map((b: any) => b.title) || [])}
- Active Roadmap Stage: ${context?.activeHorizon || 'Phase 1 Foundations'}

ADVISORY RULES:
1. Be ultra-pragmatic: SMEs have limited IT staff and budget. Favor turnkey SaaS (QuickBooks, Zapier, Shopify, Jobber, Katana, HubSpot Starter) over complex custom ERPs (SAP, NetSuite, Salesforce Enterprise).
2. Address human adoption: 70% of SME tech initiatives fail due to staff resistance. Always provide a tip on training and employee buy-in.
3. Keep answers concise, actionable, and structured (2-4 brief paragraphs or bullet points).`;

    let reply = '';
    let success = false;
    let attempts = 0;

    // Build contents string from conversation history
    const conversationHistory = messages.map((m: any) => `${m.role === 'user' ? 'Client' : 'DigiShift Advisor'}: ${m.content}`).join('\n\n');
    const prompt = `${conversationHistory}\n\nDigiShift Advisor:`;

    while (!success && attempts < 2) {
      attempts++;
      try {
        const geminiPromise = geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: 'LOW' as any },
          },
        });

        // 7-second timeout for responsive chat UX
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 7000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        reply = response.text?.trim() || '';
        if (reply) {
          success = true;
        }
      } catch (err: any) {
        console.warn(`Gemini chat attempt ${attempts} error:`, err?.message || err);
        if (attempts >= 2) {
          reply = generateLocalAdvisoryReply(latestMessage, context);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!reply) {
      reply = generateLocalAdvisoryReply(latestMessage, context);
    }

    res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(200).json({
      fallback: true,
      reply: 'I am here to guide your SME transformation. For your current maturity level, prioritizing foundational cloud accounting and paperless dispatch will yield the fastest cashflow payback.',
    });
  }
});

function generateLocalAdvisoryReply(question: string, context: any): string {
  const q = question.toLowerCase();
  const company = context?.profile?.name || 'your business';
  const score = context?.overallScore || 40;

  if (q.includes('tool') || q.includes('software') || q.includes('recommend') || q.includes('stack')) {
    return `For ${company} (Maturity: ${score}/100), our top recommendation is to start with high-velocity SaaS integrations rather than custom builds:

1. **Finance & Billing**: QuickBooks Online Plus or Xero + Stripe 1-click invoice payments.
2. **Operations & Task Tracking**: Monday.com or Jobber (if field service) / Katana (if manufacturing).
3. **Internal Documentation**: Google Workspace with a shared Team Drive and 1Password for team 2FA hygiene.

*Key Warning*: Avoid multi-year enterprise contracts like NetSuite or Salesforce until reaching $15M+ ARR; they require dedicated administrators your team doesn't need yet.`;
  }

  if (q.includes('staff') || q.includes('employee') || q.includes('resistance') || q.includes('culture') || q.includes('train')) {
    return `Employee pushback is the #1 hurdle in SME modernization. Here is our 3-step change playbook:

1. **Frame as Time-Reclaim**: Tell staff: "This tool is to eliminate the 2 hours you spend retyping orders every Friday so you can leave on time," not "management wants to track you."
2. **Appoint a Department Champion**: Pair tech-resistant veteran staff with a younger, enthusiastic peer who can do 1-on-1 handholding.
3. **Zero Penalty Grace Period**: Enforce a strict 30-day "no blame" rule for software errors while employees build confidence.`;
  }

  if (q.includes('roi') || q.includes('payback') || q.includes('cost') || q.includes('budget') || q.includes('money')) {
    return `Based on your diagnostic profile, your administrative drag is leaking thousands of dollars annually in manual transcription and delayed receivables.

- **Phase 1 Investment**: ~$100–$250/month in SaaS subscriptions + ~$500 one-time onboarding.
- **Projected Payback**: Estimated at 2.8 to 4.2 months.
- **Fastest Win**: Transitioning from paper invoices to digital click-to-pay links typically accelerates Days Sales Outstanding (DSO) by 12–18 days, injecting immediate working capital.`;
  }

  return `Great question regarding ${company}. At a digital maturity score of ${score}/100, the most critical principle is **phased sequencing**:

- Don't try to digitize everything in week one. Focus exclusively on Phase 1 quick wins (cloud general ledger, 1-click customer payment links, and centralized Google Workspace/2FA).
- Once the front office and billing cycles are automated, phase into shop floor/field dispatch and barcode inventory.
- Feel free to ask me about specific vendor comparisons, implementation timelines, or how to handle non-technical staff!`;
}

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DigiShift server running on port ${PORT}`);
  });
}

startServer();
