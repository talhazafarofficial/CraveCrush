import React from 'react';
import { RiTimeLine, RiLeafLine, RiStarLine, RiHeartLine, RiShieldCheckLine, RiCustomerService2Line, RiEarthLine, RiRestaurantLine } from 'react-icons/ri';
import Footer from "../components/Footer";
const AboutUs = () => {
  return (
    <div>
      {/* Hero + Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">About CraveCrush</h1>
          <p className="text-lg text-gray-600">Your favorite destination for fast, fresh, and delicious food</p>
        </div>

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">Founded in 2025, CraveCrush started with a simple mission: to deliver fast, fresh, and delicious food right to your doorstep.</p>
            <p className="text-gray-600 mb-4">Our journey began in a small kitchen with big dreams. Today, we serve thousands of satisfied customers daily, maintaining the same commitment to quality and freshness that started it all.</p>
            <p className="text-gray-600">Every meal is prepared with carefully selected ingredients and cooked to perfection by our skilled chefs who share our passion for exceptional food.</p>
          </div>
          <div className="h-96 bg-cover bg-center rounded-lg" style={{ backgroundImage: "url('/about.jpg')" }}></div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { title: 'Fast Delivery', desc: '25-35 minutes average', icon: RiTimeLine, bg: 'bg-red-500' },
            { title: 'Fresh Ingredients', desc: 'Locally sourced', icon: RiLeafLine, bg: 'bg-yellow-500' },
            { title: 'Quality Assured', desc: 'Prepared with care', icon: RiStarLine, bg: 'bg-green-500' }
          ].map(({ title, desc, icon: Icon, bg }) => (
            <div key={title} className={`text-center p-6 ${bg.replace('500', '50')} rounded-lg`}>
              <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="container mx-auto bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600">At CraveCrush, our values guide everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: RiHeartLine, label: 'Passion' },
              { icon: RiShieldCheckLine, label: 'Quality' },
              { icon: RiCustomerService2Line, label: 'Service' },
              { icon: RiEarthLine, label: 'Community' }
            ].map(({ icon: Icon, label }) => (
              <div className="text-center" key={label}>
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Icon className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{label}</h4>
                <p className="text-sm text-gray-600">Our commitment to {label.toLowerCase()} defines us.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;