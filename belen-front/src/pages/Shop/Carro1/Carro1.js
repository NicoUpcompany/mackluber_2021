import React, { useState, useEffect } from "react";
import { notification, Form } from 'antd';

import { emailValidation, minLengthValidation, rutValidation } from '../../../utils/formValidation';
import maklube from '../../../assets/img/maklube.png';
import belen from '../../../assets/img/belen.png';

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
                setHob(55000 * personCount);
                setHobString(numberToString(55000 * personCount));
                setTotalAmount((55000 * personCount) + 15000);
                setTotalAmountString(numberToString((55000 * personCount) + 15000));
            } else {
                setHob(55000 * 0);
                setHobString(numberToString(55000 * 0));
                setTotalAmount((55000 * 0) + 15000);
                setTotalAmountString(numberToString((55000 * 0) + 15000));
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
                window.location.href = '/experiencia-gastronomica'
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
                        <div className="maklube"><img src={maklube} alt="maklube" /></div>
                        <div className="belen"><img src={belen} alt="belen" /></div>
                    </div>
                </div>
                <div className="contenedor">
                    <div className="pasos">
                        <div className="col">
                            <div className="num active">1</div>
                            <span>Compra tu entrada</span>
                        </div>
                        
                        <div className="col">
                            <div className="num">2</div>
                            <span>Agregar Experiencia Gastronómica</span>
                        </div>
                       
                        <div className="col">
                            <div className="num">3</div>
                            <span>añadir invitados</span>
                        </div>
                        <div className="col">
                            <div className="num">4</div>
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
                                    <p>Solo si eres de Chile:</p>
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
                                    {/* <div className="campo">
                                         */}
                                    {/* <div className="campo">
                                        <div className="md">
                                            <div className="custom-select">
                                                <label  htmlFor="region">Región</label>
                                                <select name="region" id="region">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Arica y Parinacota</option>
                                                    <option value="2">Tarapacá</option>
                                                    <option value="3">Antofagasta</option>
                                                    <option value="4">Atacama</option>
                                                    <option value="5">Coquimbo</option>
                                                    <option value="6">Valparaíso</option>
                                                    <option value="7">Libertador General Bernardo O'Higgins</option>
                                                    <option value="8">Maule</option>
                                                    <option value="9">Biobío</option>
                                                    <option value="10">La Araucanía</option>
                                                    <option value="11">Los Ríos</option>
                                                    <option value="12">Los Lagos</option>
                                                    <option value="13">Aisén del G. Carlos Ibáñez del Campo</option>
                                                    <option value="14">Magallanes y de la Antártica Chilena</option>
                                                    <option value="15">Metropolitana de Santiago</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="md">
                                            <div id="comunaSelect1" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Santiago</option>
                                                    <option value="2">Cerrillos</option>
                                                    <option value="3">Cerro Navia</option>
                                                    <option value="4">Conchalí</option>
                                                    <option value="5">El Bosque</option>
                                                    <option value="6">Estación Central</option>
                                                    <option value="7">Huechuraba</option>
                                                    <option value="8">Independencia</option>
                                                    <option value="9">La Cisterna</option>
                                                    <option value="10">La Florida</option>
                                                    <option value="11">La Granja</option>
                                                    <option value="12">La Pintana</option>
                                                    <option value="13">La Reina</option>
                                                    <option value="14">Las Condes</option>
                                                    <option value="15">Lo Barnechea</option>
                                                    <option value="16">Lo Espejo</option>
                                                    <option value="17">Lo Prado</option>
                                                    <option value="18">Macul</option>
                                                    <option value="19">Maipú</option>
                                                    <option value="20">Ñuñoa</option>
                                                    <option value="21">Pedro Aguirre Cerda</option>
                                                    <option value="22">Peñalolén</option>
                                                    <option value="23">Providencia</option>
                                                    <option value="24">Pudahuel</option>
                                                    <option value="25">Quilicura</option>
                                                    <option value="26">Quinta Normal</option>
                                                    <option value="27">Recoleta</option>
                                                    <option value="28">Renca</option>
                                                    <option value="29">San Joaquín</option>
                                                    <option value="30">San Miguel</option>
                                                    <option value="31">San Ramón</option>
                                                    <option value="32">Vitacura</option>
                                                    <option value="33">Puente Alto</option>
                                                    <option value="34">Pirque</option>
                                                    <option value="35">San José de Maipo</option>
                                                    <option value="36">Colina</option>
                                                    <option value="37">Lampa</option>
                                                    <option value="38">Tiltil</option>
                                                    <option value="39">San Bernardo</option>
                                                    <option value="40">Buin</option>
                                                    <option value="41">Calera de Tango</option>
                                                    <option value="42">Paine</option>
                                                    <option value="43">Melipilla</option>
                                                    <option value="44">Alhué</option>
                                                    <option value="45">Curacaví</option>
                                                    <option value="46">María Pinto</option>
                                                    <option value="47">San Pedro</option>
                                                    <option value="48">Talagante</option>
                                                    <option value="49">El Monte</option>
                                                    <option value="50">Isla de Maipo</option>
                                                    <option value="51">Padre Hurtado</option>
                                                    <option value="52">Peñaflor</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect2" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Arica</option>
                                                    <option value="2">Camarones</option>
                                                    <option value="3">Putre</option>
                                                    <option value="4">General Lagos</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect3" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Iquique</option>
                                                    <option value="2">Alto Hospicio</option>
                                                    <option value="3">Pozo Almonte</option>
                                                    <option value="4">Camiña</option>
                                                    <option value="5">Colchane</option>
                                                    <option value="6">Huara</option>
                                                    <option value="7">Pica</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect4" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Antofagasta</option>
                                                    <option value="2">Mejillones</option>
                                                    <option value="3">Sierra Gorda</option>
                                                    <option value="4">Taltal</option>
                                                    <option value="5">Calama</option>
                                                    <option value="6">Ollagüe</option>
                                                    <option value="7">San Pedro de Atacama</option>
                                                    <option value="8">Tocopilla</option>
                                                    <option value="9">María Elena</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect5" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Copiapó</option>
                                                    <option value="2">Caldera</option>
                                                    <option value="3">Tierra Amarilla</option>
                                                    <option value="4">Chañaral</option>
                                                    <option value="5">Diego de Almagro</option>
                                                    <option value="6">Vallenar</option>
                                                    <option value="7">Alto del Carmen</option>
                                                    <option value="8">Freirina</option>
                                                    <option value="9">Huasco</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect6" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">La Serena</option>
                                                    <option value="2">Coquimbo</option>
                                                    <option value="3">Andacollo</option>
                                                    <option value="4">La Higuera</option>
                                                    <option value="5">Paiguano</option>
                                                    <option value="6">Vicuña</option>
                                                    <option value="7">Illapel</option>
                                                    <option value="8">Canela</option>
                                                    <option value="9">Los Vilos</option>
                                                    <option value="10">Salamanca</option>
                                                    <option value="11">Ovalle</option>
                                                    <option value="12">Combarbalá</option>
                                                    <option value="13">Monte Patria</option>
                                                    <option value="14">Punitaqui</option>
                                                    <option value="15">Río Hurtado</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect7" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Valparaíso</option>
                                                    <option value="2">Casablanca</option>
                                                    <option value="3">Concón</option>
                                                    <option value="4">Juan Fernández</option>
                                                    <option value="5">Puchuncaví</option>
                                                    <option value="6">Quintero</option>
                                                    <option value="7">Viña del Mar</option>
                                                    <option value="8">Isla de Pascua</option>
                                                    <option value="9">Los Andes</option>
                                                    <option value="10">Calle Larga</option>
                                                    <option value="11">Rinconada</option>
                                                    <option value="12">San Esteban</option>
                                                    <option value="13">La Ligua</option>
                                                    <option value="14">Cabildo</option>
                                                    <option value="15">Papudo</option>
                                                    <option value="16">Petorca</option>
                                                    <option value="17">Zapallar</option>
                                                    <option value="18">Quillota</option>
                                                    <option value="19">Calera</option>
                                                    <option value="20">Hijuelas</option>
                                                    <option value="21">La Cruz</option>
                                                    <option value="22">Nogales</option>
                                                    <option value="23">San Antonio</option>
                                                    <option value="24">Algarrobo</option>
                                                    <option value="25">Cartagena</option>
                                                    <option value="26">El Quisco</option>
                                                    <option value="27">El Tabo</option>
                                                    <option value="28">Santo Domingo</option>
                                                    <option value="29">San Felipe</option>
                                                    <option value="30">Catemu</option>
                                                    <option value="31">Llaillay</option>
                                                    <option value="32">Panquehue</option>
                                                    <option value="33">Putaendo</option>
                                                    <option value="34">Santa María</option>
                                                    <option value="35">Limache</option>
                                                    <option value="36">Quilpué</option>
                                                    <option value="37">Villa Alemana</option>
                                                    <option value="38">Olmué</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect8" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Rancagua</option>
                                                    <option value="2">Codegua</option>
                                                    <option value="3">Coinco</option>
                                                    <option value="4">Coltauco</option>
                                                    <option value="5">Doñihue</option>
                                                    <option value="6">Graneros</option>
                                                    <option value="7">Las Cabras</option>
                                                    <option value="8">Machalí</option>
                                                    <option value="9">Malloa</option>
                                                    <option value="10">Mostazal</option>
                                                    <option value="11">Olivar</option>
                                                    <option value="12">Peumo</option>
                                                    <option value="13">Pichidegua</option>
                                                    <option value="14">Quinta de Tilcoco</option>
                                                    <option value="15">Rengo</option>
                                                    <option value="16">Requínoa</option>
                                                    <option value="17">San Vicente</option>
                                                    <option value="18">Pichilemu</option>
                                                    <option value="19">La Estrella</option>
                                                    <option value="20">Litueche</option>
                                                    <option value="21">Marchihue</option>
                                                    <option value="22">Navidad</option>
                                                    <option value="23">Paredones</option>
                                                    <option value="24">San Fernando</option>
                                                    <option value="25">Chépica</option>
                                                    <option value="26">Chimbarongo</option>
                                                    <option value="27">Lolol</option>
                                                    <option value="28">Nancagua</option>
                                                    <option value="29">Palmilla</option>
                                                    <option value="30">Peralillo</option>
                                                    <option value="31">Placilla</option>
                                                    <option value="32">Pumanque</option>
                                                    <option value="33">Santa Cruz</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect9" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Talca</option>
                                                    <option value="2">Constitución</option>
                                                    <option value="3">Curepto</option>
                                                    <option value="4">Empedrado</option>
                                                    <option value="5">Maule</option>
                                                    <option value="6">Pelarco</option>
                                                    <option value="7">Pencahue</option>
                                                    <option value="8">Río Claro</option>
                                                    <option value="9">San Clemente</option>
                                                    <option value="10">San Rafael</option>
                                                    <option value="11">Cauquenes</option>
                                                    <option value="12">Chanco</option>
                                                    <option value="13">Pelluhue</option>
                                                    <option value="14">Curicó</option>
                                                    <option value="15">Hualañé</option>
                                                    <option value="16">Licantén</option>
                                                    <option value="17">Molina</option>
                                                    <option value="18">Rauco</option>
                                                    <option value="19">Romeral</option>
                                                    <option value="20">Sagrada Familia</option>
                                                    <option value="21">Teno</option>
                                                    <option value="22">Vichuquén</option>
                                                    <option value="23">Linares</option>
                                                    <option value="24">Colbún</option>
                                                    <option value="25">Longaví</option>
                                                    <option value="26">Parral</option>
                                                    <option value="27">Retiro</option>
                                                    <option value="28">San Javier</option>
                                                    <option value="29">Villa Alegre</option>
                                                    <option value="30">Yerbas Buenas</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect10" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Concepción</option>
                                                    <option value="2">Coronel</option>
                                                    <option value="3">Chiguayante</option>
                                                    <option value="4">Florida</option>
                                                    <option value="5">Hualqui</option>
                                                    <option value="6">Lota</option>
                                                    <option value="7">Penco</option>
                                                    <option value="8">San Pedro de la Paz</option>
                                                    <option value="9">Santa Juana</option>
                                                    <option value="10">Talcahuano</option>
                                                    <option value="11">Tomé</option>
                                                    <option value="12">Hualpén</option>
                                                    <option value="13">Lebu</option>
                                                    <option value="14">Arauco</option>
                                                    <option value="15">Cañete</option>
                                                    <option value="16">Contulmo</option>
                                                    <option value="17">Curanilahue</option>
                                                    <option value="18">Los Alamos</option>
                                                    <option value="19">Tirúa</option>
                                                    <option value="20">Los Angeles</option>
                                                    <option value="21">Antuco</option>
                                                    <option value="22">Cabrero</option>
                                                    <option value="23">Laja</option>
                                                    <option value="24">Mulchén</option>
                                                    <option value="25">Nacimiento</option>
                                                    <option value="26">Negrete</option>
                                                    <option value="27">Quilaco</option>
                                                    <option value="28">Quilleco</option>
                                                    <option value="29">San Rosendo</option>
                                                    <option value="30">Santa Bárbara</option>
                                                    <option value="31">Tucapel</option>
                                                    <option value="32">Yumbel</option>
                                                    <option value="33">Alto Biobío</option>
                                                    <option value="34">Chillán</option>
                                                    <option value="35">Bulnes</option>
                                                    <option value="36">Cobquecura</option>
                                                    <option value="37">Coelemu</option>
                                                    <option value="38">Coihueco</option>
                                                    <option value="39">Chillán Viejo</option>
                                                    <option value="40">El Carmen</option>
                                                    <option value="41">Ninhue</option>
                                                    <option value="42">Ñiquén</option>
                                                    <option value="43">Pemuco</option>
                                                    <option value="44">Pinto</option>
                                                    <option value="45">Portezuelo</option>
                                                    <option value="46">Quillón</option>
                                                    <option value="47">Quirihue</option>
                                                    <option value="48">Ránquil</option>
                                                    <option value="49">San Carlos</option>
                                                    <option value="50">San Fabián</option>
                                                    <option value="51">San Ignacio</option>
                                                    <option value="52">San Nicolás</option>
                                                    <option value="53">Treguaco</option>
                                                    <option value="54">Yungay</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect11" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Temuco</option>
                                                    <option value="2">Carahue</option>
                                                    <option value="3">Cunco</option>
                                                    <option value="4">Curarrehue</option>
                                                    <option value="5">Freire</option>
                                                    <option value="6">Galvarino</option>
                                                    <option value="7">Gorbea</option>
                                                    <option value="8">Lautaro</option>
                                                    <option value="9">Loncoche</option>
                                                    <option value="10">Melipeuco</option>
                                                    <option value="11">Nueva Imperial</option>
                                                    <option value="12">Padre Las Casas</option>
                                                    <option value="13">Perquenco</option>
                                                    <option value="14">Pitrufquén</option>
                                                    <option value="15">Pucón</option>
                                                    <option value="16">Saavedra</option>
                                                    <option value="17">Teodoro Schmidt</option>
                                                    <option value="18">Toltén</option>
                                                    <option value="19">Vilcún</option>
                                                    <option value="20">Villarrica</option>
                                                    <option value="21">Cholchol</option>
                                                    <option value="22">Angol</option>
                                                    <option value="23">Collipulli</option>
                                                    <option value="24">Curacautín</option>
                                                    <option value="25">Ercilla</option>
                                                    <option value="26">Lonquimay</option>
                                                    <option value="27">Los Sauces</option>
                                                    <option value="28">Lumaco</option>
                                                    <option value="29">Purén</option>
                                                    <option value="30">Renaico</option>
                                                    <option value="31">Traiguén</option>
                                                    <option value="32">Victoria</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect12" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Valdivia</option>
                                                    <option value="2">Corral</option>
                                                    <option value="3">Lanco</option>
                                                    <option value="4">Los Lagos</option>
                                                    <option value="5">Máfil</option>
                                                    <option value="6">Mariquina</option>
                                                    <option value="7">Paillaco</option>
                                                    <option value="8">Panguipulli</option>
                                                    <option value="9">La Unión</option>
                                                    <option value="10">Futrono</option>
                                                    <option value="11">Lago Ranco</option>
                                                    <option value="12">Río Bueno</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect13" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Puerto Montt</option>
                                                    <option value="2">Calbuco</option>
                                                    <option value="3">Cochamó</option>
                                                    <option value="4">Fresia</option>
                                                    <option value="5">Frutillar</option>
                                                    <option value="6">Los Muermos</option>
                                                    <option value="7">Llanquihue</option>
                                                    <option value="8">Maullín</option>
                                                    <option value="9">Puerto Varas</option>
                                                    <option value="10">Castro</option>
                                                    <option value="11">Ancud</option>
                                                    <option value="12">Chonchi</option>
                                                    <option value="13">Curaco de Vélez</option>
                                                    <option value="14">Dalcahue</option>
                                                    <option value="15">Puqueldón</option>
                                                    <option value="16">Queilén</option>
                                                    <option value="17">Quellón</option>
                                                    <option value="18">Quemchi</option>
                                                    <option value="19">Quinchao</option>
                                                    <option value="20">Osorno</option>
                                                    <option value="21">Puerto Octay</option>
                                                    <option value="22">Purranque</option>
                                                    <option value="23">Puyehue</option>
                                                    <option value="24">Río Negro</option>
                                                    <option value="25">San Juan de la Costa</option>
                                                    <option value="26">San Pablo</option>
                                                    <option value="27">Chaitén</option>
                                                    <option value="28">Futaleufú</option>
                                                    <option value="29">Hualaihué</option>
                                                    <option value="30">Palena</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect14" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Coihaique</option>
                                                    <option value="2">Lago Verde</option>
                                                    <option value="3">Aisén</option>
                                                    <option value="4">Cisnes</option>
                                                    <option value="5">Guaitecas</option>
                                                    <option value="6">Cochrane</option>
                                                    <option value="7">O'Higgins</option>
                                                    <option value="8">Tortel</option>
                                                    <option value="9">Chile Chico</option>
                                                    <option value="10">Río Ibáñez</option>
                                                </select>
                                            </div>
                                            <div id="comunaSelect15" className="custom-select">
                                                <label  htmlFor="comuna">Comuna</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Punta Arenas</option>
                                                    <option value="2">Laguna Blanca</option>
                                                    <option value="3">Río Verde</option>
                                                    <option value="4">San Gregorio</option>
                                                    <option value="5">Cabo de Hornos (Ex-Navarino)</option>
                                                    <option value="6">Antártica</option>
                                                    <option value="7">Porvenir</option>
                                                    <option value="8">Primavera</option>
                                                    <option value="9">Timaukel</option>
                                                    <option value="10">Natales</option>
                                                    <option value="11">Torres del Paine</option>
                                                </select>
                                            </div>
                                        </div> */}
                                    {/* </div> */}
                                    {/* <div className="campo">
                                        <input 
                                            type="text"
                                            name="adress" 
                                            placeholder="Dirección (Calle, número, depto)" 
                                            onChange={inputValidation}
                                            value={inputs.adress}
                                        />
                                        <label>Dirección</label>
                                    </div> */}
                                    <div className="campo">
                                        <span className="btn" onClick={() => register()}>Comprar una entrada</span>
                                    </div>
                                </div>
                                <div className="mid">
                                    <div className="desc">
                                        <p>
                                            <span>01</span> |  Al comprar tu entrada, estás adquiriendo <strong>UNA</strong> conexión al evento.
                                        </p>
                                        <p>
                                            <span>02</span> |  Luego, llegará a tu mail un código con el link para ingresar a nuestro Maklube fraterno. <small>(si no lo encuentras revisa el spam)</small>
                                        </p>
                                        <p>
                                            <span>03</span> |  Dicho código puede ser usado <strong>una vez</strong> y en <strong>un solo dispositivo</strong> (computador, smart TV, tablet, celular), ya que es bloqueado después del ingreso.
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
                </div>
            </div>

            <div className="footer">
                <div className="contenedor">
                    <img src={belen} alt="belen" width="150" />
                    <div className="Up">
                        <a href="https://upwebinar.cl/" target="_blank" rel="noopener noreferrer">
                            <img src="https://upwebinar.cl/img/up.min.svg" alt="upwebinar" width="14"/>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}