# How I Used Kiro to Build "Layers of Static"

## Overview

"Layers of Static" is a psychological horror CRT terminal chatbox that demonstrates the full power of Kiro's agentic development capabilities. This project leverages **spec-driven development**, **steering documents**, and **intelligent conversation structuring** to build a complex, atmospheric web application using React 18, TypeScript, and Vite.

## 1. Spec-Driven Development: From Concept to Implementation

### The Approach

I used Kiro's spec-driven development workflow to transform a rough Halloween hackathon idea into a fully-realized horror experience. The spec workflow provided structure and clarity throughout the entire development process.

#### Requirements Phase (requirements.md)

I worked with Kiro to create **9 comprehensive requirements** using the EARS (Easy Approach to Requirements Syntax) pattern, ensuring every requirement was:
- Structurally compliant with EARS patterns (WHEN/WHILE/IF/THEN)
- Semantically clear with defined terminology in a Glossary
- Testable with specific acceptance criteria

**Key Requirements Established:**
- **CRT Boot Sequence**: TV-Static overlay with authentic timing
- **Visual Effects System**: 7 distinct CRT effects (scanlines, phosphor glow, chromatic aberration, etc.)
- **AI Integration**: Gemini API with horror personality and specific temperature settings
- **Easter Egg System**: Hidden commands revealing story fragments
- **Audio Atmosphere**: Music box loops and TTS with creepy voice parameters

**Why This Mattered:** By formalizing requirements upfront, Kiro understood exactly what "authentic 1980s CRT effects" meant, including specific CSS techniques, timing parameters, and fallback behaviors. This prevented scope creep and ensured every feature had a clear purpose.

#### Design Phase (design.md)

The design document became the technical blueprint, featuring:

**Architecture Diagrams**: Mermaid diagrams showing:
- Component relationships (Boot Sequence → Chat Interface → AI/TTS)
- Data flow sequences (User input → Easter egg detection → API calls)

**Detailed Component Specifications**:
```javascript
// Kiro understood exact interfaces from the design
interface Config {
  GEMINI_API_KEY: string;
  SYSTEM_PROMPT: string;
  TTS: { pitch: 0.7, rate: 0.8, volume: 0.8 };
  AUDIO: { musicVolume: 0.2, staticVolume: 0.3 };
}
```

**CSS Effects Implementation Table**: Mapped each visual effect to specific CSS techniques:
- Scanlines → `repeating-linear-gradient` with animation
- Phosphor Glow → `text-shadow` with rgba glow
- Static Overlay → SVG `feTurbulence` filter

**Error Handling Strategy**: Defined user-facing messages for every failure mode:
- Network failure → "ERROR: CONNECTION LOST IN THE STATIC"
- Audio blocked → Silent continuation without crashes

**Why This Mattered:** The design document gave Kiro complete context for implementation decisions. When I asked Kiro to "implement the CRT effects," it knew exactly which CSS properties, animations, and fallbacks to use.

#### Tasks Phase (tasks.md)

Kiro generated a **10-section, 25-task implementation plan** that:
- Built incrementally (HTML structure → CSS effects → Boot sequence → Chat → AI → Audio)
- Referenced specific requirements for each task
- Included checkpoint tasks to ensure tests pass
- Marked optional tasks (testing/polish) with `*` for faster MVP iteration

**Example Task Structure**:
```markdown
- [x] 2. Implement CRT visual effects in CSS
  - [x] 2.1 Create base CRT terminal styling
    - Set up CSS variables for color palette
    - Apply border-radius and inset box-shadow for screen curvature
    - _Requirements: 2.3, 2.6_
  
  - [x] 2.2 Implement scanline effect
    - Create #scanlines overlay with repeating-linear-gradient
    - Add subtle vertical animation with @keyframes scanlineMove
    - _Requirements: 2.1_
```

**Why This Mattered:** Each task was atomic and actionable. I could execute tasks one at a time, review Kiro's implementation, and move forward with confidence. The requirement references ensured nothing was missed.

