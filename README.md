<div align="center">

```
     ╭─────────────────────────────────╮
     │                                 │
     │        ◢■■■■■■■■■■■■■◣           │
     │      ◢■■■■■■■■■■■■■■■■◣         │
     │     ◢■■■■■■■■■■■■■■■■■■◣        │
     │    ◢■■■■■■■  ◉  ■■■■■■■◣       │
     │    ■■■■■■■■     ■■■■■■■■       │
     │    ■■■■■■■■     ■■■■■■■■       │
     │    ◥■■■■■■■■■■■■■■■■■■◤        │
     │      ◥■■■■■■■■■■■■■■◤          │
     │         ◥■■■■■■■■◤             │
     │            ▼                    │
     │                                 │
     ╰─────────────────────────────────╯
```

# LocalLife AI

### Street Food & Slang Intelligence Platform

*Navigate Indian cities like a local. Powered by Gemini AI.*

[![React](https://img.shields.io/badge/React-19.2.3-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)](https://vitejs.dev)
[![Gemini](https://img.shields.io/badge/Gemini-API-4285f4?logo=google)](https://ai.google.dev)

</div>

---

## 🎯 What is LocalLife AI?

LocalLife AI is a privacy-first, context-aware AI assistant designed to help users navigate the streets of India like a seasoned local. By leveraging the Gemini API and rich local context files, it provides authentic intelligence that skips the tourist brochures.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏙️ **Context-Aware Personas** | 35+ Indian cities, each with a dedicated 15+ year resident persona |
| 🍜 **Street Food Intelligence** | Real-time recommendations with Google Maps grounding for locations, timings, and hygiene |
| 💬 **Slang Translator** | Deciphers local dialects with social context (elders vs. friends) |
| 🎤 **Voice-First Experience** | Low-latency real-time conversations using Gemini Live API |
| 🔒 **Privacy-First Storage** | All data stored exclusively on-device via IndexedDB |
| 🖼️ **Visual Postcards** | AI-generated photorealistic images of city landmarks and food |

## 🛠️ Tech Stack

```
Frontend    │ React 19.2.3 + TypeScript 5.8.2 + Tailwind CSS
Build       │ Vite 6.2.0
AI Engine   │ Gemini 3 Flash (Text) + Gemini 2.5 Flash (Voice/Image/Maps)
Grounding   │ Google Search + Google Maps Integration
Storage     │ IndexedDB (Client-side persistence)
Deployment  │ Stateless edge-optimized
```

## � Quicpk Start

### Prerequisites

- Node.js (v18 or higher)
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd locallife-ai

# Install dependencies
npm install

# Create environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🧠 Intelligence Philosophy

The core of LocalLife AI is **Agent Steering**. Instead of generic LLM responses, we inject custom city contexts that force the AI to:

- ✅ **Be opinionated** – Real locals have favorite spots and places they avoid
- ✅ **Use regional vocabulary** – Natural slang with explanations when needed
- ✅ **Prioritize practical safety** – Hygiene, social etiquette over encyclopedic facts
- ✅ **Provide specific locations** – Trigger Google Maps grounding for navigation

### Four Intelligence Modes

| Mode | Purpose | Model Used |
|------|---------|------------|
| 🍜 **FOOD** | Street food recommendations with specific stalls and timings | Gemini 2.5 Flash (Maps) |
| 💬 **SLANG** | Cultural translation with usage nuances | Gemini 3 Flash |
| 🚗 **TRAFFIC** | Local traffic intelligence with shortcuts and bottlenecks | Gemini 2.5 Flash (Maps) |
| 🏛️ **CULTURE** | City traditions, etiquette, and unwritten rules | Gemini 3 Flash |

## 🗺️ Supported Cities

35+ Indian cities including Chennai, Mumbai, Delhi, Bangalore, Kolkata, Hyderabad, Pune, Jaipur, Kochi, Goa, and many more. Each city has a unique persona with local knowledge and dialect.
