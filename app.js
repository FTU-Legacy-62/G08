/* =========================
   FREE FALL - UPDATED FINAL MVP ENGINE
   Updated from the latest New information.zip (Freefall.xlsx, mail.docx, evidence files, final feedback logic).

   Key logic:
   - Information arrives every 3 seconds.
   - Final Score = 40% PV + 40% RC + 20% DQ.
   - PV Score uses a piecewise benchmark formula:
     - 43k / -57% return = 0 points, based on severe GFC drawdown reference.
     - 100k / 0% return = 70 points, capital preservation baseline.
     - 107k / +7% return = 100 points, based on Moody's Baa credit-yield benchmark.
   - RC = 60% Risky Exposure Structure + 40% Liquidity Control.
   - DQ = 30% ISQ + 35% Evidence Use + 20% Bias Control + 15% Belief Updating.
   - Reading time is tracked. Documents opened under 3s are treated as skim/click-through.
   - Yellow/important files cost 2 RB; white files cost 1 RB; RB adds +2 each phase and carries over.
========================= */

/* =========================
   DOM
========================= */

const pages = {
  landing: document.getElementById("landing-page"),
  rules: document.getElementById("rules-page"),
  case: document.getElementById("case-page"),
  game: document.getElementById("game-page"),
  result: document.getElementById("result-page"),
  reveal: document.getElementById("reveal-page")
};

const startBtn = document.getElementById("start-btn");
const rulesStartBtn = document.getElementById("rules-start-btn");
const rulesBackBtn = document.getElementById("rules-back-btn");
const caseCard = document.querySelector(".case-card.playable");
const sideButtons = document.querySelectorAll(".side-btn");
const contentBox = document.getElementById("content-box");
const taskList = document.getElementById("task-list");
const nextPhaseBtn = document.getElementById("next-phase-btn");

const phaseLabel = document.getElementById("phase-label");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");
const portfolioValue = document.getElementById("portfolio-value");
const researchBudget = document.getElementById("research-budget");
const marketDataGrid = document.getElementById("market-data-grid");
const arrivalCard = document.getElementById("arrival-card");
const lastOutcome = document.getElementById("last-outcome");
const allocationList = document.getElementById("allocation-list");

const resultTitle = document.getElementById("result-title");
const resultDescription = document.getElementById("result-description");
const decisionReplay = document.getElementById("decision-replay");
const restartBtn = document.getElementById("restart-btn");
const revealCaseBtn = document.getElementById("reveal-case-btn");
const viewResultAgainBtn = document.getElementById("view-result-again-btn");
const backLandingFromRevealBtn = document.getElementById("back-landing-from-reveal-btn");

const pdfModal = document.getElementById("pdf-modal");
const pdfModalBody = document.getElementById("pdf-modal-body");
const pdfModalTitle = document.getElementById("pdf-modal-title");
const pdfModalClose = document.getElementById("pdf-modal-close");

/* =========================
   CONSTANTS
========================= */

const CHANNEL_ORDER = ["news", "social", "email", "chat", "file", "decision"];
const ARRIVAL_DELAY_MS = 3000;

const CHANNEL_LABELS = {
  news: "News",
  social: "Internet",
  email: "Gmail",
  chat: "Messenger",
  file: "Files",
  decision: "Decision"
};

