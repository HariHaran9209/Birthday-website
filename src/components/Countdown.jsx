import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const CountdownContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
`

const TimeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`

const TimeUnit = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
`

const TimeValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ff6b6b;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  min-width: 80px;
`

const TimeLabel = styled.div`
  font-size: 1rem;
  color: #666;
  text-transform: uppercase;
  margin-top: 0.5rem;
`

const Countdown = ({ targetDate, onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [countdownFinished, setCountdownFinished] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onCountdownEnd && !countdownFinished) {
          onCountdownEnd();
          setCountdownFinished(true); // Mark countdown as finished
        }
      }
    };

    // Call immediately to set initial state
    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onCountdownEnd, countdownFinished]); // Added countdownFinished to dependency array

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  return (
    <CountdownContainer>
      <Title>Time Until Your Special Day</Title>
      <TimeContainer>
        {timeUnits.map((unit, index) => (
          <TimeUnit
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TimeValue>{unit.value.toString().padStart(2, '0')}</TimeValue>
            <TimeLabel>{unit.label}</TimeLabel>
          </TimeUnit>
        ))}
      </TimeContainer>
    </CountdownContainer>
  );
};

export default Countdown; 