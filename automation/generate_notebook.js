const fs = require('fs');
const path = require('path');

const md = (source) => ({ cell_type: "markdown", metadata: {}, source });
const code = (source) => ({ cell_type: "code", execution_count: null, metadata: {}, outputs: [], source });

const cells = [];

cells.push(md(
`# EasyTradeSetup — Automated Pack Builder

**What this notebook does (Runtime → Run all):**
1. Mounts Google Drive
2. Creates \`EasyTradeSetup/\` folder structure in Drive
3. Clones GitHub repo and syncs files to Drive
4. Validates Pine Scripts
5. Generates the Strategy PDF guide
6. Packages all 3 tier ZIPs (Basic / Pro / Expert)
7. Saves everything to Drive — ready for Gumroad upload`
));

cells.push(md("---\n## STEP 1 — Install Dependencies & Mount Drive"));

cells.push(code(
`!pip install fpdf2 -q
print('fpdf2 installed')`
));

cells.push(code(
`from google.colab import drive
drive.mount('/content/drive')
print('Google Drive mounted')`
));

cells.push(md("---\n## STEP 2 — Create Drive Folder Structure"));

cells.push(code(
`from pathlib import Path

DRIVE_ROOT = Path('/content/drive/MyDrive')
ETS_ROOT   = DRIVE_ROOT / 'EasyTradeSetup'

FOLDERS = [
    '01_PineScripts',
    '02_PDFs',
    '03_Deliverables',
    '04_Colabs',
    '05_LandingPage',
    '06_Assets',
]

print(f'Creating under: {ETS_ROOT}')
for folder in FOLDERS:
    (ETS_ROOT / folder).mkdir(parents=True, exist_ok=True)
    print(f'  OK {folder}/')
print('Drive folder structure ready.')`
));

cells.push(md("---\n## STEP 3 — Clone GitHub Repo & Sync to Drive"));

cells.push(code(
`import subprocess, shutil

REPO_URL  = 'https://github.com/quantsentra/easytradesetup.git'
REPO_PATH = Path('/content/easytradesetup')

if REPO_PATH.exists():
    r = subprocess.run(['git', '-C', str(REPO_PATH), 'pull'], capture_output=True, text=True)
    print('Pulled latest from GitHub')
else:
    r = subprocess.run(['git', 'clone', REPO_URL, str(REPO_PATH)], capture_output=True, text=True)
    print('Cloned from GitHub')
print(r.stdout or r.stderr)

# Pine Scripts
for f in (REPO_PATH / 'pine-scripts').rglob('*.pine'):
    shutil.copy2(f, ETS_ROOT / '01_PineScripts' / f.name)
    print(f'  Copied {f.name} -> 01_PineScripts/')

# Landing Page
lp = REPO_PATH / 'landing-page' / 'index.html'
if lp.exists():
    shutil.copy2(lp, ETS_ROOT / '05_LandingPage' / 'index.html')
    print('  Copied index.html -> 05_LandingPage/')

# This notebook
nb = REPO_PATH / 'colabs' / 'ETS-Builder.ipynb'
if nb.exists():
    shutil.copy2(nb, ETS_ROOT / '04_Colabs' / 'ETS-Builder.ipynb')
    print('  Copied ETS-Builder.ipynb -> 04_Colabs/')

print('Sync complete.')`
));

cells.push(md("---\n## STEP 4 — Validate Pine Scripts"));

cells.push(code(
`pine_files = list((ETS_ROOT / '01_PineScripts').glob('*.pine'))

CHECKS = {
    'Pine v5 declaration' : '//@version=5',
    'strategy/indicator'  : lambda c: 'strategy(' in c or 'indicator(' in c,
    'overlay=true'        : 'overlay=true',
    'Supertrend'          : 'ta.supertrend',
    'EMA calc'            : 'ta.ema',
    'RSI filter'          : 'ta.rsi',
    'Session filter'      : 'input.session',
    'Strategy entry'      : 'strategy.entry',
    'Strategy exit'       : 'strategy.exit',
    'EOD close'           : 'close_all',
}

all_ok = True
for pf in pine_files:
    content = pf.read_text(encoding='utf-8')
    print(f'\\n{pf.name}')
    print('-' * 40)
    for label, chk in CHECKS.items():
        ok = chk(content) if callable(chk) else (chk in content)
        if not ok:
            all_ok = False
        mark = 'PASS' if ok else 'FAIL'
        print(f'  [{mark}] {label}')

print()
print('All checks passed.' if all_ok else 'WARNING: Some checks failed.')`
));

