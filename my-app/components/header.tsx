'use client';

import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="relative w-full bg-transparent z-10">
      <nav className="flex items-center justify-between p-6 bg-transparent text-gray-200">
        <div className="flex items-center">
          {/* Replace text with animated logo */}
          <img src="/logo.png" alt="Amadou" className="w-12 h-12 animate-spin" />
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-xl hover:text-gray-300">Home</a>
          <a href="#services" className="text-xl hover:text-gray-300">Services</a>
          <a href="#about" className="text-xl hover:text-gray-300">About</a>
          <a href="#contact" className="text-xl hover:text-gray-300">Contact</a>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {isMenuOpen ? 'X' : '☰'}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-gray-800 bg-opacity-75 z-20 md:hidden">
          <div className="flex flex-col items-center py-6 space-y-4">
            <a href="#home" className="text-xl text-white">Home</a>
            <a href="#services" className="text-xl text-white">Services</a>
            <a href="#about" className="text-xl text-white">About</a>
            <a href="#contact" className="text-xl text-white">Contact</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;