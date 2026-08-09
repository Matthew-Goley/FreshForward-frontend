import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './lib/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import VercelAnalytics from './components/VercelAnalytics'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import BrowseMap from './pages/BrowseMap'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import AdminRestaurants from './pages/AdminRestaurants'
import RestaurantApply from './pages/RestaurantApply'
import RestaurantDashboard from './pages/RestaurantDashboard'
import Placeholder from './pages/Placeholder'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <VercelAnalytics />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/restaurant/apply"
              element={
                <RequireAuth>
                  <RestaurantApply />
                </RequireAuth>
              }
            />
            <Route element={<Layout />}>
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route
                path="/checkout/:listingId"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <RequireAuth>
                    <OrderConfirmation />
                  </RequireAuth>
                }
              />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route
                path="/admin/restaurants"
                element={
                  <RequireAuth>
                    <AdminRestaurants />
                  </RequireAuth>
                }
              />
              <Route
                path="/restaurant/dashboard"
                element={
                  <RequireAuth>
                    <RestaurantDashboard />
                  </RequireAuth>
                }
              />
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
              <Route
                path="*"
                element={
                  <Placeholder
                    title="Page not found"
                    description="We couldn't find that page. It may have moved, or the link may be out of date."
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
