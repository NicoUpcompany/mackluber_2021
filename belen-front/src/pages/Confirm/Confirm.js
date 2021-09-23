import React from "react";

import belen from '../../assets/img/belen.png';
import maklube from '../../assets/img/maklube.png';
import cal1 from '../../assets/img/cal1.png';
import cal2 from '../../assets/img/cal2.png';

export default function Confirm() {

    return (
    	<>
            <div className="exito">
                <div className="contenedor">
                    <div className="dialog">
                        <div className="content">
                            <div className="mid">
                                <img src={maklube} alt="maklube" width="100%" />
                                <h3>¡Gracias por tu adhesión!</h3>
                            </div>
                            <div className="mid">
                                <p>
                                    Los códigos de las entradas fueron<br/>
                                    enviados a tu correo.
                                </p>
                                <p>
                                    Recuerda conectarte 30 minutos antes.
                                </p>
                            </div>
                        </div>
                        <div className="t3">Agenda tu evento virtual, <strong>Maklube Fraterno 2020</strong></div>
                        <div className="btns">
                            <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Maklube%20Fraterno%202020&dates=20201016T000000Z%2F20201016T020000Z&details=https%3A%2F%2Fmaklube.upwebinar.cl&location=https%3A%2F%2Fmaklube.upwebinar.cl" target="_blank" rel="noopener noreferrer" className="btn"><img src={cal1} alt="cal1" /></a>
                            <a href="http://upwebinar.cl/mailing/maklube/maklube.ics" target="_blank" rel="noopener noreferrer" className="btn"><img src={cal2} alt="cal2" /></a>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="contenedor">
                    <img src={belen} alt="belen" width="150" />
                    <div className="Up">
                        <a href="https://upwebinar.cl/" target="_blank" rel="noopener noreferrer">
                            <img src="https://upwebinar.cl/img/up.min.svg" alt="upwebinar" width="14"/>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}