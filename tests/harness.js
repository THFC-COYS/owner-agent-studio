/* Node harness for Owner Agent Studio.
   Extracts the pure <script id="agent-core"> block from index.html and
   asserts its behavior. Run: node tests/harness.js
   Sections: BASELINE pins the behavior that shipped with the studio.
   SOUL pins the soul step upgrade and must never weaken the baseline. */
"use strict";
var fs = require("fs"), os = require("os"), path = require("path");

var html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
var m = html.match(/<script id="agent-core">([\s\S]*?)<\/script>/);
if (!m) { console.error("agent-core block not found"); process.exit(1); }
var tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "oas-")), "core.js");
fs.writeFileSync(tmp, m[1]);
var C = require(tmp);

var passed = 0, failed = 0, failures = [];
function check(name, cond) {
  if (cond) { passed++; }
  else { failed++; failures.push(name); console.log("FAIL: " + name); }
}
function includes(name, hay, needle) { check(name, typeof hay === "string" && hay.indexOf(needle) >= 0); }

/* ---------- shared fixture ---------- */
var CFG = {
  ownerName: "Jordan Meyer", role: "Founder and managing partner",
  businessType: "Commercial real estate development, 38 staff",
  agentName: "Atlas",
  priorities: ["Close the Mesa industrial acquisition", "Protect two mornings a week for deep work"],
  leaks: [{ id: "inbox", hours: 6 }, { id: "travel", hours: 2 }],
  persona: "chief", tone: "direct", proactivity: "routine",
  matrix: { sendEmail: "draft", bookTravel: "draft", scheduleMeetings: "do", spendMoney: "never", contactClients: "draft", familyMatters: "never" },
  rules: { noSpend: true, noExternal: true, citeSources: true, escalateSensitive: true },
  escalation: "Message me directly with the decision needed."
};
var NO_RULES = Object.assign({}, CFG, { rules: { noSpend: false, noExternal: false, citeSources: false, escalateSensitive: false } });

/* ================= BASELINE (52) ================= */
/* Catalogs and constants */
check("B01 LEAKS has 8 drains", C.LEAKS.length === 8);
check("B02 PERSONAS has 5 personas", Object.keys(C.PERSONAS).length === 5);
check("B03 chief persona is Chief of Staff", C.PERSONAS.chief.name === "Chief of Staff");
check("B04 followthrough persona name", C.PERSONAS.followthrough.name === "Follow-Through Partner");
check("B05 TONES has 3 tones", Object.keys(C.TONES).length === 3);
check("B06 PROACTIVITY has 3 levels", Object.keys(C.PROACTIVITY).length === 3);
check("B07 MATRIX_ACTIONS has 6 actions", C.MATRIX_ACTIONS.length === 6);
check("B08 spend money defaults to never", C.MATRIX_ACTIONS.filter(function(a){ return a.id === "spendMoney"; })[0].def === "never");
check("B09 family matters defaults to never", C.MATRIX_ACTIONS.filter(function(a){ return a.id === "familyMatters"; })[0].def === "never");
check("B10 reclaim rate is 0.6", C.RECLAIM_RATE === 0.6);
check("B11 leakById finds inbox", C.leakById("inbox").label === "Inbox triage");
check("B12 leakById unknown returns null", C.leakById("nope") === null);

/* fmt */
check("B13 fmt whole number", C.fmt(6) === "6");
check("B14 fmt one decimal", C.fmt(2.5) === "2.5");

/* computeTimeBack */
check("B15 timeback empty total", C.computeTimeBack([]).totalHours === 0);
check("B16 timeback empty items", C.computeTimeBack([]).items.length === 0);
check("B17 timeback total sums hours", C.computeTimeBack([{ id: "inbox", hours: 10 }]).totalHours === 10);
check("B18 timeback reclaims 60 percent", C.computeTimeBack([{ id: "inbox", hours: 10 }]).reclaimed === 6);
check("B19 timeback per year uses 48 weeks", C.computeTimeBack([{ id: "inbox", hours: 10 }]).perYear === 288);
check("B20 timeback ignores unknown leak id", C.computeTimeBack([{ id: "nope", hours: 5 }]).items.length === 0);
check("B21 timeback ignores zero hours", C.computeTimeBack([{ id: "inbox", hours: 0 }]).items.length === 0);
check("B22 timeback two leaks total", C.computeTimeBack([{ id: "inbox", hours: 6 }, { id: "travel", hours: 2 }]).totalHours === 8);
check("B23 timeback per item back figure", C.computeTimeBack([{ id: "inbox", hours: 10 }]).items[0].back === 6);

/* ownerGate */
check("B24 gate rejects empty config", C.ownerGate({}).ok === false);
check("B25 gate rejects blank owner", C.ownerGate({ ownerName: "   " }).ok === false);
includes("B26 gate message states the law", C.ownerGate({}).message, "No owner, no agent");
check("B27 gate accepts a named owner", C.ownerGate({ ownerName: "Jordan Meyer" }).ok === true);

/* buildCharter */
var charter = C.buildCharter(CFG);
includes("B28 charter title", charter, "OWNER AGENT CHARTER");
includes("B29 charter names the agent", charter, "Agent: Atlas");
includes("B30 charter names the owner", charter, "Jordan Meyer");
includes("B31 charter names the persona", charter, "Chief of Staff");
includes("B32 charter renders matrix never", charter, "Spend money: Never");
includes("B33 charter renders standing rule", charter, "No spending without approval");
includes("B34 charter lists priorities", charter, "Close the Mesa industrial acquisition");
includes("B35 charter has kill switch", charter, "Kill switch");
includes("B36 charter carries escalation", charter, "Message me directly with the decision needed.");
includes("B37 charter with no rules says so", C.buildCharter(NO_RULES), "None set");

