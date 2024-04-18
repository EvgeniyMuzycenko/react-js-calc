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

  //Расчет кредита
  const calculateLoan = () => {
    if (!sum || !downPayment || !loanTerm) {
      setErrorFieldText('Заполните все поля!')
      setTimeout(() => { setErrorFieldText('') }, 3000)
    } else if (sum <= 0 || downPayment <= 0 || loanTerm <= 0) {
      setErrorFieldText('Значения полей должны быть положительными!')
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
    if (monthlyPayment !== 0 || incomeDeposit !== 0) {

      const saveData = {
        sum: sum,
        downPayment: downPayment,
        interestRate: interest_rate,
        loanTerm: loanTerm,
        monthlyPayment: monthlyPayment,
        requiredIncome: requiredIncome,
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
      setErrorSaveText('Пустой расчет!')
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
            <h2>{name}</h2>
            <label>Сумма кредита:</label>
            <input type="number" min='0' max='100000000' value={sum}
              onChange={(e) => setSum(e.target.value)} placeholder='Введите сумму кредита' required />
            <label>Первоначальный взнос:</label>
            <input type="number" min='0' max='10000000' value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)} placeholder='Введите сумму первоначального взноса' required />
            <label>Срок кредита:
              <input type='number' className='termValue' min='0' max='100' value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)} placeholder='Введите срок' required /> {years}
            </label>
            <label>Процентная ставка:
              <input type="text" className='interestValue' defaultValue={interest_rate} disabled /> %
            </label>
            <button type='button' onClick={calculateLoan}>Рассчитать</button>
            <p className='error'>{errorFieldText}</p>
          </form>
          <div className='сalculation'>
            <p className='resText'>Результат расчета:</p>
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
            <h2>{name}</h2>
            <label>Сумма вклада:</label>
            <input type="number" min='0' max='100000000' value={sum}
              onChange={(e) => setSum(e.target.value)} placeholder='Введите сумму вклада в рублях' required />
            <label>
              Срок вклада:
              <input type="number" className='termValue' min='0' max='100' value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)} placeholder='Введите срок' required /> {months}
            </label>
            <label>
              Процентная ставка:
              <input type="text" className='interestValue' defaultValue={interest_rate} /> %
            </label>
            <button type="button" onClick={calculateDeposit}>Рассчитать</button>
            <p className='error'>{errorFieldText}</p>
          </form>
          <div className='сalculation'>
            <p className='resText'>Результат расчета:</p>
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