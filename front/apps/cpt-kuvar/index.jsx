import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Plus, X, Sparkles, Clock, Users, ChevronDown, ChevronUp, Flame } from 'lucide-react'

// ── Mock recepti (zameni sa AI API pozivom) ────────────────────────────────
const MOCK_RECIPES = [
  {
    id: 1,
    naziv: 'Punjene paprike sa pirinčem',
    vreme: '55 min',
    porcije: 4,
    tezina: 'Srednje',
    opis: 'Klasično srpsko jelo — sočne paprike punjene mlevenim mesom i pirinčem, kuvane u paradajz sosu.',
    sastojci: [
      { kolicina: '6 kom', naziv: 'babura paprika' },
      { kolicina: '400 g', naziv: 'mleveno meso (mešano)' },
      { kolicina: '100 g', naziv: 'pirinač' },
      { kolicina: '1 kom', naziv: 'crni luk' },
      { kolicina: '400 ml', naziv: 'paradajz pire' },
      { kolicina: '2 kašike', naziv: 'vegeta' },
      { kolicina: 'po ukusu', naziv: 'so, biber, lovorov list' },
    ],
    koraci: [
      'Operi paprike, iseci kapice i izvadi semenke.',
      'Poprži sitno seckani luk na ulju dok ne postane staklast.',
      'Dodaj mleveno meso i prži dok ne promeni boju. Začini vegetom i biberom.',
      'Dodaj oprani pirinač i promešaj. Skloni sa vatre.',
      'Napuni paprike mešavinom (ne do vrha — pirinač nabubri).',
      'Poslaži paprike u šerpu, prelij paradajz pireom razblaženim vodom.',
      'Kuvaj na tihoj vatri 45 minuta uz povremeno polievanje sosom.',
    ],
    savet: 'Dodaj malo pavlake u sos na kraju kuvanja za kremastiji ukus.',
    tagovi: ['srpska kuhinja', 'ručak', 'meso'],
  },
  {
    id: 2,
    naziv: 'Proja sa sirom i kajmakom',
    vreme: '35 min',
    porcije: 6,
    tezina: 'Lako',
    opis: 'Hrskava kukuruzna proja sa slanim sirom i kajmakom — idealna uz jogurt ili kiselo mleko.',
    sastojci: [
      { kolicina: '300 g', naziv: 'kukuruzno brašno' },
      { kolicina: '200 g', naziv: 'beli sir (feta ili domaći)' },
      { kolicina: '100 g', naziv: 'kajmak' },
      { kolicina: '2 kom', naziv: 'jaja' },
      { kolicina: '200 ml', naziv: 'kiselo mleko' },
      { kolicina: '1 kašičica', naziv: 'prašak za pecivo' },
      { kolicina: 'prstohvat', naziv: 'so' },
    ],
    koraci: [
      'Zagrej rernu na 200°C. Namasti pleh i pospi kukuruznim brašnom.',
      'Umuti jaja sa kiselim mlekom i kajmakom.',
      'Dodaj kukuruzno brašno, prašak za pecivo i so. Dobro promešaj.',
      'Utrljaj sir u smesu rukama ili viljuškom.',
      'Izlij u pleh i izravnaj.',
      'Peci 25-30 minuta dok ne dobije zlatnu koricu.',
    ],
    savet: 'Služi toplu, isečenu na kocke, uz čašu hladnog jogurta.',
    tagovi: ['srpska kuhinja', 'doručak', 'vegetarijansko'],
  },
  {
    id: 3,
    naziv: 'Pasulj sa suvim mesom',
    vreme: '2 h 30 min',
    porcije: 6,
    tezina: 'Srednje',
    opis: 'Gusti, aromatični pasulj sa dimljenim mesom — srpski klasik koji greje dušu.',
    sastojci: [
      { kolicina: '500 g', naziv: 'pasulj (tetovac ili šareni)' },
      { kolicina: '300 g', naziv: 'suva rebra ili kolenicu' },
      { kolicina: '1 kom', naziv: 'crni luk' },
      { kolicina: '3 čena', naziv: 'beli luk' },
      { kolicina: '2 kašike', naziv: 'aleva paprika' },
      { kolicina: '2 kašike', naziv: 'brašno (za zaprška)' },
      { kolicina: 'po ukusu', naziv: 'so, biber, lovor' },
    ],
    koraci: [
      'Pasulj namočiti u vodi prethodne večeri.',
      'Suvo meso prokuvati 10 minuta, baciti vodu, oprati.',
      'Pasulj i meso staviti u šerpu, preliti hladnom vodom i kuvati 1.5-2h.',
      'Na ulju propržiti luk, dodati aleva papriku, pa brašno za zaprška.',
      'Zaprška sipati u pasulj, dobro promešati.',
      'Dodati beli luk i začine, kuvati još 20 minuta.',
    ],
    savet: 'Pasulj je bolji sutradan — daj mu da se "izvlači" preko noći.',
    tagovi: ['srpska kuhinja', 'ručak', 'zimnica'],
  },
]

const TEZINA_BOJA = { 'Lako': '#6bffd4', 'Srednje': '#ffd46b', 'Teško': '#ff6b4a' }

