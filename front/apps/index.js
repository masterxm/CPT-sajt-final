import { lazy } from 'react'
import { ChefHat, Timer } from 'lucide-react'

export const APPS = [
  {
    slug:        'cpt-kuvar',
    name:        'CPT Kuvar',
    tagline:     'AI kuvar za srpsku kuhinju',
    description: 'Unesite sastojke iz frižidera i dobijte recepte, planove obroka i kulinarske savete prilagođene srpskom podnebuju.',
    icon:        ChefHat,
    color:       '#ff6b9d',
    gradient:    'linear-gradient(135deg, #ff6b4a, #ff6b9d)',
    badge:       'Beta',
    component:   lazy(() => import('./cpt-kuvar')),
  },
  {
    slug:        'cpt-tajmer',
    name:        'CPT Tajmer',
    tagline:     'Pomodoro tajmer za fokus i produktivnost',
    description: 'Ostani fokusiran uz Pomodoro tehniku — 25 minuta rada, 5 minuta pauze, duga pauza na svakih 4 runde.',
    icon:        Timer,
    color:       '#a89aff',
    gradient:    'linear-gradient(135deg, #7c6bff, #a89aff)',
    badge:       'Novo',
    component:   lazy(() => import('./cpt-tajmer')),
  },
]
