import React, { useState, useEffect } from "react";
import { notification, Form } from 'antd';

import { emailValidation, minLengthValidation, rutValidation } from '../../../utils/formValidation';

import belen from '../../../assets/imagen/logoBelenColor.png';
import macklube from '../../../assets/imagen/logoBelen.png';
 

var arrayAux = [];

export default function Carro3() {

    const [inputs, setInputs] = useState({
        fullName: '',
        email: '',
        phone: '',
        rut: '',
        adress: '',
        commune: '',
        region: '',
        communeHob: '',
        hobValue: false,
        guest: true,
        totalAmount: 0,
        hob: 0,
        hobString: ''
    });

    const [guestInputs, setGuestInputs] = useState({
        userFullName: '',
        userRut: '',
        userPhone: '',
        userEmail: '',
        userAdress: '',
    });

    const [formValid, setFormValid] = useState({
        userFullName: false,
        userRut: false,
        userPhone: false,
        userEmail: false,
        userAdress: false
    });

    const [currencyType, setCurrencyType] = useState(true);
    const [deleteUserStatus, setDeleteUserStatus] = useState(false);
    const [deleteHobStatus, setDeleteHobStatus] = useState(false);
    const [userCommune, setUserCommune] = useState(''); // Comuna
    const [users, setUsers] = useState([]); // Usuarios
    const [usersCount, setUsersCount] = useState(0);
    const [usersRestCount, setUsersRestCount] = useState(0);
    const [hobValue, setHobValue] = useState(true); // Experiencia gastronómica
    const [personCount, setPersonCount] = useState(1); // Cantidad de pedidos por invitado
    const [hob, setHob] = useState(0); // Valor final hob
    const [hobString, setHobString] = useState(''); // Valor final hob en String
    const [usersHob, setUsersHob] = useState(0); // Valor hob invitados
    const [usersHobStatus, setUsersHobStatus] = useState(false);
    const [usersHobCount, setUsersHobCount] = useState(0);
    const [usersHobString, setUsersHobString] = useState(''); // Valor hob invitados en String
    const [totalAmountTitular, setTotalAmountTitular] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0); // Valor final
    const [totalAmountString, setTotalAmountString] = useState(''); // Valor final en String
    const [ticketStatus, setTicketStatus] = useState(false); // Si hay invitados
    const [ticketValue, setTicketValue] = useState(0); // Valor total tickets invitados
    const [ticketValueString, setTicketValueString] = useState(''); // Valor total tickets invitados en String
    const [hobCount, setHobCount] = useState(0); // Valor total tickets invitados en String
    const [hobAux, setAux] = useState(false); // Valor total tickets invitados en String
    

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
                        setUserCommune(e.target.innerHTML)
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
            region: localStorage.getItem('region'),
            communeHob: localStorage.getItem('communeHob'),
            hobValue: localStorage.getItem('hobValue'),
            guest: localStorage.getItem('guest'),
            totalAmount: localStorage.getItem('totalAmount'),
            hob: localStorage.getItem('hob'),
            hobString: localStorage.getItem('hobString')
        });
        setTotalAmount(localStorage.getItem('totalAmount'));
        setTotalAmountString(numberToString(localStorage.getItem('totalAmount')));
        setTotalAmountTitular(parseInt((localStorage.getItem('totalAmount'))))
        setCurrencyType(localStorage.getItem('currencyType') === 'true');
    }, []);

    useEffect(() => {
        if (currencyType) {
            if (!deleteHobStatus) {
                if (usersHobStatus && ticketStatus) {
                    setTicketValue(usersCount * 15000);
                    setTicketValueString(numberToString(usersCount * 15000));
                    setHob(60000 * usersHobCount);
                    setHobString(numberToString(60000 * usersHobCount));
                    setTotalAmountTitular((((60000 * usersHobCount) + (usersCount * 15000)) + parseInt(totalAmount)));
                    setTotalAmountString(numberToString(((60000 * usersHobCount) + (usersCount * 15000)) + parseInt(totalAmount)));
                }
            } else {
                setTicketValue(usersCount * 15000);
                setTicketValueString(numberToString(usersCount * 15000));
                setHob(60000 * usersHobCount);
                setHobString(numberToString(60000 * usersHobCount));
                setTotalAmountTitular((((60000 * usersHobCount) + (usersCount * 15000)) + parseInt(totalAmount)));
                setTotalAmountString(numberToString(((60000 * usersHobCount) + (usersCount * 15000)) + parseInt(totalAmount)));
    
            }
            if (!deleteUserStatus) {
                if (ticketStatus && !usersHobStatus) {
                    setTicketValue(usersCount * 15000);
                    setTicketValueString(numberToString(usersCount * 15000));
                    setTotalAmountTitular(totalAmountTitular + 15000)
                    setTotalAmountString(numberToString(totalAmountTitular + 15000));
                }
            } else {
                if (!usersHobStatus && !deleteHobStatus) {
                    setTicketValue(usersCount * 15000);
                    setTicketValueString(numberToString(usersCount * 15000));
                    setTotalAmountTitular(totalAmountTitular - 15000)
                    setTotalAmountString(numberToString(totalAmountTitular - 15000));
                }
                setDeleteUserStatus(false);
                setDeleteHobStatus(false);
            }
        } else {
            if (!deleteHobStatus) {
                if (usersHobStatus && ticketStatus) {
                    setTicketValue(usersCount * 20);
                    setTicketValueString(numberToString(usersCount * 20));
                    setHob(70 * usersHobCount);
                    setHobString(numberToString(70 * usersHobCount));
                    setTotalAmountTitular((((70 * usersHobCount) + (usersCount * 20)) + parseInt(totalAmount)));
                    setTotalAmountString(numberToString(((70 * usersHobCount) + (usersCount * 20)) + parseInt(totalAmount)));
                }
            } else {
                setTicketValue(usersCount * 20);
                setTicketValueString(numberToString(usersCount * 20));
                setHob(70 * usersHobCount);
                setHobString(numberToString(70 * usersHobCount));
                setTotalAmountTitular((((70 * usersHobCount) + (usersCount * 20)) + parseInt(totalAmount)));
                setTotalAmountString(numberToString(((70 * usersHobCount) + (usersCount * 20)) + parseInt(totalAmount)));
    
            }
            if (!deleteUserStatus) {
                if (ticketStatus && !usersHobStatus) {
                    setTicketValue(usersCount * 20);
                    setTicketValueString(numberToString(usersCount * 20));
                    setTotalAmountTitular(totalAmountTitular + 20)
                    setTotalAmountString(numberToString(totalAmountTitular + 20));
                }
            } else {
                if (!usersHobStatus && !deleteHobStatus) {
                    setTicketValue(usersCount * 20);
                    setTicketValueString(numberToString(usersCount * 20));
                    setTotalAmountTitular(totalAmountTitular - 20)
                    setTotalAmountString(numberToString(totalAmountTitular - 20));
                }
                setDeleteUserStatus(false);
                setDeleteHobStatus(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersCount, currencyType, hobAux]);

    const numberToString = value => {
        var moneyDots = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return moneyDots;
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
            if (name === 'userRut') {
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

    const changeForm = e => {
        setGuestInputs({
            ...guestInputs,
            [e.target.name]: e.target.value
        });
    };

    const handleClickRadio = () => {
        setHobValue(true)
    }

    const handleClickRadio2 = () => {
        setHobValue(false)
    }

    const deleteUser = item => {
        let userArray = users;
        if (item.hobExperience) {
            var aux = item.quantityHobExperience * 60000;
            setUsersHobCount(usersHobCount - item.quantityHobExperience);
            if ((hob - aux) === 0) {
                setUsersHobStatus(false);
                setDeleteHobStatus(true);
            }
        } else {
            setDeleteUserStatus(true);
        }
        if ((ticketValue - 15000) === 0) {
            setTicketStatus(false);
        }
        userArray = userArray.filter(e => e !== item);
        arrayAux = arrayAux.filter(e => e !== item);
        setUsers(userArray);
        setUsersCount(usersCount - 1);
    }

    const clearForm = () => {
        setGuestInputs({
            userFullName: '',
            userRut: '',
            userPhone: '',
            userEmail: '',
            userAdress: '',
        });
        document.getElementById("userFullName").focus();
    }

    const addUser = () => {
        const fullNameVal = guestInputs.userFullName;
        const emailVal = guestInputs.userEmail;
        const fullNameFormVal = formValid.userFullName;
        const emailFormVal = formValid.userEmail;

        if ( !fullNameVal || !emailVal ) {
            notification['error']({
                message: "Nombre y correo son campos obligatorios"
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
            const newUser = {
                fullName: guestInputs.userFullName,
                phone: guestInputs.userPhone,
                email: guestInputs.userEmail,
                hobExperience: false,
                quantityHobExperience: 0,
            }
            arrayAux.push(newUser);
            setUsers(arrayAux);
            setTicketStatus(true);
            setHobCount(hobCount + 1);
            setUsersCount(usersCount + 1);
            clearForm();
        }
    }

    const addExperience = () => {
        if (hobValue) {
            if (users.length > 0) {
                if (hobCount > 0) {
                    const adressVal = guestInputs.userAdress;
                    const userCommuneVal = userCommune;
                    const adressFormVal = formValid.userAdress;
                    if (!adressFormVal || !adressVal) {
                        notification['error']({
                            message: "Dirección no válida"
                        });
                    } else if (userCommuneVal === '') {
                        notification['error']({
                            message: "Debes seleccionar una comuna"
                        });
                    } else {
                        setHobValue(true);
                        setTicketStatus(true);
                        setUsersHobStatus(true);
                        setUsersHob(personCount * 60000);
                        setUsersHobString(numberToString(personCount * 60000));
                        const updateUser = {
                            fullName: users[users.length - 1].fullName,
                            phone: users[users.length - 1].phone,
                            email: users[users.length - 1].email,
                            adress: guestInputs.userAdress,
                            hobExperience: hobValue,
                            quantityHobExperience: personCount,
                            commune: userCommune
                        }
                        let userArray = users;
                        userArray = userArray.filter(e => e !== users[users.length - 1]);
                        arrayAux = arrayAux.filter(e => e !== users[users.length - 1]);
                        arrayAux.push(updateUser);
                        setUsers(arrayAux);
                        setUsersHobCount(parseInt(usersHobCount) + parseInt(personCount));
                        setHobCount(0);
                        setAux(!hobAux);
                    }
                } else {
                    notification['error']({
                        message: "Solo una experiencia por invitado"
                    });
                }
            } else {
                notification['error']({
                    message: "Debes agregar una entrada de invitado"
                });
            }
        } else {
            notification['error']({
                message: "Debes aceptar la experiencia gastronómica para invitados"
            });
        }
    }

    const register = () => {
        localStorage.setItem('finalEntradaInvitados', ticketValue);
        localStorage.setItem('finalHobInvitados', hob);
        localStorage.setItem('ticketStatus', ticketStatus);
        localStorage.setItem('usersHobStatus', usersHobStatus);
        localStorage.setItem('totalAmount', totalAmountTitular);
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = '/medio-de-pago';
    }

    return (
        <>
            <div className="carro">
                <div className="header">
                    <div className="contenedor">
                        <div className="maklube"><img src={macklube} alt="maklube" /></div>
                        <div className="belen"><img src={belen} alt="belen" /></div>
                     </div>
                </div>
                <div className="contenedor2">
                    <div className="pasos">
                        <div className="col">
                            <div className="num">1</div>
                            <span>Compra tu entrada</span>
                        </div>
                        
                        <div className="col">
                            <div className="num">2</div>
                            <span>Agregar caja Gastronómica</span>
                        </div>
                       
                        <div className="col">
                            <div className="num active">3</div>
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
                                    <h3>Comprar entrada invitado<small>(una conexión)</small></h3>
                                    <div className="campo">
                                        <input 
                                            type="text" 
                                            name="userFullName" 
                                            id="userFullName"
                                            placeholder="Nombre y Apellido" 
                                            onChange={inputValidation}
                                            value={guestInputs.userFullName}
                                        />
                                        <label>Nombre y Apellido</label>
                                    </div>
                                    <div className="campo">
                                        <div className="md">
                                             <input 
                                                type="email" 
                                                name="userEmail" 
                                                placeholder="Email invitado" 
                                                onChange={inputValidation}
                                                value={guestInputs.userEmail}
                                            />
                                            <label>Email</label>
                                        </div>
                                        <div className="md">
                                            <input 
                                                type="text" 
                                                name="userPhone" 
                                                placeholder="Teléfono Ej: 56961306226"
                                                onChange={inputValidation}
                                                value={guestInputs.userPhone}
                                            />
                                            <label>Teléfono</label>
                                        </div>
                                    </div>
                                    <div className="campo">
                                        <span onClick={() => addUser()} className="btn">Agregar al carro</span>
                                    </div>
                                    <div className="campo">&nbsp;</div>
                                    <h3>Caja Gastronómica para invitados</h3>
                                    <div className="campo">
                                        <div className="ml">
                                            <div className="campo-r">
                                                <div className="radio">
                                                    <div className="radiobtn">
                                                        <input type="radio" id="si" name="experiencia"  onClick={handleClickRadio} checked={hobValue} />
                                                        <div className="check"></div>
                                                    </div>
                                                    <label htmlFor="si">Si, quiero</label>
                                                </div>
                                                <div className="radio">
                                                    <div className="radiobtn">
                                                        <input type="radio" id="no" name="experiencia" onClick={handleClickRadio2} checked={!hobValue} />
                                                        <div className="check"></div>
                                                    </div>
                                                    <label htmlFor="no">No, gracias</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ms">
                                            <div className="custom-select">
                                                <label htmlFor="cant">Cant de Box</label>
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
                                        <div className="md">
                                            <div className="campo">
                                                <input 
                                                    type="text" 
                                                    name="userAdress" 
                                                    placeholder="Dirección (Calle, Numeración, Depto)" 
                                                    onChange={inputValidation}
                                                    value={guestInputs.userAdress}
                                                />
                                                <label>Dirección</label>
                                            </div>
                                        </div>
                                        <div className="md">
                                            <div className="custom-select">
                                                <label htmlFor="comuna">Comunas disponibles para delivery</label>
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
                                    </div>
                                    <div className="campo">
                                        <span onClick={() => addExperience()} className="btn">Agregar la caja</span>
                                    </div>
                                    <div className="campo">
                                        <span onClick={() => clearForm()} className="btn">Agregar otro invitado</span>
                                    </div>

                                    <div className="inscritos">
                                        {users.map((item, i) => {
                                            return (
                                                <div className="line" key={i}>
                                                    <div className="v">
                                                        <span>Nombre y Apellido</span>
                                                        {item.fullName}
                                                    </div>
                                                    <div className="v">
                                                        <span>Email</span>
                                                        {item.email}
                                                    </div>
                                                    <div className="opciones">
                                                        <span onClick={() => deleteUser(item)} >Elimnar</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="mid">
                                    <h3>Resumen del pedido</h3>
                                    <div className="resumen">
                                        <div className="lines">
                                            {currencyType ?
                                                <div className="line">Entrada Chile <span>$15.000</span></div>
                                            :
                                                <div className="line">Entrada otros países <span>$20</span></div>
                                            }
                                            {ticketStatus ? <div className="line">Entrada Chile (Invitados)<span>${ticketValueString}</span></div> : <span></span>}
                                            
                                            {inputs.hobValue ? <div className="line">Caja gastronómica (Titular)<span>${inputs.hobString}</span></div> : <span></span>}
                                            {usersHobStatus ? <div className="line">Caja gastronómica (Invitados)<span>${hobString}</span></div> : <span></span>}
                                           
                                        </div>
                                        <div className="total">Total <span>${totalAmountString}</span></div>
                                        <div className="btns">
                                            <span onClick={() => register()} className="btn center">finalizar compra</span>
                                        </div>
                                        
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