cells.push(md("---\n## STEP 5 — Generate Strategy PDF\n\n### 5a. Define PDF class"));

cells.push(code(
`from fpdf import FPDF

C_BG      = (13,  17,  23)
C_SURFACE = (22,  27,  34)
C_BLUE    = (88,  166, 255)
C_GREEN   = (0,   200, 83)
C_RED     = (244, 67,  54)
C_TEXT    = (230, 237, 243)
C_MUTED   = (139, 148, 158)
C_ORANGE  = (255, 152, 0)

class ETS_PDF(FPDF):
    def header(self):
        self.set_fill_color(*C_BG)
        self.rect(0, 0, 210, 15, 'F')
        self.set_font('Helvetica', '', 8)
        self.set_text_color(*C_MUTED)
        self.set_y(5)
        self.cell(0, 6, 'EasyTradeSetup  |  easytradesetup.com', align='C')

    def footer(self):
        self.set_y(-12)
        self.set_fill_color(*C_BG)
        self.rect(0, self.get_y()-2, 210, 15, 'F')
        self.set_font('Helvetica', '', 8)
        self.set_text_color(*C_MUTED)
        self.cell(0, 8, f'Page {self.page_no()}  |  Not financial advice. Trade at your own risk.', align='C')

    def bg_fill(self):
        self.set_fill_color(*C_BG)
        self.rect(0, 0, 210, 297, 'F')

    def h2(self, txt):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(*C_BLUE)
        self.ln(4)
        self.multi_cell(0, 8, txt)
        self.set_draw_color(*C_BLUE)
        self.set_line_width(0.3)
        y = self.get_y()
        self.line(10, y, 200, y)
        self.ln(4)

    def h3(self, txt):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(*C_TEXT)
        self.ln(3)
        self.multi_cell(0, 7, txt)
        self.ln(1)

    def body(self, txt):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*C_MUTED)
        self.multi_cell(0, 6, txt)
        self.ln(2)

    def bullet(self, txt):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*C_TEXT)
        self.set_x(14)
        self.multi_cell(0, 6, f'  {txt}')

    def box(self, title, lines, tc=None):
        self.set_fill_color(*C_SURFACE)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*(tc or C_BLUE))
        self.set_x(10)
        self.cell(190, 8, f'  {title}', fill=True)
        self.ln()
        for ln in lines:
            self.set_font('Helvetica', '', 10)
            self.set_text_color(*C_TEXT)
            self.set_x(14)
            self.multi_cell(186, 6, ln, fill=True)
        self.ln(3)

print('PDF class ready')`
));

cells.push(md("### 5b. Build and save PDF"));

