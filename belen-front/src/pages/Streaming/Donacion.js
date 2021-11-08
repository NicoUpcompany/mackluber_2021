import React, { useState }  from 'react';
import salir from '../../assets/img/salir.png'
import jwtDecode from 'jwt-decode';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';
import uuid from 'uuid/v4';

import { getAccessTokenApi } from '../../api/auth';
import { MakeDonationApi, MakeDonationPaypalApi } from '../../api/payment';
moment.locale();

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Donacion = () => {

    const [amountState, setAmountState] = useState();
    const [mensaje, setMensaje] = useState("");
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(true);
    
    const changeForm = e => {
        setAmountState(e.target.value);
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
    return ( 
        <>
            <div className="popUpDonacion" id="popupDonacion" >
               
                <div className="salir">
                    <img src={salir} alt="salir" onClick={closePopUp} />
                </div>
                <form onSubmit={makeFormPay}>
                    <div className="row1">
                     <h1>DONACIÓN</h1>
                    <span>Tu donación permitirá entregar eduación a cientos de niños en Palestina.</span>

                    <span>Cada beca cubre <strong>Matrícula, Útiles escolares y desayuno. <br/></strong> Su valor anual es de <strong>$ 300.000</strong> por niño</span>
                    <span>La meta de esta noche es recaudar el dinero para <strong>120 becas completas</strong></span>
                    <div className="campo alto">
                        <div className="in">
                            <input type="radio" id="donacion4" for="labelwey" checked={paymentMethod} onClick={() => setPaymentMethod(true)}  name="donacion" />
                            <label htmlFor="donacion4" id="labelwey" onClick={() => setPaymentMethod(true)} >Pago Fácil (CLP)</label>
                            <div className="centro"></div>
                        </div>
                        <div className="in">
                            <input type="radio" id="donacion5" for="labelwey2" checked={!paymentMethod} onClick={() => setPaymentMethod(false)}   name="donacion" />
                            <label htmlFor="donacion5" id="labelwey2" onClick={() => setPaymentMethod(false)} >PayPal (USD)</label>
                            <div className="centro1"></div>
                        </div>
                        <div className="in">
                            <input type="text" name="amountState" onChange={changeForm} value={amountState} placeholder="Ingresa un monto" />
                        </div>
                    </div>
                    <div className="resumen">
                        <h1 className="tituloResumen">Resumen Pedido</h1>
                        <hr/>
                        <div className="total">
                            <strong className="left">Total</strong>
                            <strong className="right">${amountState}</strong>
                        </div>
                        <hr/>
                        <a onClick={makeFormPay}>Donar <strong>Ahora</strong> </a>
                    </div>

                    </div>
                </form>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">{mensaje}</Alert>
                </Snackbar>
                

            </div>
        </>
     );
}
 
export default Donacion;