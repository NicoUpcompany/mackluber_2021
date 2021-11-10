import React, { useState, useEffect } from "react";
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';

import { getAccessTokenApi } from '../../api/auth';
import { makeQuestionApi } from '../../api/question';
import { LoginOutlined } from '@ant-design/icons'
import { signOutApi, updateStreamApi } from '../../api/user';

// import agrosuper from '../../assets/img/agrosuper.png'
// import cd from '../../assets/img/CyD.png'
// import lipigas from '../../assets/img/lipigas.png'
// import sancristobal from '../../assets/img/sancristobal.png'
// import sqm from '../../assets/img/sqm.png'
// import pf from '../../assets/img/pf.png'
// import up from '../../assets/img/up3.png'
//import Slider from "react-slick";
import Donacion from './Donacion';

import a1 from '../../assets/img/a1.jpg';
import a2 from '../../assets/img/a2.jpg';
import a3 from '../../assets/img/a3.jpg';
import a4 from '../../assets/img/a4.jpg';
import a5 from '../../assets/img/a1.jpg';
import a6 from '../../assets/img/a5.jpg';
import a7 from '../../assets/img/a6.jpg';
import a8 from '../../assets/img/a7.jpg';
import a9 from '../../assets/img/a1.jpg';
import a10 from '../../assets/img/a8.jpg';
import a11 from '../../assets/img/a9.jpg';
import a12 from '../../assets/img/a10.jpg';
import { useHistory } from "react-router";
// import a7 from '../../assets/img/a7.jpg';
// import a8 from '../../assets/img/a8.jpg';
// import a9 from '../../assets/img/a9.jpg';
// import a10 from '../../assets/img/a10.jpg';
// import a11 from '../../assets/img/a11.jpg';
// import a12 from '../../assets/img/a12.jpg';
// import a13 from '../../assets/img/a13.jpg';

import belen from '../../assets/imagen/logoBelenColor.png';
import macklube from '../../assets/imagen/logoBelen.png';

