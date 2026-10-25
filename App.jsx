import { useState, useEffect, useRef } from 'react'
import './app.css'

// ═══════════════════════════════════════════════════
// HOSPITAL DATA + AI SCORING ALGORITHM
// ═══════════════════════════════════════════════════
const HOSPITALS = [
  { id: 0, name: 'Apollo', loc: 'Greams Rd', dist: 3.2, traffic: 1, icuFree: 4, spec: 'Cardiac', beds: 280, load: 68, eta: '4 MIN', wards: { ICU: 68, ER: 72, OT: 55, NICU: 40, Neuro: 80 } },
  { id: 1, name: 'MIOT Intl', loc: 'Manapakkam', dist: 6.1, traffic: 2, icuFree: 2, spec: 'Ortho', beds: 350, load: 81, eta: '9 MIN', wards: { ICU: 81, ER: 65, OT: 90, NICU: 30, Neuro: 50 } },
  { id: 2, name: 'Fortis', loc: 'Adyar', dist: 4.8, traffic: 3, icuFree: 6, spec: 'Multi', beds: 240, load: 55, eta: '7 MIN', wards: { ICU: 55, ER: 60, OT: 45, NICU: 70, Neuro: 40 } },
  { id: 3, name: 'Kaveri', loc: 'Vadapalani', dist: 5.2, traffic: 2, icuFree: 3, spec: 'Neuro', beds: 180, load: 74, eta: '8 MIN', wards: { ICU: 74, ER: 58, OT: 60, NICU: 20, Neuro: 90 } },
]

const OBSTACLES = [
  { loc: 'Anna Salai', type: 'Construction' },
  { loc: 'GST Road', type: 'Protest' },
  { loc: 'OMR Flyover', type: 'Accident' },
]

/**
 * calculateBestNode — AetherPulse Neural AI Algorithm
 * Score = (dist×0.4) + (traffic×10×0.3) + ((100−aiVacancy30min)×0.3) + obstaclePenalty
 * Lower score = optimal rescue node
 */
function calculateBestNode() {
  const obstacles = OBSTACLES.filter(() => Math.random() < 0.25)
  const nodes = HOSPITALS.map(h => {
    const aiVac = Math.min(100, h.icuFree * 8 + Math.random() * 5)
    const obsPenalty = obstacles.length * 1.5
    const score = (h.dist * 0.4) + (h.traffic * 10 * 0.3) + ((100 - aiVac) * 0.3) + obsPenalty
    return { ...h, score: Math.round(score * 10) / 10, aiVac: Math.round(aiVac) }
  }).sort((a, b) => a.score - b.score)
  return { nodes, obstacles }
}

function tMinus(h) { return `⏱ AI: ICU bed ~${Math.max(2, Math.round(h.load / 100 * 25 + h.traffic * 2))} min` }
function trafficLabel(t) { return ['', 'LOW', 'MED', 'HIGH'][t] || '—' }
function trafficColor(t) { return ['', 'var(--green)', 'var(--orange)', 'var(--red)'][t] || 'var(--dim)' }

// ═══════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════
const NAV_TABS = [
  ['dashboard', 'COMMAND'], ['sos', 'SOS'], ['voice', 'AI VOICE'],
  ['wellness', 'WELLNESS'], ['hospital', 'HOSPITAL'], ['admin', 'ADMIN'],
]

const FEATURES = [
  ['🚨', 'ONE-TAP SOS', 'Instantly dispatches ambulance with GPS location and notifies emergency contacts automatically'],
  ['🧠', 'NEURAL AI ROUTING', 'Scores hospitals by distance, traffic, ICU beds, specialty — selects optimal rescue node in milliseconds'],
  ['🗺️', 'QUANTUM ROUTING', 'Live ambulance tracking with obstacle-aware rerouting via Google Maps integration'],
  ['🎙️', 'VOICE AI ASSISTANT', 'Tamil, Hindi, English voice commands for rural accessibility and emergency guidance'],
  ['💚', 'WELLNESS SYNC', 'Real-time HR, SpO2, steps and sleep tracking with AI health insights and anomaly detection'],
  ['🏥', 'HOSPITAL NETWORK', 'Live ICU bed, ER, and ambulance data across 6 hospitals updated every 30 seconds'],
]

const TICKER = [
  ['var(--red)', 'CARDIAC — Zone 4 — Amb #07 dispatched', '2m ago'],
  ['var(--cyan)', 'TRAUMA — Anna Salai — Apollo ICU confirmed', '5m ago'],
  ['var(--purple)', 'STROKE — T Nagar — Kaveri Neuro routed', '8m ago'],
  ['var(--red)', 'POLYTRAUMA — Adyar — MIOT bay ready', '11m ago'],
  ['var(--cyan)', 'BURN — Tambaram — SRMC burn unit alerted', '15m ago'],
]

const EM_HISTORY = [
  ['Cardiac — Apollo — Resolved', 'g', 'RESOLVED'],
  ['Trauma — MIOT — Resolved', 'g', 'RESOLVED'],
  ['Stroke — Kaveri — Active', 'r', 'ACTIVE'],
]

const SOS_LANG = {
  en: 'Tap SOS to dispatch nearest ambulance instantly.',
  ta: 'அருகில் உள்ள ஆம்புலன்ஸை உடனடியாக அனுப்ப SOS ஐ தட்டவும்.',
  hi: 'निकटतम एम्बुलेंस तुरंत भेजने के लिए SOS दबाएं।',
}

const TL_STEPS = [
  ['Ambulance Dispatched', 'Unit #07 — GPS locked to your location'],
  ['Traffic Cleared', 'Green corridor on GST Road activated'],
  ['Doctor Ready at ER', 'Dr. Ravi Kumar — Cardiac team standing by'],
  ['Patient Arrival', 'Apollo ER Bay 3 reserved and prepared'],
  ['ICU Admission Ready', 'Bed 12-B prepped with vitals monitor'],
]

const TL_INITIAL = [
  { cls: 'pend', icon: '1', time: 'Waiting...' },
  { cls: 'pend', icon: '2', time: 'Waiting...' },
  { cls: 'pend', icon: '3', time: 'Waiting...' },
  { cls: 'pend', icon: '4', time: 'ETA 4 MIN' },
  { cls: 'pend', icon: '5', time: 'ETA 7 MIN' },
]

const TL_ANIM = [
  { t: 0, time: 'T-0:00 — Ambulance #07 dispatched' },
  { t: 1800, time: 'T+0:45 — Green corridor activated' },
  { t: 3600, time: 'T+2:10 — Doctor ready at ER Bay 3' },
  { t: 5400, time: 'ETA 4 MIN — Bay prepared' },
  { t: 7200, time: 'ETA 7 MIN — ICU Bed 12-B ready' },
]

