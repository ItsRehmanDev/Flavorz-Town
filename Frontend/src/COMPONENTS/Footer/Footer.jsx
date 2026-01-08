import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-20" id="contact">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">
        
       
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">Flavor Town</h2>
          <p className="text-gray-400">
            Bringing you the best flavors from around the world 🍴
          </p>
        </div>

       
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-yellow-400">Home</a></li>
            <li><a href="#" className="hover:text-yellow-400">Menu</a></li>
            <li><a href="#" className="hover:text-yellow-400">About</a></li>
            <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
          </ul>
        </div>

       
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Contact</h3>
          <p className="text-gray-400">📍 123 Flavor Street, Food City</p>
          <p className="text-gray-400">📞 +92 300 1234567</p>
          <p className="text-gray-400 mb-4">✉️ support@flavortown.com</p>
          
         
          <div className="flex justify-center md:justify-start gap-4 text-xl">
            <a href="#" className="hover:text-yellow-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-yellow-400"><FaInstagram /></a>
            <a href="#" className="hover:text-yellow-400"><FaTwitter /></a>
            <a href="#" className="hover:text-yellow-400"><FaGithub /></a>
          </div>
        </div>
      </div>

  
      <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-6">
        <p>© 2025 Flavor Town. All Rights Reserved.</p>
        <p className="text-sm">Made with ❤️ for food lovers</p>
      </div>
    </footer>
  );
};

export default Footer;
