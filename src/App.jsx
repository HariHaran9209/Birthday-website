import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { BrowserRouter as Router } from 'react-router-dom'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Memories from './components/Memories'
import Countdown from './components/Countdown'
import QuestionAnswer from './components/QuestionAnswer'
import BirthdayCake from './components/BirthdayCake'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`

const Section = styled(motion.section)`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1rem; /* Adjust padding for smaller screens */
  }
`

function App() {
  const [showBirthdayCake, setShowBirthdayCake] = useState(false);

  const handleCountdownEnd = () => {
    setShowBirthdayCake(true);
  };

  return (
    <Router>
      <AppContainer>
        {showBirthdayCake ? (
          <BirthdayCake key="birthday-cake" />
        ) : (
          <div key="main-content-wrapper">
            <Hero />
            <Section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Countdown targetDate="2025-06-21T23:59:59" onCountdownEnd={handleCountdownEnd} />
            </Section>
            <Section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Gallery />
            </Section>
            <Section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <QuestionAnswer />
            </Section>
          </div>
        )}
      </AppContainer>
    </Router>
  );
}

export default App;
