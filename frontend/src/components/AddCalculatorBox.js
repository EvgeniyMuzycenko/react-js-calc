import React, { useState } from 'react';
import './AddCalculatorBox.css';
import { FaX } from "react-icons/fa6";

function AddCalculatorBox({ setModalBox, setMessage }) {

  const [errorText, setErrorText] = useState('')

  function AddCalculator() {

    const type = document.getElementById('type').value
    const status = document.getElementById('status').value
    const interest_rate = document.getElementById('interest_rate').value
    const name = document.getElementById('name').value

    if (!name || !type || !interest_rate || !status) {
      setErrorText('Заполните все поля!')
      setTimeout(() => { setErrorText('') }, 3000)
    } else if (interest_rate <= 0) {
      setErrorText('Значения полей должны быть положительными!')
      setTimeout(() => { setErrorText('') }, 3000)
    } else {

      let message

      const data = {
        type: type,
        status: status,
        interest_rate: interest_rate,
        name: name
      }

      const api = 'http://127.0.0.1:9001/calculators/add'

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
  }

  return (
    <div className="AddCalculatorBox">
      <form id='calc-form'>
        <p>Добавление калькулятора</p>
        <input id='name' placeholder='Название калькулятора' type='text' required />
        <input id='type' placeholder='Тип: вклад или кредит' type='text' required />
        <input id='interest_rate' type='number' step='0.1' min='0' max='100'
          placeholder='Процентная ставка' required />
        <input id='status' type='number' min='0' max='1' placeholder='0 - скрыт, 1 - отображается' required />
        <button id='send' onClick={() => AddCalculator()}>Добавить</button>
        <p className='error'>{errorText}</p>
        <FaX className='btn-close' id='send' onClick={() => setModalBox('none')} />
      </form>
    </div>
  );
}

export default AddCalculatorBox;