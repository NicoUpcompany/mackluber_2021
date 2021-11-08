import React, { useState, useEffect } from 'react';
import { Modal, notification, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import uuid from 'uuid/v4';

import { emailValidation, minLengthValidation, numberValidation } from '../../../utils/formValidation';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../utils/constants';
import { signInApi } from '../../../api/user';
import { getAccessTokenApi } from '../../../api/auth';
import pagofacil from '../../../assets/img/pagofacil2.png';
import paypal from '../../../assets/img/paypal.png';

import logo from '../../../assets/imagen/logoBelenColor.png';
import logo2 from '../../../assets/imagen/logoBelen.png';


import { MakeDonationApi, MakeDonationPaypalApi } from '../../../api/payment';

const Login = () => {
  const [inputs, setInputs] = useState({
    email: '',
    code: '',
    total: ''
  });
  const [formValid, setFormValid] = useState({
    email: false,
    code: false,
    total: false
  });
  const[ mensaje, setMensaje] = useState("");
  const[ open, setOpen] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(true);

  useEffect(() => {
    var token = getAccessTokenApi();
    if (token !== null) {
      var decodedToken = jwtDecode(token);
      if (decodedToken.fullName === 'Código de cortesía') {
        window.location.href = "/iniciarsesion2";
      } else {
        window.location.href = "/salaespera";
      }
    }
  }, []);

  useEffect(() => {
    var hash = window.location.hash;
    if (hash === '#modal') {
        setVisible(true);
    }
}, []);
     
  const inputValidation = e => {
      const { name } = e.target;

      if(name === "email") setFormValid({...formValid,[name]: emailValidation(e.target)});
        
      if(name === "code") setFormValid({...formValid,[name]: minLengthValidation(e.target, 2)});

      if(name === "fullName") setFormValid({...formValid,[name]: minLengthValidation(e.target, 2)});

      if(name === "total") setFormValid({...formValid,[name]: numberValidation(e.target)});
  };

  const changeForm = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
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

  const toShop = () => {
    window.location.href = "/ingresa-tus-datos";
  }
  
  const register = async () => {      
    if (  !inputs.email  ) {
      setMensaje("El Email es obligatorio");
      handleClick();
    } else if (!formValid.email ) {
      setMensaje("El email no es válido ");
      handleClick();
    } else {
      var data = {
        email: inputs.email,
        signInTime: moment().format('LLL')
      }
      const result = await signInApi(data);
      if (!result.ok) {
        setMensaje(result.message);
        handleClick();
      } else {
        const { accessToken, refreshToken } = result;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        localStorage.setItem('email',JSON.stringify(inputs.email));
        if (result.cortesiaCode) {
          window.location.href = "/iniciarsesion2";
        } else {
          window.location.href = "/salaespera";
        }
      }
    }
  };

  const makeDonation = async () => {
    setLoading(true);
    const emailVal = inputs.email;
    const totalVal = inputs.total;
    const emailFormVal = formValid.email;
    const totalFormVal = formValid.total;

    if ( !totalVal || !emailVal ) {
        notification['error']({
            message: "Correo y monto son campos obligatorios"
        });
        setLoading(false);
    } else if (!totalFormVal ) {
        notification['error']({
            message: "Monto no válido"
        });
        setLoading(false);
    } else if (!emailFormVal ) {
        notification['error']({
            message: "Correo no válido"
        });
        setLoading(false);
    } else {
        if (parseInt(totalVal) < 1000 && paymentMethod) {
            notification['error']({
                message: "El monto mínimo en CLP es de $1.000"
            });
            setLoading(false);
        } else {
            if (paymentMethod) {
                var data = {
                    amount: inputs.total,
                    email: inputs.email
                };
                var result = await MakeDonationApi(data);
                if (result.status !== 200) {
                    notification["error"]({
                        message: result.message
                    });
                    setLoading(false);
                } else {
                    window.location.href = result.response.payUrl[1].url;
                }
            } else {
                const payData = {
                    amount: inputs.total,
                    payId: uuid()
                }
                const resultPay = await MakeDonationPaypalApi(payData);
                if (resultPay.status !== 200) {
                    notification["error"]({
                        message: resultPay.message
                    });
                    setLoading(false);
                } else {
                    window.location.href = resultPay.response[1].href;
                }
            }
        }
    }
}

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  return ( 
    <>
      <div className="container2">
        <div className="row">
          <div className="column-1"></div>
          <div className="column-2">
            <div className="center">
              <div className="imagen i1">
                <img src={logo2} alt="logo"/>
              </div>
              <div className="prueba">
                <form onChange={changeForm}>
                  <div className="datos">
                    <h2>Ingresa mail registrado en tu compra</h2>      
                    {/* <span>Ticket entrada</span> */}
                  </div>    
                  <div className="campo">
                    <input 
                      id="email"
                      name="email"
                      label="Email" 
                      onChange={inputValidation}
                      value={inputs.email}
                      placeholder="Email"
                    />
                    <label>Email</label>
                  </div>
                  {/* <div className="campo">
                    <TextField 
                      id="code" 
                      name="code"
                      label="Ticket de entrada" 
                      onChange={inputValidation}
                      value={inputs.code}
                    />
                  </div> */}
                  <div className="campo">
                    <button type="button" onClick={() => register()}>Entrar al evento</button>
                  </div>
                  <div className="campo">
                    <button  type="button" onClick={() => toShop()} >Aún no he comprado mi entrada</button>
                  </div>
                  {/* <div className="campo">
                    <button  type="button" onClick={() => setVisible(true)}>Haz tu donación aquí</button>
                  </div> */}
                </form>
              </div>
              <div className="imagen i2">
                <img src={logo} alt="logo"/>
              </div>
            </div>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                {mensaje}
              </Alert>
            </Snackbar>
          </div>      
        </div>
      </div>
          <Modal
              title=""
              visible={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              cancelText=' Cancelar '
              okText=' Pagar '
          >
          <Spin spinning={loading} size="large" indicator={antIcon}>
              <div className="donacion">
                  <h1>Ingrese sus datos</h1>
                  <form onChange={changeForm}>
                      <div className="campo">
                          <Input
                              size="large"
                              type="email"
                              name="email"
                              onChange={inputValidation}
                              value={inputs.email}
                              placeholder="Correo electrónico" 
                          />
                      </div>
                      <div className="campo">
                          <Input 
                              size="large"
                              type="text"
                              name="total"
                              onChange={inputValidation}
                              value={inputs.total}
                              placeholder="Monto Total"
                          />
                      </div>
                  </form>
                  <div className="campo">
                      <div className="mid">
                          <span>
                              *El monto para PagoFácil debe ser CLP y para PayPal debe ser USD.
                          </span>
                              <h3>Medio de pago</h3>
                              <div className="medios">
                                  <div className="md">
                                      <input type="radio" name="medio_pago" id="pagofacil" checked={paymentMethod}  />
                                      <label onClick={() => setPaymentMethod(true)} htmlFor="pagofacil"><img src={pagofacil} alt="pagofacil" /></label>
                                  </div>
                                  <div className="md">
                                      <input type="radio" name="medio_pago" id="paypal"  checked={!paymentMethod} />
                                      <label onClick={() => setPaymentMethod(false)} htmlFor="paypal"><img src={paypal} alt="paypal" /></label>
                                  </div>
                              </div>
                      </div>
                  </div>
                  {/* <div className="botones">
                      <span className="btn" onClick={() => makeDonation()}>Donar</span>
                  </div> */}
              </div>
          </Spin>
      </Modal>
    </> 
  );
}
 
export default Login;