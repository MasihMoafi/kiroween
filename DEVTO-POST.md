---
title: Building a Horror Game in 8 Hours with Kiro AI - My Kiroween Hackathon Journey
published: false
description: How I used Kiro's CLI, MCP servers, and spec-driven development to build a psychological horror CRT terminal in record time
tags: ai, hackathon, webdev, gamedev
cover_image: https://github.com/MasihMoafi/kiroween/raw/main/public/image.png
---

# Building a Horror Game in 8 Hours with Kiro AI

For the Kiroween 2025 hackathon, I built **Layers of Static** - a psychological horror experience disguised as a vintage 1970s CRT television. The twist? An AI lives inside it, asking disturbing questions and giving creepy dares.

The real story isn't what I built. It's **how** I built it.

## The Challenge: Frankenstein Category

The hackathon's "Frankenstein" category challenged us to stitch together incompatible technologies into something unexpectedly powerful. My chimera:

- **1970s CRT aesthetics** (scanlines, phosphor glow, chromatic aberration)
- **Modern AI** (Google Gemini for conversation)
- **Voice synthesis** (ElevenLabs TTS with a little girl's voice)
- **Web Audio API** (music box loops, audio ducking, sound effects)

Normally, this would take weeks. With Kiro, I shipped in 8 hours.

## What is Kiro?

Kiro is an AI-powered development environment that goes beyond code generation. It's a **development partner** with:

- **Spec-driven development** - Turn requirements into structured implementation plans
- **Steering docs** - Inject project context into every conversation
- **MCP (Model Context Protocol)** - Extend capabilities with custom servers
- **CLI-first workflow** - Terminal-native for speed and flexibility

Think "GitHub Copilot meets project manager meets senior dev who never forgets context."

## My Workflow: Hybrid Approach

I used four Kiro features strategically:

### 1. Steering Docs: Never Repeat Context

I created three markdown files in `.kiro/steering/`:

**product.md** - The vision:
```markdown
## Design Philosophy
- Visual: CRT effects (scanlines, phosphor glow, chromatic aberration)
- Tone: Cryptic, poetic, disturbing - unsettling but not explicit
- Inspiration: Layers of Fear, Call of Duty: Black Ops terminal
```

**structure.md** - Where code lives:
```markdown
| File | Purpose |
|------|---------|
| components/Screen.tsx | Game logic, menu, chat |
| services/ttsService.ts | ElevenLabs TTS integration |
| utils/sound.ts | Audio system, ducking, effects |
```

**tech.md** - Stack constraints:
```markdown
- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS + custom CRT effects
```

These docs auto-injected into **every conversation**. No more "remember, we're building a horror game" every session.

**Time saved**: ~5 hours of repetitive context-setting.

### 2. MCP: Persistent Memory Across Sessions

I used custom MCP servers:

- **Memory Server** - Persisted decisions across days
- **RAG Server** - Queried large files without loading full context

On Day 1: "We're using ElevenLabs for TTS with a creepy little girl voice."

On Day 2 (after closing/reopening): Kiro **remembered**. No re-explaining needed.

This transformed Kiro from stateless to stateful. Multi-day development felt like a single continuous conversation.

### 3. Spec-Driven Development: Structure for Core Features

For complex features, I created a spec in `.kiro/specs/`:

**requirements.md** - 9 EARS-compliant requirements:
```
REQ-2.1: WHEN the terminal is visible, 
         the system SHALL display animated scanlines
         with 0.1 opacity and 2px spacing
```

**design.md** - Technical blueprint:
```markdown
## Scanline Implementation
- CSS: repeating-linear-gradient
- Animation: vertical scroll at 10s duration
- Fallback: Static scanlines if animation disabled
```

**tasks.md** - 25 atomic tasks:
```markdown
- [x] 2.2 Implement scanline effect
  - Create #scanlines overlay
  - Add vertical animation
  - Requirements: 2.1
```

When I said "execute task 2.2," Kiro knew:
- What to build (scanlines)
- How to build it (repeating-linear-gradient)
- Where to put it (style.css)
- Why it exists (requirement 2.1)

**Result**: Zero missed features. Every line of code traced back to a requirement.

### 4. Vibe Coding: Speed for Iteration

For polish and refinements, I ditched specs and just talked:

- "Make the scanlines more subtle"
- "Add a scream sound effect when the player types DARE"
- "The candles should flicker more realistically"

Kiro understood the aesthetic (from steering docs) and iterated instantly.

**Spec vs Vibe**: I used specs for core features (needed structure), vibe for polish (needed speed).

## The Most Impressive Code Generation

I asked: "When TTS speaks, background music should duck down smoothly, then restore when done."

Kiro generated a complete audio management system in `utils/sound.ts`:

```typescript
const duck = () => {
  if (muted) return;
  ducking = true;
  const targetVolume = masterVolume * DUCK_VOLUME;
  const steps = 10;
  const interval = DUCK_DURATION / steps;
  let step = 0;
  
  duckInterval = setInterval(() => {
    step++;
    activeTracks.forEach(track => {
      const newVolume = track.volume - 
        (track.volume - targetVolume) / (steps - step + 1);
      track.volume = Math.max(targetVolume, newVolume);
    });
    if (step >= steps) clearInterval(duckInterval);
  }, interval);
};
```

This handled:
- Smooth volume ramping (200ms transitions)
- Coordination between 5+ audio sources
- Cancellation flags for interrupting speech
- Proper cleanup to prevent memory leaks

**Zero bugs. Worked perfectly on first try.**

This would have taken me hours to implement and debug manually. Kiro did it in seconds.

## Why Kiro CLI > IDE

I used `kiro-cli` instead of the IDE for 90% of development:

**Speed**: Instant responses, no UI overhead
```bash
kiro "add error handling to TTS service"
kiro "make the glow effect more subtle"
```

**Flexibility**: Pipe commands, script workflows
```bash
kiro "list all TODO comments" | grep URGENT
```

**Focus**: Terminal-first matches my workflow. No context switching.

The CLI felt like pair programming with a senior dev who types at 1000 WPM and never forgets context.

## The Results

**Development time**: ~8 hours (including spec creation)
**Lines of code**: 2000+ (React + TypeScript + CSS)
**Features**: 3 game modes, AI integration, voice synthesis, audio system
**Bugs**: Minimal (caught during task execution)

**Kiro's contribution**:
- ~90% of final codebase
- 80% first-try success rate
- 100% context retention across sessions

## Key Insights

### 1. MCP is the Killer Feature

Custom MCP servers transformed Kiro from "smart autocomplete" to "development partner with memory." Multi-day projects became seamless.

### 2. Steering Docs Save Hours

Writing 3 markdown files upfront saved 5+ hours of repetitive context-setting. Best time investment of the project.

### 3. Hybrid Approach Works Best

- **Specs** for core features (structure, traceability)
- **Vibe** for iteration (speed, creativity)
- **Steering** for consistency (context, aesthetic)
- **MCP** for persistence (memory, efficiency)

### 4. CLI is Underrated

The terminal interface is faster and more flexible than GUI IDEs. If you're comfortable in the terminal, try `kiro-cli`.

## Try It Yourself

**Live demo**: [layers-of-static.vercel.app](https://layers-of-static.vercel.app)  
**Source code**: [github.com/MasihMoafi/kiroween](https://github.com/MasihMoafi/kiroween)

**Warning**: Turn on your speakers. Light the candles. Don't play alone.

## Lessons for Your Next Project

1. **Write steering docs first** - 30 minutes upfront saves hours later
2. **Use specs for complex features** - Clarity beats speed for core systems
3. **Vibe code for polish** - Iteration is faster without formal structure
4. **Build/use MCP servers** - Persistent context is a superpower
5. **Try the CLI** - Terminal-first development is surprisingly efficient

## Final Thoughts

Kiro didn't just generate code. It understood my vision, maintained context across days, executed structured plans, and iterated rapidly.

The result: A polished horror experience that would have taken weeks manually, shipped in 8 hours.

That's not automation. That's **augmentation**.

---

**What's your experience with AI-assisted development? Have you tried Kiro or similar tools? Drop your thoughts in the comments!**

---

*This project was built for the Kiroween 2025 hackathon. Check out other submissions at [devpost.com/kiroween](https://devpost.com/kiroween)*
