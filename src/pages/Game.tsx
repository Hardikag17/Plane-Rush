import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { GameContext } from '../utils/web3';
import { useGame } from '../phaser/hooks';

const GameScreen = () => {
  const { state } = useContext(GameContext);
  const [ended, setEnded] = useState(false);
  const router = useHistory();
  const parentEl = useRef<HTMLDivElement>(null);
  const game = useGame(parentEl);

  const endGame = useCallback(
    (score: number) => {
      const currHighScore = parseInt(state.highScore);
      if (score > parseFloat(localStorage.getItem('highScore') ?? '0'))
        localStorage.setItem('highScore', '' + score);
      if (score - currHighScore > 100) {
        alert(
          `New high score of ${score}!!\n
          A mystery character is being created for you.\n
          Check in after a few minutes`
        );
        try {
          state.contract.methods
            .requestNewRandomCharacter(score.toString())
            .send({
              from: state.account,
              gasPrice: state.web3.utils.toWei('50', 'Gwei'),
              gas: 500000,
            });
        } catch (e) {
          console.error('character generation error');
          console.error(e);
        }
      }
      setEnded(true);
    },
    [state]
  );

  useEffect(() => {
    if (state.loaded) {
      if (game && !ended) {
        console.log('starting game');
        game.scene.scenes[0].events.emit('start-game', {
          url: state.selectedNFT.image,
          speed: state.selectedNFT.speed / 100,
          endGame,
        });
      }
      if (ended) {
        console.log('rerouting');
        router.push('/home');
      }
    }
  }, [game, state, ended, endGame, router]);

  return (
    <div
      ref={parentEl}
      style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
    />
  );
};

export default GameScreen;
