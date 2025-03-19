import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api';
import { useAuth } from '../context/AuthContext';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [newReview, setNewReview] = useState('');
  const { user } = useAuth();

  const fetchMovieDetails = async () => {
    try {
      const res = await axiosInstance.get(`/movies/${id}?sort=${sort}&page=${page}&limit=${limit}`);
      setMovie(res.data.movie);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id, sort, page]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to add a review');
    try {
      await axiosInstance.post(`/movies/${id}/reviews`, { content: newReview });
      setNewReview('');
      fetchMovieDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      await axiosInstance.post(`/movies/reviews/${reviewId}/like`);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                isLiked: !review.isLiked,
                likes_count: review.isLiked
                  ? review.likes_count - 1
                  : review.likes_count + 1,
              }
            : review
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (movieId, reviewId) => {
    try {
      await axiosInstance.delete(`/movies/${movieId}/reviews/${reviewId}`);
      fetchMovieDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReview = async (movieId, reviewId, content) => {
    const newContent = prompt('Edit your review', content);
    if (!newContent) return;
    try {
      await axiosInstance.put(`/movies/${movieId}/reviews/${reviewId}`, { content: newContent });
      fetchMovieDetails();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {movie ? (
        <>
          <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
          <img src={movie.url}/>
          <p className="mb-4">{movie.description}</p>
          <h3 className="text-2xl font-semibold mb-2">Reviews</h3>
          <div className="mb-4">
            <label className="mr-2">Sort By:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-700 p-2 rounded border border-gray-600"
            >
              <option value="recent">Most Recent</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-gray-800 p-4 rounded">
                <p className="mb-2">{review.content}</p>
                <p className="text-sm text-gray-400 mb-2">
                  By: {review.username} | Likes: {review.likes_count}
                </p>
                {user && (
                  <div className="space-x-2">
                    <button
                     onClick={() => handleLike(review.id)}
                className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300"
                  >
                  {review.isLiked ? 'Unlike' : 'Like'} 
                 
                      </button>
                    {user.id === review.user_id && (
                      <>
                        <button
                          onClick={() => handleEditReview(movie.id, review.id, review.content)}
                          className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(movie.id, review.id)}
                          className="bg-red-500 text-gray-900 px-3 py-1 rounded hover:bg-red-400"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span> Page {page} </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300"
            >
              Next
            </button>
          </div>
          {user && (
            <form onSubmit={handleAddReview} className="mt-4">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-purple-400 text-gray-900 p-2 rounded hover:bg-purple-300"
              >
                Add Review
              </button>
            </form>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MovieDetails;