cells.push(code(
`pdf = ETS_PDF()
pdf.set_auto_page_break(auto=True, margin=15)

# COVER
pdf.add_page()
pdf.bg_fill()
pdf.set_y(50)
pdf.set_font('Helvetica', 'B', 9)
pdf.set_text_color(*C_MUTED)
pdf.cell(0, 8, 'NIFTY & BANKNIFTY  -  INTRADAY  -  TRADINGVIEW', align='C')
pdf.ln(10)
pdf.set_font('Helvetica', 'B', 36)
pdf.set_text_color(*C_BLUE)
pdf.multi_cell(0, 14, 'EasyTradeSetup', align='C')
pdf.set_font('Helvetica', '', 18)
pdf.set_text_color(*C_TEXT)
pdf.multi_cell(0, 10, 'Intraday Momentum Pack', align='C')
pdf.ln(6)
pdf.set_draw_color(*C_BLUE)
pdf.set_line_width(0.4)
pdf.line(50, pdf.get_y(), 160, pdf.get_y())
pdf.ln(10)
pdf.set_font('Helvetica', '', 12)
pdf.set_text_color(*C_MUTED)
for ln in ['EMA 9/21  +  Supertrend (10,3)  +  RSI Filter',
           'Clear BUY/SELL Signals  -  Automated SL & TP',
           'Works on Free TradingView Account']:
    pdf.multi_cell(0, 8, ln, align='C')
pdf.set_y(220)
pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(*C_BLUE)
pdf.cell(0, 8, 'Version 1.0  -  easytradesetup.com', align='C')

# DISCLAIMER
pdf.add_page()
pdf.bg_fill()
pdf.set_y(20)
pdf.h2('Important Disclaimer')
pdf.body(
    'This document is for educational purposes only. The strategies and Pine Script '
    'code are tools to assist your own analysis. They are not financial advice, '
    'investment recommendations, or SEBI-registered guidance.\\n\\n'
    'Trading in F&O instruments involves significant financial risk. You can lose '
    'more than your invested capital. Always use proper risk management and trade '
    'only with capital you can afford to lose.'
)
pdf.h2('What You Need Before Starting')
pdf.h3('1. TradingView Account')
pdf.bullet('Go to tradingview.com and create a free account')
pdf.bullet('Search: NSE:NIFTYBANK or NSE:NIFTY')
pdf.bullet('Timeframe: 15-minute  |  Chart type: Candlestick')
pdf.h3('2. Installing the Pine Script')
pdf.bullet('Open Pine Editor (bottom panel on TradingView)')
pdf.bullet('Delete existing code, paste full ETS-Intraday-v1.0.pine content')
pdf.bullet('Click Save, then Add to Chart')
pdf.bullet('EMA lines, Supertrend, and BUY/SELL labels will appear')

# INDICATORS
pdf.add_page()
pdf.bg_fill()
pdf.set_y(20)
pdf.h2('Understanding the 3 Indicators')
pdf.body('All three indicators must agree before a signal is generated. This confluence approach reduces false signals significantly.')
pdf.box('Indicator 1 - EMA 9 / 21',
    ['Fast EMA = 9 (blue line), Slow EMA = 21 (orange line)',
     'EMA 9 ABOVE EMA 21 = bullish trend',
     'EMA 9 BELOW EMA 21 = bearish trend',
     'Purpose: Prevents trading against the dominant intraday trend.'], C_BLUE)
pdf.box('Indicator 2 - Supertrend (ATR 10, Multiplier 3.0)',
    ['Green line below price = buy zone. Red line above = sell zone.',
     'When the line FLIPS colour = potential trade entry signal.',
     'Purpose: Gives an objective, volatility-adjusted entry point.'], C_GREEN)
pdf.box('Indicator 3 - RSI Filter (14 period)',
    ['RSI between 45 and 70 = valid LONG momentum zone',
     'RSI between 30 and 55 = valid SHORT momentum zone',
     'Purpose: Filters out weak and exhausted moves before entry.'], C_ORANGE)

# LONG RULES
pdf.add_page()
pdf.bg_fill()
pdf.set_y(20)
pdf.h2('Long Trade - Step by Step Rules')
pdf.box('Entry Checklist - ALL 5 must be true',
    ['1. EMA 9 is ABOVE EMA 21',
     '2. Supertrend line has just turned GREEN',
     '3. RSI is between 45 and 70',
     '4. Time is between 9:20 AM and 3:00 PM IST',
     '5. You are NOT already in a trade',
     '',
     'Enter at the CLOSE of the candle where the BUY label appears.'], C_GREEN)
pdf.box('Stop Loss', ['0.5% below entry.  Example: Entry 44,000  ->  SL 43,780'], C_RED)
pdf.box('Target', ['1.5x stop loss (1:1.5 RR).  Example: Entry 44,000 | SL 43,780 | TP 44,330'], C_GREEN)
pdf.box('Early Exit',
    ['Supertrend flips RED before target -> exit immediately',
     'Time reaches 3:00 PM IST -> square off, no exceptions'], C_ORANGE)

# SHORT RULES
pdf.add_page()
pdf.bg_fill()
pdf.set_y(20)
pdf.h2('Short Trade - Step by Step Rules')
pdf.box('Entry Checklist - ALL 5 must be true',
    ['1. EMA 9 is BELOW EMA 21',
     '2. Supertrend line has just turned RED',
     '3. RSI is between 30 and 55',
     '4. Time is between 9:20 AM and 3:00 PM IST',
     '5. You are NOT already in a trade',
     '',
     'Enter at the CLOSE of the candle where the SELL label appears.'], C_RED)
pdf.box('Stop Loss', ['0.5% above entry.  Example: Entry 44,000  ->  SL 44,220'], C_RED)
pdf.box('Target', ['1.5x stop loss (1:1.5 RR).  Example: Entry 44,000 | SL 44,220 | TP 43,670'], C_GREEN)
pdf.box('Early Exit',
    ['Supertrend flips GREEN before target -> exit immediately',
     'Time reaches 3:00 PM IST -> square off'], C_ORANGE)

# RISK MANAGEMENT
pdf.add_page()
pdf.bg_fill()
pdf.set_y(20)
pdf.h2('Risk Management Rules')
pdf.box('The 3 Core Rules',
    ['Rule 1: Risk maximum 1% of capital per trade.',
     '        Example: Capital Rs 2,00,000 -> Max loss per trade Rs 2,000',
     '',
     'Rule 2: Maximum 2 trades per day. Quality over quantity.',
     '',
     'Rule 3: After 2 consecutive losing trades, stop for the day.'], C_BLUE)
pdf.box('Position Sizing',
    ['Nifty lot size = 75 units  |  BankNifty lot size = 30 units',
     'Start with 1 lot only. Increase only after 20+ journal-tracked trades.'], C_ORANGE)
pdf.h2('Common Mistakes to Avoid')
for m in [
    'Trading in first 5 candles (9:15-9:35) - too much noise',
    'Skipping the RSI check - it filters weak entries',
    'Entering without all 3 confirmations - partial setups lose more',
    'Holding past 3:00 PM - F&O time decay accelerates into close',
    'Averaging a losing trade - always exit at your stop',
    'Trading full size on Budget/Expiry days - volatility is unpredictable',
]:
    pdf.bullet(m)

# QUICK REF
pdf.add_page()
pdf.bg_fill()
pdf.set_y(20)
pdf.h2('Quick Reference Cheat Sheet')
pdf.box('LONG Setup',
    ['EMA 9 > EMA 21  +  Supertrend GREEN  +  RSI 45-70  +  9:20-15:00 IST',
     'SL: 0.5% below entry  |  TP: 0.75% above entry  |  RR: 1:1.5',
     'Exit early if: Supertrend flips red | Time = 3:00 PM'], C_GREEN)
pdf.box('SHORT Setup',
    ['EMA 9 < EMA 21  +  Supertrend RED  +  RSI 30-55  +  9:20-15:00 IST',
     'SL: 0.5% above entry  |  TP: 0.75% below entry  |  RR: 1:1.5',
     'Exit early if: Supertrend flips green | Time = 3:00 PM'], C_RED)
pdf.box('Script Settings',
    ['Chart: NSE:NIFTYBANK or NSE:NIFTY  |  Timeframe: 15 min',
     'Fast EMA: 9  |  Slow EMA: 21  |  ST Period: 10  |  ST Mult: 3.0',
     'RSI Length: 14  |  RSI Min Long: 45  |  RSI Max Short: 55',
     'Session: 0920-1500  |  SL%: 0.5  |  RR Ratio: 1.5'], C_BLUE)
pdf.box('Risk Rules',
    ['Max risk/trade: 1% of capital  |  Max trades/day: 2',
     'Stop after 2 consecutive losses  |  1 lot size only to start',
     'NO overnight holds. Square off by 3:00 PM IST.'], C_ORANGE)

# SAVE
PDF_PATH = ETS_ROOT / '02_PDFs' / 'ETS-Intraday-Strategy-Guide-v1.0.pdf'
pdf.output(str(PDF_PATH))
kb = PDF_PATH.stat().st_size / 1024
print(f'PDF saved: {PDF_PATH.name}  ({kb:.1f} KB)  Pages: {pdf.page}')`
));

