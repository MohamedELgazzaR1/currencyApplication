import styles from "./styles.module.css";
import {  NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import CurrencyInput from "./currencyinput";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

const Favourite = () => {

    const [amount1, setAmount1] = useState(1);
    const [amount2, setAmount2] = useState();
    const [currency1, setCurrency1] = useState();
    const [currency2, setCurrency2] = useState();
    const [conversionRate,setConvertionRate] = useState();
    const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");  
    navigate("/login",{ replace: true });
    window.location.reload();
  };


  //runs on the first render []
   useEffect(() => {

    axios
    .get(
      "http://localhost:8080/api/fav"
    )
    .then((response) => {
      setCurrency1(response.data.currency1);
      setCurrency2(response.data.currency2);
    });

  }, []);

  useEffect(() => {
    if (!!currency1 && !!currency2) {
      function init() {
        axios
        .get(
          `https://api.apilayer.com/fixer/convert?apikey=fIsH4cdGGkf4QQpplhCG8bxaxOTXT9vH&to=${currency2}&from=${currency1}&amount=${amount1}`
        )
        .then((response) => {
          setConvertionRate(format(response.data.info.rate));
          setAmount2(response.data.result);
        });
      }
      init();
    }
  }, [currency1,currency2]);


  function format(number) {
    return number.toFixed(4);
  }


  function handleAmount1Change(amount1) {
    setAmount2(format(amount1 * conversionRate));
    setAmount1(amount1);
  }



  function handleAmount2Change(amount2) {
    setAmount1(format(amount2 * 1/conversionRate));
    setAmount2(amount2);
  }


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
        <h1>Favourite Page</h1>
		<h2>Conversion rate : {conversionRate}</h2>
        <CurrencyInput
          onAmountChange={handleAmount1Change}
          //onCurrencyChange={handleCurrency1Change}
          currencies={[currency1]}
          amount={amount1}
          currency={currency1}
        />
        <CurrencyInput
          onAmountChange={handleAmount2Change}
          //onCurrencyChange={handleCurrency2Change}
          currencies={[currency2]}
          amount={amount2}
          currency={currency2}
        />
		
      </div>
    </div>
  );
};

export default Favourite;
