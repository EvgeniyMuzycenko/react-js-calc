import React from 'react';
import './СalculationBox.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function СalculationBox({ sum, downPayment, interestRate, loanTerm, monthlyPayment, requiredIncome, email,
  date, name, overPayment, type, incomeDeposit, capitalization, token, setMessage, setModalBox }) {

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
          overPayment,
          name
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
          name
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
          <p><b>Расчет от пользователя <span>{name}</span></b></p>
          <p><b>от {date}</b></p>
          <p><b>Сумма кредита:</b> <span>{sum} руб.</span></p>
          <p><b>Первоначальный взнос:</b> <span>{downPayment} руб.</span></p>
          <p><b>Ставка:</b> <span>{interestRate} %</span></p>
          <p><b>Срок кредита:</b> <span>{loanTerm} {years}</span></p>
          <p><b>Ежемесячный платеж:</b> <span>{monthlyPayment} руб.</span></p>
          <p><b>Необходимый доход:</b> <span>{requiredIncome} руб.</span></p>
          <p><b>Переплата:</b> <span>{overPayment} руб.</span></p>
        </div>
      );
    } else {
      return (
        <div className="СalculationBox">
          <p><b>Расчет от пользователя <span>{name}</span></b></p>
          <p><b>от {date}</b></p>
          <p><b>Сумма вклада:</b> <span>{sum} руб.</span></p>
          <p><b>Ставка:</b> <span>{interestRate} %</span></p>
          <p><b>Срок вклада:</b> <span>{loanTerm} {months}</span></p>
          <p><b>Доход:</b> <span>{incomeDeposit} руб.</span></p>
          <p><b>Доход с капитализацией:</b> <span>{capitalization} руб.</span></p>
        </div>
      );
    }
  }

  if (email === jwtDecode(token).email) {
    if (type === 'кредит') {
      return (
        <div className="СalculationBox" >
          <p><b>Расчет от {date}</b></p>
          <p><b>Сумма кредита:</b> <span>{sum} руб.</span></p>
          <p><b>Первоначальный взнос:</b> <span>{downPayment} руб.</span></p>
          <p><b>Ставка:</b> <span>{interestRate} %</span></p>
          <p><b>Срок кредита:</b> <span>{loanTerm} {years}</span></p>
          <p><b>Ежемесячный платеж:</b> <span>{monthlyPayment} руб.</span></p>
          <p><b>Необходимый доход:</b> <span>{requiredIncome} руб.</span></p>
          <p><b>Переплата:</b> <span>{overPayment} руб.</span></p>
          <input type="hidden" defaultValue={email} />
          <input type='hidden' defaultValue={subject} />
          <button className='BtnSendMail' onClick={sendMailLoan}>Отправить на почту</button>
        </div>
      );
    } else {
      return (
        <div className="СalculationBox">
          <p><b>Расчет от {date}</b></p>
          <p><b>Сумма вклада:</b> <span>{sum} руб.</span></p>
          <p><b>Ставка:</b> <span>{interestRate}</span> %</p>
          <p><b>Срок вклада:</b> <span>{loanTerm} {months}</span></p>
          <p><b>Доход:</b> <span>{incomeDeposit} руб.</span></p>
          <p><b>Доход с капитализацией:</b> <span>{capitalization} руб.</span></p>
          <input type="hidden" defaultValue={email} />
          <input type='hidden' defaultValue={subject} />
          <button className='BtnSendMail' onClick={sendMailDeposit}>Отправить на почту</button>
        </div>
      );
    }
  }
}
export default СalculationBox; 