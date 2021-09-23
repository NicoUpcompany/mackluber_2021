import React from "react";

import belen from '../../assets/img/belen.png';
import maklube from '../../assets/img/maklube.png';

export default function ErrorTrx() {

    return (
    	<>
            <div className="exito">
                <div className="contenedor">
                    <div className="dialog">
                        <div className="content">
                            <div className="mid">
                                <img src={maklube} alt="maklube" width="100%" />
                                <h3><br/><br/>Transacción rechazada</h3>
                            </div>
                            <div className="mid">
                                <p>
                                    Error en el ingreso de los datos de su tarjeta de crédito o Debito (fecha y/o código de seguridad).
                                </p>
                                <p>
                                    Su tarjeta de crédito o debito no cuenta con el cupo necesario para cancelar la compra.
                                </p>
                                <p>
                                    Tarjeta aún no habilitada en el sistema financiero.
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