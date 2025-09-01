import { RiRestaurantLine, RiFacebookFill, RiTwitterFill, RiInstagramLine, RiPhoneLine, RiMailLine, RiMapPinLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <RiRestaurantLine className="text-white text-xl" />
              </div>
              <span className="font-[Pacifico] text-2xl text-red-500">CraveCrush</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Fast, fresh, and delicious food delivered right to your door. Experience the perfect blend of quality ingredients and speedy service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
  <li>
    <Link className="text-gray-300 hover:text-red-400 transition-colors" to="/">
      Menu
    </Link>
  </li>
  <li>
    <Link className="text-gray-300 hover:text-red-400 transition-colors" to="/About">
      About
    </Link>
  </li>
  <li>
    <Link className="text-gray-300 hover:text-red-400 transition-colors" to="/Contact">
      Contact
    </Link>
  </li>
</ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center space-x-2">
                <RiPhoneLine />
                <span>+921234567890</span>
              </p>
              <p className="flex items-center space-x-2">
                <RiMailLine />
                <span>XYZ@cravecrush.com</span>
              </p>
              <p className="flex items-start space-x-2">
                <RiMapPinLine className="mt-1" />
                <span>Food Street<br />Saddar, Rawalpindi</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 CraveCrush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;