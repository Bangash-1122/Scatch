import { useEffect } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { AppRoutes } from '@/routes'
import { ScrollToTop } from '@/components/ScrollToTop'
import { useStore } from '@/store/useStore'
import './App.css'

function App() {
  useEffect(() => {
    void useStore.getState().fetchProducts()
  }, [])

  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  )
}

export default App
