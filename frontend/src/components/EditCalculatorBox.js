import React, { useState } from 'react';
import './EditCalculatorBox.css';
import Modal from 'react-modal'
import { FaX } from 'react-icons/fa6';


function EditCalculatorBox({ isOpen, onClose, id, type, status, interest_rate, name }) {

  const [errorText, setErrorText] = useState('')
  const [success, setSuccess] = useState('')

  function updateCalculator() {

    if (!updatedInfo.name || !updatedInfo.type || !updatedInfo.interest_rate || !updatedInfo.status) {
      setErrorText('Заполните все поля!')
      setTimeout(() => { setErrorText('') }, 3000)
    } else {

      const calculator = {
        id: id,
        type: type,
        status: status,
        interest_rate: interest_rate,
        name: name
      }

      const api = 'http://127.0.0.1:9001/calculators/edit'

      fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ calculatorId: calculator.id, updatedInfo: updatedInfo })
      })
        .then((result) => result.json())

      setTimeout(() => {
        setSuccess('Калькулятор сохранен!')
      }, 100)
    }
  }

  const [nameOfCalc, setNameOfCalc] = useState('')
  const [typeOfCalc, setTypeOfCalc] = useState('')
  const [interestRateOfCalc, setInterestRateOfCalc] = useState('')
  const [statusOfCalc, setStatusOfCalc] = useState('')

  const updatedInfo = {
    name: nameOfCalc,
    type: typeOfCalc,
    interest_rate: interestRateOfCalc,
    status: statusOfCalc
  }

  return (
    <Modal isOpen={isOpen}
      overlayClassName={'modal-overlay'}
      className={'modal-content'}
      ariaHideApp={false}
      closeTimeoutMS={300}
      onRequestClose={() => onClose()}>
      <div className='EditCalculatorBox'>
        <form>
          <p>Редактирование калькулятора</p>
          <input type='text' placeholder={name} value={nameOfCalc}
            onChange={(e) => setNameOfCalc(e.target.value)} required />
          <input type='text' placeholder={type} value={typeOfCalc}
            onChange={(e) => setTypeOfCalc(e.target.value)} required />
          <input type='number' placeholder={interest_rate} step='0.1' min='0' max='100'
            value={interestRateOfCalc} onChange={(e) => setInterestRateOfCalc(e.target.value)} required />
          <input type='number' placeholder='0 - скрыт, 1 - отображается' min='0' max='1'
            value={statusOfCalc} onChange={(e) => setStatusOfCalc(e.target.value)} required />
          <button id='send' onClick={() => updateCalculator()}>Сохранить</button>
          <p className='check'>{success}</p>
          <p className='error'>{errorText}</p>
          <FaX className='modal-close-btn' onClick={() => onClose()} size='20' />
        </form>
      </div>
    </Modal>
  );
}

export default EditCalculatorBox;