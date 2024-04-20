const PORT = 9001
const URLDB = 'mongodb://127.0.0.1:27017/'

const express = require('express')
const cors = require('cors')
const jsonwebtoken = require('jsonwebtoken')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const { secret } = require('./config')
const User = require('./models/User')
const Calculator = require('./models/Calculator')
const Calculation = require('./models/Calculation')

const app = express()

const generateAccessToken = (id, login, email, role, name) => {
  const payload = {
    id, login, email, role, name
  }

  return jsonwebtoken.sign(payload, secret, { expiresIn: '24h' })
}

app.use(cors())
app.use(express.json())


//Регистрация
app.post('/registration', async (req, res) => {
  console.log(req.body)
  const { login, password, email, name, role } = req.body
  const user = new User({ login, password, email, name, role })

  try {
    await user.save()
  } catch (err) {
    if (err && err.code !== 11000) {
      res.json({
        message: 'Неизвестная ошибка!'
      })
        .status(500)

      return
    }

    if (err && err.code === 11000) {
      res.json({
        message: 'Учетная запись уже существует!'
      })
        .status(400)
      console.error('Учетная запись уже существует!')

      return
    }
  }

  res.json({
    message: 'Вы успешно зарегистрировались!'
  })
})

//Авторизация
app.post('/login', async (req, res) => {
  console.log(req.body)
  const { login, password } = req.body
  let user

  try {
    user = await User.findOne({ login })
  } catch (err) {
    res.json({
      message: 'Неизвестная ошибка!'
    })
      .status(500)

    return
  }

  if (!user) {
    return res.status(400).json({ message: 'Пользователь не найден!' })
  }
  if (user.password !== password) {
    return res.status(400).json({ message: 'Неверный логин или пароль!' })
  }
  const jwtToken = generateAccessToken(user._id, user.login, user.email, user.role, user.name)

  res.json({
    message: 'Вы успешно авторизованы!',
    token: jwtToken
  })
})

//Добавление калькулятора
app.get('/calculators', async (req, res) => {
  let calculators

  try {
    calculators = await Calculator.find()
  } catch (err) {
    res.json({
      message: 'Неизвестная ошибка!'
    })
      .status(500)

    return
  }

  res.json({
    data: calculators
  })
})

app.post('/calculators/add', async (req, res) => {
  console.log(req.body)
  const { type, status, interest_rate, name } = req.body
  const calculator = new Calculator({ type, status, interest_rate, name })

  try {
    await calculator.save()
  } catch (err) {
    if (err && err.code !== 11000) {
      res.json({
        message: 'Неизвестная ошибка!'
      })
        .status(500)

      return
    }
  }

  res.json({
    message: 'Калькулятор успешно сохранен!'
  })
})

//Удаление калькулятора
app.post('/calculators/delete', async (req, res) => {
  console.log(req.body)
  const { calculatorId } = req.body;

  try {
    const deletedCalculator = await Calculator.findByIdAndDelete(calculatorId);
    if (!deletedCalculator) {
      return res.status(404).json({ message: 'Калькулятор с указанным ID не найден' });
    }
    return res.status(200).json({ message: 'Калькулятор успешно удален' });
  } catch (error) {
    return res.status(500).json({ message: 'Произошла ошибка при удалении калькулятора' });
  }
});

//Редактирование калькулятора
app.post('/calculators/edit', async (req, res) => {
  const { calculatorId, updatedInfo } = req.body;

  try {
    const updatedCalculator = await Calculator.findByIdAndUpdate(calculatorId, updatedInfo, { new: true });
    if (!updatedCalculator) {
      return res.status(404).json({ message: 'Товар с указанным ID не найден' });
    }
    return res.status(200).json({ message: 'Информация о товаре успешно отредактирована', updatedCalculator });
  } catch (error) {
    return res.status(500).json({ message: 'Произошла ошибка при редактировании информации о товаре' });
  }
});

//Сохранение расчета
app.get('/calculations', async (req, res) => {
  let calculations

  try {
    calculations = await Calculation.find()
  } catch (err) {
    res.json({
      message: 'Неизвестная ошибка!'
    })
      .status(500)

    return
  }

  res.json({
    data: calculations
  })
})

app.post('/calculations/add', async (req, res) => {
  console.log(req.body)
  const { sum, downPayment, interestRate, loanTerm, monthlyPayment, requiredIncome, email, date, name, type,
    incomeDeposit, capitalization } = req.body
  const calculation = new Calculation({
    sum, downPayment, interestRate, loanTerm, monthlyPayment,
    requiredIncome, email, date, name, type, incomeDeposit, capitalization
  })

  try {
    await calculation.save()
  } catch (err) {
    if (err && err.code !== 11000) {
      res.json({
        message: 'Неизвестная ошибка!'
      })
        .status(500)

      return
    }
  }

  res.json({
    message: 'Расчет успешно сохранен!'
  })
})

//Отправка расчета на email
function sendEmail({ email, subject, sum, downPayment, interestRate, loanTerm, monthlyPayment, requiredIncome,
  name, incomeDeposit, capitalization, months, years }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ev.muzycenko@gmail.com",
        pass: "wdhihlnkslnibnjg",
      },
    });

    let mail_configs

    if (!incomeDeposit) {
      mail_configs = {
        from: "ev.muzycenko@gmail.com",
        to: email,
        subject: subject,
        html: `
      <p><b>Имя пользователя:</b> ${name}</p>
      <p><b>Сумма кредита:</b> ${sum} руб.</p>
      <p><b>Первоначальный взнос:</b> ${downPayment} руб.</p>
      <p><b>Процентная ставка:</b> ${interestRate}%</p>
      <p><b>Срок кредита:</b> ${loanTerm} ${years}</p>
      <p><b>Ежемесячный платеж:</b> ${monthlyPayment} руб.</p>
      <p><b>Необходимый доход:</b> ${requiredIncome} руб.</p>
      `,
      };
    } else {
      mail_configs = {
        from: "ev.muzycenko@gmail.com",
        to: email,
        subject: subject,
        html: `
      <p><b>Имя пользователя:</b> ${name}</p>
      <p><b>Сумма вклада:</b> ${sum} руб.</p>
      <p><b>Процентная ставка:</b> ${interestRate}%</p>
      <p><b>Срок вклада:</b> ${loanTerm} ${months}</p>
      <p><b>Доход:</b> ${incomeDeposit} руб.</p>
      <p><b>Доход с капитализацией:</b> ${capitalization} руб.</p>
      `,
      };
    }

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.get("/", (req, res) => {
  sendEmail(req.query)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});


//Подключение к БД
const start = async () => {
  try {
    await mongoose.connect(URLDB)
    app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
  } catch (e) {
    console.error(e)
  }
}

start()