import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Deals from './pages/Deals'
import Market from './pages/Market'
import Sell from './pages/Sell'
import Browse from './pages/Browse'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/browse" element={<Browse />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/market" element={<Market />} />
          <Route path="/sell" element={<Sell />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
