import React from 'react';
import './UserBox.css';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';
import { FaSignInAlt } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

function UserBox({ setModalBox, token, setToken, setPage }) {

  function logout() {
    setToken(null)
    localStorage.removeItem('token')
    setPage('Main')
  }

  function MultipleBoxes() {
    if (token !== null) {
      const name = jwtDecode(token).name

      console.log(name)

      return (
        <div className='UserBox'>
          <FaUserCircle className='btn-profile' size='25' onClick={() => setPage('UserProfile')} />
          <FaSignOutAlt className='btn-profile' size='25' onClick={() => logout()} />
        </div>
      )
    }

    return (
      <div className='UserBox'>
        <FaSignInAlt className='btn-profile' size='25' onClick={() => setModalBox('Login')} />
      </div>
    )
  }

  return (
    <MultipleBoxes />
  );
}

export default UserBox;