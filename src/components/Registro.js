import React, { useState, useEffect } from "react";
import styles from '../styles/Registro.module.css'
import Arca from '../assets/img/arca.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registro = () => {


    const [inputs, setInputs] = useState({
        correo: "",
        nombre: "",
        contraseña: "",
    });
    const [mensaje, setMensaje] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { nombre, contraseña, correo } = inputs;


    
useEffect(() => {
    AOS.init({
        duration: 1000,
    });
}, []);

    const HandleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (nombre !== "" && contraseña !== "" && correo !== "") {
            const Usuario = {
                nombre,
                correo,
                contraseña,
            };
            setLoading(true);
            await axios
                .post("http://localhost:3030/register", Usuario)
                .then((res) => {
                    const { data } = res;
                    setMensaje(data.mensaje);
                    setInputs({ nombre: "", contraseña: "", correo: "" });
                    setTimeout(() => {
                        setMensaje("");
                    }, 5500);
                })
                .catch((error) => {
                    console.error(error);
                    setMensaje("Hubo un error");
                    setTimeout(() => {
                        setMensaje("");
                    }, 1500);
                });

            setLoading(false);
        }
    };

    return (
        <div className={styles.contBody}>
            <div className={styles.contRegistro}>
            <div className={styles.contForm} data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine" >
            <form onSubmit={(e) => onSubmit(e)}>
                <h2 className={styles.h2}>¡Bienvenid@ al PokeTimer!</h2>
                    <div className={styles.form}>
                            <label htmlFor="nombre">Nombre de usuario: 
                            <input onChange={(e) => HandleChange(e)} required 
                                value={nombre}
                                name="nombre"
                                id="nombre"
                                type="text"
                                autoComplete="off"
                                className={styles.input}
                            /></label>
                            <label htmlFor="correo">Correo: 
                            <input onChange={(e) => HandleChange(e)} required 
                                value={correo}
                                name="correo"
                                id="correo"
                                type="email"
                                autoComplete="off"
                                className={styles.input}
                            /></label>
                            <label htmlFor="contraseña">Contraseña:
                            <input onChange={(e) => HandleChange(e)} required 
                                value={contraseña}
                                name="contraseña"
                                id="contraseña"
                                type="password"
                                autoComplete="off"
                                className={styles.input}
                            /></label>
                    </div>
                    <div className={styles.contBtn} >
                    <button type="submit" className={styles.btn}>
                        {loading ? "Cargando..." : "Registrarme"}
                    </button>
                    </div>
                    <p>
                        ¿Ya tienes una cuenta?{" "}
                        <b onClick={() => navigate("/InicioSesionPokeT")}>Inicia Sesión!</b>
                    </p>
                </form>
                {mensaje && <div className={styles.mensaje}>{mensaje}</div>}
                </div>

                <img src={Arca} alt="Arca" className={styles.img} />
            </div>
            
        </div>
    );
};

export default Registro;


