import React, { useEffect, useState } from 'react';
import './Main.css';
import Calculator from '../components/Calculator';


function Main({ setModalBox, setMessage, token }) {

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


  return (
    <div className='Main'>
      {calculators.map((item) =>
        <Calculator key={item._id} id={item._id} type={item.type} status={item.status}
          interest_rate={item.interest_rate} name={item.name} token={token} setModalBox={setModalBox}
          setMessage={setMessage}
        />)}
    </div>
  );
}

export default Main;