import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div className='Footer'>
      &copy; {new Date().getFullYear()} МВЕК Все права защищены
    </div>
  );
}

export default Footer;