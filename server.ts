import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Setup Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Data persistence file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data dir:', err);
  }
}

// In-memory data store with file sync
interface DatabaseStore {
  users: any[];
  boards: any[];
  goals: any[];
  memories: any[];
  badges: any[];
}

let db: DatabaseStore = {
  users: [],
  boards: [],
  goals: [],
  memories: [],
  badges: [],
};

// Load database from disk or init
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      return;
    } catch (e) {
      console.error('Error parsing database.json, reinitializing:', e);
    }
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save database to disk:', err);
  }
}

loadDatabase();

// API Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'DreamBoard AI',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Dream-to-Action Converter
app.post('/api/ai/convert-dream', async (req: Request, res: Response) => {
  try {
    const { dreamText, categoryHint, timelinePref } = req.body;
    if (!dreamText || typeof dreamText !== 'string') {
      res.status(400).json({ error: 'Please provide a valid dream description.' });
      return;
    }

    if (!ai) {
      // Return high quality heuristic plan if API key is not currently injected
      return res.json(generateFallbackPlan(dreamText, categoryHint, timelinePref));
    }

    const prompt = `You are DreamBoard AI's master dream visualizer and goal planner. 
Transform this dream into a rich, structured, actionable milestone plan with learning suggestions and alternative paths.
Dream: "${dreamText}"
${categoryHint ? `Category hint: ${categoryHint}` : ''}
${timelinePref ? `Preferred timeline: ${timelinePref}` : ''}

Output a strictly valid JSON object matching this structure:
{
  "title": "Inspiring goal title",
  "category": "Education | Career | Travel | Personal Growth | Creativity | Health & Wellness | Hobbies | Wealth & Life",
  "summary": "Warm, encouraging 2-sentence summary of what this dream entails",
  "difficulty": "Beginner | Intermediate | Ambitious | Mastercraft",
  "suggestedTimeline": "e.g. 6 Months",
  "recommendedHabits": ["habit 1", "habit 2", "habit 3"],
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Clear target outcome",
      "estimatedHours": 30,
      "order": 1,
      "rewardBadge": "e.g. First Step Master 🌱",
      "subTasks": [
        {"title": "Subtask 1", "estimatedHours": 5},
        {"title": "Subtask 2", "estimatedHours": 10}
      ]
    }
  ],
  "learningResources": ["resource 1", "resource 2", "resource 3"],
  "alternatePaths": [
    {
      "id": "path-1",
      "title": "Fast-Track Sprint",
      "description": "Intensive hands-on immersion for quick results",
      "timeline": "3 Months",
      "estimatedCost": "Low / Free",
      "pros": ["Rapid progress", "High focus"],
      "cons": ["Demands 15+ hours/week"],
      "steps": ["Step 1", "Step 2", "Step 3"]
    },
    {
      "id": "path-2",
      "title": "Mindful & Sustainable Flow",
      "description": "Balanced daily practice integrated with life",
      "timeline": "6-9 Months",
      "estimatedCost": "Moderate",
      "pros": ["Deep retention", "Zero burnout"],
      "cons": ["Requires long-term patience"],
      "steps": ["Step 1", "Step 2", "Step 3"]
    },
    {
      "id": "path-3",
      "title": "Apprenticeship & Portfolio-First",
      "description": "Learn by building real showcase work alongside mentors",
      "timeline": "6 Months",
      "estimatedCost": "Flexible",
      "pros": ["Tangible proofs", "Network connection"],
      "cons": ["Requires finding real projects"],
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are DreamBoard AI, an optimistic, structured, creative dream architect. Return clean JSON only.',
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // Graceful fallback to maintain flawless experience
    const dream = req.body.dreamText || 'New Dream Project';
    res.json(generateFallbackPlan(dream, req.body.categoryHint, req.body.timelinePref));
  }
});

// AI Alternate Paths Generator
app.post('/api/ai/alternate-paths', async (req: Request, res: Response) => {
  try {
    const { goalTitle, currentPlan } = req.body;
    if (!ai) {
      return res.json({
        paths: [
          {
            id: 'alt-1',
            title: 'Express Bootcamp Sprint',
            description: 'Focused intensive daily sprint focusing on immediate production execution.',
            timeline: '6-8 Weeks',
            estimatedCost: 'Free / Low',
            pros: ['Quick momentum', 'Early victory celebrations'],
            cons: ['High intensity commitment'],
            steps: ['Curate top 3 core skills', 'Build 1 daily micro-artifact', 'Present proof of work'],
          },
          {
            id: 'alt-2',
            title: 'Community & Peer Accountability',
            description: 'Partner with a co-dreamer to share milestones and review progress weekly.',
            timeline: '4 Months',
            estimatedCost: 'Free',
            pros: ['High consistency', 'Shared joy and feedback'],
            cons: ['Requires scheduling syncs'],
            steps: ['Find accountability buddy', 'Define shared Sunday checkpoints', 'Exchange feedback'],
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide 3 creative alternative pathways to achieve this goal: "${goalTitle}". Current context: ${currentPlan}. Return JSON: { "paths": [...] }`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{"paths":[]}'));
  } catch (err: any) {
    res.status(500).json({ error: 'Could not generate alternative pathways.' });
  }
});