/* buildSystemPrompt */
var sp = C.buildSystemPrompt(CFG);
check("B38 system prompt opens with identity", sp.indexOf("You are Atlas") === 0);
includes("B39 system prompt has persona prompt", sp, C.PERSONAS.chief.prompt);
includes("B40 system prompt has tone prompt", sp, C.TONES.direct.prompt);
includes("B41 system prompt hard rule on spend", sp, "HARD RULE: never spend money");
includes("B42 system prompt protects priorities", sp, "PROTECT THE OWNER'S PRIORITIES");

/* time leak plan and starter tasks */
includes("B43 empty plan placeholder", C.buildTimeLeakPlan({ leaks: [] }), "(No time leaks selected");
includes("B44 plan line per leak", C.buildTimeLeakPlan(CFG), "Inbox triage: 6 hrs per week targeted");
includes("B45 plan states the estimate rate", C.buildTimeLeakPlan(CFG), "60 percent");
check("B46 first starter task is the day one brief", C.buildStarterTasks(CFG)[0].indexOf("first morning brief") >= 0);
includes("B47 starter tasks include the leak task", C.buildStarterText(CFG), "Triage the inbox");
check("B48 starter text header", C.buildStarterText(CFG).indexOf("FIRST WEEK STARTER TASKS") === 0);

/* morning brief */
var brief = C.buildMorningBrief(CFG);
includes("B49 brief title", brief, "FIRST MORNING BRIEF");
includes("B50 brief byline", brief, "Prepared by Atlas for Jordan Meyer");
includes("B51 brief lists draft work waiting", brief, "Waiting for your approval: an email draft written in your voice");
includes("B52 brief escalation line", brief, "stops here and waits for your word");

/* ================= SOUL (16) ================= */
var SOUL_CFG = Object.assign({}, CFG, {
  agentName: "Bea",
  identity: "You are Bea, my operations partner: nothing leaves this business in my name that I would not sign myself.",
  bearings: ["calm", "direct"],
  values: ["accuracy", "nosurprises"],
  valuesText: "Keep Fridays meeting free\nProtect the school run",
  neverDo: ["noinvent", "noshare"],
  neverDoText: "Never water the plants while I travel.\nNever book a red-eye without asking.",
  voiceSample: "Morning, Jordan. Bea here. Two decisions need you and the rest is already moving."
});
var soulPkg = C.buildMusePackage(SOUL_CFG);
var soulSection = C.buildSoulSection(SOUL_CFG);

check("S01 blank name falls back to a persona default", C.resolveAgentName({ agentName: "", persona: "inbox" }) === "Relay");
check("S02 blank name with unknown persona still non-empty", C.resolveAgentName({ agentName: "  ", persona: "zzz" }).length > 0);
check("S03 a given name always wins", C.resolveAgentName({ agentName: "Bea", persona: "inbox" }) === "Bea");
includes("S04 soul section carries the name", soulSection, "Name: Bea");
includes("S05 custom identity reaches the package verbatim", soulPkg, "You are Bea, my operations partner: nothing leaves this business in my name that I would not sign myself.");
check("S06 default identity has the guided shape", C.defaultIdentity({ agentName: "", persona: "chief" }).indexOf("You are Atlas, my chief of staff") === 0);
includes("S07 bearing chip reaches the package", soulPkg, "Calm under pressure");
includes("S08 value chip reaches the package", soulPkg, "Accuracy over speed");
includes("S09 free-text value lands verbatim", soulPkg, "Keep Fridays meeting free");
includes("S10 preset never-do reaches the package", soulPkg, "Never invent facts or figures");
includes("S11 free-text never-do lands verbatim", soulPkg, "Never water the plants while I travel.");
includes("S12 edited sample line is what ships", soulPkg, "Morning, Jordan. Bea here. Two decisions need you and the rest is already moving.");
check("S13 blank sample falls back to the generated line", C.resolveVoiceSample({ agentName: "Atlas", persona: "chief", tone: "direct", ownerName: "Jordan Meyer", priorities: [] }) === C.buildVoiceSample({ agentName: "Atlas", persona: "chief", tone: "direct", ownerName: "Jordan Meyer", priorities: [] }) && C.buildVoiceSample({ agentName: "Atlas", persona: "chief", tone: "direct", ownerName: "Jordan Meyer", priorities: [] }).length > 20);
var i1 = soulPkg.indexOf("SECTION 1: WHO YOUR AGENT IS"), i2 = soulPkg.indexOf("SECTION 2: WHAT YOUR AGENT DOES"), i3 = soulPkg.indexOf("SECTION 3: WHERE YOU STAY IN CHARGE");
check("S14 three section headers appear in order", i1 >= 0 && i2 > i1 && i3 > i2);
var SOUL_NO_OWNER = Object.assign({}, SOUL_CFG, { ownerName: "" });
check("S15 no owner, no agent, even with a full soul", C.buildMusePackage(SOUL_NO_OWNER) === "" && C.ownerGate(SOUL_NO_OWNER).ok === false);
includes("S16 brief byline never carries an empty name", C.buildMorningBrief(Object.assign({}, CFG, { agentName: "" , persona: "analyst" })), "Prepared by Lens for Jordan Meyer");

console.log("TOTAL: " + (passed + failed) + " assertions, " + passed + " passed, " + failed + " failed");
if (failures.length) { console.log("Failures: " + failures.join("; ")); }
process.exit(failed ? 1 : 0);
