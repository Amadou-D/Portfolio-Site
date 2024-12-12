import { useState } from 'react';

interface HeaderProps {
  onNavigateToSkills: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToSkills }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="relative w-full bg-transparent z-10">
        
      {/* Menu Icon */}
      <div className="absolute top-4 right-4">
        <div className="bg-black rounded-full p-2 flex items-center justify-center">
          <button onClick={toggleMenu} className="text-3xl text-white">
            {isMenuOpen ? 'X' : '☰'}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 text-white rounded-lg shadow-lg w-48 p-4 z-20 transition-all duration-300 transform scale-100">
          <div className="flex flex-col items-center space-y-4">
            <a href="#home" className="flex items-center text-lg hover:text-gray-300 transition duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              Home
            </a>
            <button
              onClick={() => {
                onNavigateToSkills();
                toggleMenu();
              }}
              className="flex items-center text-lg hover:text-gray-300 transition duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6v12h8V2zm-1 11H7V3h6v10zm4 1h-3v5h3v2h-4v1h5v-8h-1v5z" />
              </svg>
              Skills
            </button>
            <a href="#about" className="flex items-center text-lg hover:text-gray-300 transition duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.41 0-7 1.29-7 3.88V20h14v-2.12c0-2.59-4.59-3.88-7-3.88z" />
              </svg>
              About
            </a>
            <a href="#contact" className="flex items-center text-lg hover:text-gray-300 transition duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 8.99l-6.38-1.92-1.92-6.38L9 7.42l-6.38-1.92L8.99 3l-1.92-6.38L7.42 9l-6.38 1.92L3 8.99l6.38 1.92 1.92 6.38L15 16.58l6.38-1.92L16.58 15l1.92 6.38L15 16.58z" />
              </svg>
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;