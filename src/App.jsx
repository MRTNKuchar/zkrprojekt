import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import MatrixBackground from './components/MatrixBackground'
import Landing from './pages/Landing'
import Caesar from './pages/Caesar'
import ECC from './pages/ECC'
import Kyber from './pages/Kyber'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <MatrixBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/caesar" element={<Caesar />} />
          <Route path="/ecc" element={<ECC />} />
          <Route path="/kyber" element={<Kyber />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
