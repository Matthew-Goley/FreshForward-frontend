import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './lib/AppContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import RestaurantApply from './pages/RestaurantApply'
import RestaurantDashboard from './pages/RestaurantDashboard'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout/:listingId" element={<Checkout />} />
            <Route path="/orders/:orderId" element={<OrderConfirmation />} />
            <Route path="/restaurant/apply" element={<RestaurantApply />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
