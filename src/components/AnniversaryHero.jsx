import React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const HeroContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(to right, #ffafbd, #ffc3a0);
  color: white;
  text-align: center;
  min-height: 50vh;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 20px 20px;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    min-height: 40vh;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  max-width: 600px;
  line-height: 1.5;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AnniversaryHero = () => {
  return (
    <HeroContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Title>Happy Anniversary!</Title>
      <Subtitle>Celebrating the beautiful journey of a wonderful couple.</Subtitle>
    </HeroContainer>
  );
};

export default AnniversaryHero; 