import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Modal, notification, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import uuid from 'uuid/v4';

import maklube from '../../assets/img/maklube.png';
import logoMaklube from '../../assets/imagen/logoBelen.png'
import logoBelen from '../../assets/imagen/logoBelenColor.png'
import hora from '../../assets/imagen/timer.png';
import belen from '../../assets/img/belen.png';
import au from '../../assets/img/auspiciadores.png';
import au_m from '../../assets/img/auspiciadores-m.png';
import pagofacil from '../../assets/img/pagofacil2.png';
import paypal from '../../assets/img/paypal.png';
import imgBoy from '../../assets/imagen/img1.png';

import { emailValidation, numberValidation } from '../../utils/formValidation';
import { MakeDonationApi, MakeDonationPaypalApi } from '../../api/payment';

export default function Welcome() {
    
    const [inputs, setInputs] = useState({
        total: '',
        email: ''
    });
    const [formValid, setFormValid] = useState({
        total: false,
        email: false
    });
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(true);

    useEffect(() => {
        var hash = window.location.hash;
        if (hash === '#modal') {
            setVisible(true);
        }
    }, []);

    const changeForm = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };

    const inputValidation = async e => {
        const { type, name } = e.target;

        if(type === "email") {
            setFormValid({
                ...formValid,
                [name]: emailValidation(e.target)
            });
        }

        if(type === "text") {
            setFormValid({
                ...formValid,
                [name]: numberValidation(e.target, 2)
            });
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
        } else if (!totalFormVal ) {
            notification['error']({
                message: "Monto no válido"
            });
        } else if (!emailFormVal ) {
            notification['error']({
                message: "Correo no válido"
            });
        } else {
            if (parseInt(totalVal) < 1000 && paymentMethod) {
                notification['error']({
                    message: "El monto mínimo en CLP es de $1.000"
                });
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
                    } else {
                        window.location.href = resultPay.response[1].href;
                    }
                }
            }
        }
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    return (
        <div className="bienvenida">
            <div className="cont">
                <div className="mid m">
                    <div className="middle">
                        <div className="maklube">
                            <img src={logoMaklube} alt="maklube" className="img1" />
                            <img src={logoBelen} alt="belen" className="img2"  />
                        </div>
                        <h3>¡Bienvenidos al Maklube 2021!</h3>
                        <p>
                        Estamos muy contentos de poder reunirnos nuevamente en la XVI edición de nuestro tradicional Maklube Fraterno
                            <strong> nuevamente vía streaming </strong>
                        </p>
                        <p>
                            Orgullosos de nuestro origen y de la generosidad que nos caracteriza
                            como comunidad, queremos invitarlos a estar presentes <strong>“Por los niños de Palestina” </strong>
                            y a compartir desde la comodidad de sus casas, nuestro evento solidario 
                            junto a grandes artistas e invitados. 
                        </p>
                        <p>
                        Extendemos esta invitación a toda la gente de regiones y fuera de Chile a unirse a nuestro Maklube 2021
                        </p>
                        <p>
                            <strong>¡Nos vemos!</strong>
                        </p>

                        <div className="hora">
                            <img src={hora} alt="hora" />
                        </div>
                        <p className="texto desktop">Auspician</p>
                    </div>
                </div>
                <div className="mid">
                    <div className="entrada">
                        <img
                            src={imgBoy}
                            className='imgBoy'
                        />
                        <Link to="/ingresa-tus-datos">
                            <span className="btn">Compra tu entrada aquí</span>
                        </Link>
                        {/* <img src={logoBelen} alt="belen" className="img2"/> */}
                        {/* <span className="btn" onClick={() => setVisible(true)}>Haz tu donación aquí</span> */}
                    </div>
                </div>
            </div>
            {/* Auspiciadores*/}
            <div className="auspiciadores">
                <img src={au} alt="au" className="tablet desktop" />
                {/* <img src={au_m} alt="au_m" className="movil" width="100%" /> */}
            </div>
            <div className='auspiciadores-m'>
                <img src={au_m} alt="au_m" className="movil" width="100%" />
            </div>
        </div>
        
    )
}