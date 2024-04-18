import React, { useState } from 'react';
import './CalculatorBox.css';
import { jwtDecode } from 'jwt-decode';
import EditCalculatorBox from './EditCalculatorBox';

function CalculatorBox({ id, type, status, interest_rate, name, setMessage, setModalBox, token }) {

  const [modalProdIsOpen, setmodalProdIsOpen] = useState(false)

  function onShow() {
    setmodalProdIsOpen(true)
  }

  const deleteCalculator = async () => {

    let message;

    const calculator = {
      id: id
    }

    const api = 'http://127.0.0.1:9001/calculators/delete'

    fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ calculatorId: calculator.id })
    })
      .then((result) => result.json())
      .then((result) => message = result.message)

    setTimeout(() => {
      setMessage(message)
      setModalBox('MessageBox')
    }, 100)
  }

  let isShow;

  switch (status) {
    case '0':
      isShow = "Скрыт";
      break;
    case '1':
      isShow = "Отображается"
      break;
    default:
      break;
  }

  if (jwtDecode(token).role === 'admin') {
    return (
      <div className="CalculatorBox">
        <p><b>Название:</b></p>
        <p className='desc'>{name}</p>
        <p><b>Тип:</b></p>
        <p className='desc'>{type}</p>
        <p><b>Ставка:</b></p>
        <p className='desc'>{interest_rate} %</p>
        <p><b>Статус:</b></p>
        <p className='desc'>{isShow}</p>
        <p><button onClick={onShow}>Редактировать калькулятор</button></p>
        <p><button onClick={deleteCalculator}>Удалить калькулятор</button></p>
        <EditCalculatorBox isOpen={modalProdIsOpen} setMessage={setMessage}
          onClose={() => setmodalProdIsOpen(false)} id={id} type={type} status={status}
          interest_rate={interest_rate} name={name}
        />
      </div >
    );
  }
}


export default CalculatorBox;