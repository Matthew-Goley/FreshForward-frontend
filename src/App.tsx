import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './lib/AppContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import RestaurantApply from './pages/RestaurantApply'
import RestaurantDashboard from './pages/RestaurantDashboard'
import Placeholder from './pages/Placeholder'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<Browse />} />
          <Route element={<Layout />}>
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout/:listingId" element={<Checkout />} />
            <Route path="/orders/:orderId" element={<OrderConfirmation />} />
            <Route path="/restaurant/apply" element={<RestaurantApply />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            <Route
              path="/privacy"
              element={
                <Placeholder
                  title="Privacy Policy"
                  description="Our full privacy policy is being finalized. Check back soon for details on how we handle your data."
                />
              }
            />
            <Route
              path="/terms"
              element={
                <Placeholder
                  title="Terms of Service"
                  description="Our terms of service are being finalized. Check back soon."
                />
              }
            />
            <Route
              path="/company"
              element={
                <Placeholder
                  title="About FreshForward"
                  description="Our company story, team, and careers page are on the way."
                />
              }
            />
            <Route
              path="/doing-business"
              element={
                <Placeholder
                  title="Partner with FreshForward"
                  description="More on partnering with FreshForward, beyond applying as a restaurant, is on the way."
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
