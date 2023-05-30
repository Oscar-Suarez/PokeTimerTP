import { useState, useEffect, useCallback, useContext } from "react";
import { MyContext } from "../MyContext";
import axios from 'axios';
import styles from '../styles/Cronometro.module.css'
import color from '../styles/SeleccionPrincipal.module.css'
import { Link } from 'react-router-dom';



//Función para guardar la experiencia(tiempo) que necesita cada nivel pasa acceder a él.
const xpParaSubirNivel = [0];
for (let i = 1; i < 100; i++) {
    xpParaSubirNivel[i] = xpParaSubirNivel[i - 1] + i * 80;
}

function Cronometro() {
    const {setPokeball,pokeball,  pokePrincipal, tiempo, setTiempo, setPokeSalvaje, pokeSalvaje, setEvolucionando, medallas, setMedallas, BE_URL } = useContext(MyContext);
    const [activo, setActivo] = useState(false);
    const [detenido, setDetenido] = useState(false);
    const [tiempoTotal, setTiempoTotal] = useState(pokePrincipal.tiempo);
    const [tiempoLocal, setTiempoLocal] = useState(pokePrincipal.tiempo);
    const [nivel, setNivel] = useState(pokePrincipal.nivel);
    const [evolucionEjecutada, setEvolucionEjecutada] = useState(false);
    const id = localStorage.getItem("id");



    //Función para iniciar el cronómetro.
    const iniciar = useCallback(() => {
        setActivo(true);
        setDetenido(false);
    }, []);

    //Función para pausar el cronómetro.
    const pausa = useCallback(() => {
        setActivo(false);
        setDetenido(true);
    }, []);

    //Función para reiniciar el cronómetro.
    const reiniciar = useCallback(() => {
        setTiempoLocal(0);
        setActivo(false);
        setDetenido(false);
    }, []);




    //Hook useEffect encargada para aumentar el tiempo, la experiencia y el nivel
    useEffect(() => {
        let intervalo = null;

        if (activo && !detenido) {
            if (pokePrincipal.tiempo === 0 && pokePrincipal.nivel === 0) {
                setTiempo(0);
                setNivel(1);
            } else if (pokePrincipal.tiempo !== 0 && pokePrincipal.nivel !== 1) {
                setTiempo(() => pokePrincipal.tiempo);
                setNivel(() => pokePrincipal.nivel);
            }
            if (pokePrincipal) {
                pokePrincipal.nivel = nivel;
                pokePrincipal.tiempo = tiempo;
            }
            //Funcionalidades para aumentar tiempo y nivel para cada pokémon seleccionado como principal; además de aumentar el tiempo total y el tiempo local del cronómetro.
            intervalo = setInterval(() => {
                setTiempo((tiempo) => tiempo + 1000);
                setTiempoTotal((tiempoTotal) => tiempoTotal + 1000);
                setTiempoLocal((tiempoLocal) => tiempoLocal + 1000);
                const xpNivelActual = xpParaSubirNivel[nivel];

                if (pokePrincipal.tiempo >= xpNivelActual) {
                    setNivel((nivel) => nivel + 1);
                    if (pokePrincipal.nivel === 10) {
                        setPokeball((pokeball) => pokeball + 10);
                    } else if ((pokePrincipal.nivel % 20 === 0 && pokePrincipal.nivel !== 0) || pokePrincipal.nivel === 50) {
                        setPokeball((pokeball) => pokeball + 1);
                    }
                }

                //Bucle necesario para detener el reloj una vez se llega al nivel 100
                if (pokePrincipal.nivel === 100 && nivel === 100) {
                    setActivo(false);
                    setDetenido(true);
                    console.log("Has llegado al máximo nivel")
                    setPokeball((pokeball) => pokeball + 5);
                    setMedallas((medallas) => medallas + 1);
                }

                // Bucle necesario para evolucionar el Pokémon cada cierto nivel
                if (pokePrincipal.nivel === 1 && pokePrincipal.evoluciones && !evolucionEjecutada && pokePrincipal.segundaEvo?.name?.toUpperCase() !== pokePrincipal.name) {

                    //Esta variable se declara para saber si el pokémon tiene 1 o 2 evoluciones, se intercambia la url dependiendo de la cantidad de evoluciones que tenga y también en caso de que no tenga evoluciones
                    let link = ``
                    if (pokePrincipal.evoluciones && pokePrincipal.evoluciones?.name?.toUpperCase() !== pokePrincipal.name) {
                        link = `https://pokeapi.co/api/v2/pokemon/${pokePrincipal.evoluciones?.name}`;
                    } else if (pokePrincipal.evoluciones && pokePrincipal.evoluciones?.name?.toUpperCase() === pokePrincipal.name && pokePrincipal.segundaEvo) {
                        link = `https://pokeapi.co/api/v2/pokemon/${pokePrincipal.segundaEvo?.name}`
                    } else {
                        return console.log("Es la última evo");
                    }
                    axios.get(`${link}`)
                        .then((response) => {
                            // Devuelve el nuevo estado que se quiere asignar a evolucionando
                            return {
                                ...response.data,
                                name: response.data.name.toUpperCase(),
                                pixSprite: response.data.sprites.front_default,
                                fullSprite: response.data.sprites.other["official-artwork"].front_default,
                                tipos: response.data.types,
                                nivel: 0,
                                tiempo: 0,
                                evoluciones: pokePrincipal.segundaEvo,
                                segundaEvo: "",
                                dex: response.data.id
                            };
                        })
                        .catch(error => {
                            console.error(error);
                            return null;
                        })
                        .then(nuevoPokemon => {
                            if (nuevoPokemon) {
                                setEvolucionando(nuevoPokemon);
                                setPokeSalvaje(pokeSalvaje => [...pokeSalvaje, nuevoPokemon]);
                                console.log(`¡${pokePrincipal.name} ha evolucionado!`);
                                setEvolucionEjecutada(true); //Esta const se declara para que el bucle solo se repita 1 vez por cada evolución
                                const guardarPokemonEnBD = async () => {
                                    try {
                                        await axios.post(BE_URL, {
                                            name: nuevoPokemon.name,
                                            pixSprite: nuevoPokemon.pixSprite,
                                            fullSprite: nuevoPokemon.fullSprite,
                                            tipos: nuevoPokemon.tipos,
                                            nivel: nuevoPokemon.nivel,
                                            tiempo: nuevoPokemon.tiempo,
                                            evoluciones: nuevoPokemon.evoluciones,
                                            segundaEvo: nuevoPokemon.segundaEvo,
                                            dex: nuevoPokemon.dex,
                                            idUsuario: id
                                        });
                                    } catch (error) {
                                        console.error(error);
                                    }
                                };
                                guardarPokemonEnBD();
                            }
                        });
                }
            }, 1000);
        } else {
            clearInterval(intervalo);
        }
        return () => clearInterval(intervalo);
    }, [activo, detenido, evolucionEjecutada, medallas, nivel, pokePrincipal, pokeSalvaje, setEvolucionando, setMedallas, setNivel, setPokeSalvaje, setPokeball, setTiempo, tiempo, tiempoTotal,BE_URL, id]);


    const actualizarPokemon = async (idPokemon, nivel, tiempo) => {
        try {
            const response = await axios.put(`http://localhost:3030/putTiempoYNivel/${idPokemon}`, { nivel, tiempo });
            return response.data;

        } catch (error) {
            console.error('Error al actualizar el Pokémon:', error);
            throw new Error('Error al actualizar el Pokémon');
        }
    };



    //Hook usado para actualizar el nivel y el tiempo del pokemon seleccionado
    useEffect(() => {
        const pokeId = localStorage.getItem('pokeId');

        if (pokePrincipal._id === pokeId) {
            actualizarPokemon(pokeId, nivel, tiempoTotal)
                .then((pokemonActualizado) => {
                    // console.log('Pokémon actualizado:', pokemonActualizado);
                })
                .catch((error) => {
                    console.error('Error al actualizar el Pokémon:', error);
                });
        }
    }, [tiempoTotal, nivel, pokePrincipal._id])


    
    //Función para actualizar pokeball en la base de datos.
    const actualizarPokeball = async (id, pokeball) => {
        try {
            const response = await axios.put(`http://localhost:3030/putPokeball/${id}`, { pokeball });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar pokeball:', error);
            throw new Error('Error al actualizar pokeball');
        }
    };

    //Hook usado para actualizar pokeballs
    useEffect(() => {
        actualizarPokeball(id, pokeball)
            .then((pokeballActualizada) => {
                // console.log('Pokémon actualizado:', pokeballActualizada);
            })
            .catch((error) => {
                console.error('Error al actualizar el Pokémon:', error);
            });
    }, [pokeball, id])


    //Función para formatear el tiempo en horas, minutos y segundos.
    const formatoTiempo = (tiempo) => {
        const padTiempo = (tiempo) => {
            return tiempo.toString().padStart(2, "0");
        };
        const segundos = padTiempo(tiempo % 60);
        const minutos = padTiempo(Math.floor(tiempo / 60) % 60);
        const horas = padTiempo(Math.floor(tiempo / 3600));
        return `${horas}:${minutos}:${segundos}`;
    };
    useEffect(() => {
        if (pokePrincipal.dex > 0) {
            // setSeleccionado(true)
            setTiempo(() => pokePrincipal.tiempo);
            setNivel(() => pokePrincipal.nivel);
        };
    }, [pokePrincipal, setTiempo, setNivel]);

    //Bucle necesario para cambiar de pantalla una vez se llega al nivel 100
    if (pokePrincipal.nivel === 100) {
        return (
            <div className={`${styles[`${pokePrincipal.tipos[0].type.name}`]} ${styles.contlvl100}`} >
                <section >
                    <p className={styles.general100}>Nivel: {pokePrincipal.nivel}</p>
                    <p className={styles.pokeball100}>Tienes: {pokeball} Pokeballs.</p>
                </section>
                <h1 className={styles.general100}>Felicidades, alcanzaste el máximo nivel.</h1>
                <h1 className={styles.general100}>Tiempo que has usado a {pokePrincipal.name}: </h1>
                <h1 className={styles.general100}>{formatoTiempo(pokePrincipal.tiempo)} horas.</h1>
                <Link to="/ColecciónPokeT">
                    <button className={`${color[`${pokePrincipal.tipos[0].type.name}`]} ${styles.btn}`}>Cambiar Pokémon.</button>
                </Link>
            </div>
        );
    }



    return (
        <div className={styles.cont}>
            {pokePrincipal._id ? (
                <section className={styles.contTiempo}>
                    <h1 className={`${styles[`${pokePrincipal.tipos[0].type.name}`]} ${styles.tiempo}`}>{formatoTiempo(tiempoLocal)}</h1>
                    <button className={`${color[`${pokePrincipal.tipos[0].type.name}`]} ${styles.btn}`} onClick={iniciar}>Iniciar/Continuar.</button>
                    <button className={`${color[`${pokePrincipal.tipos[0].type.name}`]} ${styles.btn}`} onClick={pausa}>Pausar.</button>
                    <button className={`${color[`${pokePrincipal.tipos[0].type.name}`]} ${styles.btn}`} onClick={reiniciar}>Reiniciar.</button>
                    <div className={`${styles[`${pokePrincipal.tipos[0].type.name}`]} ${styles.cont2}`}>
                        <p className={styles.nivel}>Nivel: {pokePrincipal.nivel}</p>
                        <p className={styles.pokeball}>Tienes: {pokeball} Pokeballs.</p>
                        <h1 className={styles.tiempoUsado}>Tiempo que has usado a <p>{pokePrincipal.name} :<h1 className={`${styles.tiempo2}`}>{formatoTiempo(pokePrincipal.tiempo)}</h1></p> </h1>
                        <Link to="/ColecciónPokeT">
                            <button className={`${color[`${pokePrincipal.tipos[0].type.name}`]} ${styles.btn}`}>Cambiar Pokémon.</button>
                        </Link>
                    </div>

                </section>
            ) : (
                <div>
                </div>
            )}
        </div>
    );
}

export default Cronometro;


