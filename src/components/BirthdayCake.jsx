import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 7.5rem;
  text-align: center;
`

const Cake = styled(motion.div)`
  width: 300px;
  height: 200px;
  background: #f8d7da;
  border-radius: 20px;
  position: relative;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 30px;
    background: #f8d7da;
    border-radius: 20px 20px 0 0;
  }
`

const CandlesContainer = styled.div`
  position: absolute;
  top: -55px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
`

const Candle = styled.div`
  width: 8px;
  height: 40px;
  background: #fff;
  position: relative;
`

const Flame = styled(motion.div)`
  width: 12px;
  height: 24px;
  background: #ffd700;
  border-radius: 50% 50% 20% 20%;
  position: absolute;
  top: -24px;
  left: -2px;
  box-shadow: 0 0 20px #ffd700;
  animation: flicker 0.5s infinite alternate;
`

const Instructions = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin: 1rem 0;
`

const BlowButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const WishButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #ff5252;
  }
`

const WishForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`

const WishInput = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
`

const WishSavedMessage = styled(motion.div)`
  font-size: 1.2rem;
  color: #28a745;
  text-align: center;
  margin-top: 1rem;
`

const BirthdayCake = ({ onWishSaved }) => {
  const [candles, setCandles] = useState(Array(5).fill(true));
  const [showWish, setShowWish] = useState(false);
  const [wish, setWish] = useState("");
  const [wishSaved, setWishSaved] = useState(false);
  const audioContextRef = useRef(null);

  const blowOneCandle = () => {
    const firstLitIndex = candles.findIndex(isLit => isLit);
    if (firstLitIndex !== -1) {
      setCandles(prev => prev.map((lit, i) => i === firstLitIndex ? false : lit));
    }
  };

  // Re-enabled microphone access
  useEffect(() => {
    // Request microphone access
    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        mediaStreamSource.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const detectBlow = () => {
          if (candles.every(isLit => !isLit)) return; // Stop detection if all candles are out

          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;

          // Threshold for detecting a blow (adjust as needed)
          const blowThreshold = 40; // This value needs to be fine-tuned

          if (average > blowThreshold) {
            console.log("Blow detected!");
            blowOneCandle();
          }
          requestAnimationFrame(detectBlow);
        };

        detectBlow();

      } catch (err) {
        console.error('Error accessing microphone:', err);
        // We won't show an alert here, as the button provides an alternative
      }
    };

    // Only try to set up audio if candles are lit
    if (!candles.every(isLit => !isLit)) {
      setupAudio();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [candles]); // Depend on candles to restart detection if they become lit again

  useEffect(() => {
    if (candles.every(isLit => !isLit)) {
      console.log("All candles are out! Happy Birthday!");
    }
  }, [candles]);

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (!wish.trim()) return;

    try {
      await addDoc(collection(db, "wishes"), {
        wish: wish,
        timestamp: serverTimestamp(),
        isSpecial: true
      });
      setWishSaved(true);
    } catch (error) {
      console.error("Error saving wish:", error);
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Title>Happy Birthday!</Title>
      <Cake
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
      >
        <CandlesContainer>
          {candles.map((isLit, index) => (
            <Candle key={index}>
              {isLit && <Flame />}
            </Candle>
          ))}
        </CandlesContainer>
      </Cake>
      <Instructions>
        {candles.some(isLit => isLit) ? (
          "Blow into your microphone to blow out the candles!"
        ) : (
          "All candles are blown out! Make a wish!"
        )}
      </Instructions>

      {/* Ensure the blow button is only available when candles are lit */}
      {candles.some(isLit => isLit) && (
        <BlowButton
          onClick={blowOneCandle}
          disabled={candles.every(isLit => !isLit)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Don't have a microphone? Blow here!
        </BlowButton>
      )}

      <AnimatePresence>
        {!candles.some(isLit => isLit) && !showWish && !wishSaved && (
          <WishButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setShowWish(true)}
          >
            Make a Wish
          </WishButton>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWish && !wishSaved && (
          <WishForm
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onSubmit={handleWishSubmit}
          >
            <WishInput
              type="text"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Type your wish..."
              required
            />
            <WishButton type="submit">Save Wish</WishButton>
          </WishForm>
        )}
      </AnimatePresence>

      {wishSaved && (
        <WishSavedMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Wish saved!
        </WishSavedMessage>
      )}
    </Container>
  );
};

export default BirthdayCake; 