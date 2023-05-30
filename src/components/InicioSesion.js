import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../MyContext";
import styles from '../styles/InicioSesion.module.css'
import Darkrai from '../assets/img/Darkrai.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';


function InicioSesion() {
    const [inputs, setInputs] = useState({ correo: "", contraseña: "" });
    const [mensaje, setMensaje] = useState();
    const [loading, setLoading] = useState(false);
    const { setSesionIniciada } = useContext(MyContext);
    const navigate = useNavigate();
    const { correo, contraseña } = inputs;

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
        if (correo !== "" && contraseña !== "") {
            const Usuario = {
                correo,
                contraseña,
            };
            setLoading(true);
            await axios
                .post("http://localhost:3030/login", Usuario)
                .then((res) => {
                    const { data } = res;
                    setMensaje(data.mensaje);
                    setTimeout(() => {
                        setMensaje("");
                        localStorage.setItem('token', data?.usuario.token)
                        localStorage.setItem('id', data?.usuario.id)
                        navigate(`/InicialesPokeT`);
                        setSesionIniciada(true);
                    }, 1500);
                })
                .catch((error) => {
                    console.error(error);
                    setMensaje("Correo u contraseña incorrecta");
                    setTimeout(() => {
                        setMensaje("");
                    }, 1500);
                });
            setInputs({ correo: "", contraseña: "" });
            setLoading(false);
        }
    };
    return (
        <div className={styles.contBody}>
            <div className={styles.contInicioSesion}>
                <img src={Darkrai} alt="Darkrai" className={styles.img} />
                <div className={styles.contForm} data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                    <h2>¡Bienvenid@!</h2>
                    <form onSubmit={(e) => onSubmit(e)} className={styles.form}>
                        <div className="cont">
                            <div className="cont">
                                <label htmlFor="correo">Correo electrónico</label>
                                <input onChange={(e) => HandleChange(e)} value={correo}
                                    name="correo"
                                    id="correo"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    autoComplete="off"
                                    className={styles.input} />
                            </div>
                        </div>
                        <div className="cont">
                            <div className="cont">
                                <label htmlFor="contraseña">Contraseña</label>
                                <input onChange={(e) => HandleChange(e)}
                                    value={contraseña}
                                    name="contraseña"
                                    id="contraseña"
                                    type="password"
                                    placeholder="Contraseña..."
                                    autoComplete="off"
                                    className={styles.input} />
                            </div>
                        </div>
                        <div className={styles.contBtn} >
                        <button type="submit"  className={styles.btn}>{loading ? "Cargando..." : "Iniciar Sesión"}</button>
                        </div>
                        <div className={styles.paraRegistro}><p> ¿Aun no tienes cuenta?{" "}<b onClick={() => navigate("/RegistroPokeT")}>¡Registrate!</b></p>
                        </div>
                    </form>
                    {mensaje && <div className={styles.mensaje}>{mensaje}</div>}
                </div>
            </div>
        </div>
    );
}


export default InicioSesion;


