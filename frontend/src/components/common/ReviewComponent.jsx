import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

const ReviewComponent = ({ medicineId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [userReview, setUserReview] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [medicineId])

  const fetchReviews = async () => {
    try {
      const [reviewsResponse, avgResponse] = await Promise.all([
        axios.get(`/api/reviews/medicine/${medicineId}`),
        axios.get(`/api/reviews/medicine/${medicineId}/average`)
      ])
      setReviews(reviewsResponse.data)
      setAverageRating(avgResponse.data.averageRating || 0)
      
      if (user) {
        const userRev = reviewsResponse.data.find(r => r.userId === user.id)
        if (userRev) {
          setUserReview(userRev)
          setRating(userRev.rating)
          setComment(userRev.comment || '')
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to submit a review')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/reviews', {
        medicineId,
        rating,
        comment
      })
      toast.success('Review submitted successfully')
      setShowForm(false)
      fetchReviews()
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (ratingValue, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            className={interactive ? "cursor-pointer" : ""}
          >
            {star <= ratingValue ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Reviews</h3>
          <div className="flex items-center mt-2">
            {renderStars(Math.round(averageRating))}
            <span className="ml-2 text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        {user && !userReview && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && !userReview && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            {renderStars(rating, true)}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Write your review..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* User's Existing Review */}
      {userReview && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">{userReview.userName}</p>
              {renderStars(userReview.rating)}
            </div>
            <span className="text-sm text-gray-600">
              {new Date(userReview.createdAt).toLocaleDateString()}
            </span>
          </div>
          {userReview.comment && (
            <p className="text-gray-700 mt-2">{userReview.comment}</p>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.filter(r => !user || r.userId !== user.id).map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">{review.userName}</p>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-gray-700 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-center py-8">No reviews yet</p>
      )}
    </div>
  )
}

export default ReviewComponent



