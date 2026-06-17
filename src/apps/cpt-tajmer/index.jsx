import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Timer, ArrowLeft, Check } from 'lucide-react'

// ── Pomoćne funkcije ───────────────────────────────────────────────────────

// Formatuje minute lepo: 120 → "2h", 60 → "1h", 30 → "30 min"
const formatMin = m => m >= 60 ? `${m / 60}h` : `${m} min`

// Gradi objekat modova iz config-a koji ima fokus/kratka/duga u minutima
const getModes = cfg => ({
  fokus:  { label: 'Fokus',        duration: cfg.fokus  * 60, color: '#a89aff', gradient: 'linear-gradient(135deg, #7c6bff, #a89aff)' },
  kratka: { label: 'Kratka pauza', duration: cfg.kratka * 60, color: '#6bffd4', gradient: 'linear-gradient(135deg, #3dd9c4, #6bffd4)' },
  duga:   { label: 'Duga pauza',   duration: cfg.duga   * 60, color: '#6bb5ff', gradient: 'linear-gradient(135deg, #4a90e2, #6bb5ff)' },
})

// ── Predefinisani presets ──────────────────────────────────────────────────
const PRESET_LIST = [
  { id: 1, name: 'Brzi fokus',   fokus: 10,  kratka: 2,  duga: 5,  color: '#a89aff', gradient: 'linear-gradient(135deg, #7c6bff, #a89aff)' },
  { id: 2, name: 'Lagani start', fokus: 15,  kratka: 2,  duga: 5,  color: '#6bffd4', gradient: 'linear-gradient(135deg, #3dd9c4, #6bffd4)' },
  { id: 3, name: 'Klasicni',     fokus: 30,  kratka: 5,  duga: 10, color: '#ff6b9d', gradient: 'linear-gradient(135deg, #ff6b4a, #ff6b9d)' },
  { id: 4, name: 'Duboki fokus', fokus: 60,  kratka: 5,  duga: 10, color: '#ffb86b', gradient: 'linear-gradient(135deg, #ff9e6b, #ffb86b)' },
  { id: 5, name: 'Blok sesija',  fokus: 90,  kratka: 10, duga: 20, color: '#b3ff6b', gradient: 'linear-gradient(135deg, #7acc20, #b3ff6b)' },
  { id: 6, name: 'Ultra fokus',  fokus: 120, kratka: 10, duga: 30, color: '#6bb5ff', gradient: 'linear-gradient(135deg, #4a90e2, #6bb5ff)' },
]

// ── SVG ring konstante ─────────────────────────────────────────────────────
const RADIUS       = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const pad = n => String(n).padStart(2, '0')

// ── Zvučni signal ──────────────────────────────────────────────────────────
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx  = new Ctx()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 660
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch { /* browser ne podržava AudioContext */ }
}

// ── Redak u kartici: labela levo, vrednost desno ───────────────────────────
function TimePill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#6b6b88' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