const VOICE_RESPONSES = {
  en: {
    'Find nearest hospital': 'Apollo Hospital, 3.2km away — 4 ICU beds available. Routing ambulance now. ETA: 4 minutes.',
    'Emergency SOS': 'Dispatching Ambulance #07 to your GPS location. ETA 4 minutes. Dr. Ravi Kumar alerted at Apollo ER.',
    'Check ICU beds': 'Apollo: 4 free | Fortis: 6 free | Kaveri: 3 free | MIOT: 2 free. Apollo is optimal.',
    'Symptom check': 'Describe your symptoms. Based on severity, I will route you to the nearest appropriate specialist.',
    'My location': 'GPS: Chennai, Tamil Nadu — 13.0827°N, 80.2707°E. Nearest hospital: Apollo, 3.2km.',
    'Blood donor': 'Searching A+ donors in 5km radius... Found 3 compatible donors. Sending alert now.',
  },
  ta: {
    'Find nearest hospital': 'அப்பல்லோ மருத்துவமனை 3.2 கிமீ தொலைவில். 4 ICU படுக்கைகள் கிடைக்கின்றன. ஆம்புலன்ஸ் அனுப்பப்படுகிறது.',
    'Emergency SOS': 'ஆம்புலன்ஸ் #07 உங்கள் GPS இடத்திற்கு அனுப்பப்படுகிறது. 4 நிமிடங்களில் வரும்.',
    'Check ICU beds': 'அப்பல்லோ: 4 | ஃபோர்டிஸ்: 6 | காவேரி: 3 | MIOT: 2 படுக்கைகள் கிடைக்கின்றன.',
    'Symptom check': 'உங்கள் அறிகுறிகளை விவரிக்கவும். AI பகுப்பாய்வு செய்கிறேன்.',
    'My location': 'GPS: சென்னை, தமிழ்நாடு. அருகில் உள்ள மருத்துவமனை: அப்பல்லோ, 3.2 கிமீ.',
    'Blood donor': '5 கிமீ சுற்றளவில் A+ இரத்த தாதாக்களை தேடுகிறேன்... 3 பொருத்தமான தாதாக்கள் கண்டுபிடிக்கப்பட்டனர்.',
  },
  hi: {
    'Find nearest hospital': 'अपोलो अस्पताल 3.2 किमी दूर — 4 ICU बेड उपलब्ध। एम्बुलेंस रूट हो रही है।',
    'Emergency SOS': 'एम्बुलेंस #07 आपके GPS स्थान पर भेजी जा रही है। ETA 4 मिनट।',
    'Check ICU beds': 'अपोलो: 4 | फोर्टिस: 6 | कावेरी: 3 | MIOT: 2 बेड उपलब्ध।',
    'Symptom check': 'अपने लक्षण बताएं। AI विश्लेषण करेगा और नजदीकी विशेषज्ञ को रूट करेगा।',
    'My location': 'GPS: चेन्नई, तमिलनाडु। नजदीकी अस्पताल: अपोलो, 3.2 किमी।',
    'Blood donor': '5 किमी में A+ दाता खोज रहे हैं... 3 दाता मिले। अलर्ट भेजा जा रहा है।',
  },
}
const LANG_LABELS = { en: 'LANGUAGE: ENGLISH', ta: 'மொழி: தமிழ்', hi: 'भाषा: हिंदी' }

const VOICE_CMDS = [
  ['🏥', 'NEAREST HOSPITAL', 'Find available beds', 'Find nearest hospital'],
  ['🚨', 'EMERGENCY SOS', 'Dispatch ambulance', 'Emergency SOS'],
  ['🛏', 'ICU STATUS', 'Real-time bed count', 'Check ICU beds'],
  ['🩺', 'SYMPTOM CHECK', 'AI diagnosis assist', 'Symptom check'],
  ['📍', 'MY LOCATION', 'Share GPS position', 'My location'],
  ['🩸', 'BLOOD DONOR', 'Find compatible donors', 'Blood donor'],
]

const INSIGHTS = [
  ['rgba(0,242,255,.05)', 'rgba(0,242,255,.1)', 'var(--cyan)', '💡 CARDIAC RISK', 'Low risk. HR within normal range. Maintain hydration. Monitor if sustained above 100 bpm.'],
  ['rgba(0,255,136,.05)', 'rgba(0,255,136,.1)', 'var(--green)', '✓ ACTIVITY LEVEL', 'Good activity. 78% of daily goal achieved. Try 2,000 more steps before sleep.'],
  ['rgba(255,149,0,.05)', 'rgba(255,149,0,.1)', 'var(--orange)', '⚠ SLEEP PATTERN', 'Slightly below optimal. Aim for 7–8 hours tonight. Avoid screens 1 hour before bed.'],
  ['rgba(160,32,240,.05)', 'rgba(160,32,240,.1)', 'var(--purple)', '🧠 AI PREDICTION', 'Based on trend: low fatigue risk tomorrow. Blood oxygen stable. No anomalies detected.'],
]

const WARDS = [
  ['ICU', 68, 'var(--orange)', 'linear-gradient(90deg,var(--orange),#cc7700)', '⏱ AI: next bed ~8 min'],
  ['EMERGENCY (ER)', 72, 'var(--cyan)', 'linear-gradient(90deg,var(--cyan),#0090aa)', '⏱ AI: next bed ~6 min'],
  ['OPERATION THEATRE', 55, 'var(--cyan)', 'linear-gradient(90deg,var(--cyan),var(--purple))', '⏱ AI: next slot ~12 min'],
  ['NICU', 40, 'var(--cyan)', 'linear-gradient(90deg,var(--green),#00aa55)', '⏱ AI: 4 beds available'],
  ['NEUROLOGY', 80, 'var(--red)', 'linear-gradient(90deg,var(--red),#aa2222)', '⏱ AI: next bed ~22 min'],
]

const INITIAL_REQUESTS = [
  { id: 0, cls: 'urgent', title: 'CARDIAC ARREST — Zone 4', desc: 'Male, 54 — A+ Blood — Amb #07 en route — ETA 3 min', status: 'URGENT', statusCls: 'status-active', canAccept: true },
  { id: 1, cls: 'moderate', title: 'TRAUMA — Adyar', desc: 'Female, 32 — O+ Blood — Amb #12 en route — ETA 7 min', status: 'PENDING', statusCls: 'status-pending', canAccept: true },
  { id: 2, cls: '', title: 'STROKE — T Nagar', desc: 'Male, 67 — B+ Blood — Kaveri primary, Apollo backup', status: 'RESOLVED', statusCls: 'status-done', canAccept: false },
]

const HOSP_STATUS = [
  ['Apollo Hospitals — Greams Rd', 'g', 'ONLINE'],
  ['MIOT International — Manapakkam', 'g', 'ONLINE'],
  ['Fortis Malar — Adyar', 'g', 'ONLINE'],
  ['Kaveri Hospital — Vadapalani', 'c', 'MODERATE'],
  ['SRMC — Porur', 'g', 'ONLINE'],
  ['Global Hospitals — Perumbur', 'g', 'ONLINE'],
]

const AI_MODELS = [
  ['Hospital Scorer v4.2', 'g', 'ACTIVE'],
  ['Route Optimizer v3.1', 'g', 'ACTIVE'],
  ['Vacancy Predictor v2.8', 'g', 'ACTIVE'],
  ['Wellness Analyzer v1.5', 'c', 'TRAINING'],
]

const DEFAULT_BANNER = '⚠ CRITICAL — PATIENT HR ELEVATED — QUANTUM ROUTE ACTIVE — APOLLO HOSPITAL — ETA 4 MIN'

// ═══════════════════════════════════════════════════
// CANVAS HELPERS
// ═══════════════════════════════════════════════════
function drawHeatmap(c) {
  if (!c) return
  const ctx = c.getContext('2d')
  c.width = c.offsetWidth || 300; c.height = 140
  const zones = [
    { x: .15, y: .35, r: 46, col: 'rgba(255,49,49,.65)' },
    { x: .5, y: .62, r: 36, col: 'rgba(255,149,0,.55)' },
    { x: .74, y: .24, r: 30, col: 'rgba(0,242,255,.45)' },
    { x: .32, y: .72, r: 40, col: 'rgba(255,49,49,.42)' },
    { x: .88, y: .65, r: 26, col: 'rgba(0,255,136,.42)' },
  ]
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, c.width, c.height)
  ctx.strokeStyle = 'rgba(0,242,255,.06)'; ctx.lineWidth = .5
  for (let x = 0; x < c.width; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke() }
  for (let y = 0; y < c.height; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke() }
  zones.forEach(z => {
    const g = ctx.createRadialGradient(z.x * c.width, z.y * c.height, 0, z.x * c.width, z.y * c.height, z.r)
    g.addColorStop(0, z.col); g.addColorStop(1, 'transparent')
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(z.x * c.width, z.y * c.height, z.r, 0, Math.PI * 2); ctx.fill()
  })
  ;['Zone A', 'Central', 'North', 'South', 'East'].forEach((l, i) => {
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '9px Rajdhani'
    ctx.fillText(l, zones[i].x * c.width - 14, zones[i].y * c.height + 3)
  })
}