const ICON_SVGS = {
  news: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h12a3 3 0 0 1 3 3v11H6a2 2 0 0 1-2-2V5z"/><path d="M19 8h1a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2"/><path d="M8 9h6"/><path d="M8 13h7"/><path d="M8 17h4"/></svg>`,
  social: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5l12 14"/><path d="M18 5 6 19"/></svg>`,
  email: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>`,
  file: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>`,
  decision: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M5 6h14"/><path d="M6 6l-3 7h6L6 6z"/><path d="M18 6l-3 7h6l-3-7z"/><path d="M8 21h8"/></svg>`,
  locked: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/></svg>`,
  archive: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="4" rx="1"/><path d="M6 9v10h12V9"/><path d="M10 13h4"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01"/><path d="M12 12h.01"/><path d="M19 12h.01"/></svg>`,
  reply: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>`,
  repost: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>`,
  like: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21l8.8-8.2a5.1 5.1 0 0 0 0-7.2z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`
};

function hydrateStaticIcons() {
  document.querySelectorAll(".side-icon[data-icon]").forEach(icon => {
    icon.innerHTML = ICON_SVGS[icon.dataset.icon] || "";
  });
}

function inlineIcon(name) {
  return `<span class="inline-ui-icon" aria-hidden="true">${ICON_SVGS[name] || ""}</span>`;
}

const CRISIS_STAGE_CLASSES = [
  "crisis-stage-calm",
  "crisis-stage-pressure",
  "crisis-stage-warning",
  "crisis-stage-stress",
  "crisis-stage-panic",
  "crisis-stage-crash"
];

const ASSET_LABELS = {
  broad_equity: "Broad Equity Index",
  financial_sector: "Financial Sector Basket",
  structured_credit: "Structured Credit Basket",
  ig_bonds: "Investment-Grade Bond Basket",
  cash: "Cash / Treasury Bills"
};

// Asset names used in decision text. These aliases let the parser convert
// allocation lines such as "Financial +10%" into the internal asset keys.
const ASSET_KEYWORDS = [
  ["Broad Equity Index", "broad_equity"],
  ["Broad Equity", "broad_equity"],
  ["Equity", "broad_equity"],
  ["Financial Sector Basket", "financial_sector"],
  ["Financial Sector", "financial_sector"],
  ["Financial", "financial_sector"],
  ["Structured Credit Basket", "structured_credit"],
  ["Structured Income Products", "structured_credit"],
  ["Structured Credit", "structured_credit"],
  ["Structured", "structured_credit"],
  ["Investment-Grade Bond Basket", "ig_bonds"],
  ["Investment-Grade Bonds", "ig_bonds"],
  ["IG Bonds", "ig_bonds"],
  ["Bonds", "ig_bonds"],
  ["Cash / Treasury Bills", "cash"],
  ["Cash/T-bills", "cash"],
  ["Treasury Bills", "cash"],
  ["Cash", "cash"]
];

// Corrected phase returns used for PV calculation.
// These values are already phase returns, not cumulative/YTD returns.
// Each value is applied directly to the player's current allocation in that phase.
const stylizedPhaseReturns = {
  broad_equity: [0, 0.048000, 0.021947, 0.021475, -0.038391, -0.085551, -0.194387],
  financial_sector: [0, 0.072000, 0.029851, 0.021739, -0.090426, -0.166667, -0.274854],
  structured_credit: [0, 0.065000, 0.017840, 0.006458, -0.066911, -0.135560, -0.227273],
  ig_bonds: [0, 0.016000, 0.003937, 0.003922, 0.006836, 0.016489, 0.016221],
  cash: [0, 0.007000, 0.002979, 0.001980, 0.002964, 0.003941, 0.004907]
};

const returnTable = stylizedPhaseReturns;

const safeAssets = ["cash", "ig_bonds"];
const riskyAssets = ["financial_sector", "structured_credit"];


// Short file-card previews from FREE_FALL_File_Card_Previews.docx.
// Keep cards concise: detailed tables, footnotes, and warning evidence stay inside the opened PDF.
const FILE_CARD_PREVIEWS = {
  1: {
    1: {
      title: "NorthLake Consultant Peer Ranking Extract",
      type: "Consultant benchmark extract",
      cost: 2,
      preview: "A peer ranking showing why HarborPoint is under pressure to chase returns."
    },
    2: {
      title: "Investment Committee Voting Sheet",
      type: "Committee voting sheet",
      cost: 1,
      preview: "An internal voting record showing how the committee viewed a limited allocation increase."
    }
  },
  2: {
    1: {
      title: "Helios Income Note 2007-B Term Sheet Footnotes",
      type: "Product term sheet page",
      cost: 2,
      preview: "A structured income product offers attractive yield and a senior rating, but the detailed footnotes may matter."
    },
    2: {
      title: "Northstar Ratings Committee Snapshot",
      type: "Rating committee snapshot",
      cost: 1,
      preview: "A rating-agency summary explaining why the senior tranche received a stable rating."
    }
  },
  3: {
    1: {
      title: "Helios 2007-B Loan Tape Extract",
      type: "Collateral pool tape",
      cost: 2,
      preview: "A collateral-level review of the mortgage pools inside Helios 2007-B."
    },
    2: {
      title: "Consultant Slide: Funds Beating HarborPoint",
      type: "Consultant peer performance slide",
      cost: 1,
      preview: "A peer comparison slide showing funds outperforming HarborPoint with higher structured-income exposure."
    }
  },
  4: {
    1: {
      title: "Boreal Capital Shareholder & Board List",
      type: "Shareholder/board list with exposure note",
      cost: 1,
      preview: "A company-level document introducing Boreal Capital and HarborPointâ€™s exposure to Boreal-linked assets."
    },
    2: {
      title: "Dealer Quote Sheet: Boreal-linked Positions",
      type: "Dealer quote sheet",
      cost: 2,
      preview: "A market desk quote sheet comparing model marks with actual dealer bids."
    }
  },
  5: {
    1: {
      title: "Margin Notice + Client Redemption Log",
      type: "Margin notice and redemption log",
      cost: 2,
      preview: "A liquidity desk document listing collateral calls, client redemption risks, and available cash sources."
    },
    2: {
      title: "Trading Desk Execution Queue",
      type: "Trading desk execution queue",
      cost: 1,
      preview: "A desk queue showing which assets can be sold, how fast, and at what estimated discount."
    }
  },
  6: {
    1: {
      title: "Landon Brothers Emergency Filing Extract",
      type: "Emergency filing extract + exposure note",
      cost: 1,
      preview: "A major intermediary has failed after rescue talks collapsed, creating direct and indirect exposure for HarborPoint."
    },
    2: {
      title: "Counterparty Freeze List + Funding-Line Status",
      type: "Counterparty/funding dashboard",
      cost: 2,
      preview: "A crisis desk dashboard tracking frozen counterparties, usable funding lines, quote reliability, and liquidity runway."
    }
  }
};

const INITIAL_PORTFOLIO_VALUE = 100000;
const RESEARCH_BUDGET_PER_PHASE = 2;

const SOURCE_QUALITY_RULES = {
  news: { skimMs: 3000, meaningfulMs: 12000, meaningfulScroll: 0.85, maxPoints: 18, maxItems: 3 },
  email: { skimMs: 3000, meaningfulMs: 7000, meaningfulScroll: 0.5, maxPoints: 16, maxItems: 2 },
  chat: { skimMs: 3000, meaningfulMs: 8000, meaningfulScroll: 0.85, maxPoints: 15, maxItems: 3 },
  social: { skimMs: 3000, meaningfulMs: 6000, meaningfulScroll: 0.85, maxPoints: 6, maxItems: 3 },
  file: { skimMs: 4000, meaningfulMs: 14000, meaningfulScroll: 0, maxPoints: 45, maxItems: 2 }
};

const BU_TRANSITION_MATRIX = {
  3: {
    A: { A: 20, B: 80, C: 100, D: 80 },
    B: { A: 20, B: 40, C: 100, D: 80 },
    C: { A: 20, B: 60, C: 100, D: 80 },
    D: { A: 20, B: 60, C: 80, D: 40 }
  },
  4: {
    A: { A: 20, B: 60, C: 100, D: 80 },
    B: { A: 20, B: 40, C: 100, D: 80 },
    C: { A: 20, B: 60, C: 80, D: 80 },
    D: { A: 20, B: 60, C: 80, D: 40 }
  },
  5: {
    A: { A: 60, B: 40, C: 100, D: 80 },
    B: { A: 60, B: 40, C: 100, D: 80 },
    C: { A: 60, B: 40, C: 80, D: 80 },
    D: { A: 60, B: 40, C: 80, D: 40 }
  },
  6: {
    A: { A: 60, B: 80, C: 40, D: 100 },
    B: { A: 60, B: 80, C: 40, D: 100 },
    C: { A: 60, B: 80, C: 60, D: 100 },
    D: { A: 40, B: 80, C: 60, D: 80 }
  }
};

// Decision Quality rubric from LOGIC MVP sheet.
const DQ_RUBRIC = {
  1: { A: { eu: 60, bc: 40 }, B: { eu: 80, bc: 80 }, C: { eu: 100, bc: 100 }, D: { eu: 80, bc: 100 } },
  2: { A: { eu: 60, bc: 40 }, B: { eu: 80, bc: 80 }, C: { eu: 100, bc: 100 }, D: { eu: 80, bc: 100 } },
  3: { A: { eu: 20, bc: 20 }, B: { eu: 80, bc: 80 }, C: { eu: 100, bc: 100 }, D: { eu: 80, bc: 100 } },
  4: { A: { eu: 60, bc: 60 }, B: { eu: 60, bc: 60 }, C: { eu: 100, bc: 100 }, D: { eu: 80, bc: 80 } },
  5: { A: { eu: 60, bc: 60 }, B: { eu: 40, bc: 40 }, C: { eu: 100, bc: 100 }, D: { eu: 80, bc: 80 } },
  6: { A: { eu: 60, bc: 40 }, B: { eu: 80, bc: 80 }, C: { eu: 60, bc: 60 }, D: { eu: 100, bc: 100 } }
};

// Belief updating is only meaningful once warning signals start changing.
// P1->P2 is not counted; P2/P3/P4/P5/P6 scores represent the quality of the
// player's update into that phase.
const BU_RUBRIC = {
  2: { A: 60, B: 80, C: 100, D: 80 },
  3: { A: 20, B: 60, C: 100, D: 80 },
  4: { A: 20, B: 60, C: 80, D: 80 },
  5: { A: 60, B: 40, C: 80, D: 80 },
  6: { A: 60, B: 80, C: 60, D: 100 }
};

/* =========================
   RAW PHASE DATA
========================= */

const RAW_PHASES = [
  {
    "title": "Phase 1: Normal Market",
    "timeline": "12 March 2006 â€” Normal Market",
    "marketState": "Credit and housing-related markets appear stable. Risk assets perform well, liquidity is easy, and conservative positioning looks increasingly costly.",
    "coreQuestion": "Should the fund join the best-performing market themes, or stay conservative while peers move faster?",
    "historicalLogic": "Housing and credit markets look stable; easy credit supports confidence and risk-taking.",
    "psychology": "Comfort",
    "designRule": "Do not reveal the exact crisis. Make the environment feel normal, profitable, and institutionally safe.",
    "marketData": [
      {
        "label": "Broad Equity Index",
        "value": "+4.8%",
        "note": ""
      },
      {
        "label": "Financial Sector Basket",
        "value": "+7.2%",
        "note": ""
      },
      {
        "label": "Structured Credit Basket",
        "value": "+6.5%",
        "note": ""
      },
      {
        "label": "Investment-Grade Bond Basket",
        "value": "+1.6%",
        "note": ""
      },
      {
        "label": "Cash / Treasury Bills",
        "value": "+0.7%",
        "note": ""
      }
    ],
    "news": [
      "Markets Extend Rally as Credit Conditions Remain Loose\nSubtitle: Investors continue to favor financial firms and structured income products as returns outpace safer assets.\nMarkets continued higher as strong earnings, low borrowing costs, and active credit creation supported confidence. The Broad Equity Index is up +4.8%, while the Financial Sector Basket has gained +7.2% and Structured Income Products have returned +6.5%.\nFinancial firms led gains and structured income products attracted new inflows from pension funds, insurance portfolios, and asset managers. By contrast, investment-grade bonds returned only +1.6% and Cash/Treasury Bills gained just +0.7%, making defensive allocations harder to defend.\nRatings stayed stable and liquidity looked strong, while borrower-quality concerns remained early and low attention.\nTop stories: Financial firms lead another weekly rally; Pension funds add structured income exposure; Cash-heavy portfolios trail peer benchmarks",
      "Financial Firms Lead Market Gains on Strong Lending Revenue\nSubtitle: Banks report strong fee income and active loan growth, reinforcing confidence in the credit cycle.\nFinancial firms outperformed broader equities as lending revenue, securitization fees, and balance-sheet growth supported earnings expectations. The Financial Sector Basket is now up +7.2%, ahead of the Broad Equity Index at +4.8%.\nAnalysts noted that banks are benefiting from active credit demand and investor appetite for income products. Structured Income Products also remained attractive at +6.5%, compared with +1.6% for investment-grade bonds.\nA few reports mentioned looser underwriting standards in fast-growing segments, but these concerns remained secondary to profitability and return-on-equity momentum.\nTop stories: Bank fee income rises with securitization activity; Loan growth supports financial-sector earnings; Underwriting standards draw quiet scrutiny",
      "Is Cash Becoming a Drag? Fund Managers Face Pressure to Take More Risk\nSubtitle: Clients ask why portfolios are holding low-yielding liquid assets while competitors report higher returns.\nCash and Treasury bills continued to protect liquidity, but their low returns created performance pressure. Cash/Treasury Bills have gained only +0.7%, far below the +4.8% return of broad equities and the +6.5% return of structured income products.\nConsultants said some conservative funds may need to explain why they are avoiding high-income credit products that remain well-rated and widely held. Risk managers argued that liquidity has option value, although that argument has been difficult to defend while markets continue rising.\nInvestment-grade bonds returned +1.6%, offering more stability but still lagging the credit-linked products favored by return-seeking clients.\nTop stories: Consultants question high cash allocations; Credit products continue to beat Treasury bills; Risk teams defend liquidity buffers"
    ],
    "posts": [
      "YieldHunter88: Structured income still paying way above boring bonds and people are STILL hiding in cash? Could not be me lol.\nComments: Cash is where returns go to die. / If ratings are stable, what is the drama? / Clients remember performance, not footnotes.",
      "MacroNerd: Everyone is acting like credit risk disappeared because defaults are low. Maybe that is right, but the economy has not tested these structures under real refinancing stress.\nComments: Not bearish, just curious. / Low default data is not the same as all-weather evidence.",
      "FinanceBroLeo: Financials are carrying this market. If your fund missed the trade, you now need a very good explanation for clients.\nComments: Being early conservative looks exactly like being wrong. / Committees hate underperformance more than theoretical risk."
    ],
    "emails": [
      "Subject: Client question â€“ why are we underweight financials?\nFrom: Maya Collins <maya.collins@harborpoint.com>\nTime: Tuesday, 8:42 AM\nTo: Investment Committee\nHi team,\nJust got a query from NorthLake Pension. Theyâ€™ve noticed that our peer funds have been increasing exposure to both financials and structured income products.\nWe need a concrete recommendation before the upcoming allocation meeting. Should we:\nmaintain current weighting,\nmoderately increase,\nor aggressively increase exposure?\nClient perception is a key factor here - especially since our cash position has been dragging relative returns. Please prepare your analysis and proposed stance.\nThanks,\nMaya",
      "Subject: Baseline model note - stress history is limited\nFrom: Risk System <risk.system@harborpoint.com>\nTime: Wednesday, 9:03 AM\nTo: Portfolio Management Team\nTeam,\nBaseline portfolio risk remains within normal limits based on available history.\nHowever, please note that the current dataset contains limited observations for a simultaneous combination of:\nhousing slowdown,\nwidening funding haircuts, and\nreduced dealer balance-sheet capacity.\nThis is not a formal breach, but sensitivity ranges from the model should be interpreted cautiously.\nLet me know if you need the full stress scenario appendix.\nâ€” Risk System (automated)"
    ],
    "inboxPreview": "Sender: Maya Collins â€” Client question - why are we underweight financials?\nSender: Risk System â€” Baseline model note â€” stress history is limited\nUnread: 2\nPriority flags: Client performance pressure; model sensitivity note",
    "chats": [
      "Risk Review\nLena: Structured income products are becoming a much larger part of peer portfolios.\nYou: Is that a risk issue yet?\nLena: Not by current limits. The uncomfortable part is that the trade looks safe because recent history has been calm.\nYou: So we are not saying avoid it?\nLena: I am saying do not treat stable marks as proof that exits will always be easy.",
      "Market Desk\nJon: Dealers are bidding normally. Liquidity looks fine.\nYou: Any concern about structured income?\nJon: Not in senior pieces. There is demand everywhere.\nYou: Any weak spots?\nJon: Maybe some lower-quality originators, but that is not what most clients own.\nYou: So adding exposure is executable?\nJon: Yes, today it is.",
      "Client Relations\nMaya: NorthLake is comparing us to peer funds.\nYou: Are they asking for a change?\nMaya: Not directly, but the message is clear. They want to know why we are carrying so much liquidity when the market is rewarding credit exposure.\nYou: Can we defend staying conservative?\nMaya: Yes, but only if the explanation sounds disciplined, not scared."
    ],
    "files": [
      "p1-f1-northlake-consultant-peer-ranking-extract.pdf\nImportance: Yellow\nResearch cost: 2 AP\nType: Consultant benchmark extract\nPreview: Header: NorthLake Pension Consultant Pack â€” Peer Ranking Extract: Income & Balanced Mandates. Prepared for NorthLake Pension Allocation Committee. Benchmark table compares HarborPoint Balanced Fund with peer funds on broad equity, financial sector, structured credit, IG bonds, cash/T-bills, phase return, and liquidity disclosure. Consultant comment: HarborPoint trails the peer median mainly because its cash/T-bill sleeve remains materially higher while structured credit and financial-sector assets continue to outperform. Client note: NorthLake does not require an immediate aggressive allocation shift, but expects a clear explanation for the 20% cash/T-bill sleeve when cash has returned only +0.7%. Benchmark table",
      "p1-f2-investment-committee-voting-sheet.pdf\nImportance: White\nResearch cost: 1 AP\nType: Committee voting sheet\nPreview: Header: HarborPoint Investment Committee â€” Allocation Review: Attendance & Vote Extract. Committee table lists who supported or questioned a limited allocation increase. Approval condition: initial structured credit allocation should remain below 5â€“7% of portfolio NAV unless additional collateral and liquidity review is completed. Meeting note: cash drag is harder to defend, but committee did not approve structured credit as a substitute for core IG bonds or cash reserves. Committee voting extract"
    ],
    "decisionPrompt": "NorthLake Pension is asking why the fund is not taking more exposure to financials and structured income products while peer funds are outperforming. Market conditions still look supportive: financial firms are strong, ratings are stable, liquidity appears normal, and cash is visibly dragging returns. Your recommendation must balance performance pressure against the possibility that todayâ€™s calm conditions may not reveal how these assets behave under stress.",
    "options": [
      "A. Increase financial sector and structured income exposure.\nAllocation change: Broad Equity -5%; Financial +10%; Structured +10%; IG Bonds -5%; Cash/T-bills -10%.\nRationale: Uses the supportive credit environment to close the performance gap versus peer funds.\nCost: Reduces liquidity and increases dependence on ratings, dealer liquidity, and the continuation of easy credit conditions.",
      "B. Moderately increase financial-sector and structured income exposure.\nAllocation change: Broad Equity 0%; Financial +5%; Structured +5%; IG Bonds -5%; Cash/T-bills -5%.\nRationale: Narrows peer underperformance without fully abandoning liquidity discipline.\nCost: Still increases exposure to the same late-cycle credit conditions and may be too small to satisfy performance-focused clients.",
      "C. Maintain balanced allocation and continue monitoring.\nAllocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.\nRationale: Avoids chasing performance after a strong run and keeps flexibility if conditions change.\nCost: Underperformance versus peers may persist, making the fund harder to defend in client meetings.",
      "D. Reduce financial and structured exposure and raise cash.\nAllocation change: Broad Equity 0%; Financial -5%; Structured -5%; IG Bonds +5%; Cash/T-bills +5%.\nRationale: Preserves liquidity and lowers exposure before credit conditions are tested.\nCost: May look overly defensive in a strong market and could deepen peer underperformance if the credit boom continues."
    ]
  },
  {
    "title": "Phase 2: New Opportunity",
    "timeline": "18 September 2006 â€” New Opportunity",
    "marketState": "Structured income products become a new opportunity. Senior-rated credit instruments offer attractive yield while still appearing professionally defensible.",
    "coreQuestion": "Should the fund enter structured income while the evidence still seems to support taking risk?",
    "historicalLogic": "Structured housing/credit products attract investors because they appear to offer higher yield without obviously higher risk.",
    "psychology": "Curiosity",
    "designRule": "Present the risky choice as rational and professionally defensible, not obviously reckless.",
    "marketData": [
      {
        "label": "Broad Equity Index",
        "value": "+2.2%",
        "note": ""
      },
      {
        "label": "Financial Sector Basket",
        "value": "+3.0%",
        "note": ""
      },
      {
        "label": "Structured Credit Basket",
        "value": "+1.8%",
        "note": ""
      },
      {
        "label": "Investment-Grade Bond Basket",
        "value": "+0.4%",
        "note": ""
      },
      {
        "label": "Cash / Treasury Bills",
        "value": "+0.3%",
        "note": ""
      }
    ],
    "news": [
      "Markets Extend Rally as Credit Conditions Remain Loose\nSubtitle: Investors continue to favor financial firms and structured income products as returns outpace safer assets.\nMarkets continued higher as strong earnings, low borrowing costs, and active credit creation supported confidence. By this phase, the Broad Equity Index has risen +7.1%, while the Financial Sector Basket is up +10.4% and Structured Income Products have gained +8.4%.\nFinancial firms led gains and structured income products attracted new inflows from pension funds, insurance portfolios, and asset managers. Defensive assets continued to lag, with Investment-Grade Bonds returning only +2.0% and Cash/Treasury Bills up +1.0%.\nRatings stayed stable and liquidity looked strong, while borrower-quality concerns remained early and low attention.\nTop stories: Financial-sector gains widen the gap with defensive portfolios; Structured income inflows continue as bond yields stay low; Cash and Treasury-bill returns lag risk-linked products",
      "Peer Funds Outperform After Adding Credit Exposure\nSubtitle: Conservative portfolios face questions as competitors report smoother income and better quarterly returns.\nPeer funds that increased structured income and financial-sector exposure reported stronger relative performance. Structured Income Products are now up +8.4%, far ahead of Cash/Treasury Bills at +1.0% and Investment-Grade Bonds at +2.0%.\nConsultants described the trade as a controlled way to improve yield without moving heavily into equities. Conservative managers now face harder client conversations, especially where cash and government-bond allocations are dragging returns.\nRisk teams continue to request more sensitivity analysis, but investment committees remain focused on opportunity cost.\nTop stories: Peer funds report smoother income after adding credit exposure; Consultants question conservative allocation policies; Risk teams request more sensitivity analysis before new buying",
      "Rating Agencies Maintain Stable Outlook on Senior Credit Products\nSubtitle: Agencies say senior structures remain protected under base-case assumptions, though model sensitivity varies by collateral quality.\nRating agencies maintained stable outlooks on many senior structured income products, citing credit enhancement, diversification, and continued investor demand. Market participants took comfort from the updates, especially because realized losses remained limited.\nThe positive rating tone helped support demand for senior products, even as the broader performance gap widened: financials gained +10.4%, structured income gained +8.4%, and cash remained at only +1.0%.\nThe reports also noted that outcomes depend on refinancing conditions and correlation assumptions, but those caveats received less attention than the headline stability.\nTop stories: Rating agencies keep senior structured products stable; Credit enhancement remains central to product marketing; Technical caveats receive less attention than headline ratings"
    ],
    "posts": [
      "YieldHunter88: Senior credit carry keeps landing every month. At some point â€œwaiting for a better entryâ€ is just another way to miss the trade.\nComments: Consultants love smooth returns. / Nobody gets paid for holding cash forever. / Model caveats exist in every product.",
      "MacroNerd: Stable rating does not mean zero sensitivity. It means the base case still works. The question is how much housing weakness and liquidity withdrawal the base case can absorb.\nComments: Caveats are boring until they matter. / Senior structure helps, but assumptions still matter.",
      "FinanceBroLeo: Imagine telling a pension client you avoided senior-rated income because of a hypothetical stress scenario nobody can observe. Good luck with that meeting.\nComments: Peer tables are brutal. / Risk teams always find a caveat. / Returns are not hypothetical."
    ],
    "emails": [
      "Subject: Allocation meeting - structured income exposure\nFrom: Maya Collins <maya.collins@harborpoint.com>\nTime: Wednesday, 9:15 AM\nTo: Investment Committee / Research Team\nHi all,\nTomorrowâ€™s committee will ask a pointed question: are we being too slow?\nPeer funds are already showing better quarterly income after adding senior structured exposure. We need a recommendation that acknowledges the opportunity cost of staying conservative - not just the risk case.\nPlease also include a concrete answer we would give to NorthLake Pension if we decide to keep cash levels unchanged. Theyâ€™ll want to hear why weâ€™re willing to underperform peers on income.\nThanks,\nMaya",
      "Subject: Model sensitivity note - liquidity not fully observed\nFrom: Risk System <risk.system@harborpoint.com>\nTime: Thursday, 8:58 AM\nTo: Portfolio Management Team\nTeam,\nCurrent structured income exposure remains inside approved limits.\nHowever, please be aware that the liquidity score is based mainly on: recent dealer indications, and normal-market settlement conditions.\nThe model does not fully observe how much size can actually be executed if multiple funds attempt to sell similar positions at the same time.\nThis is a model limitation, not a breach. But it's worth flagging before any material increase in structured exposure.\nâ€” Risk System (automated)"
    ],
    "inboxPreview": "Sender: Maya Collins â€” Allocation meeting â€” structured income exposure\nSender: Risk System â€” Model sensitivity note â€” liquidity not fully observed\nUnread: 2\nPriority flags: Peer pressure; liquidity evidence based on normal-market indications",
    "chats": [
      "Risk Review\nLena: The issue is not that these products are losing money. They are not.\nYou: Then why is Risk pushing back?\nLena: Because the model sees income and rating stability better than it sees crowding.\nYou: Is that enough to block an allocation?\nLena: No. But it is enough to size it carefully and keep liquidity real.",
      "Market Desk\nJon: Senior-rated structured products are getting strong bids again this week.\nYou: Any change in tone?\nJon: Dealers like clean collateral. They ask more questions on the weaker pools, but the main market still works.\nYou: What about size?\nJon: Reasonable size is fine. Huge blocks would need a conversation.",
      "Committee Prep\nMaya: Tomorrowâ€™s committee will ask: are we missing yield because we are too cautious?\nYou: What answer do they expect?\nMaya: They want a balanced recommendation. If we say no increase, we need to explain the opportunity cost. If we say increase, we need to show liquidity control.\nYou: So no easy optics.\nMaya: Exactly."
    ],
    "files": [
      "p2-f1-helios-income-note-2007b-term-sheet-footnotes.pdf\nImportance: Yellow\nResearch cost: 2 AP\nType: Product term sheet page\nPreview: Header: Helios Income Note 2007-B. Arranger: Landon Brothers Structured Credit Desk. This creates continuity with the Landon failure in Phase 6. Distribution status: institutional clients only; settlement T+3. Product summary includes target yield, minimum ticket, senior rating, dealer indications, and intended use as a satellite income sleeve. Footnotes are visually small but important: dealer liquidity support is indicative only; historical calibration excludes nationwide housing-price decline; large block sales may require negotiated pricing; senior rating assumes refinancing access remains broadly available. Product summary Tranche structure",
      "p2-f2-northstar-ratings-committee-snapshot.pdf\nImportance: White\nResearch cost: 1 AP\nType: Rating committee snapshot\nPreview: Header: Northstar Ratings â€” Pre-Sale Committee Snapshot: Helios Income Note 2007-B. Rating summary shows senior tranche rating, base stress assumptions, senior loss absorption cushion, default correlation assumption, and surveillance frequency. Rating rationale: senior tranche is supported by subordination, excess spread, cash reserve, and diversified collateral. Committee note: refinancing access is monitored; major deterioration may change delinquency assumptions. Rating summary"
    ],
    "decisionPrompt": "Structured income products are becoming one of the most popular trades in the market. Peer funds are reporting smoother income and better relative returns, while rating agencies remain stable on senior products. The committee wants to know whether the fund should increase exposure, but the risk team notes that liquidity evidence is mostly based on normal-market dealer indications. Your decision must be defensible both to clients and to the risk committee.",
    "options": [
      "A. Aggressively increase structured income exposure.\nAllocation change: Broad Equity -5%; Financial +5%; Structured +15%; IG Bonds -5%; Cash/T-bills -10%.\nRationale: Captures the strongest carry opportunity while senior ratings and peer adoption still support the trade.\nCost: Creates concentration in a crowded position and leaves less room if funding or exit assumptions change.",
      "B. Moderately increase structured income exposure while keeping a liquidity reserve.\nAllocation change: Broad Equity 0%; Financial 0%; Structured +7%; IG Bonds -3%; Cash/T-bills -4%.\nRationale: Responds to peer pressure while preserving some defensive capacity.\nCost: A compromise position may underperform aggressive peers and still add exposure to a crowded, model-sensitive trade.",
      "C. Maintain current allocation and open a technical review.\nAllocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.\nRationale: Delays allocation changes until liquidity assumptions, collateral quality, and peer exposures are reviewed.\nCost: Protects process discipline but may look slow while competitors continue reporting higher income.",
      "D. Reduce structured exposure and raise cash.\nAllocation change: Broad Equity 0%; Financial 0%; Structured -10%; IG Bonds +5%; Cash/T-bills +5%.\nRationale: Prioritizes liquidity and avoids adding to a trade whose exit assumptions are not fully tested.\nCost: Sacrifices income and may be difficult to justify if senior products remain stable and peers continue outperforming."
    ]
  },
  {
    "title": "Phase 3: Boom & FOMO",
    "timeline": "26 February 2007 â€” Boom & FOMO",
    "marketState": "The boom intensifies. Peer funds report smoother returns, clients question conservative positioning, and yield-chasing becomes harder to resist.",
    "coreQuestion": "Should the fund increase exposure when peers are outperforming and clients are demanding stronger returns?",
    "historicalLogic": "Investors chase yield and peer performance; structured products become crowded and professionally normalized.",
    "psychology": "Greed / Pressure",
    "designRule": "Create FOMO. The player should feel pressure from clients, peers, and performance rankings.",
    "marketData": [
      {
        "label": "Broad Equity Index",
        "value": "+2.1%",
        "note": ""
      },
      {
        "label": "Financial Sector Basket",
        "value": "+2.2%",
        "note": ""
      },
      {
        "label": "Structured Credit Basket",
        "value": "+0.6%",
        "note": ""
      },
      {
        "label": "Investment-Grade Bond Basket",
        "value": "+0.4%",
        "note": ""
      },
      {
        "label": "Cash / Treasury Bills",
        "value": "+0.2%",
        "note": ""
      }
    ],
    "news": [
      "Credit Products Stay Popular as Investors Search for â€œLow-Volatilityâ€ Returns\nSubtitle: Senior-rated structures continue to post positive carry even as weaker borrower pools receive more attention.\nCredit products remained attractive to investors seeking income with limited day-to-day price movement. Senior-rated structures continued to trade close to model values, and several desks reported normal demand for cleaner collateral pools.\nBy this phase, the Broad Equity Index has risen +9.4%, while the Financial Sector Basket has gained +12.8% and Structured Income Products remain positive at +9.1%. Defensive assets continue to lag, with Investment-Grade Bonds at +2.4% and Cash/Treasury Bills at +1.2%.\nAt the same time, a few smaller lenders and lower-quality pools showed weaker payment trends, raising debate over whether recent problems are isolated or the start of broader deterioration.\nTop stories: Senior structured products continue to post positive carry; Weak borrower pools draw more analyst attention; Dealers remain constructive but more selective",
      "Smaller Credit Firms Face Questions as Late Payments Edge Higher\nSubtitle: The market debates whether weaker borrower performance is contained or an early warning for structured portfolios.\nA group of smaller credit firms faced questions after late payments increased in lower-quality borrower pools. Larger institutions argued that senior-rated securities remain protected by structural subordination and diversified collateral.\nThe broader market has not yet moved into panic. Financial-sector assets remain up +12.8%, and structured income products are still up +9.1%, suggesting investors continue to separate isolated borrower weakness from systemic risk.\nSkeptics countered that pool-level deterioration can matter if refinancing conditions tighten. For now, broad market pricing still implies containment rather than systemic stress.\nTop stories: Late payments rise in lower-quality borrower segments; Senior protection remains the central defense for credit products; Market pricing still points to contained stress",
      "When Everyone Owns the Same â€œSafeâ€ Trade, Who Buys First in a Sell-Off?\nSubtitle: Crowding concerns rise, but investors remain divided on whether liquidity risk matters without clear credit losses.\nStructured income has become a crowded trade among yield-seeking investors. Some strategists warned that liquidity can disappear even before credit losses become obvious, especially if many portfolios hold similar assets.\nThe trade still looks profitable: Structured Income Products have returned +9.1%, outperforming Investment-Grade Bonds at +2.4% and Cash/Treasury Bills at +1.2%. That performance gap makes reducing exposure difficult for managers under client scrutiny.\nOthers dismissed the concern, arguing that senior cash flows remain strong and that temporary price moves should not force long-term investors to sell. The result is a market that looks profitable but harder to exit.\nTop stories: Crowded positioning raises exit-liquidity questions; Investors debate whether senior cash flows are enough; Cash and bonds continue to lag the credit trade"
    ],
    "posts": [
      "YieldHunter88: Structured income still green, financials still leading, and people are calling the top again. Maybe weak lenders are just weak lenders?\nComments: Senior pieces are not junior trash. / Every cycle has noise. / If you sell every headline, you own only T-bills.",
      "MacroNerd: The first cracks never look systemic. They look like â€œjust a few weak pools.â€ The real question is whether everyone is using the same exit assumption.\nComments: Maybe contained, maybe not. / Liquidity is always abundant until every holder needs it together.",
      "DeskRumors: Hearing junior pieces are getting marked wider, but senior stuff still has buyers if the collateral is clean. Nobody wants the messy pools though.\nComments: Selectivity is back. / Not a market freeze, but not the old easy bid either."
    ],
    "emails": [
      "Subject: Committee follow-up - do we stay with the trade?\nFrom: Maya Collins <maya.collins@harborpoint.com>\nTime: Thursday, 10:05 AM\nTo: Investment Committee\nTeam,\nNorthLakeâ€™s consultant just sent another peer comparison.\nThey acknowledge that there are weak borrower pools, but their core question is this: Why should we reduce senior-rated exposure when returns are still positive and realized losses remain limited?\nWe need a clear, defensible view - whether the decision is to stay invested or to reduce exposure. Either is fine, but the rationale cannot sound reactive or defensive.\nPlease prepare your recommendation before the follow-up call.\nThanks,\nMaya",
      "Subject: Watchlist update - borrower pool performance\nFrom: Risk System <risk.system@harborpoint.com>\nTime: Thursday, 9:27 AM\nTo: Credit & Portfolio Management Team\nTeam,\nLower-quality borrower pools are showing weaker payment trends compared to last quarter.\nSenior-rated exposures remain within modeled protection levels under base-case assumptions. However, correlation between weak pools has increased.\nRecommendation: review concentration by collateral type and expected exit route before adding any further exposure.\nThis is a watchlist update - no breach at this time.\nâ€” Risk System (automated)"
    ],
    "inboxPreview": "Sender: Maya Collins â€” Committee follow-up â€” do we stay with the trade?\nSender: Risk System â€” Watchlist update â€” borrower pool performance\nUnread: 2\nPriority flags: Peer comparison; senior protection still modeled; weak-pool trend deteriorating",
    "chats": [
      "Risk Review\nLena: The data is getting less clean. Weak pools are no longer one-off headlines.\nYou: Are senior positions still protected?\nLena: Under the base case, yes. But protection depends on assumptions about correlation, refinancing, and exit timing.\nYou: So the problem is uncertainty?\nLena: Exactly. Not proof of disaster, but less room for confidence.",
      "Market Desk\nJon: Weâ€™re seeing more pushback on junior pieces, but senior names still trade.\nYou: Are buyers stepping away?\nJon: Not broadly. They are just more selective.\nYou: Does selectivity mean risk is rising?\nJon: It means the easy bid is not universal anymore. That is different from a freeze.",
      "Client Relations\nMaya: NorthLakeâ€™s consultant sent another peer table. They are underlining the funds with higher structured income returns.\nYou: Are they ignoring the weaker pools?\nMaya: They see them, but they think senior exposure is different.\nYou: What worries you?\nMaya: If we cut too early and peers keep winning, we look defensive for no reason."
    ],
    "files": [
      "p3-f1-helios-2007b-loan-tape-extract.pdf\nImportance: Yellow\nResearch cost: 2 AP\nType: Collateral pool tape\nPreview: Header: Helios Income Note 2007-B â€” Collateral Tape Extract: Early Performance Review. Pool-level table gives share, delinquency, refinancing success, and loan type. Loan feature summary highlights adjustable-rate exposure, low-documentation loans, housing-sensitive regions, and second-lien exposure. Correlation note: weak-pool default correlation has been revised upward; rating surveillance has not yet updated. Protection note: senior tranche remains protected under base-case structure, but deterioration is concentrated in broker-originated and second-lien pools. Collateral performance table Loan feature summary",
      "p3-f2-consultant-slide-funds-beating-harborpoint.pdf\nImportance: White\nResearch cost: 1 AP\nType: Consultant peer performance slide\nPreview: Header: NorthLake Consultant Slide â€” Funds Beating HarborPoint: Income Strategy Comparison. Peer table shows structured exposure, financial exposure, cash buffer, repo use, and phase return. Consultant comment: strongest peer returns are associated with larger structured-income allocations and lower cash balances. Disclosure note: repo use and liquidity adjustment are not consistently disclosed across peer funds. Peer performance slide"
    ],
    "decisionPrompt": "Structured income products are still profitable, and senior-rated products continue to look resilient. However, weaker borrower pools are no longer isolated headlines, and crowding is making exit assumptions harder to evaluate. The committee needs a decision before the next client update. Your choice should address whether to keep harvesting carry, slow the trade, reduce selected exposures, or derisk more decisively.",
    "options": [
      "A. Continue increasing structured income and financial-sector exposure.\nAllocation change: Broad Equity -5%; Financial +5%; Structured +10%; IG Bonds -5%; Cash/T-bills -5%.\nRationale: Treats weak-pool problems as contained and continues harvesting positive carry.\nCost: Looks sensible if markets stabilize, but exposes the fund to correlation, crowding, and liquidity risk if stress broadens.",
      "B. Maintain current structured exposure, stop new buying, and keep the liquidity buffer intact.\nAllocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.\nRationale: Continues earning carry without adding to the trade while the evidence is mixed.\nCost: May look indecisive to clients and does not reduce existing exposure if weak-pool stress spreads.",
      "C. Reduce the most liquidity-sensitive structured exposure while keeping senior, cleaner positions.\nAllocation change: Broad Equity 0%; Financial -3%; Structured -7%; IG Bonds +5%; Cash/T-bills +5%.\nRationale: Acknowledges growing weak-pool and exit-risk signals without abandoning the entire carry trade.\nCost: May reduce returns if stress remains contained and could be criticized as reacting before realized losses appear.",
      "D. Cut structured and financial exposure materially before broader market stress becomes visible.\nAllocation change: Broad Equity 0%; Financial -10%; Structured -15%; IG Bonds +10%; Cash/T-bills +15%.\nRationale: Acts early on crowding, correlation, and liquidity concerns rather than waiting for realized losses.\nCost: Could be seen as alarmist, reduces carry sharply, and risks severe client criticism if markets remain contained."
    ]
  },
  {
    "title": "Phase 4: Mixed Signals",
    "timeline": "20 June 2007 â€” Mixed Signals",
    "marketState": "Mixed signals emerge. Losses and fund stress appear in some mortgage-linked products, but broader markets still show periods of stability and rebound.",
    "coreQuestion": "Should the fund keep harvesting carry when senior-rated products still look profitable but warning signs are no longer isolated?",
    "historicalLogic": "Mortgage losses and fund-level stress appear, but signals remain ambiguous because some assets still perform and markets partially recover.",
    "psychology": "Confusion",
    "designRule": "Create genuine ambiguity. Some sources should warn of danger, while others suggest the problem is contained or temporary.",
    "marketData": [
      {
        "label": "Broad Equity Index",
        "value": "-3.8%",
        "note": ""
      },
      {
        "label": "Financial Sector Basket",
        "value": "-9.0%",
        "note": ""
      },
      {
        "label": "Structured Credit Basket",
        "value": "-6.7%",
        "note": ""
      },
      {
        "label": "Investment-Grade Bond Basket",
        "value": "+0.7%",
        "note": ""
      },
      {
        "label": "Cash / Treasury Bills",
        "value": "+0.3%",
        "note": ""
      }
    ],
    "news": [
      "Credit Markets Remain Open, but Pricing Confidence Begins to Fray\nSubtitle: Dealers still quote many products, yet managers report wider differences between model marks and executable bids.\nCredit markets remained open after recent volatility, and some structured products recovered part of their earlier spread widening. Supporters argued that senior cash flows remain protected and that patient investors may benefit from temporary discounts.\nEven so, the market tone has changed. Broad Equity gains have cooled to +5.2%, the Financial Sector Basket is up only +2.6%, and Structured Income Products have slowed to +1.8%. Defensive assets have become more competitive, with Investment-Grade Bonds up +3.1% and Cash/Treasury Bills up +1.5%.\nHowever, several portfolio managers said marks now depend more heavily on dealer assumptions, collateral type, and trade size, making reported prices harder to compare across funds.\nTop stories: Dealer quote dispersion widens across structured products; Senior cash-flow confidence remains mostly intact; Reported marks become harder to compare across funds",
      "Analysts Split Over Whether Recent Credit Weakness Is a Buying Opportunity\nSubtitle: Some desks see oversold credit, while others warn that liquidity is becoming more dependent on dealer balance sheets.\nAnalysts were divided after recent credit volatility. Several desks argued that spread widening has created attractive entry points in senior and higher-quality structured products, particularly for investors not reliant on leverage.\nAt the same time, performance momentum has weakened: Structured Income Products are now only +1.8%, and financial-sector returns have fallen to +2.6%. That leaves little cushion against further repricing, especially compared with Investment-Grade Bonds at +3.1%.\nOthers warned that liquidity is becoming less automatic, with bids varying by dealer, collateral pool, and trade size. The disagreement has made allocation decisions harder to justify either way.\nTop stories: Desks debate whether spread widening is a buying opportunity; Dealer balance sheets become more important to liquidity; Higher-quality senior collateral attracts selective interest",
      "Fund Managers Face Harder Trade-Off as Performance Pressure Meets Risk Control\nSubtitle: Cutting exposure may look prudent later, but premature derisking could damage returns and client confidence now.\nFund managers are divided over whether to reduce structured credit exposure after recent volatility. Some committees want to preserve performance because several products continue to pay income and have not suffered realized losses.\nBut the performance gap that supported risk-taking has narrowed. Structured Income Products are up +1.8%, only slightly ahead of Cash/Treasury Bills at +1.5% and behind Investment-Grade Bonds at +3.1%. The argument for holding risk is therefore less obvious than in earlier phases.\nOthers want to raise liquidity before market depth is tested further. The challenge is timing: derisk too early and the fund may underperform; wait too long and exits may become expensive.\nTop stories: Committees weigh performance protection against liquidity planning; Cash and investment-grade bonds regain relevance; Managers face reputational risk whichever action they choose"
    ],
    "posts": [
      "YieldHunter88: Spreads widened, then tightened a bit. Feels like people panicked and now want back in quietly.\nComments: Patient money wins. / If you can hold to maturity, why sell? / Liquidity risk matters only if you need to exit today.",
      "MacroNerd: A model mark is a useful estimate, not a promise from a buyer. If dealers quote different levels for the same thing, the range is information too.\nComments: Not every cheap asset is mispriced. / Trade size matters more than people admit.",
      "CreditDeskGuy: Not a crash, not clean either. Some accounts are bidding, but they want smaller size, better collateral, and a discount for uncertainty.\nComments: Price discovery is getting weird. / Screen quotes look calmer than actual conversations."
    ],
    "emails": [
      "Subject: Committee follow-up - do recent spread moves change our allocation view?\nFrom: Maya Collins <maya.collins@harborpoint.com>\nTime: Friday, 9:48 AM\nTo: Investment Committee\nTeam,\nThe committee is currently split.\nSome members believe the recent rebound proves that last weekâ€™s widening was an overreaction. Others want to raise liquidity now, before exits become more difficult.\nPlease prepare a recommendation that clearly explains the trade-off between:\nprotecting near-term performance,\npreserving optionality for the portfolio.\nWe need to settle this before the NorthLake call.\nThanks,\nMaya",
      "Subject: Risk flag - quote dispersion and valuation confidence\nFrom: Risk System <risk.system@harborpoint.com>\nTime: Friday, 8:44 AM\nTo: Portfolio Management Team\nTeam,\nNo formal risk breach to report.\nHowever, quote dispersion has increased across several structured holdings - especially where collateral data is less transparent.\nWhile reported NAV may remain defensible, executable price confidence is lower for larger trade sizes.\nRecommendation: separate mark-to-model confidence from actual liquidation confidence when making allocation decisions.\nâ€” Risk System (automated)"
    ],
    "inboxPreview": "Sender: Maya Collins â€” Committee follow-up â€” do recent spread moves change our allocation view?\nSender: Risk System â€” Risk flag â€” quote dispersion and valuation confidence\nUnread: 2\nPriority flags: Committee split; rebound narrative; executable-price uncertainty",
    "chats": [
      "Risk Review\nLena: I am less worried about headline return than confidence around the marks.\nYou: We still have quotes though.\nLena: Yes, but quote quality varies. Small size, clean collateral, patient seller â€” fine. Large size, messy collateral, urgent seller â€” different market.\nYou: So we need separate performance from liquidity.\nLena: That is the decision.",
      "Market Desk\nJon: Some structured names are cheaper today. Buyers with nerves are asking for lists.\nYou: Real bids or fishing?\nJon: Both. Clean senior paper has interest. Messy pools get lowball bids.\nYou: Could we sell if we had to?\nJon: Yes, but price depends heavily on urgency and size.",
      "Committee Prep\nMaya: We need a recommendation we can defend if the market stabilizes next week and if it gets worse next month.\nYou: That is two different worlds.\nMaya: Exactly. Selling now may look smart later or embarrassing immediately. Holding may preserve returns or trap us.\nYou: So the language matters.\nMaya: The logic matters more."
    ],
    "files": [
      "p4-f1-boreal-capital-shareholder-board-list.pdf\nImportance: White\nResearch cost: 1 AP\nType: Shareholder/board list + exposure note\nPreview: Header: Boreal Capital â€” Shareholder, Board & Exposure Extract. Major shareholder table gives stakes and notes. Board/executive table gives names, roles, and current concerns. HarborPoint exposure table shows direct bond exposure, Boreal-arranged structured notes, repo/funding line through Boreal desk, and mortgage warehouse-linked note. Market signal: Boreal CDS spread widened from 180 bps to 410 bps; management says liquidity remains adequate; two hedge-fund clients reportedly reduced balances. Major shareholders Board and executives",
      "p4-f2-dealer-quote-sheet-boreal-linked-positions.pdf\nImportance: Yellow\nResearch cost: 2 AP\nType: Dealer quote sheet\nPreview: Header: Dealer Quote Sheet â€” Boreal-linked and Helios-linked Structured Positions. Prepared by Market Desk. Quote comparison table gives model marks, dealer bids, large-block indications, and desk notes. Desk note: clean senior collateral still attracts bids, but quote quality depends heavily on trade size, collateral transparency, and seller urgency. Valuation note: NAV marks remain defensible for several positions, but liquidation value is increasingly uncertain for larger or weaker positions. Quote comparison table"
    ],
    "decisionPrompt": "The market has partially stabilized after recent volatility, so cutting risk now could look premature if spreads continue to recover. At the same time, quote dispersion and trade-size sensitivity suggest that liquidity may be worse than headline marks imply. The committee is split between protecting performance and preserving optionality. Your recommendation must explain what risk you are willing to accept.",
    "options": [
      "A. Add selectively to spread-widened structured exposure.\nAllocation change: Broad Equity -5%; Financial 0%; Structured +10%; IG Bonds -5%; Cash/T-bills 0%.\nRationale: Treats recent weakness as a selective buying opportunity in higher-quality structured assets.\nCost: May improve returns if spreads normalize, but uses liquidity exactly when market depth is becoming less reliable.",
      "B. Keep current allocation unchanged and intensify monitoring of spreads, dealer quotes, and redemption risk.\nAllocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.\nRationale: Avoids reacting to ambiguous price moves and preserves the chance to benefit from stabilization.\nCost: Buys time but not liquidity; if market depth deteriorates, the fund may have delayed too long.",
      "C. Keep some structured exposure, but reduce weaker risk positions and build cash gradually.\nAllocation change: Broad Equity -5%; Financial -5%; Structured -10%; IG Bonds +5%; Cash/T-bills +15%.\nRationale: Improves liquidity and lowers exposure to questionable collateral while avoiding a full exit.\nCost: Realizes some discount, reduces carry income, and may still be insufficient if funding pressure escalates quickly.",
      "D. Exit a large share of structured income exposure now and rotate into liquid assets.\nAllocation change: Broad Equity -5%; Financial -10%; Structured -20%; IG Bonds +10%; Cash/T-bills +25%.\nRationale: Prioritizes executable liquidity before quote dispersion becomes a forced-sale problem.\nCost: Locks in discounts, may miss a rebound, and could make the fund look like it has lost confidence in its own marks."
    ]
  },
  {
    "title": "Phase 5: Market Stress",
    "timeline": "17 August 2007 â€” Market Stress",
    "marketState": "Market stress becomes harder to ignore. Funding markets tighten, collateral demands rise, and liquidity becomes more important than reported valuation.",
    "coreQuestion": "Should the fund defend performance after partial stabilization, or build liquidity before market depth is truly tested?",
    "historicalLogic": "Funding markets tighten; liquidity, collateral, and redemption pressure start to dominate portfolio decisions.",
    "psychology": "Anxiety",
    "designRule": "Shift the game from return-seeking to liquidity management. The player must balance losses, redemptions, and institutional credibility.",
    "marketData": [
      {
        "label": "Broad Equity Index",
        "value": "-8.6%",
        "note": ""
      },
      {
        "label": "Financial Sector Basket",
        "value": "-16.7%",
        "note": ""
      },
      {
        "label": "Structured Credit Basket",
        "value": "-13.6%",
        "note": ""
      },
      {
        "label": "Investment-Grade Bond Basket",
        "value": "+1.6%",
        "note": ""
      },
      {
        "label": "Cash / Treasury Bills",
        "value": "+0.4%",
        "note": ""
      }
    ],
    "news": [
      "Credit Funds Face Redemption Pressure as Liquidity Conditions Tighten\nSubtitle: Funds with complex holdings face harder choices as clients ask for cash and lenders demand more collateral.\nSeveral credit-oriented funds faced redemption requests and higher collateral requirements as lenders reviewed exposures to structured products. Managers stressed that some assets may be fundamentally money-good if held to maturity, but near-term liquidity has become more important than model value.\nMarket performance now reflects the pressure. The Broad Equity Index has slipped to -3.8%, the Financial Sector Basket is down -14.5%, and Structured Income Products have fallen -12.0%. In contrast, Investment-Grade Bonds are up +4.8% and Cash/Treasury Bills are up +1.9%.\nDefensive funds with cash reserves reported new interest from clients, while yield-focused funds argued that forced selling could destroy long-term value.\nTop stories: Credit funds face rising redemption requests; Collateral calls increase pressure on complex holdings; Defensive funds attract clients seeking cash access",
      "Short-Term Funding Costs Jump as Lenders Demand More Collateral\nSubtitle: Haircuts rise for complex collateral, but some managers say the pressure is technical rather than fundamental.\nShort-term funding costs rose as lenders demanded additional collateral against structured holdings and financial-sector exposures. Funds with liquid assets met calls more easily, while leveraged portfolios faced difficult choices.\nLosses have become visible: Financial-sector assets are down -14.5% and Structured Income Products are down -12.0%. Those declines increase collateral pressure and make it harder to separate temporary funding stress from solvency concerns.\nSome managers argued that higher haircuts reflect temporary balance-sheet caution, not permanent credit impairment. Others warned that temporary funding pressure can become permanent if forced sales push marks lower.\nTop stories: Haircuts rise on structured-credit collateral; Leveraged portfolios face tougher financing terms; Funding pressure risks becoming a forced-sale loop",
      "â€œLiquidity Is the Positionâ€: Defensive Funds Gain New Relevance\nSubtitle: Cash-rich portfolios regain credibility, but aggressive derisking may still look costly if markets stabilize.\nFunds with larger cash and government-bond allocations regained attention as liquidity became scarce. Some clients now value immediate cash access more than reported yield, especially where redemption needs are uncertain.\nDefensive assets are now leading: Investment-Grade Bonds are up +4.8% and Cash/Treasury Bills are up +1.9%, while Broad Equity is down -3.8% and credit-linked risk assets have declined sharply.\nYet aggressive derisking remains controversial because selling into stressed markets can lock in losses, reduce future income, and make a fund look as if it is reacting late.\nTop stories: Cash-rich funds regain credibility during stress; Investment-grade bonds outperform risky credit assets; Managers debate whether selling now locks in losses"
    ],
    "posts": [
      "YieldHunter88: This drawdown is ugly, but dumping senior paper at fire-sale levels feels like giving free money to stronger hands.\nComments: Forced sellers create bargains. / Unless redemptions hit, I would rather wait. / The hard part is knowing who has to sell.",
      "MacroNerd: Funding stress can turn a valuation debate into a cash problem. The asset can be fine long-term and still be impossible to finance short-term.\nComments: This is where leverage changes the story. / â€œHold to maturityâ€ needs cash to hold.",
      "CreditDeskGuy: Dealer quote is not the same as executable price. If you need real size today, the bid changes. If you can wait, maybe the mark is not crazy.\nComments: Liquidity depends on urgency. / Everyone says they are long-term until clients ask for cash."
    ],
    "emails": [
      "Subject: URGENT - liquidity plan before market close\nFrom: Maya Collins <maya.collins@harborpoint.com>\nTime: Friday, 11:12 AM\nTo: Investment Committee / Treasury Team\nTeam,\nWe have two issues landing simultaneously:\nRedemption questions from two clients\nA collateral request from one financing counterparty\nThe board wants a clear answer: how much cash can we raise without looking like forced sellers?\nPlease prepare a plan before market close that balances three things:\nClient confidence\nRealized losses\nLiquidity coverage over the next two weeks\nThis is time-sensitive. Let me know who is covering each asset class.\nThanks,\nMaya",
      "Subject: Margin and liquidity warning  structured holdings\nFrom: Risk System <risk.system@harborpoint.com>\nTime: Friday, 10:31 AM\nTo: Portfolio Management Team / Treasury\nTeam,\nMargin requirements have increased on structured holdings, and financial-sector collateral.\nCurrent liquidity coverage is adequate only if:\nredemptions remain near expected levels,\nliquid assets can be sold without major discount.\nPlease be aware that a forced sale of complex holdings would likely occur below current marks.\nThis is a formal warning - not a breach yet, but conditions are deteriorating.\nâ€” Risk System (automated)"
    ],
    "inboxPreview": "Sender: Maya Collins â€” URGENT â€” liquidity plan before market close\nSender: Risk System â€” Margin and liquidity warning â€” structured holdings\nUnread: 2\nPriority flags: Redemption questions; collateral call; forced-sale discount risk",
    "chats": [
      "Risk Review\nLena: The problem is no longer just valuation confidence. It is cash timing.\nYou: Could selling now overreact?\nLena: Absolutely. But if redemptions and margin calls arrive together, not selling can also become a decision.\nYou: What is the least bad path?\nLena: Raise enough liquidity without advertising distress or destroying the whole portfolio.",
      "Market Desk\nJon: Bids are still there for cleaner senior names. Lower-quality and complex stuff is much harder.\nYou: If we need cash today, what sells?\nJon: Government bonds, broad equities, maybe clean senior paper. The problem is that selling liquid assets leaves the hard stuff behind.\nYou: So liquidity quality matters.\nJon: Exactly.",
      "Committee Prep\nMaya: I need language for the committee. Are we protecting capital or admitting we were late?\nYou: Both interpretations are possible.\nMaya: Clients hate forced selling, but they also hate hearing that cash was not available when needed.\nYou: So we need liquidity without panic.\nMaya: And a story that survives tomorrowâ€™s questions."
    ],
    "files": [
      "p5-f1-margin-notice-client-redemption-log.pdf\nImportance: Yellow\nResearch cost: 2 AP\nType: Margin notice + redemption log\nPreview: Header: HarborPoint Liquidity Desk â€” Margin Notice + Client Redemption Log. Status: Urgent. Margin notice from Dealer A Collateral Operations shows one formal financing counterparty request. Client redemption log keeps active client requests to NorthLake and EastRiver, with Hillcrest as pending review/watchlist to stay consistent with Gmail wording about two clients. Liquidity sources table shows immediately usable cash, saleable IG bonds, volatile broad equity, negotiated clean senior structured exposure, and uncertain complex structured exposure. Scenario table shows expected, redemption + margin, and severe stress cash needs. Residual risk note: using only liquid assets can leave the remaining portfolio more concentrated in structured credit. Margin notice extract",
      "p5-f2-trading-desk-execution-queue.pdf\nImportance: White\nResearch cost: 1 AP\nType: Trading desk execution queue\nPreview: Header: Market Desk â€” Execution Queue: Liquidity Generation. Order queue lists proposed sales, desk status, expected settlement, and expected discount. Desk comment: execution is available in liquid assets, while structured credit execution requires smaller sizes and counterparty-specific negotiation. Order queue"
    ],
    "decisionPrompt": "Liquidity stress is now affecting the fund. Redemptions and collateral calls may require cash before complex holdings can be sold at reasonable levels. Some assets may still have long-term value, but holding them requires enough liquidity to survive near-term pressure. Your decision must balance cash generation, realized losses, client confidence, and the risk of leaving the portfolio with only hard-to-sell positions.",
    "options": [
      "A. Preserve long-term value and avoid forced liquidation of assets trading below model value.\nAllocation change: Broad Equity -5%; Financial 0%; Structured 0%; IG Bonds -5%; Cash/T-bills +10%.\nRationale: Raises some cash through liquid assets while refusing to sell structured holdings at distressed levels.\nCost: Protects long-term marks but may leave the fund with a less liquid residual portfolio if redemptions continue.",
      "B. Raise cash by selling broad equities and high-quality bonds while avoiding structured sales.\nAllocation change: Broad Equity -10%; Financial 0%; Structured 0%; IG Bonds -10%; Cash/T-bills +20%.\nRationale: Meets near-term cash needs without crystallizing losses on complex holdings.\nCost: Removes the most liquid assets first and may leave the portfolio more concentrated in hard-to-sell positions.",
      "C. Sell a controlled amount of structured exposure and financial-sector risk, then rebuild liquidity.\nAllocation change: Broad Equity -5%; Financial -10%; Structured -15%; IG Bonds +5%; Cash/T-bills +25%.\nRationale: Accepts some realized losses to avoid relying only on liquid-asset sales.\nCost: Could be viewed as admitting late risk management and may pressure marks on remaining similar holdings.",
      "D. Reduce structured exposure aggressively and move into cash/T-bills and investment-grade bonds.\nAllocation change: Broad Equity -5%; Financial -15%; Structured -25%; IG Bonds +15%; Cash/T-bills +30%.\nRationale: Creates a stronger liquidity buffer and reduces exposure to margin-call feedback loops.\nCost: Realizes losses, cuts future income, and may trigger difficult client questions about why action was not taken earlier."
    ]
  },
  {
    "title": "Phase 6: Crash & Reveal",
    "timeline": "18 September 2008 â€” Crash & Reveal",
    "marketState": "The crisis is revealed. Major intermediaries fail or require rescue, counterparty trust collapses, and forced selling turns valuation uncertainty into systemic stress.",
    "coreQuestion": "How should the fund survive when selling locks in losses, but holding complex assets may create a cash trap?",
    "historicalLogic": "Major collapse, rescue actions, and market-wide loss of confidence reveal the systemic nature of the crisis.",
    "psychology": "Panic / Reflection",
    "designRule": "Simulate survival under systemic stress. Every option should be costly, and earlier choices should affect how trapped the player feels.",
    "marketData": [
      {
        "label": "Broad Equity Index",
        "value": "-19.4%",
        "note": ""
      },
      {
        "label": "Financial Sector Basket",
        "value": "-27.5%",
        "note": ""
      },
      {
        "label": "Structured Credit Basket",
        "value": "-22.7%",
        "note": ""
      },
      {
        "label": "Investment-Grade Bond Basket",
        "value": "+1.6%",
        "note": ""
      },
      {
        "label": "Cash / Treasury Bills",
        "value": "+0.5%",
        "note": ""
      }
    ],
    "news": [
      "Large Market Intermediary Fails to Secure Rescue Deal as Credit Markets Seize Up\nSubtitle: Confidence breaks after a year of rolling interventions, failed rescues, and recurring funding stress.\nA major market intermediary failed to secure support, triggering a sharp reassessment of counterparty risk across credit markets. Dealers reduced balance-sheet commitments, funding lines were reviewed, and complex assets became difficult to sell except at distressed levels.\nMarket losses are now severe. The Broad Equity Index is down -22.5%, the Financial Sector Basket has fallen -38.0%, and Structured Income Products are down -32.0%. Defensive assets are the rare positive segment, with Investment-Grade Bonds up +6.5% and Cash/Treasury Bills up +2.4%.\nAuthorities discussed emergency liquidity measures, but investors remained unsure whether support would reach private portfolios in time to meet margin calls and client withdrawals.\nTop stories: Major intermediary failure breaks counterparty confidence; Dealers reduce balance-sheet commitments across credit markets; Investors rush toward cash and government securities",
      "Forced Selling Accelerates as Margin Calls Hit Leveraged Credit Portfolios\nSubtitle: Funds sell what they can, not necessarily what they want, as cash becomes more valuable than model marks.\nForced selling accelerated across leveraged credit portfolios as margin calls and investor withdrawals collided. Managers attempted to preserve senior and higher-quality assets, but liquid positions were often sold first because buyers were still available there.\nThe sell-off has moved far beyond isolated credit weakness. Financial-sector assets are down -38.0% and Structured Income Products have fallen -32.0%, while broad equities have dropped -22.5%. The demand for cash and government securities has intensified.\nThis created a difficult trade-off: selling safe assets raises cash quickly, while selling complex assets may crystallize deep discounts and signal distress to clients.\nTop stories: Margin calls force funds to sell liquid assets first; Complex credit bids weaken as urgency rises; Portfolio managers weigh cash needs against distress signaling",
      "Authorities Prepare Emergency Liquidity Measures as Market Confidence Breaks\nSubtitle: Policy support may calm markets eventually, but fund-level survival still depends on immediate cash and counterparty access.\nAuthorities prepared emergency liquidity measures as confidence deteriorated across funding and credit markets. Investors debated whether policy support would stabilize prices or merely slow the adjustment.\nThe policy discussion comes as risky assets face deep losses: broad equities are down -22.5%, financials are down -38.0%, and structured products are down -32.0%. Cash and Treasury bills have become a survival asset, not merely a low-return allocation.\nFor portfolio managers, the immediate question was more practical: whether they had enough cash, acceptable collateral, and client communication to survive before broader rescue measures could take effect.\nTop stories: Emergency liquidity measures move into policy discussion; Fund-level survival still depends on immediate cash access; Client communication becomes part of crisis management"
    ],
    "posts": [
      "YieldHunter88: Okay this is not normal anymore. Even good names are getting questioned. Still, selling everything today might be the worst possible execution.\nComments: Cash is king but panic has a price. / Need to survive first. / Hard to know what â€œfair valueâ€ even means now.",
      "MacroNerd: This was never just one bad asset class. It is leverage, opacity, marks, funding, and confidence hitting each other at once.\nComments: Policy can help markets, but not every portfolio. / Liquidity is a survival variable now.",
      "CreditDeskGuy: Real talk: a quote is not liquidity, a model price is not cash, and a policy headline is not a buyer for your exact position.\nComments: Treasury bills have a real bid. / Complex credit has a conversation. / Survival beats elegance today."
    ],
    "emails": [
      "Subject: URGENT - liquidity plan needed before client call\nFrom: Maya Collins <maya.collins@harborpoint.com>\nTime: Monday, 7:35 AM\nTo: Investment Committee / Treasury\nTeam,\nNorthLake just requested a call before noon. They are worried about three things:\ncounterparty exposure,\nredemption timing,\nwhether our marks reflect executable prices.\nThe board needs a survival plan - immediately. Please prepare:\nImmediate cash sources â€“ what can we access today?\nDistressed sale red lines â€“ what will we not sell below certain levels?\nCommunication script â€“ how do we explain this without creating panic?\nI need this on my desk by 9:00 AM. The call is at 11:00.\nThanks,\nMaya",
      "Subject: Critical risk breach - liquidity and counterparty exposure\nFrom: Risk System <risk.system@harborpoint.com>\nTime: Tuesday, 6:58 AM\nTo: Investment Committee / Treasury / Portfolio Management\nBREACH TRIGGERED\nThe following risk metrics have deteriorated simultaneously:\nCounterparty limits\nLiquidity coverage\nQuote reliability (across multiple structured holdings)\nCritical assessment: Current marks should not be treated as executable prices for large trades.\nImmediate actions required:\nPreserve cash\nConfirm funding lines are still available\nReduce weakest exposures where bids exist (even if below marks)\nDocument all client communication regarding valuations and redemption terms\nThis is an official risk breach. Please acknowledge receipt.\nâ€” Risk System (automated)"
    ],
    "inboxPreview": "Sender: Maya Collins â€” URGENT â€” liquidity plan needed before client call\nSender: Risk System â€” Critical risk breach â€” liquidity and counterparty exposure\nUnread: 2\nPriority flags: Client call; counterparty limits; survival plan required",
    "chats": [
      "Risk Review\nLena: The issue is no longer early warning. The stress is here.\nYou: Is there any clean answer?\nLena: No. Sell too much and we lock in panic prices. Sell too little and we may fail liquidity needs.\nYou: What matters first?\nLena: Survival, documentation, client trust, and knowing which positions still have real bids.",
      "Market Desk\nJon: Treasury bills are bid like crazy. Anything complex is being negotiated one call at a time.\nYou: Can we sell structured assets?\nJon: Some, but not at yesterdayâ€™s marks and not in unlimited size.\nYou: What about financial-sector positions?\nJon: Liquid names trade, but prices are moving violently. Execution risk is huge.",
      "Committee Prep\nMaya: We need a decision the board can defend tomorrow morning.\nYou: Defensive action may look like panic.\nMaya: Inaction may look worse if redemptions accelerate.\nYou: What do clients need to hear?\nMaya: That we know what can be sold, what should not be dumped, and how long our cash lasts."
    ],
    "files": [
      "p6-f1-landon-brothers-emergency-filing-extract.pdf\nImportance: White\nResearch cost: 1 AP\nType: Emergency filing extract + exposure note\nPreview: Header: Landon Brothers Holdings Inc. â€” Emergency Filing Extract + HarborPoint Exposure Note. Event summary: weekend rescue talks failed after counterparties refused to roll short-term funding. Clearing banks requested additional collateral before Monday open. Several structured credit desks suspended normal bid indications. Landon Brothers filed for court protection Monday morning. HarborPoint exposure table separates direct exposure from broader trading, repo, and structured-product links. Immediate market effect: dealer balance sheets pulled back; indicative quotes are no longer reliable for several complex credit positions; â€œno firm bidâ€ is increasingly common. Internal note: direct bond exposure is limited, but trading, repo, and structured-product links create broader liquidity and counterparty exposure. HarborPoint exposure",
      "p6-f2-counterparty-freeze-list-funding-line-status.pdf\nImportance: Yellow\nResearch cost: 2 AP\nType: Counterparty freeze list + funding-line status\nPreview: Header: HarborPoint Crisis Desk â€” Counterparty Freeze List + Funding-Line Status. Status: Critical. Counterparty status table lists Landon Brothers, Boreal Legacy Vehicle, a major protection seller, and emergency liquidity facility status. Keep names limited to avoid overwhelming the player. Funding lines table separates capacity from usable now: confirmed, conditional, frozen, and restricted lines. Liquidity runway table shows base case, redemption stress, and counterparty freeze case. Quote reliability table shows why model marks and policy headlines should not be treated as cash today. Emergency thresholds define red flags for liquidity runway, quote reliability, and client cash demand. Crisis desk note: the board requires a three-hour liquidity update, including usable funding lines, executable assets, and client communication points."
    ],
    "decisionPrompt": "The market has moved from stress to systemic crisis after a major intermediary failed to secure support. The fund needs a survival decision under extreme uncertainty. Selling everything may raise cash but lock in distressed prices and alarm clients. Holding complex assets may preserve future value but risks a liquidity failure. Your decision must prioritize survival while remaining explainable to the board and clients.",
    "options": [
      "A. Sell structured income and financial-sector exposure aggressively to raise immediate cash.\nAllocation change: Broad Equity 0%; Financial -15%; Structured -25%; IG Bonds +10%; Cash/T-bills +30%.\nRationale: Maximizes liquidity quickly and reduces exposure to further systemic deterioration.\nCost: Locks in distressed prices, signals distress to clients, and may sacrifice recovery value if policy support stabilizes markets.",
      "B. Raise liquidity using the most liquid assets first, reduce weakest structured exposure only where real bids exist.\nAllocation change: Broad Equity -10%; Financial -5%; Structured -10%; IG Bonds +5%; Cash/T-bills +20%.\nRationale: Balances cash generation with avoiding indiscriminate forced selling.\nCost: May not raise enough cash if redemptions accelerate and could still leave sizable complex exposure.",
      "C. Preserve distressed structured positions, suspend discretionary risk-taking, and negotiate funding lines.\nAllocation change: Broad Equity -5%; Financial -5%; Structured 0%; IG Bonds 0%; Cash/T-bills +10%.\nRationale: Avoids dumping complex assets at panic prices while trying to survive through funding support.\nCost: Highly dependent on counterparties and client patience; if funding lines fail, the fund may be forced to sell later at worse prices.",
      "D. Raise cash, freeze new risk-taking, communicate transparently with clients, and seek backup liquidity lines.\nAllocation change: Broad Equity -10%; Financial -10%; Structured -15%; IG Bonds +5%; Cash/T-bills +30%.\nRationale: Prioritizes survival, governance, and client trust without selling every complex asset at any price.\nCost: Still crystallizes losses, may not satisfy all redemptions if panic deepens, and public defensiveness could further damage confidence."
    ]
  }
];

let activeEmailIndex = 0;
let activeChatIndex = 0;
let activeNewsIndex = 0;
let phaseTimers = [];
let currentTab = "news";
let selectedDecision = null;
let unlockedChannels = {};
let unreadChannels = {};
let viewedChannels = {};
let activeChannel = null;
let activeChannelStart = null;
let activeDocumentSession = null;
let gameState = initialState();

function initialState() {
  return {
    phase: 1,
    pv: INITIAL_PORTFOLIO_VALUE,
    peakPV: INITIAL_PORTFOLIO_VALUE,
    rb: 0,
    awardedPhases: [],
    documentsRead: [],
    documentsReadByPhase: {},
    documentEngagement: {},
    sourceEngagement: {},
    sourceTimeByPhase: {},
    emailReplies: {},
    socialReplies: {},
    chatReplies: {},
    decisionLog: [],
    lastOutcomeText: "",
    allocation: {
      broad_equity: 0.40,
      financial_sector: 0.10,
      structured_credit: 0.05,
      ig_bonds: 0.25,
      cash: 0.20
    }
  };
}

/* =========================
   DATA PARSERS
========================= */

function parseNewsCell(text, phaseIndex, newsIndex, customTopStories = null) {
  const lines = cleanText(text).split(/\n+/).map(x => x.trim()).filter(Boolean);
  const headline = lines[0] || `News ${newsIndex}`;
  let subtitle = "";
  const body = [];
  let stories = [];

  lines.slice(1).forEach(line => {
    if (/^Subtitle:/i.test(line)) {
      subtitle = line.replace(/^Subtitle:\s*/i, "");
    } else if (/^Top stories:/i.test(line)) {
      const raw = line.replace(/^Top stories:\s*/i, "");
      stories = raw.split(/;|\|/).map(x => x.trim()).filter(Boolean);
    } else if (/^Top signals:/i.test(line)) {
      // Hidden design cue only. Do not display in the news UI.
    } else {
      body.push(line);
    }
  });

  if (customTopStories && customTopStories.length) stories = customTopStories;

  return {
    brand: newsIndex === 1 ? "MARKET WATCH" : newsIndex === 2 ? "CREDIT DAILY" : "FINANCIAL TIMES",
    url: `https://freefall.local/p${phaseIndex}/news-${newsIndex}`,
    headline,
    subtitle,
    date: `Phase ${phaseIndex} update`,
    body,
    stories: stories.length ? stories : ["Market conditions remain uncertain", "Investors review liquidity risk", "Committees debate allocation strategy"],
    image: `asset/p${phaseIndex}-n${newsIndex}.jpg`
  };
}