// ── Kartica jednog preseta ─────────────────────────────────────────────────
function PresetCard({ preset, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(preset)}
      style={{
        background: 'rgba(13,13,22,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '22px 20px 20px',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Obojena linija na vrhu kartice */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: preset.gradient }} />

      <div style={{ fontSize: 17, fontWeight: 800, color: '#e8e8f0', fontFamily: 'Syne, sans-serif', letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 16, marginTop: 4 }}>
        {preset.name}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <TimePill label="Fokus"        value={formatMin(preset.fokus)} color={preset.color} />
        <TimePill label="Kratka pauza" value={`${preset.kratka} min`}  color="rgba(255,255,255,0.35)" />
        <TimePill label="Duga pauza"   value={`${preset.duga} min`}    color="rgba(255,255,255,0.35)" />
      </div>
    </motion.div>
  )
}

// ── Input za custom preset ─────────────────────────────────────────────────
function CustomInput({ label, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5a5a7a', marginBottom: 5, letterSpacing: 0.3 }}>
        {label}
      </label>
      <input
        type="number" min="1" max="999" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="min"
        style={{
          width: '100%', padding: '8px 12px', borderRadius: 8, boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#e8e8f0', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
  )
}

// ── "Izaberi sam" — puna širina, horizontalni layout ─────────────────────
function CustomCard({ onSelect }) {
  const [fokus, setFokus]   = useState('')
  const [kratka, setKratka] = useState('')
  const [duga, setDuga]     = useState('')

  const valid = Number(fokus) > 0 && Number(kratka) > 0 && Number(duga) > 0

  const handleStart = () => {
    if (!valid) return
    onSelect({
      name:     'Moj preset',
      fokus:    Number(fokus),
      kratka:   Number(kratka),
      duga:     Number(duga),
      color:    '#a89aff',
      gradient: 'linear-gradient(135deg, #7c6bff, #a89aff)',
    })
  }

  return (
    <motion.div
      style={{
        background: 'rgba(13,13,22,0.7)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16, padding: '22px 24px',
        backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05))' }} />

      {/* Naslov + inputi + dugme u jednom redu */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#e8e8f0', fontFamily: 'Syne, sans-serif', paddingBottom: 9, whiteSpace: 'nowrap' }}>
          Izaberi sam
        </div>

        <div style={{ flex: 1, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 110 }}>
            <CustomInput label="Fokus (min)" value={fokus} onChange={setFokus} />
          </div>
          <div style={{ flex: 1, minWidth: 110 }}>
            <CustomInput label="Kratka pauza (min)" value={kratka} onChange={setKratka} />
          </div>
          <div style={{ flex: 1, minWidth: 110 }}>
            <CustomInput label="Duga pauza (min)" value={duga} onChange={setDuga} />
          </div>

          <motion.button
            whileHover={valid ? { scale: 1.03 } : {}}
            whileTap={valid ? { scale: 0.97 } : {}}
            onClick={handleStart}
            style={{
              height: 36, padding: '0 20px', borderRadius: 10, border: 'none',
              cursor: valid ? 'pointer' : 'not-allowed',
              background: valid ? 'linear-gradient(135deg, #7c6bff, #a89aff)' : 'rgba(255,255,255,0.05)',
              color: valid ? '#fff' : '#4a4a60',
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 0.25s',
            }}
          >
            <Check size={13} /> Počni
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Ekran za izbor preseta ─────────────────────────────────────────────────
function PresetPickerScreen({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 80 }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '5%', left: '25%', width: 700, height: 700,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, #a89aff2a, transparent 70%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto', padding: '40px 28px 80px' }}>
        {/* Naslov */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(168,154,255,0.12)', border: '1px solid rgba(168,154,255,0.25)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 20,
          }}>
            <Timer size={14} color="#a89aff" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a89aff', letterSpacing: 0.5 }}>CPT Tajmer</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 10, lineHeight: 1.1 }}>
            Izaberi tip{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c6bff, #a89aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              sesije
            </span>
          </h1>
          <p style={{ fontSize: 14, color: '#7878a0' }}>
            Fokus · Kratka pauza · Duga pauza
          </p>
        </motion.div>

        {/* Grid kartica — 6 preseta */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 14,
        }}>
          {PRESET_LIST.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <PresetCard preset={p} onSelect={onSelect} />
            </motion.div>
          ))}
        </div>

        {/* "Izaberi sam" — puna širina ispod grid-a */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + 6 * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <CustomCard onSelect={onSelect} />
        </motion.div>
      </div>
    </div>
  )
}

// ── Glavna komponenta ──────────────────────────────────────────────────────
export default function CptTajmer() {
  // null = prikaži picker; objekat = prikaži tajmer
  const [presetConfig, setPresetConfig] = useState(null)

  const [mode, setMode]         = useState('fokus')
  const [timeLeft, setTimeLeft] = useState(0)
  const [running, setRunning]   = useState(false)
  const [rounds, setRounds]     = useState(0)

  // Refs za pristup najnovijem stanju unutar interval callback-a
  const modeRef         = useRef(mode)
  const roundsRef       = useRef(rounds)
  const presetConfigRef = useRef(presetConfig)
  useEffect(() => { modeRef.current = mode },               [mode])
  useEffect(() => { roundsRef.current = rounds },           [rounds])
  useEffect(() => { presetConfigRef.current = presetConfig }, [presetConfig])

  // Glavni interval — odbrojava sekunde
  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          beep()
          setRunning(false)

          const m  = modeRef.current
          const r  = roundsRef.current
          const pc = presetConfigRef.current
          if (!pc) return 0

          if (m === 'fokus') {
            const newR = r + 1
            setRounds(newR)
            const next = newR % 4 === 0 ? 'duga' : 'kratka'
            setTimeout(() => {
              setMode(next)
              setTimeLeft(getModes(pc)[next].duration)
            }, 800)
          } else {
            setTimeout(() => {
              setMode('fokus')
              setTimeLeft(getModes(pc).fokus.duration)
            }, 800)
          }

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running])

  // Kada korisnik izabere preset, inicijalizuje tajmer i prelazi na timer ekran
  const handleSelectPreset = (config) => {
    setPresetConfig(config)
    setMode('fokus')
    setTimeLeft(config.fokus * 60)
    setRunning(false)
    setRounds(0)
  }

  // Nazad na picker — resetuje sve
  const handleBack = () => {
    setRunning(false)
    setPresetConfig(null)
  }

  // ── Svi hook-ovi su pozvani gore, tek sad sme da bude rani return ────────
  if (!presetConfig) {
    return <PresetPickerScreen onSelect={handleSelectPreset} />
  }

  // Izvedene vrednosti za prikaz tajmera
  const modes       = getModes(presetConfig)
  const cfg         = modes[mode]
  const progress    = timeLeft / cfg.duration
  const offset      = CIRCUMFERENCE * (1 - progress)
  const minutes     = Math.floor(timeLeft / 60)
  const seconds     = timeLeft % 60
  const cycleRounds = rounds % 4

  const goToMode = (nextMode) => {
    setRunning(false)
    setMode(nextMode)
    setTimeLeft(getModes(presetConfigRef.current)[nextMode].duration)
  }

  const skip = () => {
    if (mode === 'fokus') {
      const newR = rounds + 1
      setRounds(newR)
      goToMode(newR % 4 === 0 ? 'duga' : 'kratka')
    } else {
      goToMode('fokus')
    }
  }

  // ── Timer UI ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 80 }}>
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '10%', left: '30%', width: 600, height: 600,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(circle, ${cfg.color}33, transparent 70%)`,
          transition: 'background 0.8s ease',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 auto', padding: '32px 28px 80px', textAlign: 'center' }}>
        {/* Nazad dugme */}
        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#5a5a7a', fontSize: 12, fontWeight: 600, padding: '6px 0',
            }}
          >
            <ArrowLeft size={13} /> Promeni sesiju
          </motion.button>
        </div>

        {/* Badge — prikazuje aktuelni preset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${cfg.color}18`, border: `1px solid ${cfg.color}33`,
            borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            transition: 'all 0.5s ease',
          }}
        >
          <Timer size={14} color={cfg.color} />
          <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color, letterSpacing: 0.5 }}>
            CPT Tajmer · {presetConfig.name}
          </span>
        </motion.div>

        {/* Naslov */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}
        >
          Ostani u{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ background: cfg.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {mode === 'fokus' ? 'fokusu' : mode === 'kratka' ? 'pauzi' : 'dugoj pauzi'}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        <p style={{ fontSize: 14, color: '#7878a0', marginBottom: 40 }}>
          {formatMin(presetConfig.fokus)} fokus · {presetConfig.kratka} min pauza · duga pauza na svakih 4 runde
        </p>

        {/* SVG Ring */}
        <div style={{ position: 'relative', width: 280, height: 280, margin: '0 auto 32px' }}>
          <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="140" cy="140" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <motion.circle
              cx="140" cy="140" r={RADIUS}
              fill="none" stroke={cfg.color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: 'linear' }}
              style={{ filter: `drop-shadow(0 0 10px ${cfg.color}77)`, transition: 'stroke 0.5s' }}
            />
          </svg>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontSize: 52, fontWeight: 700, fontFamily: '"Inter", system-ui, sans-serif',
              fontVariantNumeric: 'tabular-nums', letterSpacing: 2,
              color: '#fff', lineHeight: 1, textShadow: `0 0 30px ${cfg.color}44`,
            }}>
              {pad(minutes)}:{pad(seconds)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: cfg.color, marginTop: 8, transition: 'color 0.5s' }}>
              {cfg.label}
            </div>
          </div>
        </div>

        {/* Indikatori rundi */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#4a4a60', marginRight: 4 }}>RUNDA</span>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i < cycleRounds ? cfg.color : 'rgba(255,255,255,0.1)',
                boxShadow:       i < cycleRounds ? `0 0 8px ${cfg.color}99` : 'none',
                borderColor:     i < cycleRounds ? cfg.color : 'rgba(255,255,255,0.15)',
              }}
              transition={{ duration: 0.3 }}
              style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid' }}
            />
          ))}
          {rounds >= 4 && (
            <span style={{ fontSize: 11, color: '#4a4a60', marginLeft: 4 }}>×{Math.floor(rounds / 4)}</span>
          )}
        </div>

        {/* Kontrolna dugmad */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            onClick={() => goToMode(mode)}
            title="Reset"
            style={{
              width: 52, height: 52, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7878a0',
            }}
          >
            <RotateCcw size={17} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, boxShadow: `0 0 36px ${cfg.color}55` }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRunning(r => !r)}
            style={{
              width: 76, height: 76, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: cfg.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: running ? `0 0 24px ${cfg.color}44` : 'none',
              transition: 'background 0.5s, box-shadow 0.3s',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={running ? 'pause' : 'play'}
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.12 }}
              >
                {running
                  ? <Pause size={30} fill="#fff" color="#fff" />
                  : <Play  size={30} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
                }
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            onClick={skip}
            title="Preskoči"
            style={{
              width: 52, height: 52, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7878a0',
            }}
          >
            <SkipForward size={17} />
          </motion.button>
        </div>

        {/* Selector moda */}
        <div style={{
          display: 'inline-flex', gap: 4,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 4,
        }}>
          {Object.entries(modes).map(([key, val]) => (
            <button
              key={key}
              onClick={() => goToMode(key)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                background: mode === key ? `${val.color}18` : 'transparent',
                color:      mode === key ? val.color : '#4a4a60',
                outline:    mode === key ? `1px solid ${val.color}33` : 'none',
              }}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
