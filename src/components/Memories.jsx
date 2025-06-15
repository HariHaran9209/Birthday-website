import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FaHeart, FaStar, FaGift, FaSmile } from 'react-icons/fa'

const MemoriesContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;

  &::after {
    content: '';
    position: absolute;
    width: 4px;
    background: #ff6b6b;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -2px;
  }
`

const MemoryItem = styled(motion.div)`
  padding: 1rem;
  position: relative;
  width: 50%;
  box-sizing: border-box;
  margin-bottom: 2rem;

  &:nth-of-type(odd) {
    left: 0;
    padding-right: 2rem;
  }

  &:nth-of-type(even) {
    left: 50%;
    padding-left: 2rem;
  }
`

const MemoryContent = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const MemoryIcon = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  top: 50%;
  transform: translateY(-50%);

  ${MemoryItem}:nth-of-type(odd) & {
    right: -20px;
  }

  ${MemoryItem}:nth-of-type(even) & {
    left: -20px;
  }
`

const MemoryTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`

const MemoryText = styled.p`
  color: #666;
  line-height: 1.6;
`

const Memories = () => {
  const memories = [
    {
      icon: <FaHeart />,
      title: 'Class Topper',
      text: 'Remember when you got 97% and got 4th in 10th and 90% and got 2nd in 11th and 80% in 12th...'
    },
    {
      icon: <FaStar />,
      title: 'Most genuine and innocent alien',
      text: 'Most talented artist ,talkitve one with closed ones, Existed person and who plans greater surprises for friends and can do anything for them...'
    },
    {
      icon: <FaGift />,
      title: 'Surprise Party',
      text: 'The look on your face when we surprised you with that birthday party! Priceless memories we created together.'
    },
    {
      icon: <FaSmile />,
      title: 'Family Vacations',
      text: 'Our family trips and adventures, filled with laughter and unforgettable moments.'
    }
  ]

  return (
    <MemoriesContainer>
      <Title>Your Life Journey</Title>
      <Timeline>
        {memories.map((memory, index) => (
          <MemoryItem
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <MemoryContent>
              <MemoryIcon>{memory.icon}</MemoryIcon>
              <MemoryTitle>{memory.title}</MemoryTitle>
              <MemoryText>{memory.text}</MemoryText>
            </MemoryContent>
          </MemoryItem>
        ))}
      </Timeline>
    </MemoriesContainer>
  )
}

export default Memories 