function parsePostCell(text, index) {
  const source = cleanText(text).trim();
  const lines = source.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const firstLine = lines.shift() || `MarketUser${index}: Market update.`;
  const colon = firstLine.indexOf(":");
  const name = colon > -1 ? firstLine.slice(0, colon).trim() : `MarketUser${index}`;
  const message = colon > -1 ? firstLine.slice(colon + 1).trim() : firstLine;
  const commentsLine = lines.find(line => /^Comments:/i.test(line)) || "";
  const comments = commentsLine
    ? commentsLine.replace(/^Comments:\s*/i, "").split("/").map(x => x.trim()).filter(Boolean)
    : ["This is what the market is debating.", "Not everyone agrees."];

  return {
    name,
    handle: `@${name.replace(/[^a-zA-Z0-9]/g, "") || "market"}`,
    text: message,
    comments,
    stats: `${80 + index * 45} replies · ${300 + index * 210} reposts · ${1200 + index * 900} likes`
  };
}

function parseEmailCell(text) {
  const lines = cleanText(text).split(/\n+/).map(x => x.trim()).filter(Boolean);
  let subject = "Inbox update";
  let sender = "Unknown Sender";
  let email = "unknown@freefall.local";
  let time = "09:00 AM";
  const body = [];

  lines.forEach(line => {
    if (/^Subject:/i.test(line)) {
      subject = line.replace(/^Subject:\s*/i, "");
    } else if (/^From:/i.test(line)) {
      const raw = line.replace(/^From:\s*/i, "");
      const match = raw.match(/^(.*?)\s*<([^>]+)>/);
      if (match) {
        sender = match[1].trim();
        email = match[2].trim();
      } else {
        sender = raw;
      }
    } else if (/^(Time|Sent):/i.test(line)) {
      time = line.replace(/^(Time|Sent):\s*/i, "");
    } else {
      body.push(line);
    }
  });

  const joined = body.join(" ");
  return {
    sender,
    email,
    subject,
    preview: joined.length > 120 ? joined.slice(0, 120) + "..." : joined,
    time,
    body
  };
}

