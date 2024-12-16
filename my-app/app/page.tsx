'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import RetroGrid from '@/components/ui/retro-grid';
import SkillsSection from '@/components/SkillsSection';
import Contact from '@/components/contact';

const CubePage = () => {
  const [showSkills, setShowSkills] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [textToShow, setTextToShow] = useState('designed');
  const [fadeClass, setFadeClass] = useState('fade-in');

  const textOptions = ['designed', 'created', 'solved', 'coded', 'developed', 'crafted'];

  // Cycle through text options
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('fade-out');
      setTimeout(() => {
        setTextToShow((prev) => {
          const currentIndex = textOptions.indexOf(prev);
          return textOptions[(currentIndex + 1) % textOptions.length];
        });
        setFadeClass('fade-in');
      }, 1500); // Match the duration of the fade-out animation
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setStartAnimation(true);
    setTimeout(() => {
      setShowSkills(true);
      setStartAnimation(false);
    }, 1250);
  };

  const handleNavigateToContact = () => {
    setStartAnimation(true);
    setTimeout(() => {
      setShowContact(true);
      setStartAnimation(false);
    }, 1250);
  };

  const handleNavigateToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`relative w-screen min-h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden ${startAnimation ? 'zoom-animation' : ''}`}
    >
      <RetroGrid gridColor="rgba(255, 255, 255, 1)" />

      {/* Rotating Text and Name */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-row items-center space-x-1 sm:space-x-2">
        <div className="flex items-center justify-end text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-400 rotating-text min-w-[100px] sm:min-w-[150px] text-right overflow-hidden">
          <p className={fadeClass}>{textToShow}</p>
        </div>
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white name-text">
          by Amadou
        </p>
      </div>

      <div className="mt-16 sm:mt-20 text-center text-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 min-w-[250px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <button
            className="mt-4 sm:mt-6 px-12 sm:px-24 py-4 sm:py-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white rounded-lg hover:text-gray-400 transition-all duration-300 flex items-center justify-center space-x-4"
            onClick={handleStartClick}
          >
            <FontAwesomeIcon icon={faTools} />
            <span>Projects</span>
          </button>
          <button
            className="mt-4 sm:mt-6 px-12 sm:px-24 py-4 sm:py-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white rounded-lg hover:text-gray-400 transition-all duration-300 flex items-center justify-center space-x-4"
            onClick={handleNavigateToContact}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Contact</span>
          </button>
          <button
            className="mt-4 sm:mt-6 px-12 sm:px-24 py-4 sm:py-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white rounded-lg hover:text-gray-400 transition-all duration-300 flex items-center justify-center space-x-4"
            onClick={handleNavigateToAbout}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>About</span>
          </button>
        </div>
      </div>

      {showSkills && <SkillsSection onClose={() => setShowSkills(false)} />}
      {showContact && <Contact onClose={() => setShowContact(false)} />}
    </div>
  );
};

export default CubePage;