// AI Dream Drift Detector
app.post('/api/ai/analyze-drift', async (req: Request, res: Response) => {
  try {
    const { goalTitle, plannedProgress, actualProgress, targetDate, milestones } = req.body;
    const diff = (actualProgress || 0) - (plannedProgress || 0);

    if (!ai) {
      return res.json({
        status: diff >= 0 ? 'on_track' : diff > -15 ? 'slight_drift' : 'behind',
        driftPercentage: diff,
        diagnosedBlockers: diff < 0 ? ['Scope expansion on initial milestones', 'Time fragmentation during weekday evenings'] : [],
        catchUpRecommendations: [
          'Break next milestone into 30-minute bite-sized steps',
          'Block two 45-minute focus rituals on calendar this week',
          'Celebrate previous wins to rekindle intrinsic motivation',
        ],
        suggestedAdjustmentDays: diff < -10 ? 7 : 0,
      });
    }

    const prompt = `Analyze this goal progress for dream drift:
Goal: "${goalTitle}"
Planned Progress: ${plannedProgress}%
Actual Progress: ${actualProgress}%
Target Date: ${targetDate}
Milestones state: ${JSON.stringify(milestones || [])}

Provide warm, non-judgmental, psychologically encouraging diagnostic analysis in JSON:
{
  "status": "on_track | slight_drift | behind | critical_drift",
  "driftPercentage": number,
  "diagnosedBlockers": ["blocker 1", "blocker 2"],
  "catchUpRecommendations": ["tip 1", "tip 2", "tip 3"],
  "suggestedAdjustmentDays": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.status(500).json({ error: 'Could not analyze drift.' });
  }
});

// Helper for fallback AI plan
function generateFallbackPlan(dreamText: string, categoryHint?: string, timelinePref?: string) {
  const cat = categoryHint || 'Personal Growth';
  return {
    title: dreamText.length > 45 ? `${dreamText.slice(0, 42)}...` : dreamText,
    category: cat,
    summary: `An inspiring journey to turn "${dreamText}" into real tangible progress through structured milestones and joyful creativity.`,
    difficulty: 'Intermediate',
    suggestedTimeline: timelinePref || '6 Months',
    recommendedHabits: [
      'Daily 25-minute uninterrupted dream building ritual',
      'Weekly Sunday vision review and milestone celebration',
      'Document breakthroughs in Dream Memory Wall',
    ],
    milestones: [
      {
        title: 'Foundation & Core Knowledge Blueprint',
        description: 'Gather essential resources, define constraints, and create your workspace.',
        estimatedHours: 25,
        order: 1,
        rewardBadge: 'Seed Sprouter 🌱',
        subTasks: [
          { title: 'Research top 3 proven methods and benchmarks', estimatedHours: 5 },
          { title: 'Set up dedicated tools and inspiration canvas', estimatedHours: 5 },
          { title: 'Draft first milestone execution checklist', estimatedHours: 15 },
        ],
      },
      {
        title: 'Hands-on Prototyping & First Milestone Build',
        description: 'Construct the first working version or tangible artifact.',
        estimatedHours: 40,
        order: 2,
        rewardBadge: 'Craft Builder 🔨',
        subTasks: [
          { title: 'Build initial prototype / practice session 1', estimatedHours: 15 },
          { title: 'Iterate based on test feedback', estimatedHours: 15 },
          { title: 'Review progress and record reflection', estimatedHours: 10 },
        ],
      },
      {
        title: 'Refinement, Mastery & Public Sharing',
        description: 'Polish to professional craft level and share your dream with the world.',
        estimatedHours: 35,
        order: 3,
        rewardBadge: 'Dream World Master 👑',
        subTasks: [
          { title: 'Final polish and detail verification', estimatedHours: 15 },
          { title: 'Publish or present to community / mentor', estimatedHours: 10 },
          { title: 'Archive memory certificate on Wall', estimatedHours: 10 },
        ],
      },
    ],
    learningResources: [
      'Interactive DreamBoard Action Workshop',
      'Curated Masterclass Series',
      'Tactile 3D Clay Mind Mapping Notes',
    ],
    alternatePaths: [
      {
        id: 'alt-1',
        title: 'Fast-Track Intensive Sprint',
        description: 'Accelerate through daily dedicated 2-hour blocks.',
        timeline: '8 Weeks',
        estimatedCost: 'Free / Low',
        pros: ['Rapid milestone completion', 'High momentum'],
        cons: ['Requires strong energy management'],
        steps: ['Focus on 1 priority task daily', 'Ship weekly demos', 'Review on Sundays'],
      },
      {
        id: 'alt-2',
        title: 'Mindful Step-by-Step Flow',
        description: 'Steady 30-minute daily progress with zero stress.',
        timeline: '6 Months',
        estimatedCost: 'Minimal',
        pros: ['Sustainable long-term habit', 'Enjoyable journey'],
        cons: ['Longer time to final goal'],
        steps: ['Morning micro-habit', 'Weekend creative play', 'Monthly milestone check'],
      },
    ],
  };
}

// Database CRUD Endpoints for full persistence
app.get('/api/data', (_req: Request, res: Response) => {
  res.json(db);
});

app.post('/api/data/sync', (req: Request, res: Response) => {
  try {
    const { boards, goals, memories, badges, user } = req.body;
    if (boards) db.boards = boards;
    if (goals) db.goals = goals;
    if (memories) db.memories = memories;
    if (badges) db.badges = badges;
    if (user) {
      const idx = db.users.findIndex((u) => u.id === user.id);
      if (idx >= 0) db.users[idx] = user;
      else db.users.push(user);
    }
    saveDatabase();
    res.json({ success: true, message: 'Data synced successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to sync database' });
  }
});

async function startServer() {
  // Mount Vite middleware in development
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ DreamBoard AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
