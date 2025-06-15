import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

const GalleryContainer = styled.div`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`

const ImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`

const ImageCaption = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
`

const UploadForm = styled.form`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #f0f2f5;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Spacing between form elements */

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem auto;
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

  &[type="file"] {
    opacity: 0;
    position: absolute;
    width: 0.1px;
    height: 0.1px;
    overflow: hidden;
    z-index: -1;
  }
`

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  padding-right: 1rem;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem; /* Increased padding */
  background: #ff6b6b;
  color: white;
  border-radius: 8px; /* Slightly smaller radius for button */
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  white-space: nowrap; /* Prevent text wrapping */
  margin: -1px; /* Offset border of container */

  &:hover {
    background: #ff5252;
  }
`;

const FileNameDisplay = styled.span`
  flex-grow: 1;
  color: #555;
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubmitButton = styled(motion.button)`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
`

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh; /* Adjust as needed */
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 1rem;
`

const ModalText = styled.p`
  color: #333;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 0.5rem;
`

const ModalCloseButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #ff5252;
  }
`

const Gallery = () => {
  const [images, setImages] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const cloudinaryCloudName = 'dlq0gap0m' // Your Cloudinary cloud name
  const cloudinaryUploadPreset = 'birthday_gallery_uploads' // Your unsigned upload preset name

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const imagesRef = collection(db, 'images')
      const q = query(imagesRef, orderBy('timestamp', 'desc')); // Order by timestamp
      const snapshot = await getDocs(q)
      const imagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setImages(imagesList)
    } catch (error) {
      console.error('Error fetching images:', error)
      setError('Failed to load images. Please try again later.')
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !name) {
      setError('Please provide your name and select an image.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', cloudinaryUploadPreset)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Cloudinary upload failed')
      }

      const data = await response.json()
      const imageUrl = data.secure_url // Get the secure URL from Cloudinary

      // Save image metadata to Firestore
      await addDoc(collection(db, 'images'), {
        url: imageUrl,
        name: name,
        message: message,
        timestamp: serverTimestamp()
      })

      // Refresh images
      await fetchImages()
      
      // Reset form
      setName('')
      setMessage('')
      setFile(null)
      setSuccess('Photo uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image to Cloudinary or Firestore:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <GalleryContainer>
      <Title>Photo Gallery</Title>
      
      <Grid>
        {images.map((image) => (
          <ImageContainer
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => handleImageClick(image)}
          >
            <Image src={image.url} alt={image.name} />
          </ImageContainer>
        ))}
      </Grid>

      <UploadForm onSubmit={handleSubmit}>
        <Title>Upload Your Photo & Wish</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <Input 
          type="text" 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <Input 
          type="text" 
          placeholder="Your Message (Optional)" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <FileInputContainer>
          <Input 
            id="file-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            required 
          />
          <FileInputLabel htmlFor="file-upload">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Choose File
          </FileInputLabel>
          <FileNameDisplay>
            {file ? file.name : 'No file chosen'}
          </FileNameDisplay>
        </FileInputContainer>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Photo'}
        </SubmitButton>
      </UploadForm>

      <AnimatePresence>
        {selectedImage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <ModalImage src={selectedImage.url} alt={selectedImage.name} />
              <ModalText>
                <strong>Uploader:</strong> {selectedImage.name}
              </ModalText>
              {selectedImage.message && (
                <ModalText>
                  <strong>Message:</strong> {selectedImage.message}
                </ModalText>
              )}
              <ModalCloseButton onClick={handleCloseModal}>Close</ModalCloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </GalleryContainer>
  )
}

export default Gallery 