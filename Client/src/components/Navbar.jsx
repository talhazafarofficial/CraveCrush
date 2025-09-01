import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  RiShoppingCartLine,
  RiLoginCircleLine,
  RiLogoutCircleLine,
  RiUserLine,
  RiRestaurantLine,
  RiMenu3Line,
  RiCloseLine,
} from 'react-icons/ri';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = ({ onCartClick }) => {
  const { user, setUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <RiRestaurantLine className="text-white text-xl" />
          </div>
          <span className="font-[Pacifico] text-2xl text-red-500">CraveCrush</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-3xl text-red-500 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-red-500">Menu</Link>
          <Link to="/about" className="text-gray-700 hover:text-red-500">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-red-500">Contact</Link>

          {!user ? (
            <Link to="/login" className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <RiLoginCircleLine />
              <span>Login</span>
            </Link>
          ) : (
            <>
              {user.role === 'admin' ? (
                <Link to="/AdminDashboard" className="text-gray-700 hover:text-red-500">Dashboard</Link>
              ) : (
                <Link to="/Dashboard" className="text-gray-700 hover:text-red-500">Dashboard</Link>
              )}
              <button onClick={logout} className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <RiLogoutCircleLine />
                <span>Logout</span>
              </button>
            </>
          )}

          <button type="button" onClick={onCartClick} className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 relative">
            <RiShoppingCartLine />
            <span>Cart</span>
            {cart && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black rounded-full px-2 py-0.5 font-bold">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Nav */}
      <nav
        className={`md:hidden bg-white shadow-lg transition-all duration-300 ${
          menuOpen ? 'max-h-[500px] py-4' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="text-gray-700 hover:text-red-500" onClick={closeMenu}>Menu</Link>
          <Link to="/about" className="text-gray-700 hover:text-red-500" onClick={closeMenu}>About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-red-500" onClick={closeMenu}>Contact</Link>

          {!user ? (
            <Link to="/login" className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center space-x-2" onClick={closeMenu}>
              <RiLoginCircleLine />
              <span>Login</span>
            </Link>
          ) : (
            <>
              {user.role === 'admin' ? (
                <Link to="/AdminDashboard" className="text-gray-700 hover:text-red-500" onClick={closeMenu}>Dashboard</Link>
              ) : (
                <Link to="/Dashboard" className="text-gray-700 hover:text-red-500" onClick={closeMenu}>Dashboard</Link>
              )}
              <button onClick={logout} className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <RiLogoutCircleLine />
                <span>Logout</span>
              </button>
            </>
          )}

          <button type="button" onClick={() => { onCartClick(); closeMenu(); }} className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 relative">
            <RiShoppingCartLine />
            <span>Cart</span>
            {cart && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black rounded-full px-2 py-0.5 font-bold">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;