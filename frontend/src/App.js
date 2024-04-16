import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './views/Main';
import ModalBox from './components/ModalBox';
import Login from './components/Login';
import Registration from './components/Registration';
import UserProfile from './views/UserProfile';
import MessageBox from './components/MessageBox';
import AddCalculatorBox from './components/AddCalculatorBox';

function App() {

  const [page, setPage] = useState('Main')
  const [modalBox, setModalBox] = useState('none')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [message, setMessage] = useState('')

  const pages = {
    Main: <Main setMessage={setMessage} setModalBox={setModalBox} token={token} />,
    UserProfile: <UserProfile setMessage={setMessage} setModalBox={setModalBox} token={token} />
  }

  const modalBoxes = {
    none: null,
    Login: <ModalBox setModalBox={setModalBox}>
      <Login setModalBox={setModalBox} setToken={setToken} setMessage={setMessage} />
    </ModalBox>,

    Registration: <ModalBox setModalBox={setModalBox}>
      <Registration setModalBox={setModalBox} setMessage={setMessage} />
    </ModalBox>,

    MessageBox: <ModalBox setModalBox={setModalBox}>
      <MessageBox setModalBox={setModalBox} message={message} />
    </ModalBox>,

    AddCalculatorBox: <ModalBox setModalBox={setModalBox}>
      <AddCalculatorBox setModalBox={setModalBox} setMessage={setMessage} />
    </ModalBox>
  }

  return (
    <div className="App">
      <Header setPage={setPage} setModalBox={setModalBox} token={token} setToken={setToken} />
      {pages[page]}
      {modalBoxes[modalBox]}
      <Footer />
    </div>
  );
}

export default App;
