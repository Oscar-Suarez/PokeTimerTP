import styles from '../styles/Home.module.css'

function Home() {
  return (
    <div className={styles.background}>

      <div className={styles.contPr}>
        <h1 className={styles.h1}>¡Bienvenid@ al PokeTimer!</h1>
        <div className={styles.contCir}>
          <div className={styles.bCirc}>
            <div className={styles.intcirc}></div>
          </div>
          <div className={styles.circ1}></div>
          <div className={styles.circ2}></div>
          <div className={styles.circ3}></div>
        </div>
        <div className={styles.contSec}>
          <div className={styles.contTer}>
            <p className={styles.p}>Dentro de este timer podras conseguir diversos Pokémon a medida que pasa el tiempo, por lo cual para conseguir pokeballs necesitas hacer que el cronómetro corra.</p>
            <p className={styles.p}>Esta aplicación web está en versión Alpha. Lo cual quiere decir que está siendo desarrollada.</p>
            <p className={styles.p}>De momento solo puedes hacer prueba de la aplicación sin guardar tus datos ni tus registros de Pokémon. Al momento de iniciar sesión podrás acceder a la aplicación, de momento no se registra ningún usuario ni dato en la base de datos; en consecuencia puedes usar cualquier usuario y contraseña para acceder (aun si no existen). Los únicos datos guardados son los del Pokedex, pero una vez que salgas de la aplicación estos se borraran.</p>
            <p className={styles.p}>Las recompensas y los tiempos están multiplicados en un alto porcentaje, lo cual quiere decir que la aplicación final no funcionará con esos tiempos ni recompensas; esto está modificado para que puedas ver la funcionalidad de todo dentro del PokeTimer.</p>
            <p className={styles.p}>Considere por favor que debido a que es una versión inicial, al momento de salir de la página o volver a cargar la página, todos sus datos se podrán perder.</p>
          </div>
        </div>
      </div>

    </div >
  );
}


export default Home;