function parseChatCell(text) {
  const lines = cleanText(text).split(/\n+/).map(x => x.trim()).filter(Boolean);
  const contact = lines.shift() || "Chat";
  const messages = lines.map(line => {
    const colon = line.indexOf(":");
    if (colon > -1) return { from: line.slice(0, colon).trim(), text: line.slice(colon + 1).trim() };
    return { from: "System", text: line };
  });
  return { contact, messages };
}

function parseFileCell(text, phaseIndex, fileIndex) {
  const lines = cleanText(text).split(/\n+/).map(x => x.trim()).filter(Boolean);
  const originalName = lines[0] || `p${phaseIndex}-f${fileIndex}.pdf`;
  const fileName = `p${phaseIndex}-f${fileIndex}.pdf`;
  const cardPreview = FILE_CARD_PREVIEWS?.[phaseIndex]?.[fileIndex] || null;

  if (cardPreview) {
    return {
      id: `p${phaseIndex}-f${fileIndex}`,
      title: cleanText(cardPreview.title),
      fileName,
      originalName,
      type: cleanText(cardPreview.type),
      meta: `${cardPreview.cost} RB`,
      cost: cardPreview.cost,
      important: cardPreview.cost === 2,
      summary: cleanText(cardPreview.preview),
      sections: [
        { heading: "Type", text: cleanText(cardPreview.type) },
        { heading: "Research cost", text: `${cardPreview.cost} RB` },
        { heading: "Preview", text: cleanText(cardPreview.preview) },
        { heading: "Original file label", text: cleanText(originalName) }
      ],
      data: [],
      pdfPath: `asset/${fileName}`
    };
  }

  const preview = lines.slice(1).join(" ").replace(/^Preview:\s*/i, "") || "Phase document.";
  const costMatch = `${originalName} ${preview}`.match(/\((\d+)\s*RB\)|\((\d+)\s*AP\)|cost\s*:?\s*(\d+)/i);
  const important = fileIndex === 2 || /yellow|important|warning|stress|funding|rating|prospectus|liquidity|correlation|internal|model|appendix/i.test(`${originalName} ${preview}`);
  const cost = costMatch ? Number(costMatch[1] || costMatch[2] || costMatch[3]) : (important ? 2 : 1);
  const prettyTitle = originalName.replace(/\.pdf$/i, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return {
    id: `p${phaseIndex}-f${fileIndex}`,
    title: prettyTitle,
    fileName,
    originalName,
    type: fileIndex === 1 ? "Research note" : "Technical appendix",
    meta: `${cost} RB`,
    cost,
    important,
    summary: preview,
    sections: [
      { heading: "Preview", text: preview },
      { heading: "Research cost", text: `${cost} RB` },
      { heading: "Original file label", text: originalName }
    ],
    data: [],
    pdfPath: `asset/${fileName}`
  };
}

function parseDecisionOption(text, optionIndex) {
  const source = cleanText(text).trim();
  const lines = source.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const first = lines[0] || `Option ${optionIndex}`;
  const textOnly = first.replace(/^[A-D]\.\s*/i, "");
  const allocationLine = lines.find(line => /^Allocation change:/i.test(line)) || "";
  let allocationDelta = parseAllocationDelta(allocationLine);

  // If the content has no explicit allocation line, infer a small rule-based move
  // from the language of the option. This supports the newer decision-chain sheet.
  if (!Object.keys(allocationDelta).length) allocationDelta = inferAllocationDeltaFromText(source);
  const riskScore = estimateRiskScore(allocationDelta, source);
  const optionLetter = (first.match(/^([A-D])\./i) || [null, String.fromCharCode(64 + optionIndex)])[1].toUpperCase();

  return {
    id: `option-${optionIndex}`,
    optionLetter,
    text: textOnly,
    note: allocationLine,
    allocationDelta,
    txsDelta: riskScore.txsDelta,
    lqsDelta: riskScore.lqsDelta,
    awsDelta: riskScore.awsDelta,
    fomoDelta: riskScore.fomoDelta,
    advisorDelta: riskScore.advisorDelta
  };
}

function parseAllocationDelta(line) {
  const delta = {};
  ASSET_KEYWORDS.forEach(([label, key]) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escaped}\\s*([+-]?\\d+(?:\\.\\d+)?)%`, "i");
    const match = line.match(regex);
    if (match) delta[key] = (delta[key] || 0) + Number(match[1]) / 100;
  });
  return delta;
}

function inferAllocationDeltaFromText(source) {
  const st = String(source || "").toLowerCase();
  if (/aggressively increase|continue increasing|increase.*structured|increase.*financial|add selectively|spread-widened/.test(st)) {
    return { financial_sector: 0.08, structured_credit: 0.08, ig_bonds: -0.06, cash: -0.10 };
  }
  if (/moderately increase|limited|small increase/.test(st)) {
    return { financial_sector: 0.03, structured_credit: 0.05, ig_bonds: -0.03, cash: -0.05 };
  }
  if (/maintain|monitor|stop new buying|hold/.test(st)) return {};
  if (/reduce|cut|exit|raise cash|sell structured|controlled sale|freeze/.test(st)) {
    return { financial_sector: -0.06, structured_credit: -0.10, ig_bonds: 0.06, cash: 0.10 };
  }
  if (/sell broad equity|use liquid assets/.test(st)) {
    return { broad_equity: -0.08, ig_bonds: -0.06, cash: 0.14 };
  }
  return {};
}

function estimateRiskScore(delta, source) {
  const risky = (delta.financial_sector || 0) + (delta.structured_credit || 0);
  const defensive = (delta.cash || 0) + (delta.ig_bonds || 0);
  return {
    txsDelta: clamp(Math.round((delta.structured_credit || 0) * 100), -30, 40),
    lqsDelta: clamp(Math.round(defensive * 100 - risky * 80), -35, 35)
  };
}

function buildPhases() {
  return RAW_PHASES.map((raw, idx) => {
    const phaseIndex = idx + 1;
    return {
      title: cleanText(raw.title),
      timeline: cleanText(raw.timeline),
      decisionPrompt: cleanText(raw.decisionPrompt),
      tasks: {
        news: "Read 3 news updates",
        social: "Check 3 internet posts",
        email: "Open Gmail updates",
        chat: "Read team chats",
        file: "Review 2 files",
        decision: "Make 1 portfolio decision"
      },
      marketData: raw.marketData,
      content: {
        news: raw.news.map((cell, newsIdx) => parseNewsCell(cell, phaseIndex, newsIdx + 1, raw.topStories ? raw.topStories[newsIdx] : null)),
        social: {
          trends: ["#FreeFall", "#CreditRisk", "#Liquidity", "#MarketSignals"],
          posts: raw.posts.map((cell, postIdx) => parsePostCell(cell, postIdx + 1))
        },
        email: raw.emails.map(parseEmailCell),
        chat: raw.chats.map(parseChatCell)
      },
      documents: raw.files.map((cell, fileIdx) => parseFileCell(cell, phaseIndex, fileIdx + 1)),
      decisions: raw.options.map((cell, optIdx) => parseDecisionOption(cell, optIdx + 1)),
      transition: phaseIndex === 6 ? "The crisis map ends. Hidden variables are revealed." : `Phase ${phaseIndex + 1} information is now arriving.`
    };
  });
}

const phases = buildPhases();


/* =========================
   READING / SKIM TRACKING
========================= */

function ensurePhaseSourceTime(phaseNumber) {
  if (!gameState.sourceTimeByPhase[phaseNumber]) gameState.sourceTimeByPhase[phaseNumber] = {};
  return gameState.sourceTimeByPhase[phaseNumber];
}

function recordSourceTime(tab, durationMs) {
  if (!tab || durationMs <= 0 || !gameState) return;
  const bucket = ensurePhaseSourceTime(gameState.phase);
  bucket[tab] = (bucket[tab] || 0) + durationMs;
}

function ensurePhaseSourceEngagement(phaseNumber) {
  if (!gameState.sourceEngagement[phaseNumber]) gameState.sourceEngagement[phaseNumber] = {};
  return gameState.sourceEngagement[phaseNumber];
}

function ensureSourceBucket(phaseNumber, tab) {
  const phaseBucket = ensurePhaseSourceEngagement(phaseNumber);
  if (!phaseBucket[tab]) phaseBucket[tab] = { items: {} };
  return phaseBucket[tab];
}

function markSourceItemViewed(tab, itemIndex) {
  if (!tab || itemIndex === null || itemIndex === undefined || !gameState) return;
  const bucket = ensureSourceBucket(gameState.phase, tab);
  const key = String(itemIndex);
  if (!bucket.items[key]) bucket.items[key] = { opened: false, maxScroll: 0 };
  bucket.items[key].opened = true;
}

function recordSourceScroll(tab, itemIndex, scrollFraction) {
  if (!tab || itemIndex === null || itemIndex === undefined || !gameState) return;
  const bucket = ensureSourceBucket(gameState.phase, tab);
  const key = String(itemIndex);
  if (!bucket.items[key]) bucket.items[key] = { opened: true, maxScroll: 0 };
  bucket.items[key].opened = true;
  bucket.items[key].maxScroll = Math.max(bucket.items[key].maxScroll || 0, clamp(scrollFraction || 0, 0, 1));
}

function trackChannelView(tab) {
  const now = Date.now();
  if (activeChannel && activeChannelStart && activeChannel !== tab) {
    recordSourceTime(activeChannel, now - activeChannelStart);
  }
  if (activeChannel !== tab) {
    activeChannel = tab;
    activeChannelStart = now;
  }
}

function flushActiveChannelTime() {
  if (activeChannel && activeChannelStart) {
    recordSourceTime(activeChannel, Date.now() - activeChannelStart);
    activeChannelStart = Date.now();
  }
}

function sourceReadingStatus(tab, ms, scrollFraction = 0) {
  const rule = SOURCE_QUALITY_RULES[tab] || SOURCE_QUALITY_RULES.file;
  if (!ms || ms < rule.skimMs) return { label: "Skim / click-through", multiplier: 0.25, score: 25 };
  if (ms >= rule.meaningfulMs && scrollFraction >= rule.meaningfulScroll) {
    return { label: "Meaningful read", multiplier: 1.00, score: 100 };
  }
  return { label: "Partial read", multiplier: 0.60, score: 60 };
}

function readingStatusFromMs(ms) {
  return sourceReadingStatus("file", ms, 1);
}

function formatSeconds(ms) {
  return `${Math.round((ms || 0) / 1000)}s`;
}

function startDocumentSession(docItem) {
  finalizeDocumentSession();
  activeDocumentSession = {
    id: docItem.id,
    phase: gameState.phase,
    startedAt: Date.now()
  };
}

function finalizeDocumentSession() {
  if (!activeDocumentSession || !gameState) return;
  const durationMs = Date.now() - activeDocumentSession.startedAt;
  const status = readingStatusFromMs(durationMs);
  const existing = gameState.documentEngagement[activeDocumentSession.id] || { totalMs: 0, opens: 0, bestScore: 0, bestLabel: "Not read" };
  existing.totalMs += durationMs;
  existing.opens += 1;
  const combined = readingStatusFromMs(existing.totalMs);
  existing.bestScore = Math.max(existing.bestScore, combined.score);
  existing.bestLabel = combined.label;
  existing.phase = activeDocumentSession.phase;
  gameState.documentEngagement[activeDocumentSession.id] = existing;
  activeDocumentSession = null;
}

function getDocumentReadQuality(docId) {
  const engagement = gameState.documentEngagement[docId];
  if (!engagement) return { label: "Opened but not timed", multiplier: 0.25, score: 25, totalMs: 0 };
  const status = sourceReadingStatus("file", engagement.totalMs, 1);
  return { ...status, totalMs: engagement.totalMs, opens: engagement.opens };
}

function calculateScrollFraction(element) {
  if (!element) return 0;
  const scrollable = element.scrollHeight - element.clientHeight;
  if (scrollable <= 0) return 1;
  return clamp(element.scrollTop / scrollable, 0, 1);
}

function registerSourceScroll(selector, tab, itemIndexes) {
  const element = document.querySelector(selector);
  if (!element) return;
  const indexes = Array.isArray(itemIndexes) ? itemIndexes : [itemIndexes];
  const update = () => {
    const fraction = calculateScrollFraction(element);
    indexes.forEach(index => recordSourceScroll(tab, index, fraction));
  };
  update();
  element.addEventListener("scroll", update, { passive: true });
}

/* =========================
   BASIC HELPERS
========================= */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getPhase() {
  return phases[gameState.phase - 1];
}

function showPage(pageName) {
  Object.values(pages).forEach(page => {
    if (page) page.classList.remove("active");
  });
  if (pages[pageName]) pages[pageName].classList.add("active");
  document.body.classList.toggle("game-mode", pageName === "game");
  document.documentElement.classList.toggle("game-mode", pageName === "game");
  if (pageName !== "game") updateCrisisAtmosphere(0);
}

function setActiveSidebar(tab) {
  currentTab = tab;
  sideButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
}

function escapeHTML(str) {
  return cleanText(str).replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag]));
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/Â·/g, "·")
    .replace(/â€¦/g, "...")
    .replace(/â€”|â€“/g, "-")
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/Ă—/g, "x")
    .replace(/â†/g, "<-")
    .replace(/â†»/g, "Refresh")
    .replace(/â™¡/g, "Like")
    .replace(/âœ“/g, "Done")
    .replace(/đŸ’¬/g, "Chat")
    .replace(/đŸ“„/g, "File")
    .replace(/đŸ“/g, "Folder")
    .replace(/đŸ”’/g, "Locked")
    .replace(/đ•/g, "X");
}

function short(text, len) {
  const clean = cleanText(text);
  return clean.length > len ? clean.slice(0, len - 1) + "..." : clean;
}

function getHost(url) {
  try { return new URL(url).hostname; } catch { return "market.local"; }
}

function getBrandShortName(brand) {
  return brand.replace("THE ", "").replace("MAGAZINE", "Mag").replace("JOURNAL", "Journal").replace("NETWORK", "Network").replace("TIMES", "Times");
}

function getNewsTheme(brand) {
  if (/MAGAZINE/i.test(brand)) return "theme-magazine";
  if (/JOURNAL|TIMES|ECONOMIST/i.test(brand)) return "theme-journal";
  if (/NETWORK|TV|WIRE|REUTERS|ALERT/i.test(brand)) return "theme-wire";
  return "theme-paper";
}

function updateCrisisAtmosphere(phaseNumber = gameState?.phase || 0) {
  const phaseClasses = Array.from({ length: phases.length }, (_, index) => `phase-${index + 1}`);
  document.body.classList.remove(...CRISIS_STAGE_CLASSES, ...phaseClasses);
  document.documentElement.classList.remove(...CRISIS_STAGE_CLASSES, ...phaseClasses);
  if (!phaseNumber) return;

  const stageClass = CRISIS_STAGE_CLASSES[clamp(phaseNumber - 1, 0, CRISIS_STAGE_CLASSES.length - 1)];
  document.body.classList.add(stageClass, `phase-${phaseNumber}`);
  document.documentElement.classList.add(stageClass, `phase-${phaseNumber}`);
}

function getArrivalDelayForPhase() {
  const phasePacing = [3000, 2600, 2200, 1700, 1300, 950];
  return phasePacing[clamp(gameState.phase - 1, 0, phasePacing.length - 1)];
}

/* =========================
   AUTO REVEAL
========================= */

function clearPhaseTimers() {
  phaseTimers.forEach(timer => clearTimeout(timer));
  phaseTimers = [];
}

function initializeAutoReveal() {
  clearPhaseTimers();
  updateCrisisAtmosphere();
  selectedDecision = null;
  activeNewsIndex = 0;
  activeEmailIndex = 0;
  activeChatIndex = 0;
  activeChannel = null;
  activeChannelStart = null;
  unlockedChannels = {};
  unreadChannels = {};
  viewedChannels = {};

  CHANNEL_ORDER.forEach(tab => {
    unlockedChannels[tab] = false;
    unreadChannels[tab] = false;
    viewedChannels[tab] = false;
  });

  unlockChannel("news", true);

  const phaseArrivalDelay = getArrivalDelayForPhase();
  CHANNEL_ORDER.slice(1).forEach((tab, index) => {
    const timer = setTimeout(() => {
      unlockChannel(tab, true);
      showArrival(tab);
      if (currentTab === tab) renderContent(tab);
      updateStatus();
      renderTasks();
      renderNotificationDots();
      updateNextButtonState();
    }, phaseArrivalDelay * (index + 1));
    phaseTimers.push(timer);
  });

  setActiveSidebar("news");
}

function unlockChannel(tab, makeUnread) {
  unlockedChannels[tab] = true;
  if (makeUnread) unreadChannels[tab] = true;
}

function showArrival(tab) {
  if (!arrivalCard) return;
  arrivalCard.textContent = `${CHANNEL_LABELS[tab]} update received`;
  arrivalCard.classList.remove("urgent");
  arrivalCard.classList.add("show");
  if (gameState.phase >= 4 || tab === "decision") arrivalCard.classList.add("urgent");
  setTimeout(() => arrivalCard.classList.remove("show", "urgent"), gameState.phase >= 5 ? 1500 : 2200);
}

function renderNotificationDots() {
  sideButtons.forEach(btn => {
    const tab = btn.dataset.tab;
    btn.classList.toggle("has-new", Boolean(unreadChannels[tab]));
    btn.classList.toggle("locked-channel", !unlockedChannels[tab]);
  });
}

function markViewed(tab) {
  viewedChannels[tab] = true;
  unreadChannels[tab] = false;
  renderNotificationDots();
  renderTasks();
}

/* =========================
   STATUS RENDER
========================= */

function updateStatus() {
  const phaseNumber = gameState.phase;
  const totalPhases = phases.length;
  const percent = Math.round((phaseNumber / totalPhases) * 100);
  updateCrisisAtmosphere(phaseNumber);

  if (phaseLabel) phaseLabel.textContent = `Phase ${phaseNumber}/${totalPhases}`;
  if (progressPercent) progressPercent.textContent = `${percent}%`;
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (portfolioValue) portfolioValue.textContent = formatMoney(gameState.pv);
  if (researchBudget) researchBudget.textContent = `${gameState.rb} RB`;

  renderMarketData();
  renderAllocation();

  if (lastOutcome) {
    if (gameState.lastOutcomeText) {
      lastOutcome.classList.add("show");
      lastOutcome.textContent = gameState.lastOutcomeText;
    } else {
      lastOutcome.classList.remove("show");
      lastOutcome.textContent = "";
    }
  }
}

function renderMarketData() {
  const phase = getPhase();

  // Only show stylized phase returns from the phase sheet here.
  // Research Budget, allocation, safe-asset exposure, and risk exposure already
  // have their own dashboard sections, so we keep this grid clean and non-repetitive.
  const seen = new Set();
  const data = (phase.marketData || [])
    .map(normalizeMarketDataItem)
    .filter(item => {
      const key = item.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  marketDataGrid.innerHTML = data.map((item, index) => {
    const isWide = data.length % 2 === 1 && index === data.length - 1;
    const compactValue = item.value.replace(/\s+/g, "");
    const isDoubleDigitMove = /^[-+]?\d{2,}(?:\.\d+)?%/.test(compactValue);
    const isNegativeMove = compactValue.startsWith("-");
    const isStressAsset = gameState.phase >= 4 && /Financial|Structured/i.test(item.label);
    return `
      <div class="market-card${isWide ? " market-card-wide" : ""}${isDoubleDigitMove ? " market-card-double-digit" : ""}${isNegativeMove ? " market-card-negative" : ""}${isStressAsset ? " market-card-stress" : ""}">
        <small>${escapeHTML(item.label)}</small>
        <strong>${escapeHTML(item.value)}</strong>
        ${item.note ? `<span>${escapeHTML(item.note)}</span>` : ""}
      </div>
    `;
  }).join("");
}

function normalizeMarketDataItem(item) {
  const labelMap = {
    "Structured Credit Basket": "Structured Income Products",
    "Investment-Grade Bond Basket": "Investment-Grade Bonds"
  };
  const rawLabel = item?.label || "Market Indicator";
  const label = labelMap[rawLabel] || rawLabel;
  let value = String(item?.value || "").trim();

  // Sheet values may come as "4.8%". Display positive phase returns as "+4.8%"
  // for consistency with the dashboard design. Negative values and existing signs are preserved.
  if (/^\d/.test(value)) value = `+${value}`;

  return {
    label,
    value,
    note: item?.note || ""
  };
}

function renderAllocation() {
  if (!allocationList) return;
  allocationList.innerHTML = "";

  Object.entries(gameState.allocation).forEach(([asset, weight]) => {
    if (weight <= 0.005) return;
    const row = document.createElement("div");
    row.className = "allocation-row";
    row.innerHTML = `
      <span>${ASSET_LABELS[asset]}</span>
      <div class="allocation-bar">
        <div class="allocation-fill" style="width:${Math.round(weight * 100)}%"></div>
      </div>
      <strong>${Math.round(weight * 100)}%</strong>
    `;
    allocationList.appendChild(row);
  });
}

function renderTasks() {
  if (!taskList) return;
  const phase = getPhase();
  taskList.innerHTML = "";

  Object.entries(phase.tasks).forEach(([key, label]) => {
    const done = key === "decision" ? Boolean(selectedDecision) : Boolean(viewedChannels[key]);
    const unlocked = Boolean(unlockedChannels[key]);
    const li = document.createElement("li");
    li.className = `${done ? "done" : ""} ${!unlocked ? "task-locked" : ""}`.trim();
    let status = "pending";
    if (done) status = "done";
    else if (!unlocked) status = "locked";
    else if (unreadChannels[key]) status = "new";
    li.innerHTML = `<span class="task-status-icon ${status}" aria-hidden="true"></span><span>${escapeHTML(label)}</span>`;
    taskList.appendChild(li);
  });
}

function updateNextButtonState() {
  if (!nextPhaseBtn) return;

  if (!unlockedChannels.decision) {
    nextPhaseBtn.textContent = "Waiting for information...";
    nextPhaseBtn.disabled = true;
    return;
  }

  if (!selectedDecision) {
    nextPhaseBtn.textContent = "Select 1 action";
    nextPhaseBtn.disabled = false;
    return;
  }

  nextPhaseBtn.textContent = gameState.phase === phases.length ? "Finish Simulation" : "Confirm & Continue";
  nextPhaseBtn.disabled = false;
}

/* =========================
   CHANNEL RENDER
========================= */

function renderContent(tab) {
  trackChannelView(tab);
  const phase = getPhase();
  if (!unlockedChannels[tab]) {
    renderLockedChannel(tab);
    return;
  }

  markViewed(tab);

  if (tab === "news") renderNews(phase.content.news);
  if (tab === "social") renderSocial(phase.content.social);
  if (tab === "email") renderEmail(phase.content.email);
  if (tab === "chat") renderChat(phase.content.chat);
  if (tab === "file") renderFiles(phase.documents);
  if (tab === "decision") renderDecision(phase);

  updateNextButtonState();
}

function renderLockedChannel(tab) {
  const current = CHANNEL_ORDER.find(ch => unlockedChannels[ch]) || "news";
  contentBox.innerHTML = `
    <div class="locked-screen">
      <div class="locked-card-big">
        <div class="locked-icon">${ICON_SVGS.locked}</div>
        <h2>${CHANNEL_LABELS[tab]} is not available yet</h2>
        <p>Information arrives automatically over time. Wait for the next notification or return to the current channel.</p>
        <button class="primary-btn" id="go-current-channel">Go to current channel</button>
      </div>
    </div>
  `;
  document.getElementById("go-current-channel").addEventListener("click", () => {
    setActiveSidebar(current);
    renderContent(current);
  });
}

/* =========================
   NEWS
========================= */

function renderNews(articles) {
  const article = articles[activeNewsIndex];
  const themeClass = getNewsTheme(article.brand);
  markSourceItemViewed("news", activeNewsIndex);

  contentBox.innerHTML = `
    <div class="app-window news-app ${themeClass}">
      <div class="browser-tabs">
        ${articles.map((item, index) => `
          <button class="browser-tab ${index === activeNewsIndex ? "active" : ""}" data-news-index="${index}">
            <span>${short(getBrandShortName(item.brand), 24)}</span>
            <small>${getHost(item.url)}</small>
          </button>
        `).join("")}
      </div>

      <div class="news-browser-top">
        <span class="browser-dot"></span>
        <span class="browser-dot"></span>
        <span class="browser-dot"></span>
        <div class="browser-url">${article.url}</div>
      </div>

      <div class="news-page">
        <div class="news-brand">${cleanText(article.brand)}</div>
        <div class="news-grid">
          <article class="news-article">
            <h1>${cleanText(article.headline)}</h1>
            <div class="news-subtitle">${cleanText(article.subtitle)}</div>
            <div class="news-meta">${cleanText(article.date)}</div>
            ${article.image ? `<img class="news-image" src="${article.image}" alt="${escapeHTML(article.headline)}">` : `<div class="news-image-placeholder"></div>`}
            ${article.body.map(paragraph => `<p>${cleanText(paragraph)}</p>`).join("")}
          </article>
          <aside class="top-stories">
            <h3>Top stories</h3>
            ${article.stories.map(story => `<div class="story-card">${cleanText(story)}</div>`).join("")}
          </aside>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll(".browser-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeNewsIndex = Number(btn.dataset.newsIndex);
      renderNews(articles);
    });
  });
  registerSourceScroll(".news-page", "news", activeNewsIndex);
}

