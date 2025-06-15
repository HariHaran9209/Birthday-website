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
import AnniversaryHero from './components/AnniversaryHero'
import AnniversaryGallery from './components/AnniversaryGallery'
import AnniversaryWishes from './components/AnniversaryWishes'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`

const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 15px 15px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem 0.5rem;
  }
`;

const NavButton = styled.button`
  background: ${props => (props.active ? '#ff6b6b' : '#e0e0e0')};
  color: ${props => (props.active ? 'white' : '#333')};
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background: ${props => (props.active ? '#ff5252' : '#d0d0d0')};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

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
  const [activeView, setActiveView] = useState('birthday'); // 'birthday' or 'anniversary'

  const handleCountdownEnd = () => {
    setShowBirthdayCake(true);
  };

  const renderBirthdayContent = () => (
    <div key="birthday-content-wrapper">
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
        <Memories />
      </Section>
      <Section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <QuestionAnswer />
      </Section>
    </div>
  );

  const renderAnniversaryContent = () => (
    <div key="anniversary-content-wrapper">
      <AnniversaryHero />
      <Section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Countdown targetDate="2025-06-21T23:59:59" />
      </Section>
      <Section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AnniversaryGallery />
      </Section>
      <Section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AnniversaryWishes />
      </Section>
    </div>
  );

  return (
    <Router>
      <AppContainer>
        <NavContainer>
          <NavButton active={activeView === 'birthday'} onClick={() => setActiveView('birthday')}>
            Birthday
          </NavButton>
          <NavButton active={activeView === 'anniversary'} onClick={() => setActiveView('anniversary')}>
            Anniversary
          </NavButton>
        </NavContainer>

        {showBirthdayCake ? (
          <BirthdayCake key="birthday-cake" />
        ) : (
          activeView === 'birthday' ? renderBirthdayContent() : renderAnniversaryContent()
        )}
      </AppContainer>
    </Router>
  );
}

export default App;
