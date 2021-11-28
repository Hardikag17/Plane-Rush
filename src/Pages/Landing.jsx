import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';

import { GameContext } from '../utils/web3';
import SmartContract from '../abis/NFTCharacter.json';
import '../styles/landing.css';

const Landing = () => {
  const { state, setState } = useContext(GameContext);
  const history = useHistory();

  const initWeb3 = async () => {
    // To check without connecting to wallet: history.push('/play');
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
        const web3 = new Web3(window.ethereum);
        const account = (await web3.eth.getAccounts())[0];
        const netId = await web3.eth.net.getId();
        if (netId !== 80001)
          alert('Wrong network, please switch to the Matic Mumbai testnet!');
        else {
          const address = SmartContract.networks[netId].address;
          const contract = new web3.eth.Contract(SmartContract.abi, address);
          setState({
            ...state,
            web3,
            contract,
            account,
            highScore: '0',
            loaded: true,
          });
          history.push('/play');
        }
      } catch (e) {
        alert(e);
      }
    } else {
      alert('web3 not detected');
    }
  };

  return (
    <div>
      <div className='container-fluid landing-page-div'>
        <div className='front'>
          {/* <h1 className='poster-text'>
            <b>Free</b> Fall
          </h1> */}
          <button
            type='button'
            onClick={initWeb3}
            className='btn btn-dark connect-button'
            style={{ width: '200px' }}>
            Connect to wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