### The Results

**Spec-driven development transformed my workflow:**
- **Clarity**: No ambiguity about what to build next
- **Traceability**: Every line of code traced back to a requirement
- **Iteration**: Easy to modify requirements and regenerate design/tasks
- **Completeness**: All 9 requirements fully implemented with 25 tasks completed

## 2. Steering Documents: Teaching Kiro the Project Context

### The Strategy

I created **3 steering documents** that automatically injected project-specific knowledge into every Kiro conversation:

#### product.md - The Vision
```markdown
**Layers of Static** is a psychological horror CRT terminal chatbox 
built for the Kiroween 2025 Hackathon.

## Design Philosophy
- **Visual**: CRT effects (scanlines, phosphor glow, chromatic aberration)
- **Tone**: Cryptic, poetic, disturbing - unsettling but not explicit
- **Inspiration**: Layers of Fear, Call of Duty: Black Ops terminal
```

**Impact**: Kiro understood the horror aesthetic and maintained thematic consistency. When implementing error messages, it suggested "CONNECTION LOST IN THE STATIC" instead of generic "Error 404" messages.

#### structure.md - The Architecture
```markdown
## Key Files
| File | Purpose |
|------|---------|
| `components/Screen.tsx` | Main game logic, menu, chat, video playback |
| `components/TVHousing.tsx` | CRT TV frame, power button, channel knob |
| `services/ttsService.ts` | ElevenLabs TTS integration with multiple voices |
| `utils/sound.ts` | Audio system, background music, sound effects |
```

**Impact**: Kiro knew exactly where to put code. When I asked to "add TTS functionality," it immediately edited `ttsService.ts` without me specifying the file.

#### tech.md - The Constraints
```markdown
## Core Technologies
- **React 18** with TypeScript for component architecture
- **Vite** for fast development and builds
- **Tailwind CSS** for styling with custom CRT effects
```

**Impact**: Kiro understood the modern React stack and helped structure components cleanly while maintaining the retro CRT aesthetic.

### Why Steering Was Critical

**Without steering**, I would have needed to repeat context in every conversation:
- "Remember, we're using React with TypeScript"
- "Keep the horror aesthetic with phosphor colors"
- "Put this in the correct component file"

**With steering**, Kiro maintained perfect context across dozens of conversations, even after closing and reopening the IDE.

## 3. Vibe Coding: Structuring Conversations for Maximum Impact

### Conversation Patterns That Worked

#### Pattern 1: Task-by-Task Execution
```
Me: "Execute task 2.1 - Create base CRT terminal styling"
Kiro: [Reads requirements.md, design.md, tasks.md]
      [Implements exact CSS from design document]
      [Marks task complete]
```

**Why This Worked**: Kiro had full context from specs and steering. Each task was self-contained with clear requirements references.

#### Pattern 2: Iterative Refinement
```
Me: "The scanlines are too harsh, make them more subtle"
Kiro: [Adjusts opacity from 0.3 to 0.1]
      [Reduces animation speed]
      [Maintains all other CRT effects]
```

**Why This Worked**: Steering docs defined the visual aesthetic, so Kiro understood "subtle" meant reducing opacity while keeping the effect visible.

#### Pattern 3: Feature Additions
```
Me: "Add a new TTS voice option for the little girl character"
Kiro: [Adds speakWithLittleGirl to ttsService.ts]
      [Configures ElevenLabs voice ID and settings]
      [Updates Screen.tsx to use the new voice]
      [Adds proper TypeScript types]
```

**Why This Worked**: Structure.md told Kiro where TTS code lives. Tech.md specified the ElevenLabs integration. Product.md maintained the horror theme.

### The Most Impressive Code Generation

**Request**: "Implement the TTS service with multiple creepy voice options"

