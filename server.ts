import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CampusVerse API' });
});

// Lazy initialize Gemini client to avoid crashes if API key is not yet set
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// AI Campus Copilot endpoint
app.post('/api/copilot', async (req, res) => {
  try {
    const { message, studentContext, campusBuildings, campusEvents, timetable } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemPrompt = `You are "Campus Copilot 🤖", an intelligent, ultra-friendly, Gen-Z styled digital campus assistant for CampusVerse.
Your tone is quick, helpful, playful, and concise (Discord / Notion gaming vibe: "You got this 🔥", "Locked in", "Campus is cooking 🍳"). Keep replies under 3-4 sentences.

Current Campus Context:
- Buildings: ${JSON.stringify(campusBuildings?.map((b: any) => ({ id: b.id, name: b.name, code: b.code, rooms: b.rooms?.map((r: any) => r.roomNumber) })) || [])}
- Events: ${JSON.stringify(campusEvents?.map((e: any) => ({ id: e.id, title: e.title, venue: e.venueName, time: e.startTime, isLiveNow: e.isLiveNow, category: e.category })) || [])}
- Student's Next/Today Classes: ${JSON.stringify(timetable || [])}
- Student's Current Location: ${studentContext?.currentLocationBuildingId || 'Central Lawn'}

CRITICAL: If the user asks about a specific building, class, hackathon, or directions, you can suggest a map action by including a JSON block at the end in this exact format:
<<<ACTION:{"type":"focus_building"|"show_route"|"filter_category"|"register_event","payload":any,"label":"Button Label"}>>>

Examples:
- If asked about AI lab or Innovation lab:
"The Innovation & AI Labs is right next to the Central Lawn on the west wing. The AI Hackathon is currently live on Floor 3! 🚀<<<ACTION:{"type":"focus_building","payload":{"buildingId":"innovation-lab"},"label":"Highlight Innovation Lab"}>>>"
- If asked "Where is my next class?":
"Your next class is Cloud Computing at 11:00 AM in Lab 3 (Innovation Lab). It's a quick 3-minute walk from the Central Lawn! 🚶<<<ACTION:{"type":"show_route","payload":{"toBuildingId":"innovation-lab","destinationRoom":"Lab 3"},"label":"Navigate to Lab 3"}>>>"
- If asked about hackathons:
"The AI HACKATHON 2026: Agentic Futures is happening right now in Innovation Lab with $15,000 in prizes! 💻<<<ACTION:{"type":"filter_category","payload":{"category":"hackathons"},"label":"View Hackathons"}>>>"`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          }
        });

        const rawText = response.text || "Campus copilot is online! Let me know where you're heading.";
        
        // Extract action if present
        let cleanText = rawText;
        let action = undefined;
        const actionMatch = rawText.match(/<<<ACTION:(.*?)>>>/);
        if (actionMatch && actionMatch[1]) {
          try {
            action = JSON.parse(actionMatch[1]);
            cleanText = rawText.replace(/<<<ACTION:(.*?)>>>/, '').trim();
          } catch (e) {
            console.error('Failed to parse action JSON from model', e);
          }
        }

        return res.json({
          text: cleanText,
          action
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to smart heuristic:', geminiError?.message);
      }
    }

    // Heuristic Smart Fallback if Gemini key is not configured or rate-limited
    const lower = message.toLowerCase();
    let replyText = "Hey! I'm your Campus Copilot. I'm connected to the live campus map. Where do you need to go?";
    let fallbackAction = undefined;

    if (lower.includes('next class') || lower.includes('class') || lower.includes('schedule')) {
      replyText = "Your next class is Cloud Computing & Distributed Systems at 11:00 AM in Lab 3 (Innovation Lab). It's just a 3-minute walk away! 🚶";
      fallbackAction = {
        type: 'show_route',
        payload: { toBuildingId: 'innovation-lab', destinationRoom: 'Lab 3' },
        label: 'Take Me There →'
      };
    } else if (lower.includes('hackathon') || lower.includes('code') || lower.includes('coding')) {
      replyText = "The AI HACKATHON 2026: Agentic Futures is cooking right now in the Innovation Lab (Floor 3)! Over 140 students are building agents. 💻🔥";
      fallbackAction = {
        type: 'focus_building',
        payload: { buildingId: 'innovation-lab' },
        label: 'Open Innovation Lab'
      };
    } else if (lower.includes('food') || lower.includes('canteen') || lower.includes('boba') || lower.includes('coffee') || lower.includes('hungry')) {
      replyText = "The Neon Canteen is packed right now! There's a 50% discount on brown sugar milk tea and fresh woodfired pizza at the mezzanine. 🍕🧋";
      fallbackAction = {
        type: 'focus_building',
        payload: { buildingId: 'canteen' },
        label: 'View Neon Canteen'
      };
    } else if (lower.includes('ai lab') || lower.includes('lab 3') || lower.includes('innovation')) {
      replyText = "Innovation & AI Labs is on the west side of campus. It has the NVIDIA H100 cluster, drone bays, and cloud labs. 🧪";
      fallbackAction = {
        type: 'focus_building',
        payload: { buildingId: 'innovation-lab' },
        label: 'Focus AI Lab'
      };
    } else if (lower.includes('block b') || lower.includes('engineering')) {
      replyText = "Block B is the Engineering Wing on the north-east side of the campus quad. It houses Systems Engineering and Room B204. 🏫";
      fallbackAction = {
        type: 'focus_building',
        payload: { buildingId: 'block-b' },
        label: 'Highlight Block B'
      };
    } else if (lower.includes('auditorium') || lower.includes('keynote') || lower.includes('event') || lower.includes('happening')) {
      replyText = "There are 12 live activities right now! Major keynote 'The Post-Quantum Silicon Era' starts at 2:00 PM in Oppenheimer Hall. 🎤✨";
      fallbackAction = {
        type: 'filter_category',
        payload: { category: 'events' },
        label: 'View All Live Events'
      };
    } else if (lower.includes('sports') || lower.includes('gym') || lower.includes('basketball')) {
      replyText = "The 3v3 Sunset Streetball Showdown starts at 4:30 PM at the Sports Complex Court 1 with live DJ beats! 🏀";
      fallbackAction = {
        type: 'focus_building',
        payload: { buildingId: 'sports-complex' },
        label: 'Go to Sports Complex'
      };
    }

    return res.json({
      text: replyText,
      action: fallbackAction
    });
  } catch (error: any) {
    console.error('Copilot handler error:', error);
    res.status(500).json({ error: 'Internal server error processing Copilot query' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusVerse server running on http://localhost:${PORT}`);
  });
}

startServer();
