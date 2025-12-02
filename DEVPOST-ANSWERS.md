# Devpost Submission Answers - Layers of Static

## How was Kiro used in your project?

Kiro was the primary development partner for Layers of Static, handling everything from initial concept to final implementation. I used a hybrid approach combining vibe coding for rapid iteration, spec-driven development for core features, steering docs for consistent context, and custom MCP servers for persistent memory. The kiro-cli was my primary interface - faster and more flexible than traditional IDEs.

## Vibe Coding

**How did you structure your conversations?**

I structured conversations around incremental feature additions, starting with my vision: "a psychological horror CRT terminal chatbox." Kiro and I iterated in small, focused chunks:

1. "Create the CRT TV housing with authentic 1970s styling"
2. "Add scanline effects and phosphor glow"
3. "Implement the Truth or Dare game with creepy questions"
4. "Add ElevenLabs TTS with a little girl voice"
5. "Make the candles interactive - when lit, the image decays"

Each conversation built on the previous one. I'd test, give feedback ("make the scanlines more subtle"), and Kiro would refine. This iterative loop was incredibly fast with kiro-cli.

**Most impressive code generation:**

The **audio ducking system** in `utils/sound.ts`. I asked: "When TTS speaks, background music should duck down smoothly, then restore when done."

Kiro generated a complete audio management system with:
- Master gain control with Web Audio API
- Smooth volume ramping (200ms transitions)
- Cancellation flags for interrupting speech
- Coordination between 5+ audio sources (music box, piano, static, TTS)
- Proper cleanup to prevent memory leaks

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
      const newVolume = track.volume - (track.volume - targetVolume) / (steps - step + 1);
      track.volume = Math.max(targetVolume, newVolume);
    });
    if (step >= steps) clearInterval(duckInterval);
  }, interval);
};
```

Zero bugs. Worked perfectly on first try. This would have taken me hours to implement and debug manually.

## Agent Hooks

**N/A** - I didn't use custom agent hooks for this project. The built-in Kiro workflows were sufficient for my needs.

## Spec-Driven Development

**How did you structure your spec?**

I created a 3-document spec in `.kiro/specs/static-layers-of-fear/`:

1. **requirements.md** - 9 EARS-compliant requirements with acceptance criteria
2. **design.md** - Component architecture, data flow diagrams, CSS techniques
3. **tasks.md** - 25 atomic tasks with requirement references

Each requirement was traceable:
```
Requirement 2.1: Scanline Effect
→ Design: repeating-linear-gradient with animation
→ Task 2.2: Implement scanline overlay
```

**How did it improve development?**

Spec-driven gave me **clarity and completeness**. When I said "execute task 2.2," Kiro knew exactly:
- What CSS properties to use
- Which file to edit (style.css)
- What the acceptance criteria were
- Why it existed (requirement 2.1)

No ambiguity. No missed features. Every line of code traced back to a requirement.

**Spec vs Vibe Coding:**

I used **both strategically**:

- **Spec-driven** for core features (boot sequence, AI integration, TTS, game logic) - needed structure and traceability
- **Vibe coding** for polish and iteration (visual refinements, new easter eggs, quick fixes) - needed speed and creativity

Spec was slower upfront (writing requirements) but faster overall (no rework). Vibe was perfect for "make it feel creepier" type requests.

## Steering Docs

**How did you leverage steering?**

I created 3 steering docs in `.kiro/steering/`:

1. **product.md** - Vision, aesthetic, tone ("cryptic, poetic, disturbing")
2. **structure.md** - File architecture (where code lives)
3. **tech.md** - Stack constraints (React 18, TypeScript, Vite)

These docs auto-injected into every Kiro conversation, eliminating repetitive context-setting.

**Strategy that made the biggest difference:**

**Defining the aesthetic upfront**. In product.md:
```markdown
## Design Philosophy
- Visual: CRT effects (scanlines, phosphor glow, chromatic aberration)
- Color Palette: Deep purple/black, phosphor green/purple, blood-red errors
- Tone: Cryptic, poetic, disturbing - unsettling but not explicit
```

This meant when I asked for "error messages," Kiro suggested:
```
"CONNECTION LOST IN THE STATIC"
```

Instead of generic "Error 404." The horror aesthetic was baked into every response. Steering docs saved me **5+ hours** of repeating "remember, we're building a horror experience" in every conversation.

## MCP (Model Context Protocol)

**How did extending Kiro's capabilities help?**

I used **custom MCP servers** that transformed Kiro from stateless to stateful:

1. **Custom RAG Server** - Your SOTA retrieval system for managing large codebases
2. **Memory Server** - `list_all_memories` for persistent context across sessions

**Workflow improvements:**

**Multi-session development without context loss**. On Day 1, I told Kiro: "We're using React with TypeScript, ElevenLabs for TTS, Gemini for AI."

On Day 2, after closing and reopening kiro-cli, Kiro **remembered everything**. No "remember we're using React" needed. The memory MCP persisted decisions across sessions.

**RAG for efficient context**: When working with large files (App.tsx, Screen.tsx), the RAG MCP let Kiro query specific sections without loading entire files into context. This kept responses fast and accurate.

**What would have been difficult without MCP:**

- **Context repetition**: I'd waste 10-15 minutes every session re-explaining the stack, aesthetic, and architecture
- **Token limits**: Loading full files would hit context limits quickly
- **Inconsistency**: Without persistent memory, Kiro might suggest solutions that contradict earlier decisions

MCP made multi-day development feel like a single continuous conversation. That's the killer feature.

## Kiro CLI vs IDE

**Why I preferred kiro-cli:**

- **Speed**: Instant responses, no UI overhead
- **Flexibility**: Pipe commands, script workflows, integrate with terminal tools
- **Focus**: Terminal-first workflow matches my development style
- **Efficiency**: Type fast, iterate fast, ship fast

The CLI felt like pair programming with a senior dev who never forgets context and types at 1000 WPM.

---

## Summary

Kiro wasn't just a code generator - it was a **development partner** that:
- Understood my vision through steering docs
- Maintained context across days through MCP
- Executed structured plans through specs
- Iterated rapidly through vibe coding
- Generated production-quality code (audio system, game logic, TTS integration)

The result: A polished horror experience built in ~8 hours that would have taken days manually.
