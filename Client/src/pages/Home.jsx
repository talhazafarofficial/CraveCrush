// client/src/pages/Home.jsx
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { RiAddLine, RiFireLine, RiRestaurantLine, RiPieChartLine, RiCupLine, RiCake3Line } from 'react-icons/ri';
import axios from 'axios';
import Footer from "../components/Footer";

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMenu();
  }, []);

  // Filter menu items by selected category
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => {
      if (selectedCategory === 'deals') return item.category === 'deals';
      if (selectedCategory === 'burger') return item.category === 'burger';
      if (selectedCategory === 'pizza') return item.category === 'pizza';
      if (selectedCategory === 'drinks') return item.category === 'drinks';
      if (selectedCategory === 'dessert' || selectedCategory === 'desert') return item.category === 'desert' || item.category === 'dessert';
      return true;
    });

  return (
    <>
      {/* Hero */}
      <section
        className="relative h-[70vh] md:h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/banner.jpg')"
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl w-full">
          <div className="mb-6">
            <span className="font-[Pacifico] text-6xl md:text-8xl text-yellow-400 drop-shadow-lg">CraveCrush</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-6 drop-shadow-lg">
            Fast, Fresh & Delicious – Order Now!
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
            Satisfy your cravings with our mouth-watering burgers, pizzas, and more. Fresh ingredients, fast delivery, unbeatable taste!
          </p>
          <a href="#menu" className="bg-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition-colors inline-flex items-center space-x-2">
            <RiRestaurantLine />
            <span>Order Now</span>
          </a>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Menu</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our delicious selection of fresh, made-to-order favorites</p>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-8">
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 bg-white p-2 rounded-full shadow-lg scrollbar-hide">
              <button
                className={`min-w-max px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-500'} shadow-md flex items-center space-x-2`}
                onClick={() => setSelectedCategory('all')}
              >
                <RiRestaurantLine /><span>All</span>
              </button>
              <button
                className={`min-w-max px-4 py-2 rounded-full ${selectedCategory === 'deals' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-500'} flex items-center space-x-2`}
                onClick={() => setSelectedCategory('deals')}
              >
                <RiFireLine /><span>Deals</span>
              </button>
              <button
                className={`min-w-max px-4 py-2 rounded-full ${selectedCategory === 'burger' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-500'} flex items-center space-x-2`}
                onClick={() => setSelectedCategory('burger')}
              >
                <RiRestaurantLine /><span>Burgers</span>
              </button>
              <button
                className={`min-w-max px-4 py-2 rounded-full ${selectedCategory === 'pizza' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-500'} flex items-center space-x-2`}
                onClick={() => setSelectedCategory('pizza')}
              >
                <RiPieChartLine /><span>Pizza</span>
              </button>
              <button
                className={`min-w-max px-4 py-2 rounded-full ${selectedCategory === 'drinks' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-500'} flex items-center space-x-2`}
                onClick={() => setSelectedCategory('drinks')}
              >
                <RiCupLine /><span>Drinks</span>
              </button>
              <button
                className={`min-w-max px-4 py-2 rounded-full ${selectedCategory === 'dessert' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-500'} flex items-center space-x-2`}
                onClick={() => setSelectedCategory('dessert')}
              >
                <RiCake3Line /><span>Desserts</span>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No items found for this category.</div>
            ) : (
              filteredItems.map(item => (
                <div key={item._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.imageUrl && item.imageUrl.startsWith('/uploads') ? `http://localhost:5000${item.imageUrl}` : item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800" >{item.title}</h3>
                      <span className="text-2xl font-bold text-red-500">PKR{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4" style={{ minHeight: '45px'}}>{item.description}</p>
                    <button
                      className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                      onClick={() => addToCart({
                        item: item._id,
                        title: item.title,
                        price: item.price,
                        imageUrl: item.imageUrl,
                        description: item.description
                      })}
                    >
                      <RiAddLine /><span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>
      <Footer />
    </>

  );
};

export default Home;