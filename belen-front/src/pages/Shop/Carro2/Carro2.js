import React, { useState, useEffect } from "react";
import { notification } from 'antd';
import { minLengthValidation } from '../../../utils/formValidation';

import belen from '../../../assets/imagen/logoBelenColor.png';
import macklube from '../../../assets/imagen/logoBelen.png';
 

export default function Carro2() {

    const [inputs, setInputs] = useState({
        fullName: '',
        email: '',
        phone: '',
        rut: '',
        adress: '',
        commune: '',
        region: ''
    });

    const [adress, setAdress] = useState('');
    const [currencyType, setCurrencyType] = useState(true);
    const [communeHob, setCommuneHob] = useState('');
    const [hobValue, setHobValue] = useState(true);
    const [personCount, setPersonCount] = useState(1);
    const [hob, setHob] = useState(0);
    const [hobString, setHobString] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountString, setTotalAmountString] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('fullName') || localStorage.getItem('fullName') === 'null') {
            window.location.href = '/';
        }
        setInputs({
            fullName: localStorage.getItem('fullName'),
            email: localStorage.getItem('email'),
            phone: localStorage.getItem('phone'),
            rut: localStorage.getItem('rut'),
            adress: localStorage.getItem('adress'),
            commune: localStorage.getItem('commune'),
            region: localStorage.getItem('region')
        });
        setCurrencyType(localStorage.getItem('currencyType') === 'true');
    }, []);

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
                    
                    if (isNaN(e.target.innerHTML)) {
                        setCommuneHob(e.target.innerHTML)
                    } else {
                        setPersonCount(e.target.innerHTML)
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

    const numberToString = value => {
        var moneyDots = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return moneyDots;
    }

    const changeForm = e => {
        setAdress(e.target.value);
    };

    const handleClickRadio = () => {
        setHobValue(true)
    }

    const handleClickRadio2 = () => {
        setHobValue(false)
    }

    const register = () => {
        if (hobValue && communeHob === '') {
            notification['error']({
                message: "Debes seleccionar una comuna"
            });
        } else  if (hobValue && adress.trim() === '') {
            notification['error']({
                message: "Dirección no válida"
            });
        } else {
            localStorage.setItem('hobValue', hobValue);
            localStorage.setItem('hobString', hobString);
            localStorage.setItem('adress', adress);
            localStorage.setItem('guests', true);
            localStorage.setItem('hob', hob);
            localStorage.setItem('totalAmount', totalAmount);
            localStorage.setItem('totalAmountString', totalAmountString);
            localStorage.setItem('communeHob', communeHob);
            localStorage.setItem('totalAmount', totalAmount);
            window.location.href = '/invitados'
        }
    }

    const endSale = () => {
        if (hobValue && communeHob === '') {
            notification['error']({
                message: "Debes seleccionar una comuna"
            });
        } else  if (hobValue && adress.trim() === '') {
            notification['error']({
                message: "Dirección no válida"
            });
        } else {
            localStorage.setItem('fullName', inputs.fullName);
            localStorage.setItem('rut', inputs.rut);
            localStorage.setItem('email', inputs.email);
            localStorage.setItem('phone', inputs.phone);
            localStorage.setItem('adress', adress);
            localStorage.setItem('commune', inputs.commune);
            localStorage.setItem('region', inputs.region);
            localStorage.setItem('hobValue', hobValue);
            localStorage.setItem('guests', false);
            localStorage.setItem('hob', hob);
            localStorage.setItem('hobString', hobString);
            localStorage.setItem('totalAmount', totalAmount);
            localStorage.setItem('communeHob', communeHob);
            localStorage.setItem('ticketStatus', false);
            localStorage.setItem('usersHobStatus', false);
            window.location.href = '/medio-de-pago';
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
                            <div className="num">1</div>
                            <span>Compra tu entrada</span>
                        </div>
                        <div className="col">
                            <div className="num active">2</div>
                            <span>Agregar caja Gastronómica</span>
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

                    <div className="datos">
                        <div className="mid">
                            <div className="info">
                                <h3>Agregar Caja Gastronómica</h3>
                                <p>Solo en provincia de Santiago y Chicureo</p>
                                <p>
                                    ¿Quieres vivir la Experiencia gastronómica?
                                    <small>(Compra disponible hasta el 09.11.2021)</small>
                                </p>
                                
                                <div className="campos">
                                    <div className="campo">
                                        <div className="ml">
                                            <div className="campo-r">
                                                <div className="radio">
                                                    <div className="radiobtn">
                                                        <input style={{cursor: 'pointer'}} type="radio" id="si" name="experiencia" onClick={handleClickRadio} checked={hobValue} />
                                                        <div className="check"></div>
                                                    </div>
                                                    <label htmlFor="si">Si, quiero</label>
                                                </div>
                                                <div className="radio">
                                                    <div className="radiobtn">
                                                        <input style={{cursor: 'pointer'}} type="radio" id="no" name="experiencia" onClick={handleClickRadio2} checked={!hobValue} />
                                                        <div className="check"></div>
                                                    </div>
                                                    <label htmlFor="no">No, gracias</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ms">
                                            <div className="custom-select">
                                                <label  htmlFor="cant">Cant de Box</label>
                                                <select name="cant" id="cant">
                                                    <option value="1">1</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                    <option value="10">10</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="campo">
                                        <div className="mid">
                                            <div className="custom-select">
                                                <label  htmlFor="comuna">Comunas disponibles para delivery</label>
                                                <select name="comuna" id="comuna">
                                                    <option value="0">&nbsp;</option>
                                                    <option value="1">Cerrillos</option>
                                                    <option value="2">Cerro Navia</option>
                                                    <option value="3">Chicureo</option>
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
                                                    <option value="32">Santiago</option>
                                                    <option value="33">Vitacura</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mid">
                                            <div className="campo">
                                                <input 
                                                    type="text"
                                                    name="adress" 
                                                    placeholder="Dirección (Calle, número, depto)" 
                                                    onChange={changeForm}
                                                    value={adress}
                                                />
                                                <label>Dirección</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className="">
                                <h3>Resumen del pedido</h3>
                                <div className="resumen">
                                    <div className="lines">
                                        {currencyType ?
                                            <div className="line">Entrada Chile <span>$15.000</span></div>
                                        :
                                            <div className="line">Entrada otros países <span>$20</span></div>
                                        }
                                        
                                        {hobValue ? <div className="line">Caja gastronómica <span>${hobString}</span></div> : <span></span>}
                                    </div>
                                    <div className="total">Total <span>${totalAmountString}</span></div>
                                    <div className="btns">
                                        <span id="sale" className="btn" onClick={() => register()}>añadir invitados</span>
                                        <span id="sale" className="btn" onClick={() => endSale()}>finalizar compra</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="mid">
                            <div className="desc2">

                                <h3><strong>¿Qué es una caja gastronómica?</strong></h3>
                                {/* <p>
                                    <label className='num'>1 </label> <span> Box de @ameliacorreaentucasa con productos de nuestros auspiciadores y patrocinadores, para compartir el día del evento.</span>
                                </p>
                                <p>
                                    <label className='num'>2 </label> <span> <strong>Cada BOX es para 2 personas e incluye: </strong>
                                         hummus - babaghanoush - mini pan pitas - 10 hojitas de parra - 6 empanaditas mechada - queso - productos Cial Alimentos - 10 dulces árabes SUK - 2 bebidas - 1 botella de vino "El Principal" - 1 vela para "Ceremonia de la Luz" - regalos.</span>
                                </p>
                                <p>
                                    <label className='num'>3 </label> <span> Puedes comprar 1 o más Box para la misma dirección.</span>
                                </p>
                                <p>
                                    <label className='num'>4 </label> <span> Incluye el despacho</span>
                                </p> */}
                                <p>
                                    <label className='num'>1 </label> <span> Caja de<strong> Joaquin Lea Plaza</strong>  con productos para<strong> dos personas</strong> , que incluye: Vino tinto, hummus, pate de ave y oporto, empanaditas de masa philo, hojas de parra, pan pita minis, queso camembert, queso gruyere, mantecoso, damasco turco y romero, tostadas de pan pita crujiente, cecinas, dulces árabes y mucho más</span>
                                </p>
                                <p>
                                    <label className='num'>2 </label> <span> <strong>Puedes comprar 1 o más cajas gastronómicas para la misma dirección.</strong></span>
                                </p>
                                <p>
                                    <label className='num'>3 </label> <span> Incluye el despacho.</span>
                                </p>
                                {currencyType ?
                                    <div className="valor">
                                        <span>Valor caja gastronómica para dos personas.</span>
                                        CLP $60.000
                                    </div>
                                :
                                    <div className="valor" style={{width: '100%'}}>
                                        <span>Valor caja gastronómica para dos personas.</span>
                                        USD $75
                                    </div>
                                }
                            </div>                            
                        </div>

                    </div>

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