/* =========================
   SOCIAL
========================= */

function renderSocial(data) {
  const postIndexes = data.posts.map((_, index) => index);
  postIndexes.forEach(index => markSourceItemViewed("social", index));
  contentBox.innerHTML = `
    <div class="app-window social-app">
      <aside class="social-left">
        <div class="social-logo">${ICON_SVGS.social}</div>
        <div class="social-menu">
          <div class="active">Home</div>
          <div>Search</div>
          <div>Notifications</div>
          <div>Messages</div>
        </div>
      </aside>
      <main class="social-feed">
        <div class="compose-box">What's going on?</div>
        ${data.posts.map((postItem, index) => renderPost(postItem, index)).join("")}
      </main>
      <aside class="trends">
        <div class="trend-box">
          <h3>What's happening</h3>
          ${data.trends.map(trend => `<div>${cleanText(trend)}</div>`).join("")}
        </div>
      </aside>
    </div>
  `;

  document.querySelectorAll(".reply-post-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.postIndex;
      const input = document.querySelector(`.post-reply-input[data-post-index="${index}"]`);
      if (!input || !input.value.trim()) return;
      if (!gameState.socialReplies[gameState.phase]) gameState.socialReplies[gameState.phase] = {};
      if (!gameState.socialReplies[gameState.phase][index]) gameState.socialReplies[gameState.phase][index] = [];
      gameState.socialReplies[gameState.phase][index].push(input.value.trim());
      input.value = "";
      renderSocial(getPhase().content.social);
    });
  });
  registerSourceScroll(".social-feed", "social", postIndexes);
}

