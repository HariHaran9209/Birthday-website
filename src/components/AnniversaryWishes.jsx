import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

const WishesContainer = styled.div`
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

const WishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`

const WishCard = styled(motion.div)`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const WishText = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
`

const WishAuthor = styled.p`
  font-size: 0.9rem;
  color: #888;
  text-align: right;
  margin-top: 0.5rem;
`

const WishForm = styled.form`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2.5rem;
  background: #f0f2f5;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1.1rem;
  background-color: white;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1.1rem;
  background-color: white;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }
`

const SubmitButton = styled(motion.button)`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: #ff5252;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`

const SuccessMessage = styled.div`
  color: #28a745;
  background: #d4edda;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`

const AnniversaryWishes = () => {
  const [wishes, setWishes] = useState([])
  const [name, setName] = useState('')
  const [wishText, setWishText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    try {
      const wishesRef = collection(db, 'anniversary_wishes')
      const q = query(wishesRef, orderBy('timestamp', 'desc'))
      const snapshot = await getDocs(q)
      const wishesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setWishes(wishesList)
    } catch (error) {
      console.error('Error fetching anniversary wishes:', error)
      setError('Failed to load wishes. Please try again later.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !wishText) {
      setError('Please provide your name and your wish.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await addDoc(collection(db, 'anniversary_wishes'), {
        name: name,
        wish: wishText,
        timestamp: serverTimestamp()
      })

      await fetchWishes()
      setName('')
      setWishText('')
      setSuccess('Your wish has been added!')
    } catch (error) {
      console.error('Error adding wish:', error)
      setError('Failed to add your wish. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WishesContainer>
      <Title>Leave an Anniversary Wish</Title>
      <WishForm onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextArea
          placeholder="Write your anniversary wish here..."
          value={wishText}
          onChange={(e) => setWishText(e.target.value)}
          required
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Wish'}
        </SubmitButton>
      </WishForm>

      <Title>Anniversary Wishes</Title>
      <WishesGrid>
        {wishes.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#777' }}>No wishes yet. Be the first to leave one!</p>
        ) : (
          wishes.map((wish) => (
            <WishCard
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <WishText>{wish.wish}</WishText>
              <WishAuthor>- {wish.name}</WishAuthor>
            </WishCard>
          ))
        )}
      </WishesGrid>
    </WishesContainer>
  )
}

export default AnniversaryWishes 