import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://localhost:5173';
const OUTPUT_VIDEO = 'c:\\Users\\gsat6\\SIH\\AICTE_APAAR_QA_Demo_1080p.mp4';
const DURATION_SECONDS = 170; // Exactly 2 minutes and 50 seconds (170s)
const FPS = 30; // 30 FPS High-Definition Broadcast Standard
const TOTAL_FRAMES = DURATION_SECONDS * FPS; // Exactly 5100 frames

console.log('======================================================================');
console.log('QA DEMO & SCREEN RECORDING AGENT: SIH AICTE APAAR ID PLATFORM');
console.log(`Resolution: 1920x1080 (1080p) | Framerate: ${FPS} FPS`);
console.log(`Target Duration: Exactly ${DURATION_SECONDS}s (2:50.00) = ${TOTAL_FRAMES} frames`);
console.log(`Output Video: ${OUTPUT_VIDEO}`);
console.log('======================================================================');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeWalkthrough() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--disable-notifications',
      '--disable-infobars',
      '--hide-scrollbars'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  await sleep(1500);

  // Inject High-Fidelity OS Mouse Cursor with Click Ripples & Timer Watermark
  await page.evaluate(() => {
    // 1. Mouse Cursor
    const cursor = document.createElement('div');
    cursor.id = '__human_cursor';
    cursor.style.position = 'fixed';
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.zIndex = '9999999';
    cursor.style.pointerEvents = 'none';
    cursor.style.transform = 'translate(960px, 540px)';
    cursor.style.transition = 'transform 0.04s linear';

    cursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));">
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" fill="#0f172a" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
      <div id="__click_ripple" style="
        position: absolute;
        top: 2px;
        left: 4px;
        width: 34px;
        height: 34px;
        margin-top: -17px;
        margin-left: -17px;
        border-radius: 50%;
        background: rgba(37, 99, 235, 0.45);
        border: 2px solid rgba(59, 130, 246, 0.9);
        opacity: 0;
        pointer-events: none;
        transform: scale(0.2);
        transition: transform 0.45s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.45s ease-out;
      "></div>
    `;
    document.body.appendChild(cursor);

    window.__cursorX = 960;
    window.__cursorY = 540;

    window.__moveCursorTo = (x, y) => {
      window.__cursorX = x;
      window.__cursorY = y;
      const el = document.getElementById('__human_cursor');
      if (el) el.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.__triggerClickRipple = () => {
      const rip = document.getElementById('__click_ripple');
      if (rip) {
        rip.style.transition = 'none';
        rip.style.transform = 'scale(0.2)';
        rip.style.opacity = '1';
        setTimeout(() => {
          rip.style.transition = 'transform 0.45s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.45s ease-out';
          rip.style.transform = 'scale(2.0)';
          rip.style.opacity = '0';
        }, 20);
      }
    };
  });

  // CDP Screencast Setup
  const client = await page.target().createCDPSession();
  
  // Launch ffmpeg with H.264 High Profile encoding
  const ffmpeg = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(FPS),
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'veryfast',
    '-crf', '19',
    OUTPUT_VIDEO
  ]);

  let latestFrame = null;
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    latestFrame = Buffer.from(data, 'base64');
    try {
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch {}
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    maxWidth: 1920,
    maxHeight: 1080,
    everyNthFrame: 1
  });

  while (!latestFrame) {
    await sleep(40);
  }

  // Master Clock: Writes exactly 5100 frames (170.0s @ 30 FPS)
  let framesWritten = 0;
  let isRecording = true;

  const frameWriterInterval = setInterval(() => {
    if (isRecording && framesWritten < TOTAL_FRAMES && latestFrame) {
      ffmpeg.stdin.write(latestFrame);
      framesWritten++;
      if (framesWritten % (FPS * 10) === 0) {
        const sec = Math.floor(framesWritten / FPS);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        console.log(`[Recording Timeline] ${m}:${s < 10 ? '0' : ''}${s} / 2:50 (${framesWritten}/${TOTAL_FRAMES} frames)`);
      }
    }
  }, 1000 / FPS);

  // Authentic Human Movement Helpers
  async function humanMove(toX, toY, durationMs = 500) {
    const startX = await page.evaluate(() => window.__cursorX || 0);
    const startY = await page.evaluate(() => window.__cursorY || 0);
    const steps = Math.max(10, Math.floor(durationMs / 25));
    const ctrlX = (startX + toX) / 2 + (Math.random() - 0.5) * 60;
    const ctrlY = (startY + toY) / 2 + (Math.random() - 0.5) * 40;

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const currX = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * toX);
      const currY = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * toY);
      await page.evaluate((x, y) => window.__moveCursorTo(x, y), currX, currY);
      await page.mouse.move(currX, currY);
      await sleep(durationMs / steps);
    }
    await page.evaluate((x, y) => window.__moveCursorTo(x, y), toX, toY);
  }

  async function humanClick(x, y) {
    await humanMove(x, y, 350);
    await page.evaluate(() => window.__triggerClickRipple());
    await page.mouse.click(x, y);
    await sleep(250);
  }

  async function humanClickElement(elementHandle, durationMs = 450) {
    if (!elementHandle) return;
    const box = await elementHandle.boundingBox();
    if (!box) return;
    const targetX = Math.round(box.x + box.width / 2);
    const targetY = Math.round(box.y + box.height / 2);
    await humanMove(targetX, targetY, durationMs);
    await sleep(80);
    await page.evaluate(() => window.__triggerClickRipple());
    await elementHandle.click();
    await sleep(350);
  }

  async function humanType(selector, text, typingSpeedMs = 85) {
    const el = await page.$(selector);
    if (!el) return;
    await humanClickElement(el, 400);
    await sleep(150);

    // Clear input
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await sleep(100);

    for (const char of text) {
      await page.keyboard.type(char, { delay: typingSpeedMs + Math.floor(Math.random() * 25) });
      await sleep(20);
    }
    await sleep(300);
  }

  async function humanScroll(targetY, durationMs = 700) {
    const currentY = await page.evaluate(() => window.scrollY);
    const steps = Math.max(12, Math.floor(durationMs / 30));
    const delta = (targetY - currentY) / steps;

    for (let i = 1; i <= steps; i++) {
      const newY = currentY + delta * i;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), newY);
      await sleep(durationMs / steps);
    }
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
    await sleep(350);
  }

  async function switchRoleFromDropdown(roleTitle) {
    // Click top-right role switcher
    const roleBtn = await page.$('header button div.hidden div.text-xs, header button[class*="rounded-xl"]');
    if (roleBtn) {
      await humanClickElement(roleBtn, 450);
      await sleep(600);

      // Find role in dropdown
      const option = await page.evaluateHandle((title) => {
        const btns = Array.from(document.querySelectorAll('div[class*="shadow-xl"] button'));
        return btns.find(b => b.innerText.includes(title));
      }, roleTitle);

      if (option && option.asElement()) {
        await humanClickElement(option.asElement(), 450);
        await sleep(800);
        return true;
      }
    }
    return false;
  }

  async function clickTabByText(tabText) {
    const buttons = await page.$$('header div.bg-slate-50 button, header button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text && text.includes(tabText)) {
        await humanClickElement(btn, 500);
        await sleep(600);
        return true;
      }
    }
    return false;
  }

  // =========================================================================
  // PHASE 1: Public Hub & Citizen Open Search (0:00 - 0:25 | 25s)
  // =========================================================================
  console.log('>>> [PHASE 1] Public Hub & Citizen Open Search (0:00 - 0:25)');
  await clickTabByText('Public Hub & Search');
  await humanScroll(0, 300);
  await sleep(1000);

  // Showcase header, tricolor banner, and Ministry of Education emblem
  await humanMove(320, 110, 700);
  await sleep(1500);

  // Scroll to showcase platform impact statistics & architecture badges
  await humanScroll(240, 800);
  await sleep(1500);
  await humanMove(400, 260, 600);
  await sleep(1200);
  await humanMove(750, 260, 600);
  await sleep(1200);

  // Deliberately type APAAR ID: "9823-4512-8831" into the Public Search Bar
  const searchInput = await page.$('input[placeholder*="APAAR ID"], input[placeholder*="Student Name"], input[placeholder*="Search"]');
  if (searchInput) {
    await humanClickElement(searchInput, 500);
    await humanType('input[placeholder*="APAAR ID"], input[placeholder*="Student Name"], input[placeholder*="Search"]', '9823-4512-8831', 90);
    await sleep(800);

    // Trigger Search
    const searchBtns = await page.$$('button');
    for (const b of searchBtns) {
      const txt = await page.evaluate(el => el.innerText, b);
      if (txt && (txt.includes('Search') || txt.includes('Verify'))) {
        await humanClickElement(b, 450);
        break;
      }
    }
    await sleep(2200);

    // Highlight search result: Green "VERIFIED" badge, Aditi Ramesh Sharma, COEP Pune, CGPA 9.38, QR code
    await humanScroll(380, 600);
    await sleep(1000);
    await humanMove(520, 520, 800);
    await sleep(2000);
    await humanMove(820, 620, 700);
    await sleep(2200);
  }

  await humanScroll(0, 500);
  await sleep(800);

  // =========================================================================
  // PHASE 2: Student Dossier & DPDP Consent Architecture (0:25 - 0:55 | 30s)
  // =========================================================================
  console.log('>>> [PHASE 2] Student Dossier & DPDP Consent Architecture (0:25 - 0:55)');
  // 1. Universal Role Switcher -> Select "Student Portal"
  await switchRoleFromDropdown('Student Portal');
  await sleep(1000);

  // 2. Authenticate Aditi Ramesh Sharma if landing on student authentication screen
  const studentAuthInput = await page.$('input[placeholder*="1234-5678-9012"], input[placeholder*="APAAR ID or"]');
  if (studentAuthInput) {
    await humanClickElement(studentAuthInput, 500);
    await humanType('input[placeholder*="1234-5678-9012"], input[placeholder*="APAAR ID or"]', '9823-4512-8831', 85);
    await sleep(600);

    const authBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('form button, button[type="submit"]'));
      return btns.find(b => b.innerText.includes('Authenticate') || b.innerText.includes('Access'));
    });
    if (authBtn && authBtn.asElement()) {
      await humanClickElement(authBtn.asElement(), 500);
      await sleep(1800);
    }
  }

  // 3. Showcase the Sovereign APAAR Digital ID Card
  await humanScroll(180, 600);
  await sleep(1200);
  await humanMove(550, 380, 800); // APAAR Card
  await sleep(2000);

  // 4. Pan to Academic Bank of Credits (ABC) widget (84 credits, 9.38 CGPA)
  await humanMove(880, 380, 800);
  await sleep(2200);

  // 5. Demonstrate DPDP Act 2023 Consent Management
  await humanScroll(550, 700);
  await sleep(1500);

  // Find first consent toggle button (e.g. Tata Consultancy Services)
  const consentToggleBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Revoke Access') || b.innerText.includes('Grant Access') || b.innerText.includes('Access'));
  });
  if (consentToggleBtn && consentToggleBtn.asElement()) {
    // Toggle 1: Revoke Access
    await humanClickElement(consentToggleBtn.asElement(), 500);
    await sleep(1800);
    // Toggle 2: Grant Access back (Zero-Trust demonstration)
    await humanClickElement(consentToggleBtn.asElement(), 500);
    await sleep(1800);
  }

  // 6. Click Degree Link to showcase W3C-compliant digital degree certificate
  await humanScroll(0, 600);
  await sleep(1000);
  const degreeBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Generate Official Degree') || b.innerText.includes('Degree Certificate'));
  });
  if (degreeBtn && degreeBtn.asElement()) {
    await humanClickElement(degreeBtn.asElement(), 600);
    await sleep(2000);
    // Showcase Degree Certificate with gold seal and dynamic QR
    await humanScroll(350, 700);
    await sleep(2200);
    await humanMove(820, 650, 800); // QR code on degree
    await sleep(2000);
  }

  await humanScroll(0, 500);
  await sleep(800);

  // =========================================================================
  // PHASE 3: Institution Ingestion Studio & Admission Registration (0:55 - 1:35 | 40s)
  // =========================================================================
  console.log('>>> [PHASE 3] Institution Ingestion Studio & Admission (0:55 - 1:35)');
  // 1. Switch role to: "Institution Nodal Officer" (Dr. Sudhir Deshmukh, COEP Pune)
  await switchRoleFromDropdown('Institution Nodal Officer');
  await sleep(1200);

  // 2. Highlight Real-Time Intake vs. Enrolled Gauge
  await humanScroll(120, 600);
  await sleep(1200);
  await humanMove(380, 260, 700); // CSE intake card
  await sleep(1800);

  // 3. Demonstrate New Student Admission Ingestion: Click "Manual Student Entry" (+ button)
  const manualEntryBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Manual Student Entry'));
  });
  if (manualEntryBtn && manualEntryBtn.asElement()) {
    await humanClickElement(manualEntryBtn.asElement(), 500);
    await sleep(1000);
  }

  await humanScroll(340, 600);
  await sleep(800);

  // Form Field 1: Full Name: Vikramaditya S. Rao
  const nameInput = await page.$('input[placeholder*="Rohan Deshmukh"], input[placeholder*="Full Name"]');
  if (nameInput) {
    await humanClickElement(nameInput, 400);
    await humanType('input[placeholder*="Rohan Deshmukh"], input[placeholder*="Full Name"]', 'Vikramaditya S. Rao', 80);
    await sleep(350);
  }

  // Form Field 2: APAAR ID: 9842-1084-5519
  const apaarInput = await page.$('input[placeholder*="9821-"], input[placeholder*="APAAR"]');
  if (apaarInput) {
    await humanClickElement(apaarInput, 400);
    await humanType('input[placeholder*="9821-"], input[placeholder*="APAAR"]', '9842-1084-5519', 80);
    await sleep(350);
  }

  // Form Field 3: Roll No: 112103045
  const rollInput = await page.$('input[placeholder*="11210"], input[placeholder*="Roll"]');
  if (rollInput) {
    await humanClickElement(rollInput, 400);
    await humanType('input[placeholder*="11210"], input[placeholder*="Roll"]', '112103045', 75);
    await sleep(350);
  }

  // Form Field 4: Branch: Computer Science & Engineering (CSE)
  const branchSelect = await page.$('select');
  if (branchSelect) {
    await humanClickElement(branchSelect, 400);
    await page.select('select', 'CSE');
    await sleep(400);
  }

  // Form Field 5: Supernumerary Quota (TFW checkbox)
  const tfwCheckbox = await page.evaluateHandle(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const tfw = labels.find(l => l.innerText.includes('TFW'));
    return tfw ? tfw.querySelector('input') : null;
  });
  if (tfwCheckbox && tfwCheckbox.asElement()) {
    await humanClickElement(tfwCheckbox.asElement(), 400);
    await sleep(500);
  }

  // Click "+ Add to Staging Grid"
  const addStagingBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('form button, button[type="submit"]'));
    return btns.find(b => b.innerText.includes('Add to Staging Grid') || b.type === 'submit');
  });
  if (addStagingBtn && addStagingBtn.asElement()) {
    await humanClickElement(addStagingBtn.asElement(), 500);
    await sleep(1500);
  }

  // Verify row added in Pre-Upload Staging Grid with "VALID" status
  await humanScroll(580, 600);
  await sleep(1500);
  await humanMove(480, 680, 700);
  await sleep(1500);

  // 4. Click "Commit Batch to AICTE Central Repository"
  const commitBatchBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Commit Batch to AICTE Central Repository'));
  });
  if (commitBatchBtn && commitBatchBtn.asElement()) {
    await humanClickElement(commitBatchBtn.asElement(), 600);
    // 5. Wait for and capture the full screen confetti explosion and updated student directory
    await sleep(3000);
    await humanScroll(750, 700);
    await sleep(2500);
  }

  await humanScroll(0, 500);
  await sleep(800);

  // =========================================================================
  // PHASE 4: AICTE Apex Command & Regulatory Enforcement (1:35 - 2:15 | 40s)
  // =========================================================================
  console.log('>>> [PHASE 4] AICTE Apex Command & Regulatory Enforcement (1:35 - 2:15)');
  // 1. Switch role to: "AICTE Central Admin"
  await switchRoleFromDropdown('AICTE Central Admin');
  await sleep(1200);

  // 2. Showcase National Regulatory Overview (nationwide seats, compliance)
  await humanScroll(140, 600);
  await sleep(1500);
  await humanMove(320, 260, 600); // Utilization
  await sleep(1500);
  await humanMove(620, 260, 600); // Duplicate Alerts
  await sleep(1500);

  // 3. Scroll to "Intake Breach & Dual-Enrollment Detection" alert section
  await humanScroll(420, 700);
  await sleep(1800);

  // Highlight Priya Anand Verma (simultaneously enrolled at COEP and DTU)
  await humanMove(520, 500, 800);
  await sleep(2500);

  // 4. Click "Generate Show-Cause Notice" -> Display official government letterhead modal
  const noticeBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Generate Show-Cause Notice'));
  });
  if (noticeBtn && noticeBtn.asElement()) {
    await humanClickElement(noticeBtn.asElement(), 600);
    await sleep(2500); // Showcase open show-cause notice modal

    // Close Modal
    const closeModalBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('div[class*="fixed"] button'));
      return btns.find(b => b.innerText.includes('Close') || b.querySelector('svg'));
    });
    if (closeModalBtn && closeModalBtn.asElement()) {
      await humanClickElement(closeModalBtn.asElement(), 500);
      await sleep(1200);
    }
  }

  // 5. Click "Freeze Record in National DB" -> Capture status update and toast
  const freezeBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Freeze Record in National DB'));
  });
  if (freezeBtn && freezeBtn.asElement()) {
    await humanClickElement(freezeBtn.asElement(), 600);
    await sleep(2500); // Display toast: "Record for APAAR 6521-4402-9918 frozen across national registry."
  }

  await humanScroll(0, 500);
  await sleep(800);

  // =========================================================================
  // PHASE 5: Authorized Verifier & Background Screening (2:15 - 2:40 | 25s)
  // =========================================================================
  console.log('>>> [PHASE 5] Authorized Verifier & Background Screening (2:15 - 2:40)');
  // 1. Switch role to: "Authorized Verifier"
  await switchRoleFromDropdown('Authorized Verifier');
  await sleep(1200);

  // 2. Verifier Organization dropdown confirms "Tata Consultancy Services (TCS)"
  await humanMove(920, 180, 600);
  await sleep(1200);

  // 3. Enter candidate APAAR ID: "9823-4512-8831" into verification input
  const verifierInput = await page.$('input[placeholder*="12-Digit APAAR ID"], input[placeholder*="Enter candidate"]');
  if (verifierInput) {
    await humanClickElement(verifierInput, 500);
    await humanType('input[placeholder*="12-Digit APAAR ID"], input[placeholder*="Enter candidate"]', '9823-4512-8831', 85);
    await sleep(600);

    // Click "Authenticate Record"
    const authRecordBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Authenticate Record') || b.innerText.includes('Verify'));
    });
    if (authRecordBtn && authRecordBtn.asElement()) {
      await humanClickElement(authRecordBtn.asElement(), 500);
      await sleep(2200);
    }
  }

  // 4. Highlight Verification Card: Green shield, "100% Tamper-Proof Authentic AICTE Record", "AUTHENTIC_VALIDATED"
  await humanScroll(260, 600);
  await sleep(1000);
  await humanMove(520, 480, 800);
  await sleep(2000);
  await humanMove(780, 560, 700);
  await sleep(2200);

  await humanScroll(0, 500);
  await sleep(800);

  // =========================================================================
  // PHASE 6: Immutable Audit Trail & Wrap-up (2:40 - 2:50 | 10s)
  // =========================================================================
  console.log('>>> [PHASE 6] Immutable Audit Trail & Wrap-up (2:40 - 2:50)');
  // 1. Navigate to "Audit Trail & Logs" tab
  await clickTabByText('Audit Trail & Logs');
  await sleep(1200);

  // 2. Showcase live cryptographic ledger: Top rows showing freshly ingested student, regulatory freeze, TCS check
  await humanScroll(240, 600);
  await sleep(1500);
  await humanMove(480, 420, 800); // Fresh audit row
  await sleep(1800);
  await humanMove(820, 420, 700); // Chained SHA-256 hash
  await sleep(1800);

  // 3. Smooth zoom-out / scroll back to complete dashboard view
  await humanScroll(0, 600);
  await sleep(1000);

  // Rest cursor gracefully on the AICTE emblem
  await humanMove(150, 110, 700);

  console.log('Choreographed timeline complete. Padding frames to reach exact duration...');

  // Wait until master clock finishes writing exactly 5100 frames (170.0s)
  while (framesWritten < TOTAL_FRAMES) {
    await sleep(40);
  }

  isRecording = false;
  clearInterval(frameWriterInterval);

  console.log(`Writing completed: Exactly ${framesWritten} frames written (${(framesWritten / FPS).toFixed(2)}s).`);

  await client.send('Page.stopScreencast');
  ffmpeg.stdin.end();

  await new Promise((resolve) => ffmpeg.on('close', resolve));
  await browser.close();

  // Create duplicate convenient paths for the user
  try {
    fs.copyFileSync(OUTPUT_VIDEO, 'c:\\Users\\gsat6\\SIH\\AICTE_EduVerify_Prototype_Demo.mp4');
    fs.copyFileSync(OUTPUT_VIDEO, 'c:\\Users\\gsat6\\SIH\\prototype_walkthrough.mp4');
  } catch {}

  const stats = fs.statSync(OUTPUT_VIDEO);
  console.log('======================================================================');
  console.log('SUCCESS! QA DEMO VIDEO RECORDED AND EXPORTED:');
  console.log(`Path: ${OUTPUT_VIDEO}`);
  console.log(`File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('Duration: 00:02:50.00 (170.00s @ 30 FPS = 5100 frames)');
  console.log('======================================================================');
}

executeWalkthrough().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
