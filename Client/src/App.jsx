import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import { useState, useContext } from 'react';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderHistory from './pages/OrderHistory.jsx';
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import CartPage from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';

import { RiShoppingCartLine } from 'react-icons/ri';
import { CartContext } from './context/CartContext';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);

  return (
    <Router>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {/* Floating cart button for mobile */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-red-500 text-white rounded-full shadow-lg p-4 flex items-center justify-center md:hidden"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        aria-label="Open cart"
      >
        <RiShoppingCartLine className="text-2xl" />
        {cart && cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-black rounded-full px-2 py-0.5 font-bold">
            {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        )}
      </button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Block login/signup for logged-in users */}
        <Route path="/signup" element={user ? <DashboardRedirect user={user} /> : <Signup />} />
        <Route path="/login" element={user ? <DashboardRedirect user={user} /> : <Login />} />
        {/* Block /dashboard for admins */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            {user && user.role === 'admin' ? <AdminDashboardRedirect /> : <Dashboard />}
          </PrivateRoute>
        } />
        <Route path="/cart" element={<CartPage />} />
        {/* Block /AdminDashboard for non-admins */}
        <Route path="/AdminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

// Redirect helpers
function DashboardRedirect({ user }) {
  if (user.role === 'admin') return <Navigate to="/AdminDashboard" />;
  return <Navigate to="/dashboard" />;
}

function AdminDashboardRedirect() {
  return <Navigate to="/AdminDashboard" />;
}

export default App;