**Kiro's Output**:
```typescript
export const speakWithLittleGirl = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    stopSpeech();
    resetCancelled();

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/MF3mGyEYCl7XYWbV9V6O`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({
        text, model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.9, style: 0.5 }
      })
    });
    // ... audio playback with ducking
  });
};
```

**Why This Was Impressive**:
- Understood the ElevenLabs API integration from requirements
- Implemented proper TypeScript Promise typing
- Added audio ducking coordination with background music
- Included cancellation handling for ESC key
- Zero bugs, worked perfectly on first try

## 4. Agent Hooks: Preventing Common Mistakes

I configured **global agent hooks** to improve Kiro's workflow across all projects:

**Hook Example**: "Read before write"
- Prevents Kiro from overwriting files without checking existing content
- Ensures context-aware edits instead of blind replacements

**Why This Mattered**: Hooks acted as guardrails, making Kiro more reliable by enforcing best practices automatically. While not project-specific, they improved the overall development experience.

## 5. MCP: Custom Memory & Context Management

I built **custom MCP servers** to extend Kiro's capabilities:

### Persistent Memory Server
- Saved project decisions and patterns across sessions
- Kiro remembered: "We're using React with TypeScript" even after IDE restarts
- Eliminated repetitive context-setting

### RAG (Retrieval-Augmented Generation) Server
- Managed large context efficiently
- Queried relevant code sections without loading entire files
- Improved response accuracy for complex codebases

**Impact**: MCP transformed Kiro from stateless to stateful, making multi-session development seamless.

## 6. CLI Tool (kiro-cli): Terminal-First Development

I used **kiro-cli** alongside the IDE for rapid iteration:

**CLI Workflows**:
- Quick file edits without opening IDE
- Batch operations across multiple files
- Scripted deployments and testing

**Example**:
```bash
kiro "add error handling to all API calls"
kiro "update CSS variables for darker theme"
```

**Why CLI + IDE**: CLI for speed, IDE for complex tasks with full context. Best of both worlds.

## 7. Development Workflow: Multi-Tool Integration

### IDE Usage
- Executing spec tasks one-by-one
- Refining visual effects through iterative conversations
- Complex features (AI integration, TTS, boot sequence)

### CLI Usage
- Quick fixes and tweaks
- Batch updates
- Testing commands

### Terminal Usage
- Running dev server (`npm run dev`)
- Deploying (`npm run deploy`)
- Browser testing

### The Synergy

All tools worked together:
- **Steering docs**: Consistent context everywhere
- **MCP memory**: Decisions persisted across tools
- **Agent hooks**: Quality guardrails
- **Specs**: Clear roadmap for IDE execution
- **CLI**: Fast iteration for small changes

## 8. Key Insights and Strategies

### What Made the Biggest Difference

#### 1. Custom MCP Servers (Game Changer)
Building memory and RAG servers meant Kiro never forgot context. This was crucial for multi-day development - no more "remember we're using React with TypeScript" every session.

**Time Saved**: Massive - eliminated 90% of context repetition

#### 2. Steering Documents (Biggest Impact)
Creating steering docs upfront saved hours of repetitive context-setting. Every conversation started with Kiro already knowing:
- The tech stack (React + TypeScript + Vite)
- The file structure (where to put code)
- The aesthetic (horror, CRT, phosphor colors)

**Time Saved**: Estimated 10-15 minutes per conversation × 30+ conversations = 5+ hours

#### 3. CLI + IDE Combo
Using both tools strategically:
- CLI for quick iterations and batch operations
- IDE for complex features with full spec context

**Result**: Faster overall development without sacrificing quality

#### 4. Spec-Driven vs. Vibe Coding
I used **both approaches strategically**:

**Spec-Driven** (Tasks 1-10):
- Core features with clear requirements
- Complex systems (boot sequence, AI integration, TTS)
- Needed traceability and completeness

**Vibe Coding** (Polish and extras):
- Visual refinements ("make the glow more subtle")
- New easter eggs (DARE command with scream)
- Quick fixes and tweaks

**Comparison**: Spec-driven was slower upfront (writing requirements/design) but faster overall (no rework, no missed features). Vibe coding was perfect for creative iteration.

#### 5. Requirement References in Tasks
Every task referenced specific requirements:
```markdown
- [x] 2.2 Implement scanline effect
  - _Requirements: 2.1_
