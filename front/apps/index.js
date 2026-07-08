import { lazy } from 'react'
import { ChefHat, Timer } from 'lucide-react'

export const APPS = [
  {
    slug:        'cpt-kuvar',
    name:        'CPT Kuvar',
    tagline:     'AI chef for Serbian cuisine',
    description: 'Enter the ingredients from your fridge and get recipes, meal plans, and cooking tips tailored to Serbian cuisine.',
    icon:        ChefHat,
    color:       '#b0524a',
    gradient:    'linear-gradient(135deg, #9b5030, #b0524a)',
    badge:       'Beta',
    component:   lazy(() => import('./cpt-kuvar')),
  },
  {
    slug:        'cpt-tajmer',
    name:        'CPT Tajmer',
    tagline:     'Pomodoro timer for focus and productivity',
    description: 'Stay focused with the Pomodoro technique — 25 minutes of work, 5-minute breaks, and a long break every 4 rounds.',
    icon:        Timer,
    color:       '#6a5a9a',
    gradient:    'linear-gradient(135deg, #5a4a8a, #6a5a9a)',
    badge:       'New',
    component:   lazy(() => import('./cpt-tajmer')),
  },
]
