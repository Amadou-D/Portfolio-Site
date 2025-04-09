'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const tabItems = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'personal', label: 'Personal' }
];

export default function AboutPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-2 border-white/40">
                AD
              </div>
              <div className="ml-0 sm:ml-4 mt-3 sm:mt-0 text-center sm:text-left text-white">
                <h2 className="text-xl sm:text-2xl font-bold">Amadou Diallo</h2>
                <p className="text-base sm:text-lg opacity-90">Software Developer</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/')}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              aria-label="Go back home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
          </div>

          <div className="bg-gray-100 border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap transition-colors relative
                    ${activeTab === tab.id 
                      ? 'text-blue-600 bg-white' 
                      : 'text-gray-600 hover:text-blue-500 hover:bg-white/50'
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div ref={contentRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Profile tab content */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Professional Profile
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Graduating with a 4.0 GPA from SAIT&apos;s Software Development program, I have built a strong foundation in information technology and software development. My passion for IT drove me to further my education after high school, expanding my expertise in programming, web development, and cybersecurity. My professional experience as an online consultant and live performer has equipped me with strong communication skills and the ability to analyze and convey complex technical concepts effectively. I am dedicated to contributing to the evolving fields of software development, IT, and cybersecurity, leveraging my technical skills, creativity, and commitment to continuous learning.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Skills tab content */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Skills Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Technical Skills</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
                        <li>Intermediate-level IT skills in computer programming, problem-solving, network systems, cloud services, and Windows/Linux operating systems</li>
                        <li><span className="font-bold">Programming languages:</span> Python, Java, and C#</li>
                        <li><span className="font-bold">Web development:</span> HTML, CSS, JavaScript, React, Next.js, SQL, MongoDB</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Professional Skills</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
                        <li>Time management skills and a methodical approach to managing projects and deadlines</li>
                        <li>Creative problem-solving in user experience, software development, and cybersecurity</li>
                        <li>Motivated to stay up to date with the latest technologies and industry trends</li>
                        <li>Attention to detail and commitment to accuracy and quality</li>
                        <li>Exceptional verbal and written communication skills</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Experience tab content */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Professional Experience
                  </h3>
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-blue-500">
                      <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="mb-1 text-lg sm:text-xl font-bold text-gray-800">Web Developer</div>
                      <div className="text-blue-600 font-medium text-sm sm:text-base">5 Oceans Immigration | May 2024 - January 2025</div>
                      <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                        <li>Developed and maintained a full-stack web application using JavaScript, MongoDB, and Next.js</li>
                        <li>Collaborated with cross-functional teams to gather requirements</li>
                        <li>Implemented responsive design principles for various devices</li>
                        <li>Utilized version control systems for project management</li>
                        <li>Participated in code reviews and team meetings</li>
                      </ul>
                    </div>
                    
                    <div className="relative pl-6 border-l-2 border-blue-500">
                      <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="mb-1 text-lg sm:text-xl font-bold text-gray-800">Live Performer/Entertainer</div>
                      <div className="text-blue-600 font-medium text-sm sm:text-base">Dec 2012 - Oct 2023</div>
                      <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                        <li>Performed in multiple live bands as a percussionist</li>
                        <li>Gained practical communication skills through collaboration</li>
                        <li>Built active listening and non-verbal communication skills</li>
                      </ul>
                    </div>
                    
                    <div className="relative pl-6 border-l-2 border-blue-500">
                      <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="mb-1 text-lg sm:text-xl font-bold text-gray-800">Self-Employed/Online Consultant</div>
                      <div className="text-blue-600 font-medium text-sm sm:text-base">June 2014 - Sept 2018</div>
                      <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                        <li>Effectively communicated and provided insights to clients</li>
                        <li>Fostered trust and cultivated strong professional relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Education tab content */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Education
                  </h3>
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-blue-500">
                      <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="mb-1 text-lg sm:text-xl font-bold text-gray-800">Information Technology Diploma</div>
                      <div className="text-blue-600 font-medium text-sm sm:text-base">Southern Alberta Institute of Technology (SAIT), Calgary, AB</div>
                      <div className="text-gray-600 mt-1 text-sm sm:text-base">Software Development major | 4.0 GPA | May 2023 - Dec 2024</div>
                    </div>
                    
                    <div className="relative pl-6 border-l-2 border-blue-500">
                      <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="mb-1 text-lg sm:text-xl font-bold text-gray-800">High School Diploma</div>
                      <div className="text-blue-600 font-medium text-sm sm:text-base">Bowness Outreach High School</div>
                      <div className="text-gray-600 mt-1 text-sm sm:text-base">Sept 2018 - June 2022</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Personal tab content */}
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 pb-4"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Personal Interests
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <p className="text-gray-700 mb-4 text-sm sm:text-base">In my free time, I enjoy:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-blue-500 text-3xl sm:text-4xl mb-2">🎵</div>
                        <div className="font-medium text-sm sm:text-base">Making Music</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-blue-500 text-3xl sm:text-4xl mb-2">🧩</div>
                        <div className="font-medium text-sm sm:text-base">Problem Solving</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-blue-500 text-3xl sm:text-4xl mb-2">🎮</div>
                        <div className="font-medium text-sm sm:text-base">Playing Video Games</div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-6 mb-4 pb-2 border-b border-gray-200">
                    References
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">Available upon request.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
