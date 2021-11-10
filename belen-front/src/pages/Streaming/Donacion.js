import React, { useState, useEffect } from 'react';
import salir from '../../assets/img/salir.png'
import jwtDecode from 'jwt-decode';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';
import uuid from 'uuid/v4';
import { notification, Spin } from 'antd';
import { getAccessTokenApi } from '../../api/auth';
import { MakeDonationApi, MakeDonationPaypalApi } from '../../api/payment';
import { MakePaymentApi, MakePaymentPaypalApi } from '../../api/payment';
import { getStatusApi } from '../../api/redirect';
import { useHistory } from 'react-router';
import $ from 'jquery';
import { signUpApi } from '../../api/user';
import CurrencyFormat from 'react-currency-format';


moment.locale();

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Donacion = () => {

    const [amountState, setAmountState] = useState();
    const [amountPuntoState, setAmountPuntoState] = useState();
    const [mensaje, setMensaje] = useState("");
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(true);
    const history = useHistory();
    const [texto, setTexto] = useState("<span>Tu donación permitirá entregar eduación a cientos de niños en Palestina.</span><span>Cada beca cubre <strong>Matrícula, Útiles escolares y desayuno. <br/></strong> Su valor anual es de <strong>$ 300.000</strong> por niño</span><span>La meta de esta noche es recaudar el dinero para <strong>120 becas completas</strong></span>")
    const [payIdAux2, setpayIdAux2] = useState(0);

    useEffect(() => {
        if (payIdAux2 === 0) {
            setpayIdAux2(uuid());
        }
    }, [payIdAux2])

    const changeForm = e => {
        setAmountState(e.target.value);
        setAmountPuntoState(e.target.value);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const status = async () => {
        const result = await getStatusApi();
        if (result.texto) {
            setTexto("<span><strong>Salud para Palestina</strong></span><span>Tu donación permitirá entregar <strong>un nuevo Cistoscopio al hospital de Belén</strong>.</span><span>Valor Cistoscopio: <br/>U$ 10.000 ($ 8.150.000)</span>")
        } else {
            setTexto("<span>Tu donación permitirá entregar eduación a cientos de niños en Palestina.</span><span>Cada beca cubre <strong>Matrícula, Útiles escolares y desayuno. <br/></strong> Su valor anual es de <strong>$ 300.000</strong> por niño</span><span>La meta de esta noche es recaudar el dinero para <strong>120 becas completas</strong></span>")
        }
    }

    useEffect(() => {
        let interval;
        interval = setInterval(function () {
            status();
        }, 60000)

        return () => clearInterval(interval);

    }, [])

    const makeFormPay = async () => {
        var token = getAccessTokenApi();
        var decodedToken = jwtDecode(token);
        var userEmail = decodedToken.email;
        if (isNaN(amountState)) {
            setMensaje("Ingrese un monto correcto");
            handleClick();
        } else {
            if (paymentMethod) {
                if (parseInt(amountState) < 1000) {
                    setMensaje("El monto mínimo en CLP es de $1.000");
                    handleClick();
                } else {
                    var data = {
                        amount: amountState,
                        email: userEmail
                    };
                    var result = await MakeDonationApi(data);
                    if (result.status !== 200) {
                        setMensaje(result.message);
                        handleClick();
                    } else {
                        window.open(result.response.payUrl[1].url, '_blank');
                    }
                }
            } else {
                const payData = {
                    amount: amountState,
                    payId: uuid()
                }
                const resultPay = await MakeDonationPaypalApi(payData);
                if (resultPay.status !== 200) {
                    setMensaje(resultPay.message);
                    handleClick();
                } else {
                    window.open(resultPay.response[1].href, '_blank');
                }
            }
        }
    };

    const closePopUp = () => {
        var doc = document.getElementById('popupDonacion');
        doc.style.right = '-320px';
        doc.style.transitionDuration = '1s';
    }


    const pagarPaypal = async () => {
        const data = {
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

            } else {
                //window.location.href = resultPay.response[1].href;
                console.log("IR A PAYPAL2");
                const formulario = $('#formPaypal').submit();
            }
        } else {
            notification["error"]({
                message: result.message
            });
        }


    }

    return (
        <>
            <div className="popUpDonacion" id="popupDonacion" >
                <div className="salir">
                    <img src={salir} alt="salir" onClick={closePopUp} />
                </div>
                <form onSubmit={makeFormPay}>
                    <div className="row1">
                        <h1>DONACIÓN</h1>
                        <div dangerouslySetInnerHTML={{ __html: texto }}></div>
                        <div className="campo alto">
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
                                <a onClick={makeFormPay}>Donar <strong>Ahora</strong> </a>
                                :<a onClick={pagarPaypal}>Donar <strong>Ahora</strong> </a>
                                
                            }
                        </div>

                    </div>
                </form>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">{mensaje}</Alert>
                </Snackbar>


            </div>
        </>
    );
}

export default Donacion;