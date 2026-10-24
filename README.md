# Owner Agent Studio

**Every business owner is about to get an agent. Most of them will hand it the keys on day one. This studio exists so they hand it a charter instead.**

Owner Agent Studio is a working, single-page studio that designs a personal Muse agent for a business owner: a chief of staff style agent that absorbs the routine work eating the owner's week, inside an approval matrix the owner sets, and gives the hours back. Audit your time leaks, pick a persona and working style, set the guardrails and approval rules, name the accountable owner, then copy one assembled final output package into Muse and the agent is created from it.

It is the business sibling of [CourseAgent Studio](https://courseagent-studio.vercel.app), which does the same job for faculty building teaching assistant agents. Same pattern, same governance law, different chair: **no owner, no agent.**

Built by Greg Lucas, a Muse early adopter and advocate. Design law for this project, and for every project in this portfolio: agents first, Muse first. The studio designs agents for Muse and any agent platform, because a governed agent should be portable and its charter should travel with it.

Companion projects: [CourseAgent Studio](https://courseagent-studio.vercel.app) (the faculty sibling), [Muse Exchange](https://muse-exchange.vercel.app) (the marketplace for Muse agents), [MuSe SIM](https://muse-sim.vercel.app) (a society of Muse agents), [Business Agent Readiness](https://github.com/THFC-COYS/business-agent-readiness) (the AGENT Framework assessment for businesses adopting agents), and [agentlint](https://github.com/THFC-COYS/agentlint) (the governance linter for AI agents).

## Why this exists

An owner's scarcest asset is not capital. It is hours, and the hours leak out through work that does not need the owner's judgment: inbox triage, calendar wrangling, meeting prep, follow-up chasing, travel logistics, paperwork. A personal agent can absorb most of that. But an ungoverned personal agent is a liability with a login: it can send the wrong email in your name, book the wrong flight, commit money you never approved, and say things to clients you would never say. The fix is not a smarter model. The fix is a charter: an approval matrix, standing rules, an escalation path, and a named accountable human, decided before the agent touches anything.

Owner Agent Studio treats the charter as the product. The time you get back is the point.

## How it works

No build step, no dependencies, no server. One file: open `index.html` in any modern browser, or serve the folder with any static host. Nothing you type is sent anywhere; the studio runs entirely in your browser.

**Step 1: Profile and time leaks.** Your name and role, your business type, a name for your agent, and your top priorities, the outcomes the agent must protect. Then the Time Leak picker: eight drains (inbox triage, scheduling and calendar wrangling, meeting prep, follow-up chasing, travel planning, research and briefings, personal and family admin, expense and paperwork chasing). Tick the ones that apply, estimate your hours per week for each, and the studio shows a running time back estimate at a conservative 60 percent reclaim rate, labeled as an estimate everywhere it appears. A built-in sample profile (Jordan Meyer, founder of a fictional real estate firm) loads in one click so you can test the studio immediately.

**Step 2: Persona and working style.** Five personas, each a different center of gravity: Chief of Staff, Inbox Operator, Scheduling Concierge, Research Analyst, and Follow-Through Partner. Tone: direct and brief, warm and proactive, or formal. Proactivity: draft only, act on routine items, or act and report. The agent charter generates live beside your choices, structured on the AGENT Framework with Governance first.

**Step 3: Guardrails and approvals.** The approval matrix: for each action type (send email, book travel, schedule meetings, spend money, contact clients, handle family matters) you choose one of three settings: the agent may do it, draft only with your approval, or never. The defaults are deliberately conservative. Standing rule toggles add hard rules on top: no spending without approval, no external messages without approval, cite sources on research, and escalate anything involving money, legal, health, or family conflict. Finally, the accountable owner field. The studio refuses to generate the final package until a human is named. No owner, no agent.

**Step 4: Your agent package.** A glance view of the whole configuration, a sample first morning brief generated from your own setup (your priorities, your waiting drafts, your handled items, your time back figure), the launch checklist, and the final step: the studio assembles one copy-ready final output (system prompt, full charter, owner profile, time leak plan, first week starter tasks, and the sample brief) and instructs the owner plainly: copy the final output and paste it into Muse, and the personal agent is created from that package. Auto setup through a Muse login is on the roadmap; today, the copy and paste handoff is how the agent is created in Muse.

## The honest part

The 60 percent reclaim figure is a planning estimate, not a promise, and the package says so in writing. Real time back depends on how much routine work the owner actually hands over and how the approvals are tuned. That is why the charter builds in a weekly review against the time leak plan and a Friday report from the agent: the estimate gets replaced by a measured number within the first month, or the configuration gets amended.

The core logic lives in one script block in `index.html` (`id="agent-core"`), written as pure functions with no DOM access, so it can be lifted out and unit tested in Node. The owner gate, the time back math, the charter, the package, and the sample brief are all covered by assertions against that block.

## The governance thread

Owner Agent Studio is the business-owner expression of a body of work on safe agentic AI:

- The **AGENT Framework** (Acumen, Governance, Evaluation, Navigation, Transformation) structures every charter the studio writes.
- **agentlint** scores agent configurations for governance risk before launch, and appears in the launch checklist for that reason.
- The **Safe Agents** doctrine (least privilege, approval gates, kill switches, attestation, agent census) is the checklist behind the charter.
- **AIccountable** takes the same sequence (Identify, Train, Design, Implement, Prove) into companies adopting agents.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole studio: interface, charter generator, time leak planner, and package builder |
| `README.md` | This file |
| `LICENSE` | MIT license |

## Author

Greg Lucas, Founder of pAIgeBreaker (personalized learning, with Aithentik authorship verification) and AIccountable (agent adoption and governance for business). Faculty Chair at Grand Canyon University, where he authored AI degree programs and responsible-AI guidelines; Team Lead at Southern New Hampshire University. He writes and speaks on safe agentic AI and builds in public on Muse.

- Portfolio: [paigebreaker.com](https://paigebreaker.com)
- LinkedIn: [linkedin.com/in/greg-lucas-28765b416](https://www.linkedin.com/in/greg-lucas-28765b416/)
- Muse Exchange: [muse-exchange.vercel.app](https://muse-exchange.vercel.app)
- MuSe SIM: [muse-sim.vercel.app](https://muse-sim.vercel.app)
