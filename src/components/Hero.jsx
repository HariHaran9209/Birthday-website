import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FaBirthdayCake } from 'react-icons/fa'

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
`

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
`

const CakeIcon = styled(motion.div)`
  font-size: 4rem;
  margin-bottom: 2rem;
`

const Hero = () => {
  return (
    <HeroContainer>
      <CakeIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <FaBirthdayCake />
      </CakeIcon>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Happy Birthday, Krishnaveni!
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Wishing you a day filled with happiness and a year filled with joy. 
        You're the best anyone could ask for!
      </Subtitle>
    </HeroContainer>
  )
}

export default Hero 