moment.locale();

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Streaming = () => {

    const [user, setUser] = useState(null);
    const [question, setQuestion] = useState('');
    const [mensaje, setMensaje] = useState("");
    const [mensaje2, setMensaje2] = useState("");
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const history = useHistory();

    const changeInput = e => {
        setQuestion(e.target.value)
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClick2 = () => {
        setOpen2(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClose2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen2(false);
    }
    useEffect(() => {
        var token = getAccessTokenApi();
        if (token !== null) {
            var decodedToken = jwtDecode(token);
            setUser(decodedToken);
            const data = {
                code: decodedToken.code,
                streamTime: moment().format('LLL')
            }
            updateStreamApi(token, data);
        } else {
            window.location.href = "/iniciarsesion";
        }

        var time
        $(function () {
            var veces = 0;
            time = setInterval(function () {
                veces++;
                if (veces === 3) {
                    $('.img1').fadeOut('fast', function () {
                        $('.img2').fadeIn('fast');
                    });
                }
                if (veces === 6) { // BCI
                    $('.img2').fadeOut('fast', function () {
                        $('.img3').fadeIn('fast');
                    });
                }
                if (veces === 9) {
                    $('.img3').fadeOut('fast', function () {
                        $('.img4').fadeIn('fast');
                    });
                }
                if (veces === 12) {
                    $('.img4').fadeOut('fast', function () {
                        $('.img5').fadeIn('fast');
                    });
                }
                if (veces === 15) { // BCI
                    $('.img5').fadeOut('fast', function () {
                        $('.img6').fadeIn('fast');
                    });
                }
                if (veces === 18) {
                    $('.img6').fadeOut('fast', function () {
                        $('.img7').fadeIn('fast');
                    });
                }
                if (veces === 21) {
                    $('.img7').fadeOut('fast', function () {
                        $('.img8').fadeIn('fast');
                    });
                }
                if (veces === 24) {
                    $('.img8').fadeOut('fast', function () {
                        $('.img9').fadeIn('fast');
                    });
                }
                if (veces === 27) {
                    $('.img9').fadeOut('fast', function () {
                        $('.img10').fadeIn('fast');
                    });
                }
                if (veces === 30) {
                    $('.img10').fadeOut('fast', function () {
                        $('.img11').fadeIn('fast');
                    });
                }
                if (veces === 33) {
                    $('.img11').fadeOut('fast', function () {
                        $('.img12').fadeIn('fast');
                    });
                }
                if (veces === 36) {
                    $('.img12').fadeOut('fast', function () {
                        $('.img1').fadeIn('fast');
                    });
                    veces = 0;
                }

            }, 60000);
            //}, 1000);
        });
        return () => clearInterval(time);
    }, []);

    const sendQuestion = async () => {
        const data = {
            name: user.fullName,
            userQuestion: question
        }
        if (question.trim().length > 0) {
            const result = await makeQuestionApi(getAccessTokenApi(), data);
            if (result.status !== 200) {
                setMensaje(result.message);
                handleClick();
            } else {
                setMensaje2(result.message);
                handleClick2();
                setQuestion('');
            }
        } else {
            setMensaje('Ingresa una pregunta');
            handleClick();
        }
    }

    const handleClick3 = () => {
        var doc = document.getElementById('popupDonacion');
        doc.style.right = '0px';
        doc.style.transitionDuration = '1s';
    }

    const salir = async () => {
        const data = {
            email: JSON.parse(localStorage.getItem('email'))
        }
        await signOutApi(data);
        localStorage.clear();
        history.push('/iniciarsesion');
    }

    
    return (
        <>
            <div className="contenedor2">
                <div className='donacion-header'>
                    <img src={macklube} alt="maklube" width="140"/>
                    <img src={belen} alt="belen"  width="140"/>
                </div>
                <div className="webinar">
                    <div className="column-1">
                        <div className="videoWebinar">
                            <iframe src="https://player.vimeo.com/video/644539659?h=b36b88e1d9" width="100%" height="auto" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                        </div>
                        <div className="botones">
                            <div className="donacion">
                                <a onClick={handleClick3}>IR A <strong>DONAR</strong></a>
                            </div>
                            <div className="pregunta">
                                <a onClick={sendQuestion}>ENVIAR <strong>SALUDO</strong></a>
                                <input
                                    type="text"
                                    onChange={changeInput}
                                    value={question}
                                    placeholder="Escribe tu saludo"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="column-2" >

                        <div className="auspiciadores">
                        
                            <LoginOutlined className='logout' onClick={salir} 
                                style={{ fontSize: '20px', textAlign:'center', marginTop:'20px', marginLeft:'50%' }} 
                            />
                            <h2>Nuestros<br />Auspiciadores</h2>

                            <div className="imgs">
                                <div className="img img1"><img src={a1} alt="a1" /></div>
                                <div className="img img2"><img src={a2} alt="a2" /></div>
                                <div className="img img3"><img src={a3} alt="a3" /></div>
                                <div className="img img4"><img src={a4} alt="a4" /></div>
                                <div className="img img5"><img src={a5} alt="a5" /></div>
                                <div className="img img6"><img src={a6} alt="a6" /></div>
                                <div className="img img7"><img src={a7} alt="a7" /></div>
                                <div className="img img8"><img src={a8} alt="a8" /></div>
                                <div className="img img9"><img src={a9} alt="a9" /></div>
                                <div className="img img10"><img src={a10} alt="a10" /></div>
                                <div className="img img11"><img src={a11} alt="a11" /></div>
                                <div className="img img12"><img src={a12} alt="a12" /></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Donacion />
            </div>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">{mensaje}</Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open2} autoHideDuration={6000} onClose={handleClose2}>
                <Alert onClose={handleClose2} severity="success">{mensaje2}</Alert>
            </Snackbar>
        </>
    );
}

export default Streaming;