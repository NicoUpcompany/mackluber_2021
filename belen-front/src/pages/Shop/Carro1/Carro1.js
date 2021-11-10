import React, { useState, useEffect } from "react";
import { notification, Form } from 'antd';

import { emailValidation, minLengthValidation, rutValidation } from '../../../utils/formValidation';
import belen from '../../../assets/imagen/logoBelenColor.png';
import macklube from '../../../assets/imagen/logoBelen.png';
 
export default function Carro1() {

    const [inputs, setInputs] = useState({
        fullName: '',
        email: '',
        phone: '',
        rut: '',
        adress: ''
    });
    const [region, setRegion] = useState('');
    const [commune, setCommune] = useState('');
    const [currencyType, setCurrencyType] = useState(true);

    const [adress, setAdress] = useState('');
    const [communeHob, setCommuneHob] = useState('');
    const [hobValue, setHobValue] = useState(false);
    const [personCount, setPersonCount] = useState(1);
    const [hob, setHob] = useState(0);
    const [hobString, setHobString] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountString, setTotalAmountString] = useState('');

    const [formValid, setFormValid] = useState({
        fullName: false,
        email: false,
        phone: false,
        rut: false,
        adress: false
    });

    const numberToString = value => {
        var moneyDots = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return moneyDots;
    }

    // useEffect(() => {
    //     const selectComuna1 = document.getElementById('comunaSelect1');
    //     const selectComuna2 = document.getElementById('comunaSelect2');
    //     const selectComuna3 = document.getElementById('comunaSelect3');
    //     const selectComuna4 = document.getElementById('comunaSelect4');
    //     const selectComuna5 = document.getElementById('comunaSelect5');
    //     const selectComuna6 = document.getElementById('comunaSelect6');
    //     const selectComuna7 = document.getElementById('comunaSelect7');
    //     const selectComuna8 = document.getElementById('comunaSelect8');
    //     const selectComuna9 = document.getElementById('comunaSelect9');
    //     const selectComuna10 = document.getElementById('comunaSelect10');
    //     const selectComuna11 = document.getElementById('comunaSelect11');
    //     const selectComuna12 = document.getElementById('comunaSelect12');
    //     const selectComuna13 = document.getElementById('comunaSelect13');
    //     const selectComuna14 = document.getElementById('comunaSelect14');
    //     const selectComuna15 = document.getElementById('comunaSelect15');
    //     if (region === 'Metropolitana de Santiago') {
    //         selectComuna1.style.display = 'inline';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Arica y Parinacota') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'inline';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Tarapacá') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'inline';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Antofagasta') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'inline';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Atacama') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'inline';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Coquimbo') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'inline';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Valparaíso') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'inline';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === `Libertador General Bernardo O'Higgins`) {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'inline';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Maule') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'inline';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Biobío') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'inline';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'La Araucanía') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'inline';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Los Ríos') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'inline';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Los Lagos') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'inline';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Aisén del G. Carlos Ibáñez del Campo') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'inline';
    //         selectComuna15.style.display = 'none';
    //     } else if (region === 'Magallanes y de la Antártica Chilena') {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'inline';
    //     } else {
    //         selectComuna1.style.display = 'none';
    //         selectComuna2.style.display = 'none';
    //         selectComuna3.style.display = 'none';
    //         selectComuna4.style.display = 'none';
    //         selectComuna5.style.display = 'none';
    //         selectComuna6.style.display = 'none';
    //         selectComuna7.style.display = 'none';
    //         selectComuna8.style.display = 'none';
    //         selectComuna9.style.display = 'none';
    //         selectComuna10.style.display = 'none';
    //         selectComuna11.style.display = 'none';
    //         selectComuna12.style.display = 'none';
    //         selectComuna13.style.display = 'none';
    //         selectComuna14.style.display = 'none';
    //         selectComuna15.style.display = 'none';
    //     }
    // }, [region]);

    useEffect(() => {
        localStorage.clear();
    }, []);

    useEffect(() => {
        var x, i, j, selElmnt, a, b, c;
		x = document.getElementsByClassName("custom-select");
		for (i = 0; i < x.length; i++) {
		      selElmnt = x[i].getElementsByTagName("select")[0];
		      a = document.createElement("DIV");
              a.setAttribute("class", "select-selected");
		      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
              x[i].appendChild(a);
		      b = document.createElement("DIV");
		      b.setAttribute("class", "select-items select-hide");
		      for (j = 1; j < selElmnt.length; j++) {
		        c = document.createElement("DIV");
		        c.innerHTML = selElmnt.options[j].innerHTML;
		        c.setAttribute("rel", selElmnt.options[j].value);
		        c.addEventListener("click", function(e) {
                    //SELECCIONAR
                    if (e.target.innerText === 'Arica y Parinacota' || e.target.innerText === 'Tarapacá' || e.target.innerText === 'Antofagasta' || e.target.innerText === 'Atacama' 
                        || e.target.innerText === 'Coquimbo' || e.target.innerText === 'Valparaíso' || e.target.innerText === `Libertador General Bernardo O'Higgins` 
                        || e.target.innerText === 'Maule' || e.target.innerText === 'Biobío' || e.target.innerText === 'La Araucanía' || e.target.innerText === 'Los Ríos' 
                        || e.target.innerText === 'Los Lagos' || e.target.innerText === 'Aisén del G. Carlos Ibáñez del Campo' 
                        || e.target.innerText === 'Magallanes y de la Antártica Chilena' || e.target.innerText === 'Metropolitana de Santiago') {
                            setRegion(e.target.innerText)
                    } else {
                        setCommune(e.target.innerText)
                    }
                    
		            var y, i, k, s, h;
		            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
		            h = this.parentNode.previousSibling;
		            for (i = 0; i < s.length; i++) {
		              if (s.options[i].innerHTML === this.innerHTML) {
		                s.selectedIndex = i;
		                h.innerHTML = this.innerHTML;
		                y = this.parentNode.getElementsByClassName("same-as-selected");
		                for (k = 0; k < y.length; k++) {
		                  y[k].removeAttribute("class");
		                }
		                this.setAttribute("class", "same-as-selected");
		                break;
		              }
		            }
		            h.click();
		        });
		        b.appendChild(c);
		}

		  x[i].appendChild(b);
		  a.addEventListener("click", function(e) {
		    e.stopPropagation();
		    closeAllSelect(this);

		    // ABRIR
		    this.parentNode.getElementsByTagName("label")[0].classList.add("selected");
		    this.parentNode.classList.add("selected");
		    this.nextSibling.classList.toggle("select-hide");
		    this.classList.toggle("select-arrow-active");
		  });
		}

		function closeAllSelect(elmnt) {
		  var x, y, i, arrNo = [];
		  var hvClas = false;
		  x = document.getElementsByClassName("select-items");
		  y = document.getElementsByClassName("select-selected");
		  for (i = 0; i < y.length; i++) {
		    if (elmnt === y[i]) {
		      arrNo.push(i)
		    } else {
		      y[i].classList.remove("select-arrow-active");
		    }
		  }
		  for (i = 0; i < x.length; i++) {
		    if (arrNo.indexOf(i)) {
		        var z = x[i].getElementsByTagName("DIV");
		        for (var o = 0; z.length > o; o++) {
		            if(z[o].classList.contains('same-as-selected')) hvClas = true;
		        }
		        
		      x[i].classList.add("select-hide");
		    }
		    if(!hvClas){
		        x[i].parentNode.getElementsByTagName("label")[0].classList.remove("selected");
		        x[i].parentNode.classList.remove("selected");
		    }
		  }
		}

		document.addEventListener("click", closeAllSelect);
    }, []);
    
    const changeForm = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };

    const handleClickRadio = () => {
        setCurrencyType(true);
    }
    
    const handleClickRadio2 = () => {
        setCurrencyType(false);
    }

    const inputValidation = async e => {
        const { type, name } = e.target;

        if(type === "email") {
            setFormValid({
                ...formValid,
                [name]: emailValidation(e.target)
            });
        }

        if(type === "text") {
            if (name === 'rut') {
                setFormValid({
                    ...formValid,
                    [name]: rutValidation(e.target)
                });

            } else {
                setFormValid({
                    ...formValid,
                    [name]: minLengthValidation(e.target, 2)
                });
            }
        }
    };


    useEffect(() => {
        console.log(currencyType)
        if (currencyType) {
            if (hobValue) {
                setHob(60000 * personCount);
                setHobString(numberToString(60000 * personCount));
                setTotalAmount((60000 * personCount) + 15000);
                setTotalAmountString(numberToString((60000 * personCount) + 15000));
            } else {
                setHob(60000 * 0);
                setHobString(numberToString(60000 * 0));
                setTotalAmount((60000 * 0) + 15000);
                setTotalAmountString(numberToString((60000 * 0) + 15000));
            }
        } else {
            if (hobValue) {
                setHob(70 * personCount);
                setHobString(numberToString(70 * personCount));
                setTotalAmount((70 * personCount) + 20);
                setTotalAmountString(numberToString((70 * personCount) + 20));
            } else {
                setHob(70 * 0);
                setHobString(numberToString(70 * 0));
                setTotalAmount((70 * 0) + 20);
                setTotalAmountString(numberToString((70 * 0) + 20));
            }
        }
    }, [personCount, hobValue, currencyType]);



    const register = () => {
        const fullNameVal = inputs.fullName;
        const emailVal = inputs.email;
        const fullNameFormVal = formValid.fullName;
        const emailFormVal = formValid.email;

        if ( !fullNameVal || !emailVal ) {
            notification['error']({
                message: "Nombre y correo son obligatorios"
            });
        } else if (!fullNameFormVal ) {
            notification['error']({
                message: "Nombre no válido"
            });
        } else if (!emailFormVal ) {
            notification['error']({
                message: "Correo no válido"
            });
        } else {
            if (currencyType) {
                localStorage.setItem('fullName', inputs.fullName);
                localStorage.setItem('rut', inputs.rut);
                localStorage.setItem('email', inputs.email);
                localStorage.setItem('phone', inputs.phone);
                localStorage.setItem('adress', inputs.adress);
                localStorage.setItem('commune', commune);
                localStorage.setItem('region', region);
                localStorage.setItem('currencyType', currencyType);
                localStorage.setItem('hobValue', false);
                localStorage.setItem('hobString', '0');
                localStorage.setItem('adress', '');
                localStorage.setItem('guests', false);
                localStorage.setItem('hob', 0);
                localStorage.setItem('totalAmount', 15000);
                localStorage.setItem('totalAmountString', '15.000');
                localStorage.setItem('communeHob', '');
                //window.location.href = '/experiencia-gastronomica'
                window.location.href = '/invitados'
            } else {
                localStorage.setItem('fullName', inputs.fullName);
                localStorage.setItem('rut', inputs.rut);
                localStorage.setItem('email', inputs.email);
                localStorage.setItem('phone', inputs.phone);
                localStorage.setItem('adress', inputs.adress);
                localStorage.setItem('commune', commune);
                localStorage.setItem('region', region);
                localStorage.setItem('currencyType', currencyType);
                localStorage.setItem('hobValue', false);
                localStorage.setItem('hobString', '0');
                localStorage.setItem('adress', '');
                localStorage.setItem('guests', false);
                localStorage.setItem('hob', 0);
                localStorage.setItem('totalAmount', 20);
                localStorage.setItem('totalAmountString', '20');
                localStorage.setItem('communeHob', '');
                window.location.href = '/medio-de-pago'
            }
        }
    }

    return (
        <>
            <div className="carro">
                <div className="header">
                    <div className="contenedor">
                        <div className="maklube"><img  class='logo' src={macklube} alt="maklube" /></div>
                        <div className="belen"><img class='logo'  src={belen} alt="belen" /></div>
                     </div>
                </div>
                <div className="contenedor2">
                    <div className="pasos">
                        <div className="col">
                            <div className="num active">1</div>
                            <span>Compra tu entrada</span>
                        </div>
                        {/*
                        <div className="col">
                            <div className="num">2</div>
                            <span>Agregar caja Gastronómica</span>
                        </div>
                        */}
                        <div className="col">
                            <div className="num">2</div>
                            <span>añadir invitados</span>
                        </div>
                        <div className="col">
                            <div className="num">3</div>
                            <span>medio de pago</span>
                        </div>
                    </div>

                    <Form id="formInscripcion" name="formInscripcion" onChange={changeForm}>
                        <div className="datos">
                            <div className="campos">
                                <div className="mid">
                                    <h3>Datos del usuario (Quien usará la conexión)</h3>
                                    <div className="campo">
                                        <input 
                                            type="text"
                                            name="fullName"
                                            placeholder="Nombre y Apellido"
                                            onChange={inputValidation}
                                            value={inputs.fullName}
                                        />
                                        <label>Nombre y Apellido</label>
                                    </div>
                                    <div className="campo">
                                        <div className="md">
                                            <input 
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                onChange={inputValidation}
                                                value={inputs.email}
                                            />
                                            <label>Email</label>
                                        </div>
                                        <div className="md">
                                            <input 
                                                type="telefono" 
                                                name="phone" 
                                                placeholder="Teléfono Ej: 56961306226" 
                                                onChange={inputValidation}
                                                value={inputs.phone}
                                            />
                                            <label>Teléfono</label>
                                        </div>
                                    </div>
                                    <div className="campo">
                                        <div className="campo-r">
                                            <div className="radio">
                                                <div className="radiobtn">
                                                    <input style={{cursor: 'pointer'}} type="radio" id="si" name="experiencia"  onClick={handleClickRadio} checked={currencyType} />
                                                    <div className="check"></div>
                                                </div>
                                                <label htmlFor="CLP">CLP <small>(Compra en Chile)</small></label>
                                            </div>
                                            <div className="radio">
                                                <div className="radiobtn">
                                                    <input style={{cursor: 'pointer'}} type="radio" id="no" name="experiencia" onClick={handleClickRadio2} checked={!currencyType} />
                                                    <div className="check"></div>
                                                </div>
                                                <label htmlFor="USD">USD <small>(Compra desde el extranjero)</small></label>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='chile'>Solo si eres de Chile:</p>
                                    <div className="campo">
                                        <input 
                                            type="text" 
                                            name="rut" 
                                            placeholder="RUT" 
                                            onChange={inputValidation}
                                            value={inputs.rut}
                                        />
                                        <label>RUT</label>
                                    </div>
                                    <div className="campo">
                                        <span className="btn" onClick={() => register()}>Comprar una entrada</span>
                                    </div>
                                </div>
                                <div className="mid">
                                    <div className="desc">
                                        <p>
                                            <span className="num">01</span> |  Al comprar tu entrada, estás adquiriendo <strong>UNA</strong> conexión al evento.
                                        </p>
                                        <p>
                                            <span className="num">02</span> |  Luego de la compra, llegará a tu mail la confirmación de esta. <small>(si no lo encuentras revisa el spam)</small>
                                        </p>
                                        <p>
                                            <span className="num">03</span> |  El día del evento deberas ingresar con el mail registrado, este puede ser ingresado <strong>una sola vez</strong> y en <strong>un solo dispositivo</strong> (computador, smart TV, tablet, celular), ya que es bloqueado después del ingreso.
                                        </p>
                                        {/*
                                        <p>
                                            
                                            <span>04</span> |  Además puedes regalar conexiones y experiencias gastronómicas a familiares y amigos haciendo click 
                                                más abajo en "Agregar Invitado".
                                            
                                        </p>
                                        */}

                                        {currencyType ? 
                                            <div className="valor">
                                                <span>Valor de la entrada (1 conexión para 1 dispositivo) Chile.</span>
                                                CLP $15.000
                                            </div>
                                        :   <div className="valor">
                                                <span>Valor de la entrada (1 conexión para 1 dispositivo) Otros Países.</span>
                                                USD $20
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                    <div className="footer-carro">
                        {/* <img src={belen} alt="belen" width="150" /> */}
                        {/* <div className="Up">
                            <a href="https://upwebinar.cl/" target="_blank" rel="noopener noreferrer">
                                <img src="https://upwebinar.cl/img/up.min.svg" alt="upwebinar" width="14"/>
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}