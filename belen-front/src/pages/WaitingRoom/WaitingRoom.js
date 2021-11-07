import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

import { getTimeApi } from '../../api/stats';
import { getAccessTokenApi } from '../../api/auth';
import { updateWaitingRoomApi, signOutApi } from '../../api/user';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/imagen/logoBelen.png';
import logobelen from '../../assets/img/belenpop.png';
import logo2 from '../../assets/imagen/logoBelenColor.png';
import logos from '../../assets/img/auspiciadores.png';
import {LoginOutlined} from '@ant-design/icons'
moment.locale();

const WaitingRoom = () => {
    const [time, setTime] = useState(new Date().getTime());
    const [modal, setModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getTime();
    }, []);

    useEffect(() => {
        try {
            var token = getAccessTokenApi();
            if (token !== null) {
                var decodedToken = jwtDecode(token);
                const data = {
                    code: decodedToken.code,
                    waitingRoomTime: moment().format('LLL')
                }
                updateWaitingRoomApi(token, data);
            } else {
                //window.location.href = "/iniciarsesion";
            }
            var interval;
            $('.countdown').each(function(){
                var $this = $(this);
                //var date = "2020-08-27T09:00:00";
                // var countDownDate = new Date(2020, 10, 15, 9, 0, 0).getTime();
                var now = time;
                
                interval = setInterval(function() {
                    var date = "2021-11-10T21:00:00";
                    var countDownDate = new Date(date).getTime();
                    var distance = countDownDate - now;
                    var days_t = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours_t = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes_t = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds_t = Math.floor((distance % (1000 * 60)) / 1000);
        
                    var days, m1, m2, hours, minutes, seconds;
                    if(days_t < 10){
                        days = '0'+days_t;
                    }else{
                        m1 = String(days_t).substring(0, 1);
                        m2 = String(days_t).substring(1, 2);
                        days = m1+m2;
                    }
                    if(hours_t < 10){
                        hours = '0'+hours_t;
                    }else{
                        m1 = String(hours_t).substring(0, 1);
                        m2 = String(hours_t).substring(1, 2);
                        hours = m1+m2;
                    }
                    if(minutes_t < 10){
                        minutes = '0'+minutes_t;
                    }else{
                        m1 = String(minutes_t).substring(0, 1);
                        m2 = String(minutes_t).substring(1, 2);
                        minutes = m1+m2;
                    }
                    if(seconds_t < 10){
                        seconds = '0'+seconds_t;
                    }else{
                        m1 = String(seconds_t).substring(0, 1);
                        m2 = String(seconds_t).substring(1, 2);
                        seconds = m1+m2;
                    }
                    $this.empty();
                    if(countDownDate > now) {
                        if(days_t === 1){
                            $this.append("<div className='col'><h1>"+days+"</h1><span>Día</span></div>");
                            $this.append("<div className='col'><h1>"+hours+"</h1><span>Horas</span></div>");
                            $this.append("<div className='col'><h1>"+minutes+"</h1><span>Minutos</span></div>");
                        }else if(days_t > 0){
                            $this.append("<div className='col'><h1>"+days+"</h1><span>Días</span></div>");
                            $this.append("<div className='col'><h1>"+hours+"</h1><span>Horas</span></div>");
                            $this.append("<div className='col'><h1>"+minutes+"</h1><span>Minutos</span></div>");
                        }else {
                            $this.append("<div className='col'><h1>"+hours+"</h1><span>Horas</span></div>");
                            $this.append("<div className='col'><h1>"+minutes+"</h1><span>Minutos</span></div>");
                            $this.append("<div className='col'><h1>"+seconds+"</h1><span>Segundos</span></div>");
                        }
                    }else{
                        clearInterval(interval);
                        $this.append("<a href='streaming' class='btn'>Entrar al evento</a>");
                        setModal(true);
                    }
                    now = now + 1000;
                }, 1000);
            });
            return () => clearInterval(interval);
        } catch (error) {
            window.location.href = "/iniciarsesion";
        }
    }, [time]);

    const getTime = async () => {
        var result = await getTimeApi();
        setTime(result.time);
    }

    const salir = async() =>{
        const data ={
            email: JSON.parse(localStorage.getItem('email'))
        }
        await signOutApi(data);
        localStorage.clear();
        history.push('/iniciarsesion');
    }
    return ( 
        <>
            <div className="header">
                <div className="titulo">
                    <h2>EL EVENTO INICIA EN:</h2>
                    <LoginOutlined className='logout' onClick={salir} style={{fontSize:'20px'}}/>
                </div>
                <div className="rowSala">
                    <div className="logo1">
                        <img src={logo} alt="logo" width="100%" height="auto" />
                    </div>
                    <div className="cronometro">
                        <div className="countdown"></div>    
                    </div>
                    <div className="logo2">
                        <img src={logo2} alt="logo2" width="100%" height="auto" />
                    </div>
                </div>
            </div>
            <div className="streaming">
                <iframe src="https://player.vimeo.com/video/468522589?autoplay=1&loop=1" width="100%" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div> 
            <div className="sponsors">
                <div className="blanco">
                    <img src={logos} width="100%" height="auto" alt="3" />
                </div>
            </div> 
            {/*
            <div className="footer">
                <div className="belen">
                    <img src={belen} alt="belen" />
                </div>
                <div className="up">
                <img src={w} style={{justifySelf:'flex-end'}} alt="2" />
                </div>
            </div>
            */}
        {modal? 
            
            <div className="modal">
                <div className="flex">
                    <div className="contenidoModal">
                    <div className="botonPop">
                    <img className="logo" src={logo} /></div>
                    <div className="botonPop">
                    <a href="streaming" className="a">
                    <strong>Ingresar al Evento</strong>
                    </a>       
                    </div>  
                    <div className="botonPop">
                    <img className="logo" src={logobelen} /></div>
                    </div>
                </div>
            </div> :
            null
    }
        </> 
    );
}
 
export default WaitingRoom;