import { useEffect, Suspense } from 'react'
import { Routes, Route, useLocation, useParams } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetail from './pages/ProjectDetail'
import FridgePage from './pages/FridgePage'
import ContactPage from './pages/ContactPage'
import AppsPage from './pages/AppsPage'
import { APPS } from './apps'

function AppRunner() {
  const { slug } = useParams()
  const app = APPS.find(a => a.slug === slug)
  if (!app) return (
    <div style={{ padding: '120px 28px', textAlign: 'center', color: '#9b7c5a', fontSize: 15 }}>
      App not found.
    </div>
  )
  const AppComp = app.component
  return <Suspense fallback={null}><AppComp /></Suspense>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/fridge" element={<FridgePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/apps/:slug" element={<AppRunner />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
