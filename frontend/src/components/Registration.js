import React from 'react';
import './Registration.css';
import { FaX } from "react-icons/fa6";

function Registration({ setModalBox, setMessage }) {

  function Reg() {
    const email = document.getElementById('email').value
    const login = document.getElementById('login').value
    const password = document.getElementById('pass').value
    const name = document.getElementById('name').value
    const role = 'user'

    const validEmail = email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)
    const validLogin = login.match(/^[a-z0-9]+$/i)

    let message

    if (!validEmail || !validLogin || password.length === 0) {
      document.getElementById('loginError').innerText = "Вы ввели данные неправильно!"
      return
    }

    const data = {
      email: email,
      login: login,
      password: password,
      name: name,
      role: role
    }

    const api = 'http://127.0.0.1:9001/registration'

    fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((result) => result.json())
      .then((result) => message = result.message)

    setTimeout(() => {
      setMessage(message)
      setModalBox('MessageBox')
    }, 100)
  }

  return (
    <div className='Registration'>
      <form>
        <h1>Регистрация:</h1>
        <input id='email' placeholder='E-mail' type='email' required />
        <input id='login' placeholder='Логин' type='text' required />
        <input id='pass' placeholder='Пароль' type='password' required />
        <input id='name' placeholder='Имя' type='text' required />
        <button id='send' onClick={Reg}>Сохранить</button>
        <p id='loginError'></p>
        <FaX className='btn-close' id='send' onClick={() => setModalBox('none')} />
      </form>
    </div>
  );
}

export default Registration;