cells.push(md("---\n## STEP 6 — Build Tier ZIPs for Gumroad"));

cells.push(code(
`import zipfile

PINE_DIR = ETS_ROOT / '01_PineScripts'
PDF_DIR  = ETS_ROOT / '02_PDFs'
OUT_DIR  = ETS_ROOT / '03_Deliverables'

README = (
    'EasyTradeSetup - Installation Guide\\n'
    '====================================\\n\\n'
    'HOW TO INSTALL THE PINE SCRIPT\\n'
    '1. Open TradingView (free account works)\\n'
    '2. Search NIFTYBANK or NIFTY on NSE exchange\\n'
    '3. Set chart to 15-min timeframe\\n'
    '4. Open Pine Editor (bottom panel)\\n'
    '5. Delete existing code, paste .pine file content\\n'
    '6. Click Save then Add to Chart\\n\\n'
    'SUPPORT: support@easytradesetup.com\\n'
    'WEB: https://easytradesetup.com\\n\\n'
    'Trading involves risk. Not financial advice.'
)

TIERS = {
    'Basic':  {'price': '999',  'output': 'ETS-Basic-Pack-v1.0.zip'},
    'Pro':    {'price': '1999', 'output': 'ETS-Pro-Pack-v1.0.zip'},
    'Expert': {'price': '3999', 'output': 'ETS-Expert-Pack-v1.0.zip'},
}

pine_file = PINE_DIR / 'ETS-Intraday-v1.0.pine'
pdf_file  = PDF_DIR  / 'ETS-Intraday-Strategy-Guide-v1.0.pdf'

for tier, cfg in TIERS.items():
    zp = OUT_DIR / cfg['output']
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('README.txt', README)
        if pine_file.exists():
            zf.write(pine_file, f'scripts/{pine_file.name}')
        if pdf_file.exists():
            zf.write(pdf_file, f'guides/{pdf_file.name}')
    kb = zp.stat().st_size / 1024
    print(f'  {tier} (Rs {cfg["price"]}) -> {cfg["output"]} ({kb:.1f} KB)')

print('ZIPs ready in Drive/EasyTradeSetup/03_Deliverables/')`
));

