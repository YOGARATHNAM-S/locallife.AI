# Project Structure & Organization

## Root Files

- `index.html`: Entry HTML file
- `index.tsx`: React app entry point, renders App component
- `App.tsx`: Main application component with city/mode selection and voice overlay
- `types.ts`: TypeScript type definitions (enums, interfaces)
- `vite.config.ts`: Vite build configuration
- `tsconfig.json`: TypeScript compiler configuration
- `.env.local`: Local environment variables (not committed)

## Folder Structure

```
/components          # React UI components
  ChatInterface.tsx  # Main chat UI with message history
  Layout.tsx         # App layout wrapper with theme support
  Logo.tsx           # Brand logo component
  VoiceOverlay.tsx   # Voice conversation overlay

/services            # Business logic and external integrations
  gemini.ts          # Gemini API integration (text, voice, image)
  db.ts              # IndexedDB wrapper for local storage

/data                # Static data and configurations
  cityContexts.ts    # City-specific personas and context (35+ cities)
```

## Architecture Patterns

### Component Organization

- **Functional components** with React hooks (useState, useEffect, useRef)
- **Props interfaces** defined inline at component level
- **Type safety** enforced throughout with TypeScript

### State Management

- Local component state with useState
- Persistent state via IndexedDB (city, mode, theme, chat history)
- No global state management library (Redux, Zustand) - kept simple

### Data Flow

1. User selects city/mode → saved to IndexedDB
2. User sends message → saved to IndexedDB → sent to Gemini API
3. AI response → saved to IndexedDB → displayed in chat
4. History loaded from IndexedDB on component mount

### Styling Conventions

- **Tailwind CSS** utility classes throughout
- **Dark mode** support via `dark:` prefix (toggled on `<html>` element)
- **Mobile-first** responsive design
- **Custom animations** using Tailwind's animate utilities
- **Design system**: Indigo primary color, slate neutrals

### Service Layer

- `gemini.ts`: All AI interactions (text generation, image generation, voice)
- `db.ts`: All IndexedDB operations (messages, settings)
- Services are pure functions, no class-based architecture

### Type Definitions

- `AppMode`: FOOD, SLANG, TRAFFIC, CULTURE
- `City`: 35+ Indian cities as enum
- `ChatMessage`: Message structure with role, content, timestamp, city, mode
- `CityContext`: City persona with greeting, voice, and context string

## Naming Conventions

- **Components**: PascalCase (e.g., `ChatInterface.tsx`)
- **Services**: camelCase files (e.g., `gemini.ts`)
- **Functions**: camelCase (e.g., `generateLocalResponse`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CITY_CONTEXTS`)
- **Types/Interfaces**: PascalCase (e.g., `ChatMessage`)

## Key Design Decisions

- **No routing**: Single-page app with conditional rendering
- **No external UI library**: Custom components with Tailwind
- **Client-side only**: No backend server, all data stored locally
- **API key in environment**: Never hardcoded, injected at build time
