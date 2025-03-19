import React, { useState, useEffect } from 'react';
import axiosInstance from '../api';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', description: '', release_date: '', url :'' });
  const [editingMovie, setEditingMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const res = await axiosInstance.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user.is_admin) {
      fetchMovies();
    }
  }, [user]);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/movies', newMovie);
      setNewMovie({ title: '', description: '', release_date: '' , url : ''});
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/movies/${editingMovie.id}`, editingMovie);
      setEditingMovie(null);
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await axiosInstance.delete(`/admin/movies/${movieId}`);
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !user.is_admin) {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Create Movie</h3>
        <form onSubmit={handleCreateMovie} className="bg-gray-800 p-4 rounded">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
            value={newMovie.url}
            onChange={(e) => setNewMovie({ ...newMovie, url: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
            value={newMovie.description}
            onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
            required
          />
          <input
            type="date"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
            value={newMovie.release_date}
            onChange={(e) => setNewMovie({ ...newMovie, release_date: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-400 text-gray-900 p-2 rounded hover:bg-purple-300"
          >
            Create
          </button>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-2">Movies List</h3>
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li key={movie.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
              {editingMovie && editingMovie.id === movie.id ? (
                <form onSubmit={handleUpdateMovie} className="w-full">
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                    value={editingMovie.title}
                    onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                    required
                  />
                   <input
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                    value={editingMovie.url}
                    onChange={(e) => setEditingMovie({ ...editingMovie, url: e.target.value })}
                    required
                  />
                  <textarea
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                    value={editingMovie.description}
                    onChange={(e) => setEditingMovie({ ...editingMovie, description: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                    value={editingMovie.release_date}
                    onChange={(e) => setEditingMovie({ ...editingMovie, release_date: e.target.value })}
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMovie(null)}
                      className="bg-gray-500 text-gray-900 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <strong>{movie.title}</strong>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditMovie(movie)}
                      className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="bg-red-500 text-gray-900 px-3 py-1 rounded hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
