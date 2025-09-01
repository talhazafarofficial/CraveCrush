import { useState } from 'react';
import axios from 'axios';
import { RiMailLine, RiUserLine, RiMapPinLine, RiPhoneLine, RiSendPlane2Line } from 'react-icons/ri';
import Footer from "../components/Footer";
const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/contact', form);
    setSent(true);
  };

  return (
    <>
    <div className="min-h-screen bg-white pt-20 px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h2>
        <p className="text-gray-600">Have questions? Send us a message!</p>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg max-w-2xl mx-auto shadow-lg">
        {sent ? (
          <div className="text-green-600 text-center font-semibold">
            ✅ Thank you! We'll get back to you shortly.
          </div>
        ) : (
          <form onSubmit={submitForm} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" required value={form.name} onChange={handleChange} className="w-full border p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full border p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea name="message" rows="5" required value={form.message} onChange={handleChange} className="w-full border p-3 rounded-lg"></textarea>
            </div>
            <button type="submit" className="bg-red-500 text-white w-full py-3 rounded-lg hover:bg-red-600 flex justify-center items-center space-x-2">
              <RiSendPlane2Line />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ContactUs;