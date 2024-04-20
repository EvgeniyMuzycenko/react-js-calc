import React from 'react';
import './СalculationBox.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function СalculationBox({ sum, downPayment, interestRate, loanTerm, monthlyPayment, requiredIncome, email,
  date, name, type, incomeDeposit, capitalization, token, setMessage, setModalBox }) {

  const subject = `Расчет от ${date}`

  const sendMailLoan = () => {

    axios
      .get("http://127.0.0.1:9001/", {
        params: {
          email,
          subject,
          sum,
          downPayment,
          interestRate,
          loanTerm,
          monthlyPayment,
          requiredIncome,
          date,
          name,
          months,
          years
        },
      })
      .then(() => {
        setTimeout(() => {
          setMessage("Письмо отправлено успешно")
          setModalBox('MessageBox')
        }, 100)
        console.log("Письмо отправлено успешно");
      })
      .catch(() => {
        setTimeout(() => {
          setMessage("Произошла ошибка при отправке письма")
          setModalBox('MessageBox')
        }, 100)
        console.log("Произошла ошибка при отправке письма");
      });
  };

  const sendMailDeposit = () => {

    axios
      .get("http://127.0.0.1:9001/", {
        params: {
          email,
          subject,
          sum,
          interestRate,
          loanTerm,
          incomeDeposit,
          capitalization,
          date,
          name,
          months,
          years
        },
      })
      .then(() => {
        setTimeout(() => {
          setMessage("Письмо отправлено успешно")
          setModalBox('MessageBox')
        }, 100)
        console.log("Письмо отправлено успешно");
      })
      .catch(() => {
        setTimeout(() => {
          setMessage("Произошла ошибка при отправке письма")
          setModalBox('MessageBox')
        }, 100)
        console.log("Произошла ошибка при отправке письма");
      });
  };

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

  if (jwtDecode(token).role === 'admin') {
    if (type === 'кредит') {
      return (
        <div className="СalculationBox">
          <p><b>Расчет от:</b></p>
          <p className='desc'>{date}</p>
          <p><b>Имя пользователя:</b></p>
          <p className='desc'>{name}</p>
          <p><b>Сумма кредита:</b></p>
          <p className='desc'>{sum} руб.</p>
          <p><b>Первоначальный взнос:</b></p>
          <p className='desc'>{downPayment} руб.</p>
          <p><b>Процентная ставка:</b></p>
          <p className='desc'>{interestRate} %</p>
          <p><b>Срок кредита:</b></p>
          <p className='desc'>{loanTerm} {years}</p>
          <p><b>Ежемесячный платеж:</b></p>
          <p className='desc'>{monthlyPayment} руб.</p>
          <p><b>Необходимый доход:</b></p>
          <p className='desc'>{requiredIncome} руб.</p>
        </div>
      );
    } else {
      return (
        <div className="СalculationBox">
          <p><b>Расчет от:</b></p>
          <p className='desc'>{date}</p>
          <p><b>Имя пользователя:</b></p>
          <p className='desc'>{name}</p>
          <p><b>Сумма вклада:</b></p>
          <p className='desc'>{sum} руб.</p>
          <p><b>Процентная ставка:</b></p>
          <p className='desc'>{interestRate} %</p>
          <p><b>Срок вклада:</b></p>
          <p className='desc'>{loanTerm} {months}</p>
          <p><b>Доход:</b></p>
          <p className='desc'>{incomeDeposit} руб.</p>
          <p><b>Доход с капитализацией:</b></p>
          <p className='desc'>{capitalization} руб.</p>
        </div>
      );
    }
  }

  if (email === jwtDecode(token).email) {
    if (type === 'кредит') {
      return (
        <div className="СalculationBox" >
          <p><b>Расчет от:</b></p>
          <p className='desc'>{date}</p>
          <p><b>Сумма кредита:</b></p>
          <p className='desc'>{sum} руб.</p>
          <p><b>Первоначальный взнос:</b></p>
          <p className='desc'>{downPayment} руб.</p>
          <p><b>Процентная ставка:</b></p>
          <p className='desc'>{interestRate} %</p>
          <p><b>Срок кредита:</b></p>
          <p className='desc'>{loanTerm} {years}</p>
          <p><b>Ежемесячный платеж:</b></p>
          <p className='desc'>{monthlyPayment} руб.</p>
          <p><b>Необходимый доход:</b></p>
          <p className='desc'>{requiredIncome} руб.</p>
          <input type="hidden" defaultValue={email} />
          <input type='hidden' defaultValue={subject} />
          <button className='BtnSendMail' onClick={sendMailLoan}>Отправить на почту</button>
        </div>
      );
    } else {
      return (
        <div className="СalculationBox">
          <p><b>Расчет от:</b></p>
          <p className='desc'>{date}</p>
          <p><b>Сумма вклада:</b></p>
          <p className='desc'>{sum} руб.</p>
          <p><b>Процентная ставка:</b></p>
          <p className='desc'>{interestRate} %</p>
          <p><b>Срок вклада:</b></p>
          <p className='desc'>{loanTerm} {months}</p>
          <p><b>Доход:</b></p>
          <p className='desc'>{incomeDeposit} руб.</p>
          <p><b>Доход с капитализацией:</b></p>
          <p className='desc'>{capitalization} руб.</p>
          <input type="hidden" defaultValue={email} />
          <input type='hidden' defaultValue={subject} />
          <button className='BtnSendMail' onClick={sendMailDeposit}>Отправить на почту</button>
        </div>
      );
    }
  }
}
export default СalculationBox; 