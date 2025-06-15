import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { FaQuestionCircle, FaCheckCircle } from 'react-icons/fa'

const QuestionAnswerContainer = styled.div`
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

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto 2rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`

const SubmitButton = styled(motion.button)`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    background: #ff5252;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const QuestionsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const QuestionCard = styled(motion.div)`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  align-items: center;
`

const QuestionText = styled.h3`
  color: #333;
  margin: 0;
`

const AskedBy = styled.span`
  color: #666;
  font-size: 0.9rem;
`

const AnswerContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #eee;
`

const AnswerTitle = styled.p`
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const AnswerText = styled.p`
  color: #444;
  line-height: 1.6;
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

const QuestionAnswer = () => {
  const [questions, setQuestions] = useState([])
  const [askerName, setAskerName] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'))
      const snapshot = await getDocs(q)
      const questionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setQuestions(questionsList)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setError('Failed to load questions. Please try again later.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!askerName.trim() || !questionText.trim()) {
      setError('Please enter your name and a question.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await addDoc(collection(db, 'questions'), {
        askerName: askerName,
        questionText: questionText,
        answerText: '', // Initial empty answer
        timestamp: serverTimestamp()
      })

      await fetchQuestions()

      setAskerName('')
      setQuestionText('')
      setSuccess('Your question has been submitted!')
    } catch (error) {
      console.error('Error submitting question:', error)
      setError('Failed to submit question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <QuestionAnswerContainer>
      <Title>Ask the Birthday Girl!</Title>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Input
          type="text"
          placeholder="Your Name"
          value={askerName}
          onChange={(e) => setAskerName(e.target.value)}
          required
        />
        <TextArea
          placeholder="Ask your question..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Submitting...' : 'Submit Question'} <FaQuestionCircle />
        </SubmitButton>
      </Form>

      <QuestionsList>
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <QuestionHeader>
              <QuestionText>{q.questionText}</QuestionText>
              <AskedBy>Asked by: {q.askerName}</AskedBy>
            </QuestionHeader>
            {q.answerText && (
              <AnswerContainer>
                <AnswerTitle><FaCheckCircle /> Answer from the Birthday Girl:</AnswerTitle>
                <AnswerText>{q.answerText}</AnswerText>
              </AnswerContainer>
            )}
          </QuestionCard>
        ))}
      </QuestionsList>
    </QuestionAnswerContainer>
  )
}

export default QuestionAnswer 