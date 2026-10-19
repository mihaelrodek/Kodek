import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import { ROUTE_PATHS } from './i18n/routes'

// Route-level code splitting: each page (and its framer-motion usage) loads as a
// separate chunk on demand instead of inflating the initial bundle. The Suspense
// boundary lives in RootLayout, so the nav/footer shell stays mounted while a
// page chunk arrives.
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Same pages under each language's paths (Croatian at the root, English under /en). */}
        {Object.entries(ROUTE_PATHS).map(([lang, paths]) => [
          <Route key={`${lang}-home`} path={paths.home} element={<HomePage />} />,
          <Route key={`${lang}-about`} path={paths.about} element={<AboutPage />} />,
          <Route key={`${lang}-projects`} path={paths.projects} element={<ProjectsPage />} />,
          <Route key={`${lang}-contact`} path={paths.contact} element={<ContactPage />} />,
        ])}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
