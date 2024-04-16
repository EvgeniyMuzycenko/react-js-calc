import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { jwtDecode } from 'jwt-decode';
import CalculatorBox from '../components/CalculatorBox';
import СalculationBox from '../components/СalculationBox';


function UserProfile({ token, setModalBox, setMessage }) {

  const [calculators, setCalculators] = useState([])

  useEffect(() => {
    const api = 'http://127.0.0.1:9001/calculators'

    fetch(api)
      .then(result => result.json())
      .then((result) => {
        console.log(result)
        setCalculators(result.data)
      })
  }, [])


  const [calculations, setCalculations] = useState([])

  useEffect(() => {
    const api = 'http://127.0.0.1:9001/calculations'

    fetch(api)
      .then(result => result.json())
      .then((result) => {
        console.log(result)
        setCalculations(result.data)
      })
  }, [])

  function AddCalculator() {
    if (jwtDecode(token).role === 'admin') {
      return (
        <>
          <button className='addCalculator' onClick={() => setModalBox('AddCalculatorBox')}>
            Добавить калькулятор
          </button>
        </>
      )
    }
  }

  return (
    <div className='UserProfile'>
      <h2>Добро пожаловать в личный кабинет, {jwtDecode(token).name}!</h2>
      <p id='showLogin'><u>Ваш логин:</u> <b>{jwtDecode(token).login}</b></p>
      <p id='showEmail'><u>Ваш e-mail:</u> <b>{jwtDecode(token).email}</b></p>
      <p id='showRole'><u>Ваш статус:</u> <b>{jwtDecode(token).role}</b></p>
      <AddCalculator />
      <div className='calculatorBox'>
        {calculators.map((item) =>
          <CalculatorBox key={item._id} id={item._id} type={item.type}
            status={item.status} interest_rate={item.interest_rate} name={item.name} token={token}
            setMessage={setMessage} setModalBox={setModalBox}
          />)}
      </div>
      <div className='calculationBox'>
        {calculations.map((item) =>
          <СalculationBox key={item._id} id={item._id} sum={item.sum}
            downPayment={item.downPayment} interestRate={item.interestRate} loanTerm={item.loanTerm}
            monthlyPayment={item.monthlyPayment} requiredIncome={item.requiredIncome}
            overPayment={item.overPayment} email={item.email} date={item.date} name={item.name} type={item.type}
            incomeDeposit={item.incomeDeposit} capitalization={item.capitalization} token={token}
            setMessage={setMessage} setModalBox={setModalBox}
          />)}
      </div>
    </div>
  );
}

export default UserProfile;