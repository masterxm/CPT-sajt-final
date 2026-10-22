import { lazy } from 'react'
import { ChefHat, Timer, Newspaper, Bike } from 'lucide-react'

export const APPS = [
  {
    slug:        'serbian-news',
    name:        'Relevant Serbian News',
    tagline:     'AI & tech coverage from Serbian sources',
    description: 'Aggregates Serbian news RSS feeds and surfaces only AI & machine learning coverage from N1, Blic, Telegraf, and more.',
    icon:        Newspaper,
    color:       '#8b6914',
    gradient:    'linear-gradient(135deg, #8b6914, #b07850)',
    badge:       'Live',
    component:   lazy(() => import('../pages/NewsFilterPage')),
  },
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
  {
    slug:        'cpt-motori',
    name:        'CPT Motori',
    tagline:     'Your motorcycle search dashboard',
    description: 'Paste a PolovniAutomobili search and keep the motorcycles worth another look in one focused dashboard.',
    icon:        Bike,
    color:       '#b48718',
    gradient:    'linear-gradient(135deg, #8c6710, #d3a52a)',
    badge:       'New',
    component:   lazy(() => import('./cpt-motori')),
  },
]
