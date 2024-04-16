import React, { useState } from 'react';
import './Calculator.css';
import { jwtDecode } from 'jwt-decode';

function Calculator({ setModalBox, setMessage, id, type, status, interest_rate, name, token }) {

  const calculator = {
    id: id,
    type: type,
    interest_rate: interest_rate,
    status: status,
    name: name
  }

  console.log(calculator)

  const [errorFieldText, setErrorFieldText] = useState('')
  const [errorSaveText, setErrorSaveText] = useState('')

  const [sum, setSum] = useState('');
  const [downPayment, setDownPayment] = useState('')
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [requiredIncome, setRequiredIncome] = useState(0);
  const [overPayment, setOverPayment] = useState(0);

  //Расчет кредита
  const calculateLoan = () => {
    if (!sum || !downPayment || !loanTerm) {
      setErrorFieldText('Заполните все поля!')
      setTimeout(() => { setErrorFieldText('') }, 3000)
    } else if (sum <= 0 || downPayment <= 0 || loanTerm <= 0) {
      setErrorFieldText('Значения полей должны быть положительными!')
      setTimeout(() => { setErrorFieldText('') }, 3000)
    } else if (sum < downPayment) {
      setErrorFieldText('Сумма кредита меньше первоначального взноса!')
      setTimeout(() => { setErrorFieldText('') }, 3000)
    } else {

      const monthlyInterestRate = interest_rate / 12 / 100;
      console.log(monthlyInterestRate) //Ежемесячная ставка 

      const totalInterestRate = Math.pow((1 + monthlyInterestRate), loanTerm * 12);
      console.log(totalInterestRate); //Общая ставка 

      const creditAmount = sum - downPayment;
      console.log(creditAmount); //Сумма кредита

      const monthlyPayment = creditAmount * monthlyInterestRate * totalInterestRate / (totalInterestRate - 1)

      setMonthlyPayment(monthlyPayment.toFixed(2))
      console.log(monthlyPayment); //Ежемесячный платеж

      const requiredIncome = monthlyPayment * 2.5;
      setRequiredIncome(requiredIncome.toFixed(2));
      console.log(requiredIncome) //Необходимый доход 

      const overPayment = monthlyPayment * loanTerm * 12 - creditAmount
      setOverPayment(overPayment.toFixed(2))
      console.log(overPayment) //Переплата
    }
  }

  const [incomeDeposit, setIncomeDeposit] = useState(0);
  const [capitalization, setCapitalization] = useState(0);

  //Расчет вклада
  const calculateDeposit = () => {
    if (!sum || !loanTerm) {
      setErrorFieldText('Заполните все поля!')
      setTimeout(() => { setErrorFieldText('') }, 3000)
    } else if (sum <= 0 || loanTerm <= 0) {
      setErrorFieldText('Значения полей должны быть положительными!')
      setTimeout(() => { setErrorFieldText('') }, 3000)
    } else {

      const incomeDeposit = (sum * interest_rate * (loanTerm / 12)) / 100;
      setIncomeDeposit(incomeDeposit.toFixed(2));
      console.log(incomeDeposit) //Доход 

      const capitalization = (sum * Math.pow((1 + (interest_rate / 100) / 12), loanTerm)) - sum
      setCapitalization(capitalization.toFixed(2));
      console.log(capitalization) //Капитализация
    }
  }

  //Сохранение расчета
  const saveCalculation = () => {
    if (monthlyPayment !== 0 || requiredIncome !== 0 || overPayment !== 0) {

      const saveData = {
        sum: sum,
        downPayment: downPayment,
        interestRate: interest_rate,
        loanTerm: loanTerm,
        monthlyPayment: monthlyPayment,
        requiredIncome: requiredIncome,
        overPayment: overPayment,
        email: jwtDecode(token).email,
        name: jwtDecode(token).name,
        date: new Date().toLocaleString(),
        type: type,
        incomeDeposit: incomeDeposit,
        capitalization: capitalization
      }

      console.log(saveData)

      let message;

      const api = 'http://127.0.0.1:9001/calculations/add'
      fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData)
      })
        .then((result) => result.json())
        .then((result) => message = result.message)

      setTimeout(() => {
        setMessage(message)
        setModalBox('MessageBox')
      }, 100)
    } else {
      setErrorSaveText('Расчет не произведен!')
      setTimeout(() => { setErrorSaveText('') }, 3000)
    }
  }

  if (status !== '1') {
    return null;
  } else {

    //Отображение кнопки 'Сохранить'
    function ShowBtnSave() {
      if (token !== null) {
        return (
          <>
            <button type="button" onClick={saveCalculation}>Сохранить</button>
          </>
        )
      } else {
        return (
          <p className='authText'>Авторизуйтесь для сохранения расчета!</p>
        )
      }
    }

    let years;
    switch (loanTerm) {
      case '1':
        years = "год";
        break;
      case '2':
      case '3':
      case '4':
        years = "года"
        break;
      default:
        years = "лет";
    }

    let months;
    switch (loanTerm) {
      case '1':
        months = "месяц";
        break;
      case '2':
      case '3':
      case '4':
        months = "месяца"
        break;
      default:
        months = "месяцев";
    }

    if (calculator.type === 'кредит') {
      return (
        <div className="Calculator">
          <form>
            <h1>{name}</h1>
            <label>
              Сумма кредита:
              <input type="number" min='0' max='100000000' value={sum}
                onChange={(e) => setSum(e.target.value)} required /> руб.
            </label>
            <br />
            <label>
              Первоначальный взнос:
              <input type="number" min='0' max='10000000' value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)} required /> руб.
            </label>
            <br />
            <label>
              Процентная ставка:
              <input type="text" className='defaultValue' defaultValue={interest_rate} /> %
            </label>
            <br />
            <label>
              Срок кредита:
              <input type='number' min='0' max='100' value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)} required /> {years}
            </label>
            <br />
            <button type='button' onClick={calculateLoan}>Рассчитать</button>
            <p className='error'>{errorFieldText}</p>
          </form>
          <div className='сalculation'>
            <p>Ежемесячный платеж</p>
            <p className='result'>{new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              currencyDisplay: 'narrowSymbol',
              maximumSignificantDigits: 5
            }).format(monthlyPayment)}</p>
            <p>Необходимый доход</p>
            <p className='result'>{new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              currencyDisplay: 'narrowSymbol',
              maximumSignificantDigits: 5
            }).format(requiredIncome)}</p>
            <p>Переплата</p>
            <p className='result'>{new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              currencyDisplay: 'narrowSymbol',
              maximumSignificantDigits: 5
            }).format(overPayment)}</p>
            <ShowBtnSave />
            <p className='error'>{errorSaveText}</p>
          </div>
        </div>
      );
    }

    if (calculator.type === 'вклад') {
      return (
        <div className="Calculator">
          <form>
            <h1>{name}</h1>
            <label>
              Сумма вклада:
              <input type="number" min='0' max='100000000' value={sum}
                onChange={(e) => setSum(e.target.value)} required /> руб.
            </label>
            <br />
            <label>
              Процентная ставка:
              <input type="text" className='defaultValue' defaultValue={interest_rate} /> %
            </label>
            <br />
            <label>
              Срок вклада:
              <input type="number" min='0' max='100' value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)} required /> {months}
            </label>
            <br />
            <button type="button" onClick={calculateDeposit}>Рассчитать</button>
            <p className='error'>{errorFieldText}</p>
          </form>
          <div className='сalculation'>
            <p>Доход</p>
            <p className='result'>{new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              currencyDisplay: 'narrowSymbol',
              maximumSignificantDigits: 5
            }).format(incomeDeposit)}</p>
            <p>С капитализацией %</p>
            <p className='result'>{new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              currencyDisplay: 'narrowSymbol',
              maximumSignificantDigits: 5
            }).format(capitalization)}</p>
            <ShowBtnSave />
            <p className='error'>{errorSaveText}</p>
          </div>
        </div>
      );
    }
  }
}

export default Calculator;