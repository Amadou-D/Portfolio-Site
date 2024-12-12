import React from 'react'

interface AboutProps {

    onClose: () => void;
  
  }
  
  
  
  export const About: React.FC<AboutProps> = ({ onClose }) => {
  
    return (
  
      <div>
  
    <p>
        About
    </p>  
        <button onClick={onClose}>Close</button>
  
      </div>
  
  );
}
