import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../MyContext";
import styles from "../styles/AppBar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons";
import bl1 from "../assets/img/bl1.png";


function AppBar() {
  const { sesionIniciada, setSesionIniciada,pokePrincipal, setPokePrincipal } = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const cerrarSesion = () => {
    setSesionIniciada(false)
    localStorage.setItem('token', "")
    localStorage.setItem('id', "")
    setPokePrincipal("");
  }

  return (
    <nav className={`${styles.navbar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.navContainer}>
        {sesionIniciada ? (
          <Link to="/PerfilPokeT">
            <img alt="PokeTimer" className={styles.navImg} src={bl1} />
          </Link>
        ) : (
          <div className={styles.navLeft}>
            <Link to="/PokeTimerTP">
              <img alt="PokeTimer" className={styles.navImg} src={bl1} />
            </Link>
          </div>

        )}

        <ul className={styles.navLinks}>
          {sesionIniciada ? (

            pokePrincipal._id ? (
              <>
                <li>
                  <Link to="/PerfilPokeT" className={styles.a} onClick={handleCloseMenu}>
                    <h3>Perfil/Timer</h3>
                  </Link>
                </li>
                <li>
                  <Link to="/PokeSalvajePokeT" className={styles.a} onClick={handleCloseMenu}>
                    <h3>Pokémon salvaje</h3>
                  </Link>
                </li>
                <li>
                  <Link to="/ColecciónPokeT" className={styles.a} onClick={handleCloseMenu}>
                    <h3>Colección/Pokedex</h3>
                  </Link>
                </li>
                <li><Link to={"/PokeTimerTP"} className={styles.a} onClick={handleCloseMenu}>
                  <h5 onClick={cerrarSesion}>Cerrar Sesión</h5>
                </Link>
                </li>
              </>) : 
              
              (
              <>
                <li>
                  <Link to="/PokeSalvajePokeT" className={styles.a} onClick={handleCloseMenu}>
                    <h3>Pokémon salvaje</h3>
                  </Link>
                </li>
                <li>
                  <Link to="/ColecciónPokeT" className={styles.a} onClick={handleCloseMenu}>
                    <h3>Colección/Pokedex</h3>
                  </Link>
                </li>
                <li><Link to={"/PokeTimerTP"} className={styles.a} onClick={handleCloseMenu}>
                  <h5 onClick={cerrarSesion}>Cerrar Sesión</h5>
                </Link>
                </li>
              </>)
          ) : (
            <>
              <li>
                <Link to="/InicioSesionPokeT" className={styles.a} onClick={handleCloseMenu}>
                  <h3>Iniciar Sesión</h3>
                </Link>
              </li>
              <li>
                <Link to="/RegistroPokeT" className={styles.a} onClick={handleCloseMenu}>
                  <h3>Registrarse</h3>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className={styles.navToggle} onClick={handleToggle}>
          <IconContext.Provider value={{ className: styles.navIcon }}>
            {isOpen ? <FaTimes /> : <GiHamburgerMenu />}
          </IconContext.Provider>
        </div>
      </div>
    </nav>
  );
}

export default AppBar;