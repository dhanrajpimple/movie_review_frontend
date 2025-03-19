import React, { useEffect, useState } from 'react';
import axiosInstance from '../api';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
function MoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get('/movies');
        setMovies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Movies List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
           <Link
           to={`/movie/${movie.id}`}
           >
          <div
          key={movie.id}
          className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
        >
          <img
            src={movie.url}
            className="h-40 w-full object-cover rounded-md"
            alt={movie.title}
          />
          <div className='flex  items-center justify-around align-middle mt-4'>
          <h1
           
            className=" text-purple-400 text-xl font-semibold  text-center"
          >
            {movie.title}
          </h1>
          <div className="flex items-center justify-center mt-2  text-gray-400">
            <MessageCircle size={18} className="mr-1" /> 
            <span className="text-sm">{movie.review_count || 0}</span>
          </div>
          </div>
        </div>
        </Link>
        ))}
      </div>
    </div>
  );
}

export default MoviesList;
