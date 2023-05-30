import React, { createContext, useState,useEffect } from 'react';
import axios from 'axios';
const MyContext = createContext();


function MyContextProvider({ children }) {
  const [pokePrincipal, setPokePrincipal] = useState([]);
  const [pokeSalvaje, setPokeSalvaje] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [evolucionando, setEvolucionando] = useState([]);
  const [estaEvolucionado, setEstaEvolucionado] = useState(false);
  const [unaEvo, setUnaEvo] = useState(false);
  const [medallas, setMedallas] = useState(0);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [pokeInfoActual, setPokeInfoActual] = useState([]);
  const BE_URL = 'http://localhost:3030/infoPokemon';
  const [inicial, setInicial] = useState(false);
  const [usuario, setUsuario] = useState({});
  const [pokeball, setPokeball] = useState(usuario.pokeball);
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setSesionIniciada(true);
    }
  }, [setSesionIniciada]);
  
    //Hook para traer las pokeball del usuario
    useEffect(() => {
      const traerUsuario = async () => {
          try {
              const response = await axios.get('http://localhost:3030/user', {
                  headers: {
                      token: token
                  }
              });
              const data = response.data;
              setPokeball(data.pokeball)
              setUsuario(data);
          } catch (error) {
              console.error(error);
          }
      };
      traerUsuario();
  }, [id, setPokeball,token]);

  const contextValue = {
    pokePrincipal,
    setPokePrincipal,
    pokeSalvaje,
    setPokeSalvaje,
    pokeball,
    setPokeball,
    tiempo,
    setTiempo,
    evolucionando,
    setEvolucionando,
    estaEvolucionado,
    setEstaEvolucionado,
    unaEvo,
    setUnaEvo,
    medallas,
    setMedallas,
    sesionIniciada,
    setSesionIniciada,
    pokeInfoActual,
    setPokeInfoActual,
    BE_URL,
    inicial,
    setInicial
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContextProvider, MyContext };