function renderPost(postItem, index) {
  const replies = gameState.socialReplies[gameState.phase] && gameState.socialReplies[gameState.phase][index]
    ? gameState.socialReplies[gameState.phase][index]
    : [];

  return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar"></div>
        <div class="post-name">
          <strong>${postItem.name}</strong>
          <small>${cleanText(postItem.handle)} · now</small>
        </div>
      </div>
      <p>${cleanText(postItem.text)}</p>
      <div class="post-actions">
        <span>${inlineIcon("reply")} Reply</span>
        <span>${inlineIcon("repost")} Repost</span>
        <span>${inlineIcon("like")} Like</span>
        <span>${cleanText(postItem.stats)}</span>
      </div>
      <div class="comment-box">
        <strong>Comments</strong>
        ${postItem.comments.map(comment => `<div class="comment-item">${cleanText(comment)}</div>`).join("")}
        ${replies.map(reply => `<div class="comment-item user-comment">You: ${escapeHTML(reply)}</div>`).join("")}
        <div class="reply-row">
          <input class="post-reply-input" data-post-index="${index}" placeholder="Reply to this post..." />
          <button class="reply-post-btn" data-post-index="${index}">Reply</button>
        </div>
      </div>
    </div>
  `;
}

/* =========================
   EMAIL
========================= */

function renderEmail(emails) {
  const email = emails[activeEmailIndex];
  markSourceItemViewed("email", activeEmailIndex);
  contentBox.innerHTML = `
    <div class="app-window email-app">
      <div class="email-list">
        <div class="email-search">Search mail</div>
        ${emails.map((item, index) => `
          <div class="email-item ${index === activeEmailIndex ? "active" : ""}" data-email-index="${index}">
            <strong>${cleanText(item.sender)}</strong>
            <div>${cleanText(item.preview)}</div>
            <span class="email-time">${cleanText(item.time)}</span>
          </div>
        `).join("")}
      </div>
      <div class="email-read">
        <div class="email-toolbar">
          <span class="toolbar-action">${inlineIcon("archive")}Archive</span>
          <span class="toolbar-action">${inlineIcon("flag")}Report</span>
          <span class="toolbar-action">${inlineIcon("more")}More</span>
        </div>
        <h1 class="email-subject">${cleanText(email.subject)}</h1>
        <div class="email-sender">
          <div class="avatar">${email.sender.charAt(0)}</div>
          <div><strong>${cleanText(email.sender)} &lt;${cleanText(email.email)}&gt;</strong><br><small>to me · ${cleanText(email.time)}</small></div>
        </div>
        <div class="email-body">${email.body.map(paragraph => `<p>${cleanText(paragraph)}</p>`).join("")}</div>
        <div class="gmail-reply-box">
          <h3>Reply</h3>
          <textarea id="gmail-reply-text" placeholder="Write a reply...">${getEmailDraft(activeEmailIndex)}</textarea>
          <button id="save-email-reply">Save Draft</button>
          <span id="reply-status"></span>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll(".email-item").forEach(item => {
    item.addEventListener("click", () => {
      activeEmailIndex = Number(item.dataset.emailIndex);
      renderEmail(emails);
    });
  });

  document.getElementById("save-email-reply").addEventListener("click", () => {
    const text = document.getElementById("gmail-reply-text").value;
    if (!gameState.emailReplies[gameState.phase]) gameState.emailReplies[gameState.phase] = {};
    gameState.emailReplies[gameState.phase][activeEmailIndex] = text;
    const status = document.getElementById("reply-status");
    status.textContent = "Draft saved";
    setTimeout(() => { status.textContent = ""; }, 1600);
  });
  registerSourceScroll(".email-read", "email", activeEmailIndex);
}

