import React from "react";
import belen from '../../assets/imagen/logoBelen.png';
import makluber from '../../assets/imagen/logo2Belen.png';
import img from '../../assets/imagen/img3.png';

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
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged..</p>
                        </div>
                </div>
                <div
                    className='banner-footer'
                >
                    <img src={belen} alt="belen"  />
                    <img src={makluber} alt="mackluber" />

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