cells.push(md("---\n## STEP 7 — Summary"));

cells.push(code(
`print('=' * 55)
print('EasyTradeSetup - Build Complete')
print('=' * 55)

for folder, pattern in [
    ('01_PineScripts',  '*.pine'),
    ('02_PDFs',         '*.pdf'),
    ('03_Deliverables', '*.zip'),
    ('05_LandingPage',  '*.html'),
]:
    files = list((ETS_ROOT / folder).glob(pattern))
    print(f'\\n  {folder}/')
    for f in files:
        kb = f.stat().st_size / 1024
        print(f'    {f.name}  ({kb:.1f} KB)')
    if not files:
        print('    (empty)')

print('\\nNEXT STEPS:')
print('  1. Upload ZIPs from 03_Deliverables/ to Gumroad')
print('  2. Deploy index.html from 05_LandingPage/ to Vercel')
print('  3. Update Gumroad buy links in the landing page')
print('=' * 55)`
));

const notebook = {
  nbformat: 4,
  nbformat_minor: 5,
  metadata: {
    kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
    language_info: { name: "python", version: "3.10.0" },
    colab: { provenance: [], toc_visible: true }
  },
  cells
};

const outPath = path.join(__dirname, '..', 'colabs', 'ETS-Builder.ipynb');
fs.writeFileSync(outPath, JSON.stringify(notebook, null, 1), 'utf8');

// Validate by re-parsing
JSON.parse(fs.readFileSync(outPath, 'utf8'));

console.log(`Written and validated: ${outPath}`);
console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
