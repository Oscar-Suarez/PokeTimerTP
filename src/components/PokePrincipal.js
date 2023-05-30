import { useContext,useEffect } from "react";
import { MyContext } from "../MyContext";
import { Link } from 'react-router-dom';
import styles from '../styles/SeleccionPrincipal.module.css'
import Cronometro from "./Cronometro";
import axios from "axios";
import InicioSesion from "./InicioSesion";
import Iniciales from "./Iniciales";





function PokePrincipal() {
  const { pokePrincipal, setInicial, inicial } = useContext(MyContext);
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  


  useEffect(() => {
    const traerPokes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/getPokemon?idUsuario=${id}`
        );
          if(response.data.length > 0){
            setInicial(true);
          };

      } catch (error) {
        console.error(error);
      }
    };
    traerPokes();
  }, [id, setInicial]);
  

  const typesTranslations = {
    normal: "Normal",
    fighting: "Lucha",
    flying: "Volador",
    poison: "Veneno",
    ground: "Tierra",
    rock: "Roca",
    bug: "Bicho",
    ghost: "Fantasma",
    steel: "Acero",
    fire: "Fuego",
    water: "Agua",
    grass: "Planta",
    electric: "Eléctrico",
    psychic: "Psíquico",
    ice: "Hielo",
    dragon: "Dragón",
    dark: "Siniestro",
    fairy: "Hada",
  };




  /*LETRERO AL MOMENTO DE LLEGAR AL NIVEL 100*/
  if (pokePrincipal.nivel === 100) {
    return (
      <div className={styles.fondoKanto}>
      <div className={`${styles[`background-${pokePrincipal.tipos[0].type.name}`]} ${styles.background100}`}>
        <div className={styles.cont100}>
          {pokePrincipal.fullSprite && <img src={pokePrincipal.fullSprite} alt="Poke Principal" className={styles.imgPP100} />}
          <h1 className={`${styles[`color-${pokePrincipal.tipos[0].type.name}`]} ${styles.name100} `}>{pokePrincipal.name}</h1>
          {pokePrincipal.tipos.map((type, index) => (
            <span key={index} className={`${styles[type.type.name]} ${styles.tipoPP}`}>
              {typesTranslations[type.type.name]}
              {index < pokePrincipal.tipos.length - 1 ? "  " : ""}
            </span>
          ))}
        </div>
        <div className={styles.contCron100}>
          <Cronometro />
        </div>
      </div>
      </div>
    )
  }

  if (!token){
    return(
        <InicioSesion/>
    )
  }


  return (
    <div className={styles.fondoKanto}>
    <div className={styles.cont}>
      {pokePrincipal.name ? (
        <div className={`${styles[`background-${pokePrincipal.tipos[0].type.name}`]} ${styles.background}`}>
          <div className={styles.contPoke}>
            <div>
              {pokePrincipal.fullSprite && <img src={pokePrincipal.fullSprite} alt="Poke Principal" className={styles.imgPP} />}
            </div>
            <div className={styles.contInfo}>
              <h1 className={`${styles[`color-${pokePrincipal.tipos[0].type.name}`]} ${styles.name} `}>{pokePrincipal.name}</h1>
              <div className={styles.contTipos}>
                {pokePrincipal.tipos.map((type, index) => (
                  <span key={index} className={`${styles[type.type.name]} ${styles.tipoPP}`}>
                    {typesTranslations[type.type.name]}
                    {index < pokePrincipal.tipos.length - 1 ? "  " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.contCron}>
            <Cronometro />
          </div>

        </div>
      ) : (
        inicial === false ?
        ( <Iniciales/> ) : 
        (<div className={styles.contAColeccion}>
        <Link to="/ColecciónPokeT" ><button className={styles.aColeccion}><h2 className={styles.h2Coleccion}>Ir a la PokeDex</h2></button></Link>
        </div>)
      )}
    </div>
    </div>
  );



}

export default PokePrincipal;