function getEmailDraft(index) {
  return gameState.emailReplies[gameState.phase] && gameState.emailReplies[gameState.phase][index]
    ? gameState.emailReplies[gameState.phase][index]
    : "";
}

/* =========================
   CHAT
========================= */

function renderChat(conversations) {
  const current = conversations[activeChatIndex];
  markSourceItemViewed("chat", activeChatIndex);
  const replies = gameState.chatReplies[gameState.phase] && gameState.chatReplies[gameState.phase][activeChatIndex]
    ? gameState.chatReplies[gameState.phase][activeChatIndex]
    : [];

  contentBox.innerHTML = `
    <div class="app-window chat-app">
      <aside class="chat-list">
        ${conversations.map((item, index) => `
          <div class="chat-contact ${index === activeChatIndex ? "active" : ""}" data-chat-index="${index}">
            <strong>${cleanText(item.contact)}</strong>
            <p>${cleanText(item.messages[item.messages.length - 1]?.text || "")}</p>
          </div>
        `).join("")}
      </aside>
      <main class="chat-window">
        <div class="chat-header">${cleanText(current.contact)}</div>
        <div class="chat-messages">
          ${current.messages.map(message => `
            <div class="message ${message.from === "You" ? "outgoing" : "incoming"}">
              <strong>${cleanText(message.from)}</strong><br>${cleanText(message.text)}
            </div>
          `).join("")}
          ${replies.map(reply => `<div class="message outgoing"><strong>You</strong><br>${escapeHTML(reply)}</div>`).join("")}
        </div>
        <div class="chat-input">
          <input id="chat-reply-text" placeholder="Type a message..." />
          <button id="send-chat-reply">Send</button>
        </div>
      </main>
    </div>
  `;

  document.querySelectorAll(".chat-contact").forEach(item => {
    item.addEventListener("click", () => {
      activeChatIndex = Number(item.dataset.chatIndex);
      renderChat(conversations);
    });
  });

  document.getElementById("send-chat-reply").addEventListener("click", () => {
    const input = document.getElementById("chat-reply-text");
    const text = input.value.trim();
    if (!text) return;
    if (!gameState.chatReplies[gameState.phase]) gameState.chatReplies[gameState.phase] = {};
    if (!gameState.chatReplies[gameState.phase][activeChatIndex]) gameState.chatReplies[gameState.phase][activeChatIndex] = [];
    gameState.chatReplies[gameState.phase][activeChatIndex].push(text);
    input.value = "";
    renderChat(conversations);
  });
  registerSourceScroll(".chat-messages", "chat", activeChatIndex);
}

/* =========================
   FILES + PDF MODAL
========================= */

function renderFiles(documents) {
  contentBox.innerHTML = `
    <div class="app-window file-app">
      <aside class="file-sidebar">
        <div class="drive-title">Drive</div>
        <div class="file-folder active">${inlineIcon("file")} Current Phase</div>
        <div class="file-folder">${inlineIcon("file")} Market Reports</div>
        <div class="file-folder">${inlineIcon("file")} Advisor Notes</div>
        <div class="file-folder">${inlineIcon("file")} Technical Appendix</div>
      </aside>
      <main class="file-preview">
        <div class="file-header">
          <h1>Optional Documents</h1>
          <div class="file-meta">Click a document to open the evidence file. Cards show only a short preview; detailed tables, footnotes, and risk evidence stay inside the opened PDF.</div>
        </div>
        <div class="document-list">${documents.map(docItem => renderDocCard(docItem)).join("")}</div>
      </main>
    </div>
  `;

  document.querySelectorAll(".doc-card").forEach(card => {
    card.addEventListener("click", () => readDocument(card.dataset.docId));
  });
}

function renderDocCard(docItem) {
  const read = gameState.documentsRead.includes(docItem.id);
  const quality = read ? getDocumentReadQuality(docItem.id) : null;
  const typeLabel = docItem.type || "Evidence file";
  return `
    <div class="doc-card ${read ? "read" : ""} ${docItem.important ? "important-doc" : ""}" data-doc-id="${docItem.id}">
      <h3>${read ? inlineIcon("check") : ""}<span>${cleanText(docItem.title)}</span></h3>
      <div class="doc-meta"><span>${docItem.cost} RB</span><span>${cleanText(typeLabel)}</span></div>
      <p>${cleanText(docItem.summary)}</p>
      <div class="doc-meta"><span>${docItem.fileName}</span><span>${read ? "Opened" : "Click to unlock"}</span></div>
      ${read ? `<div class="read-quality">Read quality: ${quality.label} · ${formatSeconds(quality.totalMs)}</div>` : `<div class="read-quality">Unread · ${docItem.cost} RB to unlock</div>`}
    </div>
  `;
}

function readDocument(docId) {
  const phase = getPhase();
  const docItem = phase.documents.find(item => item.id === docId);
  if (!docItem) return;

  const alreadyRead = gameState.documentsRead.includes(docItem.id);
  if (!alreadyRead) {
    if (gameState.rb < docItem.cost) {
      alert(`Not enough Research Budget. This document costs ${docItem.cost} RB, but you only have ${gameState.rb} RB left.`);
      return;
    }
    gameState.rb -= docItem.cost;
    gameState.documentsRead.push(docItem.id);
    if (!gameState.documentsReadByPhase[gameState.phase]) gameState.documentsReadByPhase[gameState.phase] = [];
    gameState.documentsReadByPhase[gameState.phase].push({ id: docItem.id, important: docItem.important, cost: docItem.cost });
  }

  openPdfModal(docItem);
  renderFiles(phase.documents);
  updateStatus();
  renderTasks();
}

function openPdfModal(docItem) {
  if (!pdfModal || !pdfModalBody || !pdfModalTitle) {
    alert(`PDF path: ${docItem.pdfPath}`);
    return;
  }
  startDocumentSession(docItem);
  pdfModalTitle.textContent = docItem.title;
  pdfModalBody.innerHTML = `
    <iframe src="${docItem.pdfPath}" title="${docItem.title}"></iframe>
    <div class="pdf-fallback">
      <p><strong>If the PDF does not load:</strong></p>
      <p>Check that the file exists at <code>${docItem.pdfPath}</code>.</p>
      <p><strong>Summary:</strong> ${docItem.summary}</p>
      ${docItem.sections.map(section => `<p><strong>${section.heading}:</strong> ${section.text}</p>`).join("")}
    </div>
  `;
  pdfModal.classList.add("show");
}

function closePdfModal() {
  finalizeDocumentSession();
  if (!pdfModal || !pdfModalBody) return;
  pdfModal.classList.remove("show");
  pdfModalBody.innerHTML = "";
}

/* =========================
   DECISION - ONE PROMPT ONLY
========================= */

function renderDecision(phase) {
  contentBox.innerHTML = `
    <div class="decision-screen">
      <div class="phase-context">
        <strong>${cleanText(phase.title)}</strong><br>
        ${cleanText(phase.decisionPrompt)}
      </div>
      <h2>Decision Point</h2>
      <div class="decision-block">
        <h3>Your portfolio decision</h3>
        <p>Choose one action for this phase.</p>
        <div class="choice-list">${phase.decisions.map((decision, index) => renderChoiceButton(decision, index)).join("")}</div>
      </div>
      <div class="decision-help">
        Choose only one action. The allocation effect is applied after you confirm. Final scoring follows the latest sheet: 40% Portfolio Value, 40% Risk Control, and 20% Decision Quality.
      </div>
    </div>
  `;

  document.querySelectorAll(".choice-btn").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      selectedDecision = phase.decisions[index];
      document.querySelectorAll(".choice-btn").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      renderTasks();
      updateNextButtonState();
    });
  });
}

function renderChoiceButton(decision, index) {
  const noteHtml = escapeHTML(decision.note || "").replace(/\n/g, "<br>");
  return `
    <button class="choice-btn" data-index="${index}">
      ${String.fromCharCode(65 + index)}. ${decision.text}
      <span class="choice-note">${noteHtml}</span>
    </button>
  `;
}

/* =========================
   SCORING ENGINE
========================= */

function applyAllocationDelta(delta) {
  if (!delta) return;
  const next = { ...gameState.allocation };
  Object.entries(delta).forEach(([asset, change]) => {
    next[asset] = clamp((next[asset] || 0) + change, 0, 1);
  });
  const total = Object.values(next).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return;
  Object.keys(next).forEach(asset => { next[asset] = next[asset] / total; });
  gameState.allocation = next;
}

function calculatePhaseReturn() {
  const phase = gameState.phase;
  let totalReturn = 0;

  Object.entries(gameState.allocation).forEach(([asset, weight]) => {
    if (!returnTable[asset]) return;
    const assetReturn = returnTable[asset][phase];
    totalReturn += weight * assetReturn;
  });

  return totalReturn;
}