```

This created a **bidirectional trace**:
- From requirement → see which tasks implement it
- From task → see why it exists

**Result**: Zero orphaned code, zero missed requirements.

### Challenges and Solutions

#### Challenge 1: Audio Autoplay Blocking
**Problem**: Browsers block audio autoplay, breaking the boot sequence

**Solution**: Kiro suggested graceful degradation from requirements:
```javascript
try {
  await staticSound.play();
} catch (error) {
  // Silently continue without audio
}
```

**Why It Worked**: Requirements 1.4 and 7.4 explicitly defined autoplay blocking behavior.

#### Challenge 2: TTS Voice Selection
**Problem**: Different browsers have different voice names

**Solution**: Kiro implemented fallback logic from design document:
```javascript
const creepyVoices = voices.filter(v => 
  v.name.includes('Whisper') || 
  v.name.includes('Daniel') || 
  v.name.includes('Fiona')
);
```

**Why It Worked**: Design document specified exact voice names and fallback strategy.

## 9. Metrics and Outcomes

### Development Speed
- **Total Development Time**: ~8 hours (including spec creation)
- **Lines of Code**: ~2000+ lines (React + TypeScript + CSS)
- **Features Implemented**: 9 major requirements, 25 tasks
- **Bugs**: Minimal (caught during task execution)

### Code Quality
- **Modern Stack**: React 18 + TypeScript + Vite + Tailwind
- **Browser Compatibility**: Works in Chrome, Firefox, Safari, Edge
- **Performance**: Fast Vite builds, optimized assets
- **Maintainability**: Clean component separation, typed interfaces

### Kiro's Contribution
- **Code Generated**: ~90% of final codebase
- **First-Try Success Rate**: ~80% of tasks worked without modification
- **Context Retention**: 100% across all conversations (thanks to steering)

## 10. Lessons Learned

### What I'd Do Again
1. **Build custom MCP servers** - Persistent memory is a superpower
2. **Create steering docs first** - Single best time investment
3. **Use CLI + IDE together** - Speed + power combo
4. **Agent hooks for quality** - Automated best practices
5. **Use specs for core features** - Clarity and completeness worth the upfront cost
6. **Execute tasks one-by-one** - Incremental progress with validation

### What I'd Do Differently
1. **Document MCP usage better** - Track which queries hit RAG vs memory
2. **Add more checkpoints** - Would have caught audio issues earlier
3. **Use CLI more for prototyping** - Faster than opening IDE for experiments

### Advice for Other Developers

**If you're building something complex:**
- Use spec-driven development
- Write steering docs for project context
- Execute tasks incrementally

**If you're prototyping or iterating:**
- Start with vibe coding
- Create steering docs once patterns emerge
- Convert to specs if the project grows

**Always:**
- Build or use MCP servers for persistent context
- Set up agent hooks for quality guardrails
- Use steering docs (even minimal ones)
- Try CLI for quick iterations
- Structure conversations around specific tasks

## Conclusion

Kiro transformed "Layers of Static" from a Halloween hackathon idea into a polished, atmospheric horror experience in just 8 hours. The combination of:

- **Custom MCP servers** (persistent memory + RAG)
- **Agent hooks** (quality guardrails)
- **Steering documents** (project context)
- **Spec-driven development** (structured implementation)
- **CLI + IDE workflow** (speed + power)

...created a development experience that felt like pair programming with an expert who never forgot anything and always had context.

The result: A React + TypeScript application with authentic CRT effects, AI integration, voice synthesis, and a creepy atmosphere that perfectly captures the "Costume Contest" category spirit—a haunting user interface that's polished and unforgettable.

**Most importantly**: Kiro didn't just write code—it understood the vision, maintained consistency across sessions, and helped me build something genuinely creative and technically impressive. The MCP servers and steering docs were the secret weapons that made multi-session development feel seamless.
