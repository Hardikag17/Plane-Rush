import '../styles/Navbar.module.css';
import { useHistory } from 'react-router-dom';
import { GameContext } from '../utils/web3';
import { useContext } from 'react';

function Navbar() {
  const history = useHistory();
  const { state, setState } = useContext(GameContext);
  return (
    <div>
      <nav className='navbar'>
        <div className='container-fluid justify-end' style={{ fontSize: '50px' }}>
          <button
            className='fas btn btn-dark ' style={{width:'200px',fontFamily:'DM Sans'}}
            onClick={() => {
              history.push('/store');
            }}>Marketplace</button>
          <button
            className='fas  btn btn-dark ' style={{width:'200px',fontFamily:'DM Sans'}}
            onClick={() => {
              state.contract.methods
                .userAddressToHighScore(state.account)
                .call()
                .then((highScore) => {
                  if (highScore.length === 0) highScore = '0';
                  setState({ ...state, highScore: parseFloat(highScore) });
                  if (localStorage.getItem('highScore') == null)
                    localStorage.setItem('highScore', highScore);
                  history.push('/game');
                });
            }}>Start</button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
