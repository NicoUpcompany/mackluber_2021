import React, { useEffect, useState } from 'react'
import belen from '../../assets/imagen/logoBelenColor.png';
import macklube from '../../assets/imagen/logoBelen.png';
import jwtDecode from 'jwt-decode';
import uuid from 'uuid/v4';
import { notification, Spin } from 'antd';
import { getAccessTokenApi } from '../../api/auth';
import { signUpApi } from '../../api/user';
import { MakePaymentApi, MakePaymentPaypalApi } from '../../api/payment';
import moment from 'moment';
import $ from 'jquery';
import './donacion.css';
import { LoadingOutlined } from '@ant-design/icons';
import CurrencyFormat from 'react-currency-format';

moment.locale();

export const Donation = () => {
    
    const [amountState, setAmountState] = useState();
    const [email, setEmail] = useState();
    const [mensaje, setMensaje] = useState("");
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(true);
    const [loading, setLoading] = useState(false);
    const [payIdAux2, setpayIdAux2] = useState(0);

    useEffect(() => {
        if (payIdAux2 === 0) {
            setpayIdAux2(uuid());
        }
    }, [payIdAux2])

    const changeForm = e => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else {
            setAmountState(e.target.value);
        }
    };

    // const makeFormPay = async () => {
    //     var token = getAccessTokenApi();
    //     var decodedToken = jwtDecode(token);
    //     var userEmail = decodedToken.email;
    //     if (isNaN(amountState)) {
    //         setMensaje("Ingrese un monto correcto");
    //         handleClick();
    //     } else {
    //         if (paymentMethod) {
    //             if (parseInt(amountState) < 1000) {
    //                 setMensaje("El monto mínimo en CLP es de $1.000");
    //                 handleClick();
    //             } else {
    //                 var data = {
    //                     amount: amountState,
    //                     email: userEmail
    //                 };
    //                 var result = await MakeDonationApi(data);
    //                 if (result.status !== 200) {
    //                     setMensaje(result.message);
    //                     handleClick();
    //                 } else {
    //                     window.open(result.response.payUrl[1].url, '_blank');
    //                 }
    //             }
    //         } else {
    //             const payData = {
    //                 amount: amountState,
    //                 payId: uuid()
    //             }
    //             const resultPay = await MakeDonationPaypalApi(payData);
    //             if (resultPay.status !== 200) {
    //                 setMensaje(resultPay.message);
    //                 handleClick();
    //             } else {
    //                 window.open(resultPay.response[1].href, '_blank');
    //             }
    //         }
    //     }
    // };

    //Donación
    const pay = async () => {

        if (email == '') {
            notification['error']({
                message: 'El correo es necesario'
            })

            return false;
        }

        setLoading(true);
        if (paymentMethod) {
            const data = {
                email: email,
                totalPayment: amountState,
                signUpTime: moment().format('lll'),
                payId: uuid()
            }
            const result = await signUpApi(data);
            if (result.ok) {
                const payData = {
                    amount: amountState,
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
            const data = {
                email: email,
                totalPayment: amountState,
                signUpTime: moment().format('lll'),
                payId: uuid()
            }
            const result = await signUpApi(data);
            if (result.ok) {
                const payData = {
                    amount: amountState,
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
        }
    }

    const makePay = async (count, result, firstResult) => {
        console.log(count)
        if (count === 1) {
            if (result.ok) {
                const payData = {
                    amount: amountState,
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

    const pagarPaypal = async () => {

        setLoading(true);
        const data = {
            email: email,
            totalPayment: amountState,
            signUpTime: moment().format('lll'),
            payId: payIdAux2
        }
        const result = await signUpApi(data);
        if (result.ok) {
            const payData = {
                amount: amountState,
                code: result.user.code
            }
            const resultPay = await MakePaymentPaypalApi(payData);
            if (resultPay.status !== 200) {
                notification["error"]({
                    message: resultPay.message
                });
                setLoading(false);
            } else {

                //window.location.href = resultPay.response[1].href;
                console.log("IR A PAYPAL2");
                const formulario = $('#formPaypal').submit();
                setLoading(false);
            }
        } else {
            notification["error"]({
                message: result.message
            });
            setLoading(false);
        }


    }

    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;


    return (
        <Spin spinning={loading} size="large" indicator={antIcon}>
            <div className='container-donacion'>
                <div className="contenedor-sm">
                    <div className='donacion-header'>
                        <img src={macklube} alt="maklube" width="200"/>
                        <img src={belen} alt="belen"  width="180"/>
                    </div>

                    <form onSubmit={pay}>
                        <div className="row1">
                            <div className="campo  form-donacion">
                                <div className="in">
                                    <input type="radio" id="donacion4" for="labelwey" checked={paymentMethod} onClick={() => setPaymentMethod(true)} name="donacion" />
                                    <label htmlFor="donacion4" id="labelwey" onClick={() => setPaymentMethod(true)} >Pago Fácil (CLP)</label>
                                    <div className="centro"></div>
                                </div>
                                <div className="in">
                                    <input type="radio" id="donacion5" for="labelwey2" checked={!paymentMethod} onClick={() => setPaymentMethod(false)} name="donacion" />
                                    <label htmlFor="donacion5" id="labelwey2" onClick={() => setPaymentMethod(false)} >PayPal (USD)</label>
                                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" id="formPaypal" >
                                        <input type="hidden" name="charset" value="utf-8" />
                                        <input type="hidden" name="cmd" value="_xclick" />
                                        <input type="hidden" name="business" value="KF7U8S9XEPUNQ" />
                                        <input type="hidden" name="item_name" value="Entrada general" />
                                        <input type="hidden" name="amount" value={amountState} />
                                        {/* <input type="hidden" name="amount" value='1.00'/>*/}
                                        <input type="hidden" name="currency_code" value="USD" />
                                        {/* <input type="hidden" name="return" value="https://fundacionbelen2000.cl/index.php/donaciones-muchas-gracias"/> */}
                                        <input type="hidden" name="return" value={`https://maklube.upwebinar.cl/api/v1/catch-donation-paypal/${payIdAux2}`} />
                                        <input type="hidden" name="notify_url" value="http://demowp.0101.cl/?wp_paypal_ipn=1" />
                                        {/* <input type="hidden" name="notify_url" value="https://maklube.upwebinar.cl/confirmacion"/> */}
                                        <input type="hidden" name="bn" value="WPPayPal_BuyNow_WPS_US" />
                                        {/* <input type="image" src={paypal} border="0" name="submit"/> */}
                                    </form>

                                    <div className="centro1"></div>
                                </div>
                                <div className="in">
                                    <input type="text" name="email" onChange={changeForm} value={email} placeholder="Ingresa Su email" style={{ marginBottom: '10px' }} />
                                </div>
                                <div className="in">
                                    <input type="text" name="amountState" onChange={changeForm} value={amountState} placeholder="Ingresa un monto" onKeyPress={(event)=>{if (!/[0-9]/.test(event.key)) { event.preventDefault(); }}} />
                                </div>
                            </div>
                            <div className="resumen">
                                <h1 className="tituloResumen">Resumen Pedido</h1>
                                <hr />
                                <div className="total">
                                    <strong className="left">Total</strong>
                                    <strong className="right"><CurrencyFormat value={amountState} displayType={'text'} thousandSeparator={true} prefix={'$'} /></strong>
                                </div>
                                <hr />
                                {
                                    paymentMethod ?
                                        <a onClick={pay}>Donar <strong>Ahora</strong> </a>
                                        : <a onClick={pagarPaypal}>Donar <strong>Ahora</strong> </a>
                                }
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </Spin>
    )
}