function drawTrend(c, hr) {
  if (!c) return
  const ctx = c.getContext('2d')
  c.width = c.offsetWidth || 600; c.height = 90
  const data = [72, 78, 85, 81, 76, 79, Math.round(hr)]
  const max = Math.max(...data) + 8, min = Math.min(...data) - 8
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * c.width, y: c.height - ((v - min) / (max - min)) * (c.height - 14) - 7 }))
  const g = ctx.createLinearGradient(0, 0, 0, c.height)
  g.addColorStop(0, 'rgba(0,242,255,.3)'); g.addColorStop(1, 'transparent')
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))
  ctx.lineTo(c.width, c.height); ctx.lineTo(0, c.height); ctx.fillStyle = g; ctx.fill()
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))
  ctx.strokeStyle = '#00F2FF'; ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = '#00F2FF'; ctx.stroke(); ctx.shadowBlur = 0
  pts.forEach((p, i) => {
    ctx.fillStyle = '#00F2FF'; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(224,247,250,.4)'; ctx.font = '9px Rajdhani'
    ctx.fillText(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Now'][i], p.x - 8, c.height - 1)
    ctx.fillStyle = 'var(--cyan)'; ctx.font = 'bold 9px Share Tech Mono'
    ctx.fillText(data[i], p.x - 6, p.y - 7)
  })
}

function drawQuantumRoute(c, h) {
  if (!c) return () => {}
  const ctx = c.getContext('2d')
  c.width = c.offsetWidth || 400; c.height = 260
  const pts = [{ x: 50, y: 220 }, { x: 110, y: 180 }, { x: 180, y: 135 }, { x: 255, y: 95 }, { x: c.width - 50, y: 55 }]
  let prog = 0, raf

  function frame() {
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, c.width, c.height)
    ctx.strokeStyle = 'rgba(0,242,255,.05)'; ctx.lineWidth = .5
    for (let x = 0; x < c.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke() }
    for (let y = 0; y < c.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke() }
    // Road
    ctx.strokeStyle = 'rgba(0,242,255,.1)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke()
    // Glow path
    const tot = pts.length - 1, ci = Math.min(Math.floor(prog * tot), tot - 1), fr = (prog * tot) % 1
    const ep = ci < tot ? { x: pts[ci].x + (pts[ci + 1].x - pts[ci].x) * fr, y: pts[ci].y + (pts[ci + 1].y - pts[ci].y) * fr } : pts[tot]
    ctx.shadowBlur = 16; ctx.shadowColor = '#00F2FF'; ctx.strokeStyle = '#00F2FF'; ctx.lineWidth = 2.5
    ctx.beginPath(); pts.slice(0, ci + 1).forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))
    ctx.lineTo(ep.x, ep.y); ctx.stroke(); ctx.shadowBlur = 0
    ctx.fillStyle = '#00F2FF'; ctx.shadowBlur = 12; ctx.shadowColor = '#00F2FF'
    ctx.beginPath(); ctx.arc(ep.x, ep.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
    // Labels
    ctx.fillStyle = 'rgba(0,242,255,.65)'; ctx.font = 'bold 10px Rajdhani'; ctx.fillText('📍 YOU', pts[0].x - 8, pts[0].y + 18)
    ctx.fillStyle = '#00F2FF'; ctx.fillText('🏥 ' + h.name.toUpperCase(), pts[tot].x - 25, pts[tot].y - 14)
    ctx.fillStyle = 'rgba(0,242,255,.2)'; ctx.beginPath(); ctx.arc(pts[tot].x, pts[tot].y, 12, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#00F2FF'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(pts[tot].x, pts[tot].y, 12, 0, Math.PI * 2); ctx.stroke()
    prog = prog < 1 ? prog + .006 : 0
    raf = requestAnimationFrame(frame)
  }
  frame()
  return () => cancelAnimationFrame(raf)
}

