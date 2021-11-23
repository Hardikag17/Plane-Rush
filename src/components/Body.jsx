import '../styles/Play.css';
import { useHistory } from 'react-router';

function Body() {
  let history = useHistory();

  return (
    <div>
      <h1 className='mx-auto text-6xl font-bold text-center items-center'>
        Save the Plane
      </h1>

      <div class='botón'>
        <div class='fondo' x='0' y='0' width='200' height='200'></div>
        <div class='icono' width='200' height='200'>
          <div
            class='parte izquierda'
            x='0'
            y='0'
            width='200'
            height='200'
            fill='#fff'></div>
          <div
            class='parte derecha'
            x='0'
            y='0'
            width='200'
            height='200'
            fill='#fff'></div>
        </div>
        <div class='puntero'></div>
      </div>
    </div>
  );
}

export default Body;
