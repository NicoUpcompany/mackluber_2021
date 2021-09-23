import React from "react";

import belen from '../../../assets/img/belen.png';
import maklube from '../../../assets/img/maklube.png';

export default function Confirm() {

    return (
    	<>
            <div className="exito">
                <div className="contenedor">
                    <div className="dialog">
                        <div className="content">
                            <div className="mid">
                                <img src={maklube} alt="maklube" width="100%" />
                                <h3>¡Gracias por tu donación!</h3>
                            </div>
                            <div className="mid">
                                <p>
                                    ¡Gracias por tu donación!<br/>
                                </p>
                            </div>
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