function startWave(c, color) {
  if (!c) return () => {}
  const ctx = c.getContext('2d')
  const col = color === 'red' ? '#FF3131' : color === 'purple' ? '#A020F0' : '#00F2FF'
  let t = 0, raf
  function frame() {
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = col
    ctx.beginPath()
    for (let x = 0; x < c.width; x++) {
      const amp = 12 + Math.sin(x * .04 + t) * 8
      const y = c.height / 2 + Math.sin(x * .025 + t * 1.4) * amp
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0; t += .07
    raf = requestAnimationFrame(frame)
  }
  frame()
  return () => cancelAnimationFrame(raf)
}

// ═══════════════════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════════════════
function HospitalGrid({ id, nodes, obstacles, onSelect, style }) {
  const bestId = nodes[0].id
  return (
    <div id={id} style={style}>
      {nodes.map(h => (
        <div key={h.id} className={`hosp-card ${h.id === bestId ? 'best' : ''}`} onClick={() => onSelect(h.id)}>
          {h.id === bestId && <div className="best-badge">BEST CHOICE</div>}
          <div className="hosp-name">{h.name}</div>
          <div style={{ fontSize: '9px', color: 'var(--dim)', marginBottom: '7px' }}>{h.loc}</div>
          <div className="hosp-score">{h.score}</div>
          <div style={{ fontSize: '9px', color: 'var(--dim)', marginBottom: '3px' }}>RESCUE SCORE (lower=better)</div>
          <div className="hosp-meta">📍 {h.dist}km<br />🛏 {h.icuFree} ICU free<br />⏱ ETA {h.eta}</div>
          <div className="tminus">{tMinus(h)}</div>
          {obstacles.length > 0 && <div style={{ fontSize: '9px', color: 'var(--orange)', marginTop: '3px' }}>⚠ Reroute: {obstacles[0].loc}</div>}
        </div>
      ))}
    </div>
  )
}

function StatusDot({ color, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block' }}></span>{children}
    </div>
  )
}

function InfoBox({ id, cls, size, color, val, label }) {
  return (
    <div className="imi" style={{ background: 'var(--glass)', border: '1px solid var(--gb2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
      <div id={id} className={`mono ${cls}`} style={{ fontSize: size, fontWeight: 'bold', ...(color ? { color } : {}) }}>{val}</div>
      <div style={{ fontSize: '9px', color: 'var(--dim)', marginTop: '2px', letterSpacing: '1px' }}>{label}</div>
    </div>
  )
}

function Ring({ title, track, stroke, offset, valClass, valSize, value, unit, ringId, ringStyle }) {
  return (
    <div className="gc" style={{ textAlign: 'center' }}>
      <div className="clbl" style={{ justifyContent: 'center' }}>{title}</div>
      <div className="ring-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="45" fill="none" stroke={track} strokeWidth="9" />
          <circle id={ringId} cx="55" cy="55" r="45" fill="none" stroke={stroke} strokeWidth="9" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={offset} transform="rotate(-90 55 55)" style={ringStyle || { transition: 'stroke-dashoffset 1s' }} />
        </svg>
        <div className={`mono ${valClass}`} style={{ fontSize: valSize, fontWeight: 'bold', marginTop: '-8px' }}>{value}</div>
        <div style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '2px' }}>{unit}</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState('landing')
  const [authMode, setAuthMode] = useState('login')

  // alert / banner
  const [alertMode, setAlertMode] = useState(false)
  const [bannerShow, setBannerShow] = useState(false)
  const [bannerText, setBannerText] = useState(DEFAULT_BANNER)
  const alertRef = useRef(false)

  // hospital scoring
  const [{ nodes, obstacles }, setScored] = useState(() => calculateBestNode())

  // live data
  const [hr, setHr] = useState(78)
  const [vit, setVit] = useState({ v: 74, icu: 12, amb: 14 })
  const [clock, setClock] = useState('')

  // SOS
  const [sos, setSos] = useState({ fired: false, sub: 'EMERGENCY', status: 'STANDBY', statusColor: 'var(--green)', eta: '—', hosp: '—', beds: '—' })
  const [sosLang, setSosLangState] = useState('en')
  const [tl, setTl] = useState(TL_INITIAL)
  const [map, setMap] = useState({ overlay: true, eta: '—', dist: '—', traffic: '—', trafficColor: 'var(--green)', block: '—', blockColor: 'var(--text)', obstacle: null })
  const sosLock = useRef(false)
  const sosTimers = useRef([])
  const routeCancel = useRef(null)

  // voice
  const [voiceLang, setVoiceLang] = useState('en')
  const [voiceOn, setVoiceOn] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('Say a command or tap a quick action below...')

  // hospital + profile
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [updMsg, setUpdMsg] = useState(false)
  const [profSaved, setProfSaved] = useState(false)

  // refs
  const ncRef = useRef(null)
  const heatRef = useRef(null)
  const trendRef = useRef(null)
  const routeRef = useRef(null)
  const waveRef = useRef(null)
  const hrRef = useRef(78)

  // ── router ──
  function showPage(name) {
    setPage(name)
    window.scrollTo(0, 0)
  }

  function setAlert(on) {
    alertRef.current = on
    setAlertMode(on)
    setBannerShow(on)
  }

  // body alert-mode class
  useEffect(() => {
    document.body.classList.toggle('alert-mode', alertMode)
  }, [alertMode])

  // ── Neural particle canvas ──
  useEffect(() => {
    const nc = ncRef.current
    const nctx = nc.getContext('2d')
    let mx = -9999, my = -9999, raf

    function resizeNC() { nc.width = innerWidth; nc.height = innerHeight }
    resizeNC()
    const onMove = e => { mx = e.clientX; my = e.clientY }
    addEventListener('resize', resizeNC)
    addEventListener('mousemove', onMove)

    function resetP(p) {
      p.x = Math.random() * nc.width; p.y = Math.random() * nc.height
      p.vx = (Math.random() - .5) * .4; p.vy = (Math.random() - .5) * .4
      p.r = Math.random() * 1.4 + .4; p.a = Math.random() * .45 + .12
    }
    const particles = Array.from({ length: 100 }, () => {
      const p = { x: 0, y: 0, vx: 0, vy: 0, r: 0, a: 0 }
      resetP(p); return p
    })

    function drawNeural() {
      nctx.clearRect(0, 0, nc.width, nc.height)
      const col = alertRef.current ? '#FF3131' : '#00F2FF'
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j]
          const dx = pi.x - pj.x, dy = pi.y - pj.y, d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) { nctx.beginPath(); nctx.moveTo(pi.x, pi.y); nctx.lineTo(pj.x, pj.y); nctx.strokeStyle = col; nctx.globalAlpha = (1 - d / 90) * .12; nctx.lineWidth = .5; nctx.stroke() }
        }
        nctx.globalAlpha = pi.a * .5; nctx.fillStyle = col; nctx.beginPath(); nctx.arc(pi.x, pi.y, pi.r, 0, Math.PI * 2); nctx.fill()
        const ddx = mx - pi.x, ddy = my - pi.y, dd = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dd < 130) { pi.vx -= ddx / dd * .25; pi.vy -= ddy / dd * .25 }
        pi.vx *= .98; pi.vy *= .98; pi.x += pi.vx; pi.y += pi.vy
        if (pi.x < 0 || pi.x > nc.width || pi.y < 0 || pi.y > nc.height) resetP(pi)
      }
      nctx.globalAlpha = 1
      raf = requestAnimationFrame(drawNeural)
    }
    drawNeural()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resizeNC)
      removeEventListener('mousemove', onMove)
    }
  }, [])

  // ── Hospital scoring refresh every 30s ──
  useEffect(() => {
    const id = setInterval(() => setScored(calculateBestNode()), 30000)
    return () => clearInterval(id)
  }, [])

  // ── HR simulation ──
  useEffect(() => {
    let trend = 1
    const id = setInterval(() => {
      let h = hrRef.current
      h += (Math.random() - .4) * trend * 3
      h = Math.max(52, Math.min(148, h))
      hrRef.current = h
      const r = Math.round(h)
      setHr(r)
      if (r > 120 && !alertRef.current) setAlert(true)
      if (r <= 100 && alertRef.current) setAlert(false)
      if (Math.random() < .015) trend *= -1
    }, 1300)
    return () => clearInterval(id)
  }, [])

  // ── Vitality ticker ──
  useEffect(() => {
    const id = setInterval(() => {
      setVit({
        v: Math.round(65 + Math.random() * 22),
        icu: Math.round(8 + Math.random() * 8),
        amb: Math.round(10 + Math.random() * 8),
      })
    }, 4500)
    return () => clearInterval(id)
  }, [])

  // ── Clock ──
  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Page-specific canvases ──
  useEffect(() => {
    if (page === 'dashboard') {
      const t = setTimeout(() => drawHeatmap(heatRef.current), 50)
      return () => clearTimeout(t)
    }
    if (page === 'wellness') {
      const t = setTimeout(() => drawTrend(trendRef.current, hrRef.current), 100)
      return () => clearTimeout(t)
    }
    if (page === 'voice') {
      let cancel = () => {}
      const t = setTimeout(() => { cancel = startWave(waveRef.current, 'purple') }, 100)
      return () => { clearTimeout(t); cancel() }
    }
  }, [page])

  // cleanup SOS timers / route on unmount
  useEffect(() => () => {
    sosTimers.current.forEach(clearTimeout)
    if (routeCancel.current) routeCancel.current()
  }, [])

  // ── Auth ──
  function doLogin(role) {
    if (role === 'hospital') { showPage('hospital'); return }
    if (role === 'admin') { showPage('admin'); return }
    showPage('dashboard')
  }

  // ── SOS ──
  function setSosLang(l) { setSosLangState(l) }

  function animateTimeline() {
    TL_ANIM.forEach((s, i) => {
      sosTimers.current.push(setTimeout(() => {
        setTl(prev => prev.map((x, k) => k === i ? { cls: 'active', icon: '→', time: s.time } : x))
        sosTimers.current.push(setTimeout(() => {
          setTl(prev => prev.map((x, k) => k === i ? { ...x, cls: 'done', icon: '✓' } : x))
        }, 1500))
      }, s.t))
    })
  }

  function fireSOS() {
    if (sosLock.current) return
    sosLock.current = true
    const best = nodes[0]
    setSos(s => ({ ...s, fired: true, sub: 'DISPATCHING...', status: 'DISPATCHING', statusColor: 'var(--orange)' }))

    setMap({
      overlay: false,
      eta: best.eta,
      dist: best.dist + ' KM',
      traffic: trafficLabel(best.traffic),
      trafficColor: trafficColor(best.traffic),
      block: obstacles.length ? obstacles[0].loc : 'NONE',
      blockColor: obstacles.length ? 'var(--orange)' : 'var(--green)',
      obstacle: obstacles.length ? obstacles[0] : null,
    })
    if (routeCancel.current) routeCancel.current()
    routeCancel.current = drawQuantumRoute(routeRef.current, best)

    setAlert(true)
    animateTimeline()

    sosTimers.current.push(setTimeout(() => {
      setSos(s => ({ ...s, eta: best.eta, hosp: best.name, beds: best.icuFree + ' ICU', status: 'DISPATCHED', statusColor: 'var(--red)', sub: 'DISPATCHED' }))
    }, 1200))
    sosTimers.current.push(setTimeout(() => { sosLock.current = false }, 15000))
  }

  // ── Voice ──
  function changeVoiceLang(l) {
    setVoiceLang(l)
    setTranscript('Language switched. Say a command or tap an action.')
  }

  function toggleVoice() {
    const next = !voiceOn
    setVoiceOn(next)
    setListening(next)
    setTranscript(next ? 'Listening...' : 'Tap mic to begin.')
  }

  function runVoiceCmd(cmd) {
    const res = VOICE_RESPONSES[voiceLang][cmd] || 'Processing your request...'
    setListening(true)
    setTranscript('🎙️ You: "' + cmd + '"\n\n🤖 Aether AI: ' + res)
    setTimeout(() => setListening(false), 2500)
    if (cmd === 'Emergency SOS') setTimeout(() => showPage('sos'), 1500)
  }

  // ── Hospital / admin / profile ──
  function updateHospitalData() {
    setUpdMsg(true)
    setTimeout(() => setUpdMsg(false), 3000)
  }

  function acceptRequest(id) {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, cls: '', status: 'ACCEPTED', statusCls: 'status-done', canAccept: false } : r))
  }

  function adminBroadcast() {
    setBannerText('📢 ADMIN BROADCAST — System maintenance scheduled. All hospitals notified.')
    setBannerShow(true)
    setTimeout(() => setBannerShow(false), 5000)
  }

  function saveProfile() {
    setProfSaved(true)
    setTimeout(() => setProfSaved(false), 3000)
  }

  const pageCls = name => `page ${page === name ? 'on' : ''}`
  const hrColor = hr > 120 ? 'var(--red)' : 'var(--cyan)'

  return (
    <>
      <canvas id="nc" ref={ncRef}></canvas>

      {/* ALERT BANNER */}
      <div id="ab" style={{ display: bannerShow ? 'flex' : 'none' }}>
        <div className="abp"></div>
        <span id="ab-text">{bannerText}</span>
      </div>

      <div id="app">

        {/* ═══════════════════════ NAV ═══════════════════════ */}
        <nav style={{ top: bannerShow ? '38px' : '0' }}>
          <div className="logo" onClick={() => showPage('landing')}>AETHERPULSE OS</div>
          <div className="nav-tabs" id="nav-tabs">
            {NAV_TABS.map(([key, label]) => (
              <button key={key} className={`ntab ${page === key ? 'on' : ''}`} onClick={() => showPage(key)}>{label}</button>
            ))}
          </div>
          <div className="nav-right">
            <div className="hr-display">♥ <span className="hr-val" id="hr-val" style={{ color: hrColor }}>{hr}</span> <span style={{ fontSize: '10px' }}>bpm</span></div>
            <div className="live-dot"></div>
            <button className="sos-nav" onClick={() => showPage('sos')}>SOS</button>
            <div className="user-badge" onClick={() => showPage('profile')} title="Profile">👤</div>
          </div>
        </nav>

        {/* ═══════════════════════ LANDING PAGE ═══════════════════════ */}
        <div className={pageCls('landing')} id="p-landing">
          <div className="hero">
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '11px', letterSpacing: '5px', color: 'var(--cyan)', marginBottom: '16px', opacity: .7 }}>URBAN AI HEALTHCARE SYSTEM</div>
            <div className="hero-title">AetherPulse OS</div>
            <p className="hero-sub">We are not just building an app — we are saving the next 100 lives in your city. AI-powered emergency response that finds hospital beds before they are officially empty.</p>
            <div className="hero-btns">
              <button className="btn btn-solid" style={{ padding: '12px 32px', fontSize: '15px' }} onClick={() => showPage('auth')}>GET STARTED</button>
              <button className="btn btn-cyan" style={{ padding: '12px 28px', fontSize: '15px' }} onClick={() => showPage('dashboard')}>LIVE DEMO</button>
            </div>
            <div style={{ marginTop: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['40%', 'var(--cyan)', 'FASTER RESPONSE'], ['6', 'var(--purple)', 'HOSPITALS LIVE'], ['24/7', 'var(--green)', 'AI MONITORING'], ['4 MIN', 'var(--red)', 'AVG ETA']].map(([n, c, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '28px', fontWeight: 900, color: c }}>{n}</div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)', letterSpacing: '2px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 28px 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div className="page-title" style={{ justifyContent: 'center', fontSize: '18px' }}>PLATFORM FEATURES</div>
              <p style={{ color: 'var(--dim)', fontSize: '13px' }}>Startup-grade technology built for real emergency impact</p>
            </div>
            <div className="feature-grid" style={{ padding: 0 }}>
              {FEATURES.map(([icon, title, desc]) => (
                <div key={title} className="gc feature-card">
                  <div className="feature-icon">{icon}</div>
                  <div className="feature-title">{title}</div>
                  <div className="feature-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════ AUTH PAGE ═══════════════════════ */}
        <div className={pageCls('auth')} id="p-auth">
          <div className="auth-box">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="logo" style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>AETHERPULSE OS</div>
              <div style={{ fontSize: '12px', color: 'var(--dim)', letterSpacing: '2px' }}>SECURE ACCESS PORTAL</div>
            </div>
            <div className="gc">
              <div className="auth-toggle">
                <button className={`auth-toggle-btn ${authMode === 'login' ? 'on' : ''}`} id="login-btn" onClick={() => setAuthMode('login')}>LOGIN</button>
                <button className={`auth-toggle-btn ${authMode === 'register' ? 'on' : ''}`} id="register-btn" onClick={() => setAuthMode('register')}>REGISTER</button>
              </div>

              {/* LOGIN */}
              <div id="login-form" style={{ display: authMode === 'login' ? 'block' : 'none' }}>
                <div className="inp-group"><div className="inp-label">EMAIL</div><input className="inp" type="email" placeholder="you@example.com" id="login-email" /></div>
                <div className="inp-group"><div className="inp-label">PASSWORD</div><input className="inp" type="password" placeholder="••••••••" id="login-pass" /></div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button className="btn btn-solid" style={{ flex: 1 }} onClick={() => doLogin()}>LOGIN →</button>
                  <button className="btn btn-red" style={{ padding: '9px 16px' }} onClick={() => doLogin('hospital')}>HOSPITAL</button>
                  <button className="btn btn-purple" style={{ padding: '9px 16px' }} onClick={() => doLogin('admin')}>ADMIN</button>
                </div>
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0,242,255,.05)', borderRadius: '6px', fontSize: '11px', color: 'var(--dim)' }}>
                  Demo: any email + password → User login<br />HOSPITAL → Hospital dashboard &nbsp; ADMIN → Admin panel
                </div>
              </div>

              {/* REGISTER */}
              <div id="register-form" style={{ display: authMode === 'register' ? 'block' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="inp-group"><div className="inp-label">FULL NAME</div><input className="inp" type="text" placeholder="Hema Priya" /></div>
                  <div className="inp-group"><div className="inp-label">PHONE</div><input className="inp" type="tel" placeholder="+91 98765 43210" /></div>
                  <div className="inp-group"><div className="inp-label">EMAIL</div><input className="inp" type="email" placeholder="hema@example.com" /></div>
                  <div className="inp-group"><div className="inp-label">AGE</div><input className="inp" type="number" placeholder="22" /></div>
                  <div className="inp-group"><div className="inp-label">BLOOD GROUP</div>
                    <select className="inp" defaultValue=""><option value="">Select...</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select>
                  </div>
                  <div className="inp-group"><div className="inp-label">PASSWORD</div><input className="inp" type="password" placeholder="••••••••" /></div>
                </div>
                <div className="inp-group"><div className="inp-label">MEDICAL HISTORY (OPTIONAL)</div><textarea className="inp" rows="2" placeholder="Diabetes, Hypertension..." style={{ resize: 'none' }}></textarea></div>
                <div className="inp-group"><div className="inp-label">EMERGENCY CONTACT</div><input className="inp" type="tel" placeholder="+91 98765 43210" /></div>
                <button className="btn btn-solid" style={{ width: '100%', marginTop: '4px' }} onClick={() => doLogin()}>CREATE ACCOUNT →</button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════ DASHBOARD ═══════════════════════ */}
        <div className={pageCls('dashboard')} id="p-dashboard">
          <div id="p-dashboard-inner" style={{ padding: '24px 28px' }}>
            {/* Status row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
              <StatusDot color="var(--cyan)">NEURAL SYNC ACTIVE</StatusDot>
              <StatusDot color="var(--purple)">AI MODEL v4.2 RUNNING</StatusDot>
              <StatusDot color="var(--green)">6 HOSPITALS ONLINE</StatusDot>
              <div style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono',monospace", fontSize: '11px', color: 'var(--dim)' }} id="clock-display">{clock}</div>
            </div>

            {/* Top stat boxes */}
            <div className="dash-grid" style={{ marginBottom: '14px' }}>
              <div className="statbox gc"><div className="statbox-val acyan" id="d-vitality">{vit.v}%</div><div className="statbox-lbl">CITY VITALITY</div></div>
              <div className="statbox gc"><div className="statbox-val agreen" id="d-icu">{vit.icu}</div><div className="statbox-lbl">ICU BEDS FREE</div></div>
              <div className="statbox gc"><div className="statbox-val apurple" id="d-active">3</div><div className="statbox-lbl">ACTIVE SOS</div></div>
              <div className="statbox gc"><div className="statbox-val aorange" id="d-amb">{vit.amb}</div><div className="statbox-lbl">AMBULANCES ON</div></div>
            </div>

            {/* Mid row */}
            <div className="dash-mid" style={{ marginBottom: '14px' }}>
              {/* Vitality */}
              <div className="gc">
                <div className="clbl">City Vitality Index</div>
                <div className="vitality-num" id="v-num">{vit.v}</div>
                <div style={{ fontSize: '10px', color: 'var(--dim)', marginTop: '4px' }}>% SYSTEM CAPACITY OPTIMAL</div>
                <div className="vbar"><div className="vfill" id="v-fill" style={{ width: vit.v + '%' }}></div></div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>ICU <b id="icu-cnt" style={{ color: 'var(--text)' }}>{vit.icu}</b></div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>ER <b id="er-cnt" style={{ color: 'var(--text)' }}>8</b></div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>OT <b id="ot-cnt" style={{ color: 'var(--text)' }}>5</b></div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>Amb <b id="amb-cnt" style={{ color: 'var(--text)' }}>14</b></div>
                </div>
              </div>

              {/* SOS Ticker */}
              <div className="gc">
                <div className="clbl">Active SOS Feed <span className="tag c">LIVE</span></div>
                <div className="ticker-wrap">
                  <div className="ticker-scroll">
                    {[...TICKER, ...TICKER].map(([color, text, ago], i) => (
                      <div key={i} className="ticker-item">
                        <div className="tdot" style={{ background: color, boxShadow: `0 0 5px ${color}` }}></div>
                        <div>{text} <span className="mono acyan">{ago}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Heatmap */}
              <div className="gc">
                <div className="clbl">Predictive Demand Heatmap <span className="tag p">AI</span></div>
                <canvas id="heatmap" ref={heatRef} style={{ width: '100%', height: '140px', borderRadius: '6px' }}></canvas>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9px', color: 'var(--dim)' }}>■ <span style={{ color: 'var(--red)' }}>CRITICAL</span></span>
                  <span style={{ fontSize: '9px', color: 'var(--dim)' }}>■ <span style={{ color: 'var(--orange)' }}>HIGH</span></span>
                  <span style={{ fontSize: '9px', color: 'var(--dim)' }}>■ <span style={{ color: 'var(--cyan)' }}>MOD</span></span>
                  <span style={{ fontSize: '9px', color: 'var(--dim)' }}>■ <span style={{ color: 'var(--green)' }}>LOW</span></span>
                </div>
              </div>
            </div>

            {/* Hospital AI Grid */}
            <div className="gc" style={{ marginBottom: '14px' }}>
              <div className="clbl">Optimal Rescue Nodes — Neural Algorithm <span className="tag p">AI SCORING</span></div>
              <HospitalGrid id="hosp-grid-dash" nodes={nodes} obstacles={obstacles} onSelect={() => showPage('sos')}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px', marginTop: '8px' }} />
            </div>

            {/* Bottom row */}
            <div className="dash-bot">
              <div className="gc">
                <div className="clbl">Recent Emergency History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} id="em-history">
                  {EM_HISTORY.map(([text, cls, tag]) => (
                    <div key={text} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,.03)', borderRadius: '8px', fontSize: '12px' }}>
                      <span>{text}</span><span className={`tag ${cls}`}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gc">
                <div className="clbl">Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="btn btn-solid-red" style={{ width: '100%' }} onClick={() => showPage('sos')}>🚨 EMERGENCY SOS</button>
                  <button className="btn btn-cyan" style={{ width: '100%' }} onClick={() => showPage('voice')}>🎙️ AI VOICE ASSIST</button>
                  <button className="btn btn-purple" style={{ width: '100%' }} onClick={() => showPage('wellness')}>💚 WELLNESS CHECK</button>
                  <button className="btn btn-cyan" style={{ width: '100%' }} onClick={() => showPage('profile')}>👤 MY PROFILE</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════ SOS PAGE ═══════════════════════ */}
        <div className={pageCls('sos')} id="p-sos">
          <div className="page-title"><span className="ared">⚡</span> EMERGENCY SOS <span className="tag r">LIVE</span></div>
          <div className="sos-layout">
            {/* Left: SOS + timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="gc">
                <div className="clbl">Emergency Dispatch</div>
                <div className="sos-center">
                  <div style={{ fontSize: '11px', color: 'var(--dim)', letterSpacing: '2px', fontFamily: "'Orbitron',monospace" }}>TAP TO ACTIVATE</div>
                  <div className="sos-ring" onClick={fireSOS}>
                    <div className={`sos-btn-inner ${sos.fired ? 'fired' : ''}`} id="sos-inner">
                      <div className="sos-text">SOS</div>
                      <div className="sos-sub-text" id="sos-sub">{sos.sub}</div>
                    </div>
                  </div>
                  <div className="sos-info-grid">
                    <InfoBox id="sos-eta" cls="acyan" size="18px" val={sos.eta} label="AMB ETA" />
                    <InfoBox id="sos-hosp" cls="apurple" size="14px" val={sos.hosp} label="HOSPITAL" />
                    <InfoBox id="sos-beds" cls="acyan" size="18px" val={sos.beds} label="ICU BEDS" />
                    <InfoBox id="sos-status" cls="agreen" size="14px" color={sos.statusColor} val={sos.status} label="STATUS" />
                  </div>
                  <div className="lang-btns" style={{ marginTop: '4px' }}>
                    <button className={`lbtn ${sosLang === 'en' ? 'on' : ''}`} onClick={() => setSosLang('en')}>EN</button>
                    <button className={`lbtn ${sosLang === 'ta' ? 'on' : ''}`} onClick={() => setSosLang('ta')}>தமிழ்</button>
                    <button className={`lbtn ${sosLang === 'hi' ? 'on' : ''}`} onClick={() => setSosLang('hi')}>हिंदी</button>
                  </div>
                  <div id="sos-lang-msg" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '12px', color: 'var(--cyan)', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>{SOS_LANG[sosLang]}</div>
                </div>
              </div>

              {/* Golden Hour Timeline */}
              <div className="gc">
                <div className="clbl">Golden Hour Timeline <span className="tag c">LIVE TRACKING</span></div>
                <div id="tl-steps">
                  {TL_STEPS.map(([label, sub], i) => (
                    <div key={label} className="tl-step">
                      <div className={`tl-icon ${tl[i].cls}`} id={`tl${i + 1}`}>{tl[i].icon}</div>
                      <div>
                        <div className="tl-label">{label}</div>
                        <div className="tl-sub">{sub}</div>
                        <div className="tl-time" id={`tl${i + 1}t`}>{tl[i].time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Map + Hospitals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="gc">
                <div className="clbl">Quantum Routing — Live Map <span className="tag c">TRACKING</span></div>
                <div className="map-box" style={{ height: '260px' }}>
                  <canvas id="route-canvas" ref={routeRef} style={{ width: '100%', height: '100%' }}></canvas>
                  <div className="map-overlay" id="map-overlay" style={{ display: map.overlay ? 'flex' : 'none' }}>
                    <div style={{ fontSize: '32px' }}>🗺️</div>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '11px', letterSpacing: '2px', color: 'var(--cyan)' }}>LOCATION DETECTED</div>
                    <div style={{ fontSize: '11px', color: 'var(--dim)' }}>Chennai, Tamil Nadu</div>
                    <div style={{ fontSize: '10px', color: 'var(--dim)', marginTop: '4px' }}>Tap SOS to activate live routing</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <div><div style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '1px' }}>ETA</div><div className="mono acyan" style={{ fontSize: '20px' }} id="map-eta">{map.eta}</div></div>
                  <div><div style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '1px' }}>DISTANCE</div><div className="mono acyan" style={{ fontSize: '20px' }} id="map-dist">{map.dist}</div></div>
                  <div><div style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '1px' }}>TRAFFIC</div><div className="mono" style={{ fontSize: '20px', color: map.trafficColor }} id="map-traffic">{map.traffic}</div></div>
                  <div><div style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '1px' }}>ROAD BLOCK</div><div className="mono" style={{ fontSize: '20px', color: map.blockColor }} id="map-block">{map.block}</div></div>
                </div>
                <div className="obstacle-box" id="obstacle-box" style={{ display: map.obstacle ? 'block' : 'none' }}>
                  {map.obstacle && (
                    <>
                      ⚠ <b>Road Block Detected</b> — {map.obstacle.type} at {map.obstacle.loc}<br />
                      <span style={{ color: 'var(--cyan)' }}>→ Re-routing via Quantum Path — ETA +1 min</span>
                    </>
                  )}
                </div>
              </div>

              {/* AI Hospital Selection */}
              <div className="gc">
                <div className="clbl">AI Hospital Selection <span className="tag p">NEURAL SCORE</span></div>
                <HospitalGrid id="sos-hosp-grid" nodes={nodes} obstacles={obstacles} onSelect={() => showPage('sos')}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════ AI VOICE PAGE ═══════════════════════ */}
        <div className={pageCls('voice')} id="p-voice">
          <div className="page-title">🎙️ AETHER AI VOICE <span className="tag p">MULTILINGUAL</span></div>
          <div className="voice-center">
            <div className={`voice-circle ${listening ? 'listening' : ''}`} id="v-circle" onClick={toggleVoice}>🎙️</div>
            <canvas id="voice-wave" ref={waveRef} width="360" height="70" style={{ maxWidth: '100%' }}></canvas>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '9px', color: 'var(--purple)', letterSpacing: '3px' }} id="v-lang-lbl">{LANG_LABELS[voiceLang]}</div>
            <div className="lang-btns">
              <button className={`lbtn ${voiceLang === 'en' ? 'on' : ''}`} onClick={() => changeVoiceLang('en')}>ENGLISH</button>
              <button className={`lbtn ${voiceLang === 'ta' ? 'on' : ''}`} onClick={() => changeVoiceLang('ta')}>தமிழ் TAMIL</button>
              <button className={`lbtn ${voiceLang === 'hi' ? 'on' : ''}`} onClick={() => changeVoiceLang('hi')}>हिंदी HINDI</button>
            </div>
            <div className="transcript-box" id="transcript">{transcript}</div>
            <div className="voice-cmds">
              {VOICE_CMDS.map(([icon, title, sub, cmd]) => (
                <div key={cmd} className="gc vcmd" onClick={() => runVoiceCmd(cmd)}>
                  <div className="vcmd-icon">{icon}</div>
                  <div className="vcmd-title">{title}</div>
                  <div className="vcmd-sub">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════ WELLNESS PAGE ═══════════════════════ */}
        <div className={pageCls('wellness')} id="p-wellness">
          <div className="page-title">💚 WELLNESS TRACKER <span className="tag g">BIO-SYNC</span></div>
          <div className="wellness-grid" style={{ marginBottom: '14px' }}>
            <Ring title="Heart Rate" track="rgba(0,242,255,.12)" stroke={hrColor} offset={283 - (283 * (hr / 180))} valClass="acyan" valSize="30px" value={hr} unit="BPM" ringId="hr-ring" ringStyle={{ transition: 'stroke-dashoffset 1s,stroke .3s' }} />
            <Ring title="SpO2 — Blood Oxygen" track="rgba(160,32,240,.12)" stroke="var(--purple)" offset="17" valClass="apurple" valSize="30px" value="97%" unit="OXYGEN SAT" />
            <Ring title="Steps Today" track="rgba(0,255,136,.12)" stroke="var(--green)" offset="141" valClass="agreen" valSize="26px" value="6,240" unit="STEPS" />
            <Ring title="Sleep Quality" track="rgba(255,149,0,.12)" stroke="var(--orange)" offset="68" valClass="aorange" valSize="30px" value="76%" unit="QUALITY" />
          </div>

          {/* 7 day trend */}
          <div className="gc" style={{ marginBottom: '14px' }}>
            <div className="clbl">7-Day Heart Rate Trend <span className="tag c">BIOSYNC</span></div>
            <canvas id="trend-canvas" ref={trendRef} style={{ width: '100%', height: '90px' }}></canvas>
          </div>

          {/* AI Insights */}
          <div className="gc">
            <div className="clbl">AI Health Insights <span className="tag p">NEURAL ANALYSIS</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px', marginTop: '6px' }}>
              {INSIGHTS.map(([bg, bd, col, title, text]) => (
                <div key={title} style={{ background: bg, border: `1px solid ${bd}`, borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: col, fontFamily: "'Orbitron',monospace", letterSpacing: '1px', marginBottom: '5px' }}>{title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)', lineHeight: 1.6 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════ HOSPITAL DASHBOARD ═══════════════════════ */}
        <div className={pageCls('hospital')} id="p-hospital">
          <div className="page-title">🏥 HOSPITAL DASHBOARD <span className="tag g">APOLLO HOSPITALS</span></div>
          <div className="hosp-dash-grid" style={{ marginBottom: '14px' }}>
            <div className="statbox gc"><div className="statbox-val acyan">4</div><div className="statbox-lbl">ICU BEDS FREE</div></div>
            <div className="statbox gc"><div className="statbox-val agreen">3</div><div className="statbox-lbl">ER BAYS OPEN</div></div>
            <div className="statbox gc"><div className="statbox-val apurple">2</div><div className="statbox-lbl">AMBULANCES</div></div>
            <div className="statbox gc"><div className="statbox-val aorange">68%</div><div className="statbox-lbl">OCCUPANCY</div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginBottom: '14px' }}>
            {/* Ward Loads */}
            <div className="gc">
              <div className="clbl">Ward Occupancy <span className="tag c">REAL TIME</span></div>
              <div id="ward-bars">
                {WARDS.map(([name, pct, pctColor, grad, ai], i) => (
                  <div key={name} style={{ background: 'rgba(0,242,255,.04)', border: '1px solid rgba(0,242,255,.08)', borderRadius: '8px', padding: '12px', marginBottom: i === WARDS.length - 1 ? 0 : '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--dim)', marginBottom: '5px' }}><span>{name}</span><span className="mono" style={{ color: pctColor }}>{pct}%</span></div>
                    <div className="prog-bg"><div className="prog-fill" style={{ width: pct + '%', background: grad }}></div></div>
                    <div style={{ fontSize: '9px', color: 'var(--purple)', marginTop: '3px' }}>{ai}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update controls */}
            <div>
              <div className="gc" style={{ marginBottom: '14px' }}>
                <div className="clbl">Update Bed Availability</div>
                <div className="inp-group"><div className="inp-label">ICU FREE BEDS</div><input className="inp" type="number" defaultValue="4" id="upd-icu" /></div>
                <div className="inp-group"><div className="inp-label">ER BAYS OPEN</div><input className="inp" type="number" defaultValue="3" id="upd-er" /></div>
                <div className="inp-group"><div className="inp-label">AMBULANCES AVAILABLE</div><input className="inp" type="number" defaultValue="2" id="upd-amb" /></div>
                <button className="btn btn-solid" style={{ width: '100%' }} onClick={updateHospitalData}>UPDATE LIVE →</button>
                <div id="upd-msg" style={{ display: updMsg ? 'block' : 'none', marginTop: '8px', padding: '8px', background: 'rgba(0,255,136,.08)', border: '1px solid rgba(0,255,136,.2)', borderRadius: '6px', fontSize: '11px', color: 'var(--green)', textAlign: 'center' }}>✓ Data updated successfully</div>
              </div>
              <div className="gc">
                <div className="clbl">Hospital Info</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--dim)' }}>
                  <div>📍 <span style={{ color: 'var(--text)' }}>Greams Road, Chennai — 600006</span></div>
                  <div>📞 <span style={{ color: 'var(--text)' }}>+91 44 2829 3333</span></div>
                  <div>🏥 <span style={{ color: 'var(--text)' }}>280 Total Beds</span></div>
                  <div>⭐ <span style={{ color: 'var(--cyan)' }}>Cardiac · Neuro · Oncology</span></div>
                  <div>🔴 <span style={{ color: 'var(--text)' }}>24/7 Emergency Services</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Emergency Requests */}
          <div className="gc">
            <div className="clbl">Live Emergency Requests <span className="tag r">INCOMING</span></div>
            <div className="request-list">
              {requests.map(r => (
                <div key={r.id} className={`req-card ${r.cls}`}>
                  <div>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '11px', fontWeight: 700, marginBottom: '2px' }}>{r.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--dim)' }}>{r.desc}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className={`req-status ${r.statusCls}`}>{r.status}</div>
                    {r.canAccept && <button className="btn btn-cyan" style={{ padding: '5px 12px', fontSize: '10px' }} onClick={() => acceptRequest(r.id)}>ACCEPT</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════ ADMIN DASHBOARD ═══════════════════════ */}
        <div className={pageCls('admin')} id="p-admin">
          <div className="page-title">⚙️ ADMIN DASHBOARD <span className="tag p">SYSTEM CONTROL</span></div>
          <div className="admin-grid" style={{ marginBottom: '14px' }}>
            <div className="statbox gc"><div className="statbox-val acyan" id="adm-users">1,284</div><div className="statbox-lbl">TOTAL USERS</div></div>
            <div className="statbox gc"><div className="statbox-val apurple">6</div><div className="statbox-lbl">HOSPITALS ONLINE</div></div>
            <div className="statbox gc"><div className="statbox-val ared" id="adm-em">3</div><div className="statbox-lbl">ACTIVE EMERGENCIES</div></div>
            <div className="statbox gc"><div className="statbox-val agreen">99.7%</div><div className="statbox-lbl">UPTIME</div></div>
          </div>

          <div className="admin-mid" style={{ marginBottom: '14px' }}>
            {/* System stats */}
            <div className="gc">
              <div className="clbl">System Overview</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                {[
                  ['rgba(0,242,255,.05)', 'rgba(0,242,255,.1)', 'acyan', 'TOTAL EMERGENCIES TODAY', '47'],
                  ['rgba(0,255,136,.05)', 'rgba(0,255,136,.1)', 'agreen', 'RESOLVED', '44'],
                  ['rgba(255,149,0,.05)', 'rgba(255,149,0,.1)', 'aorange', 'AVG RESPONSE TIME', '4.2m'],
                  ['rgba(160,32,240,.05)', 'rgba(160,32,240,.1)', 'apurple', 'AI ACCURACY', '96%'],
                ].map(([bg, bd, cls, label, val]) => (
                  <div key={label} style={{ background: bg, border: `1px solid ${bd}`, borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--dim)', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                    <div className={`mono ${cls}`} style={{ fontSize: '22px' }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="clbl" style={{ marginTop: '4px' }}>Hospital Network Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} id="hosp-status-list">
                {HOSP_STATUS.map(([name, cls, tag]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'rgba(255,255,255,.03)', borderRadius: '7px', fontSize: '12px' }}>
                    <span>{name}</span><span className={`tag ${cls}`}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Reports + controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="gc">
                <div className="clbl">Quick Controls</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="btn btn-red" style={{ width: '100%' }} onClick={adminBroadcast}>📢 BROADCAST ALERT</button>
                  <button className="btn btn-cyan" style={{ width: '100%' }}>📊 EXPORT REPORT</button>
                  <button className="btn btn-purple" style={{ width: '100%' }}>🔄 SYNC ALL HOSPITALS</button>
                  <button className="btn btn-cyan" style={{ width: '100%' }}>📋 VIEW ALL USERS</button>
                </div>
              </div>
              <div className="gc">
                <div className="clbl">AI Model Status</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  {AI_MODELS.map(([name, cls, tag]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--dim)' }}>{name}</span><span className={`tag ${cls}`}>{tag}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════ PROFILE PAGE ═══════════════════════ */}
        <div className={pageCls('profile')} id="p-profile">
          <div className="page-title">👤 MY PROFILE</div>
          <div className="profile-layout">
            {/* Left card */}
            <div>
              <div className="gc" style={{ textAlign: 'center', marginBottom: '14px' }}>
                <div className="profile-avatar">👤</div>
                <div className="profile-name" id="prof-name">Hema Priya</div>
                <div className="profile-role">REGISTERED USER</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="tag c">A+ BLOOD</span>
                  <span className="tag g">ACTIVE</span>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>📞 <span style={{ color: 'var(--text)' }}>+91 98765 43210</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>✉️ <span style={{ color: 'var(--text)' }}>hema@example.com</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>🎂 <span style={{ color: 'var(--text)' }}>22 years old</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>📍 <span style={{ color: 'var(--text)' }}>Chennai, Tamil Nadu</span></div>
                </div>
              </div>
              <div className="gc">
                <div className="clbl">Emergency Contacts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}><div style={{ fontSize: '12px', fontWeight: 600 }}>Priya (Mother)</div><div style={{ fontSize: '11px', color: 'var(--dim)' }}>+91 98765 11111</div></div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}><div style={{ fontSize: '12px', fontWeight: 600 }}>Ramesh (Father)</div><div style={{ fontSize: '11px', color: 'var(--dim)' }}>+91 98765 22222</div></div>
                  <button className="btn btn-cyan" style={{ width: '100%', marginTop: '4px' }}>+ ADD CONTACT</button>
                </div>
              </div>
            </div>

            {/* Right cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="gc">
                <div className="clbl">Medical History</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div className="inp-group"><div className="inp-label">FULL NAME</div><input className="inp" defaultValue="Hema Priya" /></div>
                  <div className="inp-group"><div className="inp-label">BLOOD GROUP</div><select className="inp"><option>A+</option><option>A-</option><option>B+</option><option>O+</option><option>AB+</option></select></div>
                  <div className="inp-group"><div className="inp-label">AGE</div><input className="inp" type="number" defaultValue="22" /></div>
                  <div className="inp-group"><div className="inp-label">PHONE</div><input className="inp" defaultValue="+91 98765 43210" /></div>
                </div>
                <div className="inp-group"><div className="inp-label">KNOWN CONDITIONS</div><textarea className="inp" rows="2" style={{ resize: 'none' }} defaultValue="No known conditions. Mild seasonal allergies."></textarea></div>
                <div className="inp-group"><div className="inp-label">CURRENT MEDICATIONS</div><textarea className="inp" rows="2" style={{ resize: 'none' }} defaultValue="Cetirizine 10mg (seasonal)"></textarea></div>
                <button className="btn btn-solid" style={{ width: '100%' }} onClick={saveProfile}>SAVE PROFILE →</button>
                <div id="prof-save-msg" style={{ display: profSaved ? 'block' : 'none', marginTop: '8px', padding: '8px', background: 'rgba(0,255,136,.08)', border: '1px solid rgba(0,255,136,.2)', borderRadius: '6px', fontSize: '11px', color: 'var(--green)', textAlign: 'center' }}>✓ Profile saved successfully</div>
              </div>

              <div className="gc">
                <div className="clbl">My Emergency History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,.03)', borderRadius: '8px', fontSize: '12px' }}><div><div>Cardiac Episode — Apollo</div><div style={{ fontSize: '10px', color: 'var(--dim)' }}>15 Apr 2024 · Resolved in 6 min</div></div><span className="tag g">RESOLVED</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,.03)', borderRadius: '8px', fontSize: '12px' }}><div><div>Allergic Reaction — Fortis</div><div style={{ fontSize: '10px', color: 'var(--dim)' }}>02 Jan 2024 · Resolved in 9 min</div></div><span className="tag g">RESOLVED</span></div>
                </div>
                <div style={{ marginTop: '12px' }}><button className="btn btn-solid-red" style={{ width: '100%' }} onClick={() => showPage('sos')}>🚨 EMERGENCY SOS</button></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}