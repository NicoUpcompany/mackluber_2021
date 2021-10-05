import React, { useState, useEffect } from "react";
import { notification, Spin  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import uuid from 'uuid/v4';

import belen from '../../../assets/imagen/logoBelenColor.png';
import macklube from '../../../assets/imagen/logoBelen.png';
 
import pagofacil from '../../../assets/imagen/pagofacil.png';
import paypal from '../../../assets/imagen/paypal.png';

import { signUpApi } from '../../../api/user';
import { MakePaymentApi, MakePaymentPaypalApi } from '../../../api/payment';
import $ from 'jquery';

moment.locale('es');

export default function Carro4() {

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
    const [loading, setLoading] = useState(false);
    const [currencyType, setCurrencyType] = useState(true);
    const [currencyTypeString, setCurrencyTypeString] = useState('CLP');
    const [users, setUsers] = useState([]);
    const [methodPay, setMethodPay] = useState(true);
    const [finalEntradaInvitados, setFinalEntradaInvitados] = useState(0);
    const [finalEntradaInvitadosString, setFinalEntradaInvitadosString] = useState('');
    const [finalHobInvitados, setFinalHobInvitados] = useState(0);
    const [finalHobInvitadosString, setFinalHobInvitadosString] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountString, setTotalAmountString] = useState('');
    const [ticketStatus, setTicketStatus] = useState(false);
    const [usersHobStatus, setUsersHobStatus] = useState(false);
    const [guestsStatus, setguestsStatus] = useState(false);
    const [hobUSD, sethobUSD] = useState(0);
    const [totalAmountUSD, setTotalAMountUSD] = useState(0);
    const [finalEntradaInvitadosUSD, setFinalEntradaInvitadosUSD] = useState(0);
    const [hobTitularUSD, setHobTitularUSD] = useState(0);
    const [finalHobInvitadosUSD, setFinalHobInvitadosUSD] = useState(0);

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
            guest: (localStorage.getItem('guests') === 'true'),
            totalAmount: localStorage.getItem('totalAmount'),
            hob: parseInt(localStorage.getItem('hob')),
            hobString: localStorage.getItem('hobString')
        });
        setCurrencyType(localStorage.getItem('currencyType') === 'true');
        if (localStorage.getItem('currencyType') === 'true') {
            setCurrencyTypeString('CLP');
        } else {
            setCurrencyTypeString('USD');
        }
        setMethodPay(localStorage.getItem('currencyType') === 'true')
        setguestsStatus(localStorage.getItem('guests') === 'true')
        if (localStorage.getItem('finalEntradaInvitados') && localStorage.getItem('finalEntradaInvitados') !== 'null') {
            setFinalEntradaInvitados(localStorage.getItem('finalEntradaInvitados'));
            setFinalEntradaInvitadosString(numberToString(localStorage.getItem('finalEntradaInvitados')));
        }
        if (localStorage.getItem('finalHobInvitados') && localStorage.getItem('finalHobInvitados') !== 'null') {
            setFinalHobInvitados(localStorage.getItem('finalHobInvitados'));
            setFinalHobInvitadosString(numberToString(localStorage.getItem('finalHobInvitados')));
        }
        if (localStorage.getItem('ticketStatus') && localStorage.getItem('ticketStatus') !== 'null') {
            setTicketStatus(localStorage.getItem('ticketStatus'));
        }
        if (localStorage.getItem('usersHobStatus') && localStorage.getItem('usersHobStatus') !== 'null') {
            setUsersHobStatus(localStorage.getItem('usersHobStatus'));
        }
        if (localStorage.getItem('totalAmount') && localStorage.getItem('totalAmount') !== 'null') {
            setTotalAmount(localStorage.getItem('totalAmount'));
            setTotalAmountString(numberToString(localStorage.getItem('totalAmount')));
        }
        if (localStorage.getItem('users') && localStorage.getItem('users') !== 'null') {
            setUsers(JSON.parse(localStorage.getItem('users')));
            var usersArray = JSON.parse(localStorage.getItem('users'));
            setguestsStatus(usersArray.length > 0)
        }
    }, []);

    const numberToString = value => {
        var moneyDots = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return moneyDots;
    }

    const changeToPagofacil = () => {
        setCurrencyTypeString('CLP');
        setMethodPay(true);
        if (!currencyType) { // TO CLP
            if (guestsStatus) {
                setFinalEntradaInvitados((finalEntradaInvitados / 20) * 15000)
                setFinalEntradaInvitadosString((finalEntradaInvitados / 20) * 15000)
                setInputs({
                    ...inputs,
                    hob: (inputs.hob / 70) * 60000,
                    hobString: (inputs.hob / 70) * 60000
                });
                setFinalHobInvitados((finalHobInvitados / 70) * 60000)
                setFinalHobInvitadosString((finalHobInvitados / 70) * 60000)
                setTotalAmount(((finalEntradaInvitados / 20) * 15000) + ((inputs.hob / 70) * 60000) + ((finalHobInvitados / 70) * 60000) + 15000)
                setTotalAmountString(numberToString(((finalEntradaInvitados / 20) * 15000) + ((inputs.hob / 70) * 60000) + ((finalHobInvitados / 70) * 60000) + 15000))
            } else {
                setInputs({
                    ...inputs,
                    hob: (inputs.hob / 70) * 60000,
                    hobString: (inputs.hob / 70) * 60000
                });
                setTotalAmount(((inputs.hob / 70) * 60000) + 15000)
                console.log(((inputs.hob / 70) * 60000) + 15000)
                setTotalAmountString(numberToString(((inputs.hob / 70) * 60000) + 15000))
            }
        } else {
            setInputs({
                ...inputs,
                hob: parseInt(localStorage.getItem('hob')),
                hobString: localStorage.getItem('hobString')
            });
            if (localStorage.getItem('finalEntradaInvitados') && localStorage.getItem('finalEntradaInvitados') !== 'null') {
                setFinalEntradaInvitados(localStorage.getItem('finalEntradaInvitados'));
                setFinalEntradaInvitadosString(numberToString(localStorage.getItem('finalEntradaInvitados')));
            }
            if (localStorage.getItem('finalHobInvitados') && localStorage.getItem('finalHobInvitados') !== 'null') {
                setFinalHobInvitados(localStorage.getItem('finalHobInvitados'));
                setFinalHobInvitadosString(numberToString(localStorage.getItem('finalHobInvitados')));
            }
            if (localStorage.getItem('totalAmount') && localStorage.getItem('totalAmount') !== 'null') {
                setTotalAmount(localStorage.getItem('totalAmount'));
                setTotalAmountString(numberToString(localStorage.getItem('totalAmount')));
            }
        }
    }

    const changeToPaypal = () => {
        setMethodPay(false);
        setCurrencyTypeString('USD');
        if (currencyType) { // TO USD
            if (guestsStatus) {
                setFinalEntradaInvitados((finalEntradaInvitados / 15000) * 20)
                setFinalEntradaInvitadosString((finalEntradaInvitados / 15000) * 20)
            //     setInputs({
            //         ...inputs,
            //         hob: (inputs.hob / 60000) * 70,
            //         hobString: (inputs.hob / 60000) * 70
            //     });
            //     setFinalHobInvitados((finalHobInvitados / 60000) * 70)
            //     setFinalHobInvitadosString((finalHobInvitados / 60000) * 70)
            //     setTotalAmount(((finalEntradaInvitados / 15000) * 20) + ((inputs.hob / 60000) * 70) + ((finalHobInvitados / 60000) * 70) + 20)
            //     setTotalAmountString(numberToString(((finalEntradaInvitados / 15000) * 20) + ((inputs.hob / 60000) * 70) + ((finalHobInvitados / 60000) * 70) + 20))
                   setInputs({
                       ...inputs, 
                       hob: 0,
                       hobString: 0
                   }) 
                   setFinalHobInvitados(0);
                   setFinalHobInvitadosString(0)
                   setTotalAmount(((finalEntradaInvitados/15000) * 20 ) + 20 )
                   setTotalAmountString(numberToString(((finalEntradaInvitados/15000) * 20 ) + 20))
            } else {
                // setInputs({
                //     ...inputs,
                //     hob: (inputs.hob / 60000) * 70,
                //     hobString: (inputs.hob / 60000) * 70
                // });
                // setTotalAmount(((inputs.hob / 60000) * 70) + 20)
                // setTotalAmountString(numberToString(((inputs.hob / 60000) * 70) + 20))
                setInputs({
                    ...inputs, 
                    hob: 0,
                    hobString: 0
                }) 
                setTotalAmount(((finalEntradaInvitados/15000) * 20 ) + 20 )
                setTotalAmountString(numberToString(((finalEntradaInvitados/15000) * 20 ) + 20))

            }
        } else {
            setInputs({
                ...inputs,
                hob: parseInt(localStorage.getItem('hob')),
                hobString: localStorage.getItem('hobString')
            });
            if (localStorage.getItem('finalEntradaInvitados') && localStorage.getItem('finalEntradaInvitados') !== 'null') {
                setFinalEntradaInvitados(localStorage.getItem('finalEntradaInvitados'));
                setFinalEntradaInvitadosString(numberToString(localStorage.getItem('finalEntradaInvitados')));
            }
            if (localStorage.getItem('finalHobInvitados') && localStorage.getItem('finalHobInvitados') !== 'null') {
                setFinalHobInvitados(localStorage.getItem('finalHobInvitados'));
                setFinalHobInvitadosString(numberToString(localStorage.getItem('finalHobInvitados')));
            }
            if (localStorage.getItem('totalAmount') && localStorage.getItem('totalAmount') !== 'null') {
                setTotalAmount(localStorage.getItem('totalAmount'));
                setTotalAmountString(numberToString(localStorage.getItem('totalAmount')));
            }
        }
    }

    const pay = async () => {
        setLoading(true);
        if (methodPay) {
            if (!guestsStatus) {
                const data = {
                    fullName: inputs.fullName,
                    email: inputs.email,
                    phone: inputs.phone,
                    rut: inputs.rut,
                    region: inputs.region,
                    commune: inputs.commune,
                    adress: inputs.adress,
                    hobExperience: inputs.hobValue,
                    quantityHobExperience: (inputs.hob / 60000),
                    communeHobExperience: inputs.communeHob,
                    guest: null,
                    totalPayment: totalAmountString,
                    totalTickets: '15.000',
                    totalHob: inputs.hobString,
                    signUpTime: moment().format('lll'),
                    payId: uuid()
                }
                const result = await signUpApi(data);
                if (result.ok) {
                    const payData = {
                        amount: totalAmount,
                        code: result.user.code
                    }
                    const resultPay = await MakePaymentApi(payData);
                    if (resultPay.status !== 200) {
                        notification["error"]({
                            message: resultPay.message
                        });
                        setLoading(false);
                    } else {
                        setLoading(false);
                        window.location.href = resultPay.response.payUrl[1].url;
                    }
                } else {
                    notification['error']({
                        message: result.message
                    });
                    setLoading(false);
                }
            } else {
                var payIdAux = uuid();
                const data = {
                    fullName: inputs.fullName,
                    email: inputs.email,
                    phone: inputs.phone,
                    rut: inputs.rut,
                    region: inputs.region,
                    commune: inputs.commune,
                    adress: inputs.adress,
                    hobExperience: inputs.hobValue,
                    quantityHobExperience: (inputs.hob / 60000),
                    communeHobExperience: inputs.communeHob,
                    guest: null,
                    totalPayment: totalAmountString,
                    totalTickets: (numberToString(parseInt(finalEntradaInvitados) + 15000)),
                    totalHob: (numberToString(inputs.hob + parseInt(finalHobInvitados))),
                    signUpTime: moment().format('lll'),
                    payId: payIdAux
                }
                const firstResult = await signUpApi(data);
                if (firstResult.ok) {
                    var count = 0;
                    users.forEach(async item => {
                        var guestData = {
                            fullName: item.fullName,
                            email: item.email,
                            phone: item.phone,
                            rut: item.rut,
                            region: '',
                            commune: '',
                            adress: item.adress,
                            hobExperience: item.hobExperience,
                            quantityHobExperience: item.quantityHobExperience,
                            communeHobExperience: item.commune,
                            guest: firstResult.user._id,
                            totalPayment: '0',
                            totalTickets: '0',
                            totalHob: '0',
                            signUpTime: moment().format('lll'),
                            payId: payIdAux
                        }
                        const result = await signUpApi(guestData);
                        if (result.ok) {
                            count = count + 1;
                            makePay(count, result, firstResult);
                        }
                    })
                } else {
                    notification['error']({
                        message: firstResult.message
                    });
                    setLoading(false);
                }
            }
        } else {
            if (!guestsStatus) {
                const data = {
                    fullName: inputs.fullName,
                    email: inputs.email,
                    phone: inputs.phone,
                    rut: inputs.rut,
                    region: inputs.region,
                    commune: inputs.commune,
                    adress: inputs.adress,
                    hobExperience: inputs.hobValue,
                    quantityHobExperience: (inputs.hob / 70),
                    communeHobExperience: inputs.communeHob,
                    guest: null,
                    totalPayment: totalAmountString,
                    totalTickets: '20',
                    totalHob: (parseInt(inputs.hobString) + parseInt(finalHobInvitados)),
                    signUpTime: moment().format('lll'),
                    payId: uuid()
                }
                const result = await signUpApi(data);
                if (result.ok) {
                    const payData = {
                        amount: totalAmount,
                        code: result.user.code
                    }
                    const resultPay = await MakePaymentPaypalApi(payData);
                    if (resultPay.status !== 200) {
                        notification["error"]({
                            message: resultPay.message
                        });
                        setLoading(false);
                    } else {
                        setLoading(false);
                        window.location.href = resultPay.response[1].href;
                    }
                } else {
                    notification["error"]({
                        message: result.message
                    });
                    setLoading(false);
                }
            } else {
                var payIdAux2 = uuid();
                const data = {
                    fullName: inputs.fullName,
                    email: inputs.email,
                    phone: inputs.phone,
                    rut: inputs.rut,
                    region: inputs.region,
                    commune: inputs.commune,
                    adress: inputs.adress,
                    hobExperience: inputs.hobValue,
                    quantityHobExperience: (parseInt(inputs.hob) / 70),
                    communeHobExperience: inputs.communeHob,
                    guest: null,
                    totalPayment: totalAmountString,
                    totalTickets: (parseInt(finalEntradaInvitados) + 20),
                    totalHob: (parseInt(inputs.hobString) + parseInt(finalHobInvitados)),
                    signUpTime: moment().format('lll'),
                    payId: payIdAux2
                }
                const firstResult = await signUpApi(data);
                if (firstResult.ok) {
                    var count2 = 0;
                    users.forEach(async item => {
                        var guestData = {
                            fullName: item.fullName,
                            email: item.email,
                            phone: item.phone,
                            rut: item.rut,
                            region: '',
                            commune: '',
                            adress: item.adress,
                            hobExperience: item.hobExperience,
                            quantityHobExperience: item.quantityHobExperience,
                            communeHobExperience: item.hobExperience,
                            guest: firstResult.user._id,
                            totalPayment: '0',
                            totalTickets: '0',
                            totalHob: '0',
                            signUpTime: moment().format('lll'),
                            payId: payIdAux2
                        }
                        const result = await signUpApi(guestData);
                        if (result.ok) {
                            count2 = count2 + 1;
                            makePayPaypal(count2, result, firstResult, totalAmount);
                        } else {
                            notification['error']({
                                message: result.message
                            });
                            setLoading(false);
                        }
                    })
                } else {
                    notification['error']({
                        message: firstResult.message
                    });
                    setLoading(false);
                }
            }
        }
    }

    const makePay = async (count, result, firstResult) => {
        console.log(count)
        if (count === 1) {
            if (result.ok) {
                const payData = {
                    amount: totalAmount,
                    code: firstResult.user.code
                }
                const resultPay = await MakePaymentApi(payData);
                if (resultPay.status !== 200) {
                    notification["error"]({
                        message: resultPay.message
                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                    localStorage.clear();
                    window.location.href = resultPay.response.payUrl[1].url;
                }
            } else {
                notification['error']({
                    message: firstResult.message
                });
                setLoading(false);
            }
        }
    }

    const makePayPaypal = async (count2, result, firstResult, totalAmountUSD) => {
        console.log(count2)
        if (count2 === 1) {
            if (result.ok) {
                const payData = {
                    amount: totalAmountUSD,
                    code: firstResult.user.code
                }
                const resultPay = await MakePaymentPaypalApi(payData);
                if (resultPay.status !== 200) {
                    notification["error"]({
                        message: resultPay.message
                    });
                } else {
                    localStorage.clear();
                    window.location.href = resultPay.response[1].href;
                }
            } else {
                notification['error']({
                    message: firstResult.message
                });
            }
        }
    }

    const pagarPaypal = () =>{
        const formulario = $('#formPaypal').submit();
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    return (
        <Spin spinning={loading} size="large" indicator={antIcon}>
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
                            <div className="num">3</div>
                            <span>añadir invitados</span>
                        </div>
                        <div className="col">
                            <div className="num active">4</div>
                            <span>medio de pago</span>
                        </div>
                    </div>
                    <div className="datos">
                        <div className="campos">
                            <div className="mid">
                                <h3>Medio de pago</h3>
                                <div className="medios">
                                    <div className="md">
                                        <input type="radio" name="medio_pago" id="pagofacil" checked={methodPay} />
                                        <label htmlFor="pagofacil" onClick={() => changeToPagofacil()}><img src={pagofacil} alt="pagofacil" className="pagoFacil"/></label>
                                    </div>
                                    <div className="md">
                                        <input type="radio" name="medio_pago" id="paypal"  checked={!methodPay} />
                                        <label htmlFor="paypal" onClick={() => changeToPaypal()}>
                                            <img src={paypal} alt="paypal" className="paypal"/>
                                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" id="formPaypal" >
                                                <input type="hidden" name="charset" value="utf-8"/>
                                                <input type="hidden" name="cmd" value="_xclick"/>
                                                <input type="hidden" name="business" value="KF7U8S9XEPUNQ"/>
                                                <input type="hidden" name="item_name" value="Entrada general"/>
                                                {/* <input type="hidden" name="amount" value={totalAmountString}/> */}
                                                <input type="hidden" name="amount" value='1.00'/>
                                                <input type="hidden" name="currency_code" value="USD"/>
                                                {/* <input type="hidden" name="return" value="https://fundacionbelen2000.cl/index.php/donaciones-muchas-gracias"/> */}
                                                <input type="hidden" name="return" value="https://maklube.upwebinar.cl/confirmacion"/>
                                                {/* <input type="hidden" name="notify_url" value="http://demowp.0101.cl/?wp_paypal_ipn=1"/> */}
                                                <input type="hidden" name="notify_url" value="https://maklube.upwebinar.cl/confirmacion"/>
                                                <input type="hidden" name="bn" value="WPPayPal_BuyNow_WPS_US"/>
                                                {/* <input type="image" src={paypal} border="0" name="submit"/> */}
                                            </form>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mid">
                                <h3>Resumen del pedido</h3>
                                <div className="resumen">
                                {/* {methodPay ? 
                                    <> */}
                                        {guestsStatus ?
                                            <>
                                                <div className="lines">
                                                    {currencyTypeString === 'CLP' ?
                                                        <div className="line">Entrada Chile <span>$15.000</span></div>
                                                    :
                                                        <div className="line">Entrada Otros países <span>$20</span></div>
                                                    }
                                                    {ticketStatus ? <div className="line">Entrada Chile (Invitados)<span>${finalEntradaInvitadosString}</span></div> : <span></span>}
                                                    
                                                    { ( inputs.hobValue && currencyTypeString==='CLP') ? <div className="line">Caja gastronómica (Titular)<span>${inputs.hobString}</span></div> : <span></span>}
                                                    { ( usersHobStatus && currencyTypeString==='CLP' ) ? <div className="line">Caja gastronómica (Invitados)<span>${finalHobInvitadosString}</span></div> : <span></span>} 
                                                   
                                                </div>
                                                <div className="total">Total <span>${totalAmountString}</span></div>
                                                <div className="btns">
                                                    { methodPay
                                                        ?<span onClick={() => pay()} className="btn center">Pagar</span>
                                                        :<span onClick={() => pagarPaypal()} className="btn center">Pagar</span> 
                                                    }
                                                </div>
                                            </> :
                                            <>
                                                <div className="lines">
                                                    {currencyTypeString === 'CLP' ?
                                                        <div className="line">Entrada Chile <span>$15.000</span></div>
                                                    :
                                                        <div className="line">Entrada Otros países <span>$20</span></div>
                                                    }
                                                    {
                                                        (inputs.hobValue && currencyTypeString==='CLP')
                                                            ? <div className="line">Caja gastronómica<span>${inputs.hobString}</span></div> 
                                                            : <span></span>
                                                    }
                                                    {
                                                        (usersHobStatus && currencyTypeString==='CLP' && finalHobInvitadosString )
                                                            ? <div className="line">Caja gastronómica (Invitados)<span>${finalHobInvitadosString}</span></div> 
                                                            : <span></span>
                                                    }
                                               
                                                </div>
                                                <div className="total">Total <span>${totalAmountString}</span></div>
                                                <div className="btns">
                                                    { methodPay
                                                        ?<span onClick={() => pay()} className="btn center">Pagar</span>
                                                        :<span onClick={() => pagarPaypal()} className="btn center">Pagar</span> 
                                                    }
                                                </div>
                                            </>
                                        }
                                    {/* </> : */}
                                    {/* <>
                                        {guestsStatus ?
                                            <>
                                                <div className="lines">
                                                    {currencyType ?
                                                        <div className="line">Entrada Chile <span>$15.000</span></div>
                                                    :
                                                        <div className="line">Entrada Otros países <span>$20</span></div>
                                                    }
                                                    {ticketStatus ? <div className="line">Entrada Chile (Invitados)<span>${finalEntradaInvitadosUSD}</span></div> : <span></span>}
                                                    {inputs.hobValue ? <div className="line">Expriencia gastronómica (Titular)<span>${hobTitularUSD}</span></div> : <span></span>}
                                                    {usersHobStatus ? <div className="line">Expriencia gastronómica (Invitados)<span>${finalHobInvitadosUSD}</span></div> : <span></span>}
                                                </div>
                                                <div className="total">Total <span>${totalAmountUSD}</span></div>
                                                <div className="btns">
                                                    <span onClick={() => pay()} className="btn center">Pagar</span>
                                                </div>
                                            </> :
                                            <>
                                                <div className="lines">
                                                    {currencyType ?
                                                        <div className="line">Entrada Chile <span>$15.000</span></div>
                                                    :
                                                        <div className="line">Entrada Otros países <span>$20</span></div>
                                                    }
                                                    {inputs.hobValue ? <div className="line">Expriencia gastronómica<span>${hobUSD}</span></div> : <span></span>}
                                                </div>
                                                <div className="total">Total <span>${totalAmountUSD}</span></div>
                                                <div className="btns">
                                                    <span onClick={() => pay()} className="btn center">Pagar</span>
                                                </div>
                                            </>
                                        }
                                    </> */}
                                {/* } */}
                                    
                                    
                                </div>
                            </div>
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

        </Spin>
    )
}