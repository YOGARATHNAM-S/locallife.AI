# Tech Stack & Build System

## Core Technologies

- **Frontend Framework**: React 19.2.3 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (mobile-first approach)
- **AI Engine**: 
  - Gemini 3 Flash (text responses)
  - Gemini 2.5 Flash (voice, image, and Maps grounding)
  - Google Search Integration for real-time grounding
- **Storage**: IndexedDB for client-side persistence (chat history, user preferences)
- **Deployment**: Optimized for stateless edge deployment

## Key Dependencies

```json
{
  "react": "^19.2.3",
  "@google/genai": "^1.34.0",
  "react-dom": "^19.2.3"
}
```

## Environment Variables

- `GEMINI_API_KEY`: Required API key from Google AI Studio
- Accessed in code via `process.env.API_KEY` (Vite transforms this)

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## TypeScript Configuration

- Target: ES2022
- Module: ESNext with bundler resolution
- JSX: react-jsx
- Path alias: `@/*` maps to project root
- Experimental decorators enabled

## Vite Configuration

- Dev server: Port 3000, host 0.0.0.0
- Path alias: `@` resolves to project root
- Environment variables injected at build time via `define`
- React plugin for Fast Refresh

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   App.tsx    │  │ Components   │  │ VoiceOverlay │      │
│  │ (City/Mode)  │──│ ChatInterface│  │   (Voice)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                  ┌─────────┴─────────┐                      │
│                  │                   │                       │
│           ┌──────▼──────┐     ┌─────▼──────┐               │
│           │  db.ts      │     │ gemini.ts  │               │
│           │ (IndexedDB) │     │ (AI API)   │               │
│           └─────────────┘     └────────────┘               │
│                  │                   │                       │
└──────────────────┼───────────────────┼───────────────────────┘
                   │                   │
                   ▼                   ▼
            ┌─────────────┐    ┌──────────────────┐
            │  IndexedDB  │    │   Gemini API     │
            │  (Browser)  │    │ - Text (3 Flash) │
            │             │    │ - Voice (2.5)    │
            │ - Messages  │    │ - Image (2.5)    │
            │ - Settings  │    │ - Maps Grounding │
            └─────────────┘    │ - Search Ground  │
                               └──────────────────┘
```

### Data Flow

1. **User Input** → Component State
2. **State Change** → IndexedDB (persistence)
3. **Message Send** → Gemini API (with city context)
4. **AI Response** → IndexedDB → Component State → UI Update
5. **Voice Mode** → Real-time bidirectional streaming with Gemini Live API

### Key Architectural Principles

- **Client-Side Only**: No backend server, fully stateless deployment
- **Privacy-First**: All data stays in browser's IndexedDB
- **Context Injection**: City personas injected as system instructions
- **Progressive Enhancement**: Text chat works without voice permissions
- **Mobile-First**: Responsive design optimized for mobile devices

## API Integration Notes

- Always initialize GoogleGenAI client with `process.env.API_KEY` directly
- Maps grounding only supported in Gemini 2.5 series models
- Use `gemini-2.5-flash` for FOOD and TRAFFIC modes (Maps grounding)
- Use `gemini-3-flash-preview` for SLANG and CULTURE modes
- Request user geolocation for enhanced Maps grounding when available
