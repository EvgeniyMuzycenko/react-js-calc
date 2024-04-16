import React from 'react';
import './MessageBox.css';
import { FaX } from 'react-icons/fa6';

function MessageBox({ setModalBox, message }) {
  return (
    <div className='MessageBox'>
      <p className='message'>{message}</p>
      <FaX className='btn-close' id='send' onClick={() => setModalBox('none')} />
    </div>
  );
}

export default MessageBox;