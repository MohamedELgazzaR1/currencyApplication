import styles from "./styles.module.css";
import {  NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import CurrencyInput from "./currencyinput";
import axios from "axios";


const Main = () => {


  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
  const [currency1, setCurrency1] = useState("EGP");
  const [currency2, setCurrency2] = useState("USD");
  const [rates, setRates] = useState([]);
  const [conversionRate,setConvertionRate] = useState(0.0532);
  const [error, setError] = useState("");


  //runs on the first render []
  useEffect(() => {
    axios
      .get(
        "https://api.apilayer.com/fixer/latest?apikey=fIsH4cdGGkf4QQpplhCG8bxaxOTXT9vH"
      )
      .then((response) => {
        setRates(response.data.rates);
        
      });
  }, []);


  //runs on every render [rates change]
  useEffect(() => { 
    if (!!rates) {
      function init() {
        handleAmount1Change(1);
        setConvertionRate(format(rates[currency2] / rates[currency1]))
      }
      init();
    }
  }, [rates]);


  const handleAddFav = async (e) => {
    e.preventDefault();
    try {
        console.log("here")
        const data = {id:"1",currency1,currency2}
        const url = "http://localhost:8080/api/fav";
        console.log(data)
        const { data: res } = await axios.post(url, data);
        console.log(res.message);
        alert(res.message)
    } catch (error) {
        if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
        ) {
            setError(error.response.data.message);
        }
    }
};


  function format(number) {
    return number.toFixed(4);
  }

  function handleAmount1Change(amount1) {
    setAmount2(format((amount1 * rates[currency2]) / rates[currency1]));
    setAmount1(amount1);
  }

  function handleCurrency1Change(currency1) {
    setAmount2(format((amount1 * rates[currency2]) / rates[currency1]));
    setConvertionRate(format(rates[currency2] / rates[currency1]))
    setCurrency1(currency1);
  }

  function handleAmount2Change(amount2) {
    setAmount1(format((amount2 * rates[currency1]) / rates[currency2]));
    setAmount2(amount2);
  }

  function handleCurrency2Change(currency2) {
    setAmount1(format((amount2 * rates[currency1]) / rates[currency2]));
    setConvertionRate(format(rates[currency2] / rates[currency1]))
    setCurrency2(currency2);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <h1>Currency Converter</h1>
        <NavLink className={styles.NavLink} aria-current="page" to="/">
          Home
        </NavLink>
        <NavLink className={styles.NavLink} to="/fav">
          Favourite
        </NavLink>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div>
    <h1>Home Page</h1>
		<h2>Conversion rate : {conversionRate}</h2>
        <CurrencyInput
          onAmountChange={handleAmount1Change}
          onCurrencyChange={handleCurrency1Change}
          currencies={Object.keys(rates)}
          amount={amount1}
          currency={currency1}
        />
        <CurrencyInput
          onAmountChange={handleAmount2Change}
          onCurrencyChange={handleCurrency2Change}
          currencies={Object.keys(rates)}
          amount={amount2}
          currency={currency2}
        />
		
      </div>
	  <button className={styles.bluebtn} onClick={handleAddFav}>
	  <i className="fa-solid fa-circle-star">Favourite this</i>
    </button>
    </div>
  );
};

export default Main;
