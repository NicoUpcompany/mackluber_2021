import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import jwtDecode from 'jwt-decode';

import logo from '../../../assets/img/maklube2.png';
import logo2 from '../../../assets/img/auspiciadores.png';

import { emailValidation, minLengthValidation } from '../../../utils/formValidation';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../utils/constants';
import { updateCortesiaCode } from '../../../api/user';
import { getAccessTokenApi } from '../../../api/auth';

const Login2 = () => {
  const [inputs, setInputs] = useState({
    email: '',
    fullName: ''
  });
  const [formValid, setFormValid] = useState({
    email: false,
    fullName: false
  });
  const[mensaje, setMensaje] = useState("");
  const[open, setOpen] = useState("");
  const[user, setUser] = useState(null);
  const[tokenStorage, setToken] = useState(null);

  useEffect(() => {
    var token = getAccessTokenApi();
    if (token !== null) {
      setToken(token);
      var decodedToken = jwtDecode(token);
      if (decodedToken.fullName !== 'Código de cortesía') {
        window.location.href = "/salaespera";
      } else {
        setUser(decodedToken);
      }
    }
  }, []);
     
  const inputValidation = e => {
    const { name } = e.target;
    if(name === "email") setFormValid({...formValid,[name]: emailValidation(e.target)});
      
    if(name === "fullName") setFormValid({...formValid,[name]: minLengthValidation(e.target, 2)});
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
  
  const register = async () => {
    var data = {
      code: user.code,
      fullName: inputs.fullName,
      email: inputs.email
    }
    if ( !inputs.email || !inputs.fullName ) {
      setMensaje("Todos los campos son obligatorios");
      handleClick();
    } else if (!formValid.email ) {
      setMensaje("Correo no válido");
      handleClick();
    } else if (!formValid.fullName ) {
      setMensaje("Nombre no válido");
      handleClick();
    } else {
      const result = await updateCortesiaCode(tokenStorage, data);
      if (!result.ok) {
        setMensaje(result.message);
        handleClick();
      } else {
        const { accessToken, refreshToken } = result;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        window.location.href = "/salaespera";
      }
    }
  };

  return ( 
    <>
      <div className="container2">
        <div className="row">
          <div className="column-1"></div>
          <div className="column-2">
            <div className="imagen">
              <img src={logo} alt="logo" />
            </div>
            <div className="prueba">
              <form onChange={changeForm}>
                <div className="datos">
                  <h2>Ingresa al evento Maklube Fraterno</h2>      
                  <span>Completa tus datos</span>
                </div>    
                <div className="campo">
                  <TextField 
                    id="fullName"
                    name="fullName"
                    label="Nombre y Apellido" 
                    onChange={inputValidation}
                    value={inputs.fullName}
                  />
                </div>
                <div className="campo">
                  <TextField 
                    id="email"
                    name="email"
                    label="Email" 
                    onChange={inputValidation}
                    value={inputs.email} />
                </div>
                <div className="campo">
                  <button type="button" onClick={() => register()}>Entrar al evento</button>
                </div>
              </form>
            </div>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                {mensaje}
              </Alert>
            </Snackbar>
          </div>      
        </div>
        <div className="pie">
          <div className="blanco responsive">
            <img src={logo2} width="100%" height="auto" alt="3" />
          </div>
        </div>
      </div>
    </>
  );
}
 
export default Login2;