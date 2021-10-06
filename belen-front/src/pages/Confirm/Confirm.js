import React from "react";
import belen from '../../assets/imagen/logoBelenColor.png';
import makluber from '../../assets/imagen/logoBelen.png';
import img from '../../assets/imagen/img3.png';
import cal1 from '../../assets/img/cal1.png';
import cal2 from '../../assets/img/cal2.png';


export default function Confirm() {

    return (
    	<>
            <div className="exito">
                <div className="contenedor">
                        <img
                            src={img}
                            className='imgBoy2'
                        />
                        <div className='text'>
                            <h1>¡Gracias por su adhesión!</h1>
                            <p>Nos vemos el 10 de noviembre a las 21:00 hrs vía streaming. Recuerda conectarte a través de
                            <a href="www.maklube.cl" target="_blank"> www.maklube.cl </a>  ingresando el correo registrado. Te esperamos desde las 20:30 hrs
                            <strong> "Por los niños de Palestina".</strong>
                            <br/>
                            Nos vemos.
                            </p>
                        </div>

                        <div className="t3">Agenda tu evento virtual, <strong>Maklube Fraterno 2021</strong></div>
                        <div className="btns">
                            <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Maklube%20Fraterno%202021&dates=20211110T233000Z%2F20211110T263000Z&details=https%3A%2F%2Fmaklube.upwebinar.cl&location=https%3A%2F%2Fmaklube.upwebinar.cl" target="_blank" rel="noopener noreferrer" className="btn"><img src={cal1} alt="cal1" /></a>
                            <a href="http://upwebinar.cl/mailing/maklube/maklube.ics" target="_blank" rel="noopener noreferrer" className="btn"><img src={cal2} alt="cal2" /></a>
                        </div>
                </div>
                <div
                    className='banner-footer'
                >
                    <img src={makluber} alt="mackluber" />
                    <img src={belen} alt="belen"  />

                </div>
            </div>
            {/* <div className="footer">
                <div className="contenedor">
                    <div className="Up">
                        <a href="https://upwebinar.cl/" target="_blank" rel="noopener noreferrer">
                            <img src="https://upwebinar.cl/img/up.min.svg" alt="upwebinar" width="14"/>
                        </a>
                    </div>
                </div>
            </div> */}
        </>
    )
}