function applyDecisionAndAdvance() {
  if (!unlockedChannels.decision) {
    alert("Wait until the decision window opens. Information is still arriving.");
    return;
  }

  if (!selectedDecision) {
    alert("Please choose one decision.");
    setActiveSidebar("decision");
    renderContent("decision");
    return;
  }

  flushActiveChannelTime();
  finalizeDocumentSession();

  const phase = getPhase();
  const oldPV = gameState.pv;

  applyAllocationDelta(selectedDecision.allocationDelta);

  const phaseReturn = calculatePhaseReturn();
  gameState.pv = gameState.pv * (1 + phaseReturn);
  gameState.peakPV = Math.max(gameState.peakPV, gameState.pv);
  const phaseISQ = calculateISQForPhase(gameState.phase);
  const rubric = getDecisionRubric(gameState.phase, selectedDecision.optionLetter);
  const phaseEU = rubric.eu;
  const phaseBU = getBUSCore(gameState.phase, selectedDecision.optionLetter);
  const phaseRC = calculateRiskControlForAllocation(gameState.allocation);

  gameState.decisionLog.push({
    phase: gameState.phase,
    phaseTitle: cleanText(phase.title),
    decision: cleanText(selectedDecision.text),
    pvBefore: oldPV,
    pvAfter: gameState.pv,
    optionLetter: selectedDecision.optionLetter,
    phaseReturn,
    allocation: { ...gameState.allocation },
    riskyExposure: (gameState.allocation.structured_credit || 0) + (gameState.allocation.financial_sector || 0),
    riskyExposureScore: phaseRC.riskyExposureScore,
    liquidityControlScore: phaseRC.liquidityControlScore,
    rcScore: phaseRC.rcScore,
    isq: phaseISQ,
    eu: phaseEU,
    euBase: rubric.eu,
    bc: rubric.bc,
    bu: phaseBU
  });

  const change = gameState.pv - oldPV;
  const sign = change >= 0 ? "+" : "";

  gameState.lastOutcomeText =
    `Outcome: ${sign}${formatMoney(change).replace("$", "")}. ` +
    `Phase return: ${(phaseReturn * 100).toFixed(1)}%. ` +
    `${phase.transition}`;

  if (gameState.phase >= phases.length) {
    showResult();
    return;
  }

  gameState.phase += 1;
  loadPhase();
}

/* =========================
   RESULT
========================= */


function awardPhaseResearchBudget() {
  if (!gameState.awardedPhases.includes(gameState.phase)) {
    gameState.rb += RESEARCH_BUDGET_PER_PHASE;
    gameState.awardedPhases.push(gameState.phase);
  }
}

function getDecisionRubric(phaseNumber, optionLetter) {
  return (DQ_RUBRIC[phaseNumber] && DQ_RUBRIC[phaseNumber][optionLetter]) || { eu: 60, bc: 60 };
}

function getBUSCore(phaseNumber, optionLetter) {
  if (phaseNumber < 3) return null;
  const previous = gameState.decisionLog.find(log => log.phase === phaseNumber - 1);
  const previousLetter = previous?.optionLetter;
  return BU_TRANSITION_MATRIX[phaseNumber]?.[previousLetter]?.[optionLetter] ?? null;
}

function calculateSourceGroupScore(phaseNumber, tab) {
  const rule = SOURCE_QUALITY_RULES[tab];
  const phaseEngagement = gameState.sourceEngagement[phaseNumber] || {};
  const sourceBucket = phaseEngagement[tab] || { items: {} };
  const items = Object.values(sourceBucket.items || {}).filter(item => item.opened);
  if (!rule || !items.length) return 0;

  const sourceTime = (gameState.sourceTimeByPhase[phaseNumber] || {})[tab] || 0;
  const timePerOpenedItem = sourceTime / items.length;
  const pointsPerItem = rule.maxPoints / rule.maxItems;
  const score = items.slice(0, rule.maxItems).reduce((sum, item) => {
    const status = sourceReadingStatus(tab, timePerOpenedItem, item.maxScroll || 0);
    return sum + pointsPerItem * status.multiplier;
  }, 0);
  return clamp(score, 0, rule.maxPoints);
}

function calculateFileISQScore(phaseNumber) {
  const docs = gameState.documentsReadByPhase[phaseNumber] || [];
  if (!docs.length) return 0;

  const hasImportant = docs.some(doc => doc.important);
  const hasNormal = docs.some(doc => !doc.important);
  let base = 0;
  if (hasImportant && hasNormal) base = 45;
  else if (hasImportant) base = 30;
  else if (hasNormal) base = 15;

  const qualityMultipliers = docs.map(doc => getDocumentReadQuality(doc.id).multiplier);
  const avgMultiplier = qualityMultipliers.length
    ? qualityMultipliers.reduce((sum, value) => sum + value, 0) / qualityMultipliers.length
    : 0;
  return clamp(base * avgMultiplier, 0, SOURCE_QUALITY_RULES.file.maxPoints);
}

function calculateISQForPhase(phaseNumber) {
  const total =
    calculateSourceGroupScore(phaseNumber, "news") +
    calculateSourceGroupScore(phaseNumber, "email") +
    calculateSourceGroupScore(phaseNumber, "chat") +
    calculateSourceGroupScore(phaseNumber, "social") +
    calculateFileISQScore(phaseNumber);
  return clamp(Math.round(total), 0, 100);
}

function applyEvidencePenaltyToEU(baseEU, evidenceEngagement) {
  if (baseEU < 80) return baseEU;
  if (evidenceEngagement < 35) return clamp(baseEU - 20, 0, 100);
  if (evidenceEngagement < 55) return clamp(baseEU - 10, 0, 100);
  if (baseEU === 100 && evidenceEngagement < 70) return clamp(baseEU - 5, 0, 100);
  return baseEU;
}

function scoreRiskyExposureForAllocation(allocation) {
  const largestRisky = Math.max(allocation.structured_credit || 0, allocation.financial_sector || 0);
  if (largestRisky < 0.25) return 100;
  if (largestRisky <= 0.35) return 80;
  if (largestRisky <= 0.50) return 60;
  if (largestRisky <= 0.70) return 40;
  return 20;
}

function scoreLiquidityControlForAllocation(allocation) {
  const liquid = (allocation.cash || 0) + (allocation.ig_bonds || 0);
  if (liquid >= 0.40) return 100;
  if (liquid >= 0.30) return 80;
  if (liquid >= 0.20) return 60;
  if (liquid >= 0.10) return 40;
  return 20;
}

function calculateRiskControlForAllocation(allocation) {
  const riskyExposureScore = scoreRiskyExposureForAllocation(allocation);
  const liquidityControlScore = scoreLiquidityControlForAllocation(allocation);
  return {
    riskyExposureScore,
    liquidityControlScore,
    rcScore: Math.round(0.60 * riskyExposureScore + 0.40 * liquidityControlScore)
  };
}

function scoreRiskyExposure() {
  return scoreRiskyExposureForAllocation(gameState.allocation);
}

function scoreLiquidityControl() {
  return scoreLiquidityControlForAllocation(gameState.allocation);
}

function calculateFinalScores() {
  const finalReturn = gameState.pv / INITIAL_PORTFOLIO_VALUE - 1;

  let pvScore;

  if (finalReturn < 0) {
    // Downside benchmark: -57% GFC drawdown = 0 points
    pvScore = 70 + (70 / 0.57) * finalReturn;
  } else {
    // Upside benchmark: approx. +7% Moody's Baa corporate bond yield reference = 100 points
    pvScore = 70 + (30 / 0.07) * finalReturn;
  }

  pvScore = clamp(Math.round(pvScore), 0, 100);

  const rcRows = gameState.decisionLog.map(log => {
    if (typeof log.rcScore === "number") return log;
    const fallback = calculateRiskControlForAllocation(log.allocation || gameState.allocation);
    return { ...log, ...fallback };
  });
  const currentRC = calculateRiskControlForAllocation(gameState.allocation);
  const avg = arr => arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 60;
  const riskyExposureScore = Math.round(avg(rcRows.map(log => log.riskyExposureScore ?? currentRC.riskyExposureScore)));
  const liquidityControlScore = Math.round(avg(rcRows.map(log => log.liquidityControlScore ?? currentRC.liquidityControlScore)));
  const rcScore = Math.round(avg(rcRows.map(log => log.rcScore ?? currentRC.rcScore)));

  const phaseCount = phases.length;
  const isqScores = [];
  const euScores = [];
  const bcScores = [];
  const buScores = [];

  for (let p = 1; p <= phaseCount; p += 1) {
    isqScores.push(calculateISQForPhase(p));
  }

  gameState.decisionLog.forEach(log => {
    euScores.push(log.eu);
    bcScores.push(log.bc);
    if (log.bu !== null && log.phase >= 3) buScores.push(log.bu);
  });

  const isqScore = Math.round(avg(isqScores));
  const euScore = Math.round(avg(euScores));
  const bcScore = Math.round(avg(bcScores));
  const buScore = Math.round(avg(buScores));
  const dqScore = Math.round(0.30 * isqScore + 0.35 * euScore + 0.20 * bcScore + 0.15 * buScore);

  let finalScore = Math.round(0.40 * pvScore + 0.40 * rcScore + 0.20 * dqScore);
  const hardGates = [];
  let maxTier = "S";

  if (gameState.pv <= 0) { hardGates.push("Bankruptcy / Game Over"); maxTier = "F"; }
  else if (gameState.pv < INITIAL_PORTFOLIO_VALUE * 0.50) { hardGates.push("Severe Capital Loss"); maxTier = minTier(maxTier, "D"); }

  const riskyBreachCount = gameState.decisionLog.filter(log => log.phase >= 4 && log.riskyExposure > 0.60).length;
  if (riskyBreachCount >= 2) { hardGates.push("Reckless Exposure Gate"); maxTier = minTier(maxTier, "C"); }
  const documentsReadCount = Object.values(gameState.documentsReadByPhase).flat().length;
  if (documentsReadCount === 0) { hardGates.push("No Research Gate"); maxTier = minTier(maxTier, "B"); }

  return {
    pvScore,
    rcScore,
    dqScore,
    isqScore,
    euScore,
    bcScore,
    buScore,
    riskyExposureScore,
    liquidityControlScore,
    readiness: clamp(finalScore, 0, 100),
    hardGates,
    maxTier
  };
}

function minTier(current, cap) {
  const order = ["F", "D", "C", "B", "A", "S"];
  return order[Math.min(order.indexOf(current), order.indexOf(cap))];
}

function tierFromScore(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}


const HARD_GATE_FEEDBACK = {
  "Bankruptcy / Game Over": "Your portfolio could not survive the crisis simulation. The final tier is capped at F. In the next attempt, focus on capital preservation, liquidity, and reducing risky exposure earlier.",
  "Severe Capital Loss": "Your portfolio lost more than half of its initial value. The final tier is capped at D. Try to protect capital earlier by reducing risky exposure and increasing defensive liquid assets.",
  "Reckless Exposure Gate": "Your portfolio held too much risky exposure when crisis signals were already clear. The final tier is capped at C. In the next attempt, respond earlier to warning signals and reduce crisis-sensitive assets.",
  "Leverage Abuse Gate": "Your leverage level created significant downside risk. The final tier is capped at C. Use leverage more carefully, especially when market volatility increases.",
  "No Research Gate": "You did not use important research documents to support your decisions. The final tier is capped at B. Next time, use the Research Budget before making major decisions."
};

function tierInfo(tier) {
  const map = {
    S: ["Crisis-Ready Investor", "Strong performance. You preserved or grew portfolio value, controlled risk well, and made evidence-based decisions during the crisis."],
    A: ["Disciplined Strategist", "Good performance. Your strategy was mostly disciplined, though there is still room to improve timing, liquidity, or research use."],
    B: ["Balanced Investor", "Fairly balanced result. You survived the crisis, but some decisions could have been more consistent or better supported by evidence."],
    C: ["Vulnerable Investor", "You survived, but the portfolio remained exposed to meaningful risks. Focus more on reducing risky exposure and strengthening liquidity."],
    D: ["Lucky Survivor", "You survived, but the result was fragile. Better capital preservation and more evidence-based decisions are needed."],
    F: ["Crisis Casualty", "The portfolio failed to withstand the crisis. In the next attempt, prioritize survival, liquidity, and risk control."]
  };
  return { letter: tier, title: map[tier][0], description: map[tier][1] };
}

function determineTier(scores) {
  const rawTier = tierFromScore(scores.readiness);
  const cappedTier = minTier(rawTier, scores.maxTier);
  return tierInfo(cappedTier);
}


function renderResultStats(scores) {
  return `
    <div class="result-stat-primary">
      <small>Final Portfolio</small>
      <strong>${formatMoney(gameState.pv)}</strong>
    </div>
    <div class="result-stat-primary">
      <small>Crisis Readiness</small>
      <strong>${scores.readiness}/100</strong>
    </div>
    <div>
      <small>Portfolio Value</small>
      <strong>${scores.pvScore}/100</strong>
    </div>
    <div>
      <small>Risk Control</small>
      <strong>${scores.rcScore}/100</strong>
    </div>
    <div>
      <small>Decision Quality</small>
      <strong>${scores.dqScore}/100</strong>
    </div>
  `;
}

function renderHardGateFeedback(scores, tier) {
  if (!scores.hardGates.length) {
    return `
      <div class="result-feedback-card">
        <h3>Hard Gates</h3>
        <p>No Hard Gate was triggered, so your final tier is based directly on your total score.</p>
        <p>${tier.description}</p>
      </div>
    `;
  }

  const gateRows = scores.hardGates.map(gate => `
    <div class="hard-gate-item">
      <strong>${gate}</strong>
      <p>${HARD_GATE_FEEDBACK[gate] || gate}</p>
    </div>
  `).join("");

  return `
    <div class="result-feedback-card hard-gate-triggered">
      <h3>Hard Gates</h3>
      <p>Your result was capped because ${scores.hardGates.join(", ")} was triggered.</p>
      ${gateRows}
      <p>${tier.description}</p>
    </div>
  `;
}

function renderPhaseReview() {
  return gameState.decisionLog.map(log => `
    <div class="phase-review-item">
      <div class="phase-review-header">
        <strong>${cleanText(log.phaseTitle)}</strong>
        <span>${(log.phaseReturn * 100).toFixed(1)}% phase return</span>
      </div>
      <p><strong>Decision:</strong> ${cleanText(log.decision)}</p>
      <p><strong>Portfolio:</strong> ${formatMoney(log.pvBefore)} -> ${formatMoney(log.pvAfter)}</p>
      <div class="phase-score-grid">
        <span>ISQ <strong>${log.isq}/100</strong></span>
        <span>EU <strong>${log.eu}/100</strong></span>
        <span>BC <strong>${log.bc}/100</strong></span>
        ${log.bu !== null ? `<span>BU <strong>${log.bu}/100</strong></span>` : ""}
        <span>RC <strong>${log.rcScore}/100</strong></span>
      </div>
    </div>
  `).join("");
}

function showResult() {
  flushActiveChannelTime();
  finalizeDocumentSession();
  clearPhaseTimers();
  showPage("result");

  const scores = calculateFinalScores();
  const tier = determineTier(scores);
  const resultStats = document.querySelector(".result-stats");

  resultTitle.textContent = `${tier.letter} - ${tier.title}`;
  resultDescription.innerHTML = renderHardGateFeedback(scores, tier);
  if (resultStats) resultStats.innerHTML = renderResultStats(scores);

  decisionReplay.innerHTML = `
    <h3>Phase Review</h3>
    ${renderPhaseReview()}
  `;
}

/* =========================
   LOAD / EVENTS
========================= */

function loadPhase() {
  awardPhaseResearchBudget();
  initializeAutoReveal();
  updateStatus();
  renderTasks();
  renderNotificationDots();
  renderContent("news");
  updateNextButtonState();
}

function startGame() {
  activeChannel = null;
  activeChannelStart = null;
  activeDocumentSession = null;
  gameState = initialState();
  showPage("game");
  loadPhase();
}

if (startBtn) startBtn.addEventListener("click", () => showPage(pages.rules ? "rules" : "case"));
if (rulesStartBtn) rulesStartBtn.addEventListener("click", () => showPage("case"));
if (rulesBackBtn) rulesBackBtn.addEventListener("click", () => showPage("landing"));
if (caseCard) caseCard.addEventListener("click", () => startGame());
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    clearPhaseTimers();
    activeChannel = null;
    activeChannelStart = null;
    activeDocumentSession = null;
    gameState = initialState();
    showPage("landing");
  });
}
if (revealCaseBtn) revealCaseBtn.addEventListener("click", () => showPage("reveal"));
if (viewResultAgainBtn) viewResultAgainBtn.addEventListener("click", () => showPage("result"));
if (backLandingFromRevealBtn) {
  backLandingFromRevealBtn.addEventListener("click", () => {
    clearPhaseTimers();
    activeChannel = null;
    activeChannelStart = null;
    activeDocumentSession = null;
    gameState = initialState();
    showPage("landing");
  });
}
if (nextPhaseBtn) nextPhaseBtn.addEventListener("click", () => applyDecisionAndAdvance());

sideButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    if (!unlockedChannels[tab]) {
      setActiveSidebar(tab);
      renderLockedChannel(tab);
      renderNotificationDots();
      return;
    }
    setActiveSidebar(tab);
    renderContent(tab);
    updateNextButtonState();
  });
});

if (pdfModalClose) pdfModalClose.addEventListener("click", closePdfModal);
if (pdfModal) {
  pdfModal.addEventListener("click", event => {
    if (event.target === pdfModal) closePdfModal();
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePdfModal();
});

hydrateStaticIcons();