// ── Chip za sastojak ───────────────────────────────────────────────────────
function IngredientChip({ name, onRemove }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,107,157,0.12)', border: '1px solid rgba(255,107,157,0.25)',
        borderRadius: 100, padding: '5px 12px',
        fontSize: 13, color: '#ffb3d0', fontWeight: 500,
      }}
    >
      {name}
      <button
        onClick={() => onRemove(name)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#ff6b9d' }}
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}

// ── Kartica recepta ────────────────────────────────────────────────────────
function RecipeCard({ recipe, index }) {
  const [open, setOpen] = useState(false)
  const boja = TEZINA_BOJA[recipe.tezina] || '#a89aff'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(13,13,22,0.7)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header kartice */}
      <div style={{ padding: '22px 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: '#e8e8f0',
            fontFamily: 'Syne, sans-serif', lineHeight: 1.2,
          }}>
            {recipe.naziv}
          </h3>
          <span style={{
            flexShrink: 0, fontSize: 11, fontWeight: 700, padding: '3px 10px',
            borderRadius: 100, background: `${boja}18`, border: `1px solid ${boja}33`,
            color: boja,
          }}>
            {recipe.tezina}
          </span>
        </div>

        <p style={{ fontSize: 13, color: '#7878a0', lineHeight: 1.65, marginBottom: 16 }}>
          {recipe.opis}
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#a89aff' }}>
            <Clock size={13} /> {recipe.vreme}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#a89aff' }}>
            <Users size={13} /> {recipe.porcije} porcije
          </div>
          {recipe.tagovi.map(t => (
            <span key={t} style={{
              fontSize: 11, color: '#6b6b88', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '2px 8px',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Proširi/sažmi */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '12px 24px', background: 'rgba(255,255,255,0.03)',
          border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: '#7878a0', fontSize: 12, fontWeight: 600,
        }}
      >
        <span>Pogledaj recept</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Sastojci */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ff6b9d', marginBottom: 10 }}>
                  Sastojci
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {recipe.sastojci.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                      <span style={{ color: '#a89aff', fontWeight: 600, minWidth: 80 }}>{s.kolicina}</span>
                      <span style={{ color: '#b0b0c8' }}>{s.naziv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Koraci */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ff6b9d', marginBottom: 10 }}>
                  Priprema
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recipe.koraci.map((k, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, fontSize: 13, lineHeight: 1.6 }}>
                      <span style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(255,107,157,0.15)', border: '1px solid rgba(255,107,157,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#ff6b9d',
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ color: '#b0b0c8' }}>{k}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Savet */}
              <div style={{
                background: 'rgba(107,255,212,0.06)', border: '1px solid rgba(107,255,212,0.15)',
                borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <Flame size={14} style={{ flexShrink: 0, marginTop: 2, color: '#6bffd4' }} />
                <span style={{ fontSize: 12, color: '#6bffd4', lineHeight: 1.65 }}>
                  <strong>Savet kuvara:</strong> {recipe.savet}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Glavna CPT Kuvar stranica ──────────────────────────────────────────────
export default function CptKuvar() {
  const [input, setInput]           = useState('')
  const [sastojci, setSastojci]     = useState([])
  const [recepti, setRecepti]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [generated, setGenerated]   = useState(false)
  const inputRef                    = useRef(null)

  const dodajSastojak = () => {
    const val = input.trim().toLowerCase()
    if (val && !sastojci.includes(val)) {
      setSastojci(prev => [...prev, val])
    }
    setInput('')
    inputRef.current?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      dodajSastojak()
    }
    if (e.key === 'Backspace' && input === '' && sastojci.length > 0) {
      setSastojci(prev => prev.slice(0, -1))
    }
  }

  const ukloniSastojak = (name) => setSastojci(prev => prev.filter(s => s !== name))

  const generisiRecepte = async () => {
    if (sastojci.length === 0) return
    setLoading(true)
    setGenerated(false)
    // TODO: ovde ide API poziv prema backendu / AI
    await new Promise(r => setTimeout(r, 1800))
    setRecepti(MOCK_RECIPES)
    setLoading(false)
    setGenerated(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 80 }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 28px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-30%', left: '30%', width: 600, height: 600,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.2), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,107,157,0.1)', border: '1px solid rgba(255,107,157,0.22)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 24,
            }}
          >
            <ChefHat size={14} color="#ff6b9d" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#ff6b9d', letterSpacing: 0.5 }}>CPT Kuvar · Beta</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 800, color: '#fff', marginBottom: 18, lineHeight: 1.06 }}
          >
            Šta ima u<br />
            <span style={{
              background: 'linear-gradient(135deg, #ff6b4a, #ff6b9d)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              frižideru?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontSize: 16, color: '#7878a0', lineHeight: 1.75, marginBottom: 40 }}
          >
            Unesite sastojke koje imate, a AI će vam predložiti recepte iz srpske kuhinje —
            sa tačnim merama, koracima i kuvarskim savetima.
          </motion.p>

          {/* ── Input zona ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(13,13,22,0.8)', border: '1px solid rgba(255,107,157,0.2)',
              borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7878a0', marginBottom: 12, letterSpacing: 0.5 }}>
              DODAJTE SASTOJKE — pritisnite Enter ili zarez nakon svakog
            </div>

            {/* Chips + input */}
            <div
              onClick={() => inputRef.current?.focus()}
              style={{
                display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
                minHeight: 44, cursor: 'text',
              }}
            >
              <AnimatePresence>
                {sastojci.map(s => (
                  <IngredientChip key={s} name={s} onRemove={ukloniSastojak} />
                ))}
              </AnimatePresence>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={sastojci.length === 0 ? 'npr. crni luk, paprika, jaja, kajmak...' : ''}
                style={{
                  flex: 1, minWidth: 180, background: 'none', border: 'none', outline: 'none',
                  fontSize: 14, color: '#e8e8f0', fontFamily: 'Inter, sans-serif',
                }}
              />
              {input && (
                <motion.button
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  onClick={dodajSastojak}
                  style={{
                    padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: 'rgba(255,107,157,0.2)', color: '#ff6b9d', fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <Plus size={11} /> Dodaj
                </motion.button>
              )}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#6b6b88' }}>
                {sastojci.length === 0 ? 'Nema dodanih sastojaka' : `${sastojci.length} sastojak${sastojci.length > 1 ? 'a' : ''}`}
              </span>
              <motion.button
                whileHover={sastojci.length > 0 ? { scale: 1.04, boxShadow: '0 0 28px rgba(255,107,157,0.4)' } : {}}
                whileTap={sastojci.length > 0 ? { scale: 0.97 } : {}}
                onClick={generisiRecepte}
                disabled={sastojci.length === 0 || loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 24px', borderRadius: 10, border: 'none', cursor: sastojci.length === 0 ? 'not-allowed' : 'pointer',
                  background: sastojci.length === 0
                    ? 'rgba(255,255,255,0.06)'
                    : 'linear-gradient(135deg, #ff6b4a, #ff6b9d)',
                  color: sastojci.length === 0 ? '#4a4a60' : '#fff',
                  fontSize: 14, fontWeight: 700, transition: 'background 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Sparkles size={15} />
                    </motion.span>
                    AI generiše recepte...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Generiši recepte
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Brzi primeri */}
          {sastojci.length === 0 && !generated && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <span style={{ fontSize: 12, color: '#4a4a60', marginTop: 4 }}>Brzi primeri:</span>
              {['crni luk', 'paprika', 'jaja', 'kajmak', 'mleveno meso', 'pasulj', 'pirinač'].map(s => (
                <button
                  key={s}
                  onClick={() => setSastojci(prev => prev.includes(s) ? prev : [...prev, s])}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#6b6b88',
                    cursor: 'pointer',
                  }}
                >
                  + {s}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Rezultati ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {generated && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '0 28px 80px' }}
          >
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: 32 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(107,255,212,0.08)', border: '1px solid rgba(107,255,212,0.2)',
                  borderRadius: 100, padding: '6px 16px', marginBottom: 12,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6bffd4', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6bffd4' }}>
                    {recepti.length} recepta pronađena za {sastojci.length} sastojaka
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#fff' }}>
                  Preporučeni recepti
                </h2>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {recepti.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                style={{
                  marginTop: 32, padding: '20px 24px',
                  background: 'rgba(124,107,255,0.06)', border: '1px solid rgba(124,107,255,0.15)',
                  borderRadius: 14, textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 13, color: '#7878a0', marginBottom: 12 }}>
                  Recepti su generisani na osnovu vaših sastojaka. U punoj verziji, AI će koristiti tačno vaše mere i predložiti zamene za nedostajuće namirnice.
                </p>
                <button
                  onClick={() => { setSastojci([]); setRecepti([]); setGenerated(false) }}
                  style={{
                    background: 'none', border: '1px solid rgba(124,107,255,0.25)',
                    borderRadius: 8, padding: '8px 20px', fontSize: 13, color: '#a89aff',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  Pokušaj sa drugim sastojcima
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Prikaz mogućnosti (pre generisanja) ───────────────────────────── */}
      {!generated && !loading && (
        <section style={{ padding: '20px 28px 80px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {[
                { emoji: '🇷🇸', title: 'Srpska kuhinja', desc: 'Recepti prilagođeni domaćim namirnicama — kajmak, ajvar, plazma, kore za pitu.' },
                { emoji: '⚖️', title: 'Tačne mere', desc: 'Sve u gramima, mililitrima i kašikama — nikad "po ukusu" bez konteksta.' },
                { emoji: '🧠', title: 'AI razumevanje', desc: 'Prepoznaje sinonime: kapula = crni luk, suva paprika = babura, sir = feta.' },
                { emoji: '📅', title: 'Plan obroka', desc: 'Generiši nedeljni meni i listu namirnica za kupovinu. (uskoro)' },
              ].map(f => (
                <div key={f.title} style={{
                  background: 'rgba(13,13,22,0.5)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '22px 20px',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{f.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0', marginBottom: 6, fontFamily: 'Syne, sans-serif' }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b6b88', lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
