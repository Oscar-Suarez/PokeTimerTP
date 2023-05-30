import { useContext, useState,useEffect } from "react";
import { MyContext } from "../MyContext";
import { Link } from 'react-router-dom';
import styles from '../styles/Coleccion.module.css';
import color from '../styles/SeleccionPrincipal.module.css'
import axios from "axios";

function Coleccion() {
  const { setPokePrincipal, pokeSalvaje } = useContext(MyContext);
  const [orden, setOrden] = useState("");
  const [pokeSalvajeLocal, setPokeSalvajeLocal] = useState([...pokeSalvaje]);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPag = 8;
  const [tipoFiltro, setTipoFiltro] = useState("");
  const id = localStorage.getItem("id");
  const [coleccionPokes, setColeccionPokes] = useState([]);
  const ultimoIndice = paginaActual * itemsPorPag;
  const primerIndice = ultimoIndice - itemsPorPag;
  const itemsVisibles = pokeSalvajeLocal.slice(primerIndice, ultimoIndice);

  useEffect(() => {
    const traerPokes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/getPokemon?idUsuario=${id}`
        );
        const data = response.data;
        setColeccionPokes(data);
        setPokeSalvajeLocal(data);
      } catch (error) {
        console.error(error);
      }
    };
    traerPokes();
  }, [id]);
  
  //Función para seleccionar el pokémon principal que se usará en el cronómetro.
  const seleccionar = (pokemon) => {
    const pokeId = pokemon._id
    setPokePrincipal(pokemon);
    localStorage.setItem('pokeId', pokeId);
  };

  //Funciones para los botones
  const pagAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };
  const pagSiguiente = () => {
    const maxPags = Math.ceil(pokeSalvajeLocal.length / itemsPorPag);
    if (paginaActual < maxPags) {
      setPaginaActual(paginaActual + 1);
    }
  };

  



  //Función para traducir los tipos 
  const traduccionTipos = {
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

  // Función para filtrar los Pokémon por tipo
  const filtrarPorTipo = (tipo) => {
    setTipoFiltro(tipo);
    if (tipoFiltro) {
      const pokemonesFiltrados = coleccionPokes.filter((pokemon) => {
        const primerTipo = pokemon.tipos[0].type.name;
        return traduccionTipos[primerTipo].toLowerCase() === tipo.toLowerCase();
      });
      setPokeSalvajeLocal(pokemonesFiltrados);
    } else {
      setPokeSalvajeLocal([...pokeSalvaje]);
    }
    setPaginaActual(1);
  };
  const darEnter = (event) => {
    if (event.keyCode === 13) {
      filtrarPorTipo(event.target.value);
    }
  };
  
  // Función para ordenar los Pokémon por ID (de menor a mayor)
  const ordenarPorId = () => {
    setPokeSalvajeLocal([...pokeSalvajeLocal].sort((a, b) => a.id - b.id));
  };

  // Función para ordenar los Pokémon por la fecha de su último agregado (de más reciente a más antiguo)
  const ordenarPorUltimoAgregado = () => {
    setPokeSalvajeLocal([...coleccionPokes])
  };
  // Función para ordenar los Pokémon por tipo
  const ordenarPorTipo = () => {
    setPokeSalvajeLocal([...pokeSalvajeLocal].sort((a, b) => {
      const tipoA = a.tipos[0].type.name;
      const tipoB = b.tipos[0].type.name;
      return tipoA.localeCompare(tipoB);
    }));
  };

  // Función para ordenar los Pokémon alfabéticamente por nombre
  const ordenarAlfabeticamente = () => {
    setPokeSalvajeLocal([...pokeSalvajeLocal].sort((a, b) => {
      const nombreA = a.name.toUpperCase();
      const nombreB = b.name.toUpperCase();
      return nombreA.localeCompare(nombreB);
    }));
  };

  // Manejar el cambio de criterio de ordenación
  const cambiarOrden = (event) => {

    const criterio = event.target.value;
    setOrden(criterio);
    setPaginaActual(1);
    // Ordenar los Pokémon según el criterio seleccionado
    switch (criterio) {
      case "id":
        ordenarPorId();
        break;
      case "ultimoAgregado":
        ordenarPorUltimoAgregado();
        break;
      case "tipo":
        ordenarPorTipo();
        break;
      case "alfabetico":
        ordenarAlfabeticamente();
        break;
      default:
        break;
    }
  };
  return (
    <>

      <div className={styles.menu} key={10}>
        <h1 className={styles.ordenar}>Ordenar por:</h1>
        <select value={orden} onChange={cambiarOrden} className={styles.opciones} key={0}>
          <option value="ultimoAgregado" key={1}>Orden inicial</option>
          <option value="id" key={2}>ID</option>
          <option value="tipo" key={3}>Tipo</option>
          <option value="alfabetico" key={4}>Alfabéticamente</option>
          <option value="ultimoAgregado" key={5}>Reiniciar</option>
        </select>
      </div>
      <div className={styles.filtro}>
        <input type="text" id="filtro" className={styles.inputFiltro} onKeyDown={darEnter} />
        <button onClick={() => filtrarPorTipo(document.getElementById("filtro").value)} key={"filtro"} className={styles.filtroBtn}>Filtrar por tipo principal</button>
      </div>
      <div className={styles.contBtn}>
        <button onClick={pagAnterior} className={styles.pagbtn} key={"ba1"}>Anterior</button>
        <button onClick={pagSiguiente} className={styles.pagbtn} key={"ba2"}>Siguiente</button>
      </div>
      <div className={`${styles.container}`}>
        {itemsVisibles.map((coleccion, index) => (
          <div key={index}>
            <li className={`${color[`background-${coleccion.tipos[0].type.name}`]} ${styles.liCole} `}>
              <p className={`${color[`color-${coleccion.tipos[0].type.name}`]} ${styles.nameCole} `}>{coleccion.name.toUpperCase()}{" "}</p>
              <img src={coleccion.pixSprite} alt="" key={index} className={styles.imgCole} />
              <p className={`${styles[`${coleccion.tipos[0].type.name}`]} ${styles.colorGeneral}`}> PokeDex: #{coleccion.dex}</p>
              <p className={`${styles[`${coleccion.tipos[0].type.name}`]} ${styles.colorGeneral}`}>
                Tipo(s):
                {coleccion.tipos.map((type, index) => (
                  <span key={index} className={`${styles[`${coleccion.tipos[0].type.name}`]} ${styles.colorTipos}`}>
                    {traduccionTipos[type.type.name]}
                    {index < coleccion.tipos.length - 1 ? " /" : ""}
                  </span>
                ))}
              </p>
              <p className={`${styles[`${coleccion.tipos[0].type.name}`]} ${styles.colorGeneral}`}>nivel: {coleccion.nivel}</p>
              <Link to="/PerfilPokeT">
                <button onClick={() => seleccionar(coleccion)} className={`${color[`${coleccion.tipos[0].type.name}`]} ${styles.btnCole}`}>
                  Elegir como pokémon principal.
                </button>
              </Link>
            </li>
          </div>
        ))}
      </div>
      <div className={styles.contBtn2}>
        <button onClick={pagAnterior} className={styles.pagbtn2} key={"bb1"}>Anterior</button>
        <button onClick={pagSiguiente} className={styles.pagbtn2} key={"bb2"}>Siguiente</button>
      </div>

    </>
  );
}

export default Coleccion;




