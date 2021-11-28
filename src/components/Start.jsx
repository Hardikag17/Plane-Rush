import '../styles/Start.css';
import { GameContext } from '../utils/web3';
import { useCallback, useContext, useEffect } from 'react';
import NFT from '../components/NFT';
import Load from '../components/Load';
import Footer from '../components/Footer';

function Start() {
  const { state, setState } = useContext(GameContext);

  const loadNFT = useCallback(async () => {
    const userNfts = [];
    try {
      const supply = await state.contract.methods
        .balanceOf(state.account)
        .call();
      console.log(supply);
      for (let i = 0; i < supply; i++) {
        const nft = parseInt(
          await state.contract.methods
            .tokenOfOwnerByIndex(state.account, i)
            .call()
        );
        const price = await state.contract.methods
          .charactersForSale(nft)
          .call();
        const url = await state.contract.methods.tokenURI(nft).call();
        userNfts.push({ url, price, page: 'main', tokenId: nft });
      }
    } catch (e) {
      console.log('nft fetch error');
    }
    userNfts.push({ url: 'dummy', price: 0, page: 'main', tokenId: -1 });
    setState({ ...state, userNfts });
  }, [state, setState]);

  useEffect(() => {
    if (state.loaded && state.userNfts.length === 0) {
      loadNFT();
    }
  }, [state, loadNFT]);

  const items =
    state.userNfts.length > 0 ? (
      state.userNfts.map((nft) => <NFT key={nft.tokenId} nft={nft} />)
    ) : (
      <div className='container-fluid position-absolute top-50 start-50 translate-middle'>
        <Load />
      </div>
    );

  return (
    <div className='container-fluid bg'>
      <center>
        <div className='start' style={{ marginBottom: '5%' }}>
          <b>
            <h1 className='text-3xl'>NFT's Connected to your wallet</h1>
          </b>
        </div>
        <div
          className='d-flex justify-content-center'
          style={{ flexWrap: 'wrap', marginBottom: '10%' }}>
          {items}
        </div>
      </center>
      <Footer />
    </div>
  );
}

export default Start;
