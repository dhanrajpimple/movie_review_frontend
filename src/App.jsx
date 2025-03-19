import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MoviesList from './components/MoviesList';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './context/AuthContext';
import "./App.css"
function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-purple-400 hover:underline">
            Movies
          </Link>
          {user && user.is_admin && (
            <Link to="/admin" className="text-purple-400 hover:underline">
              Admin Panel
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <button
                onClick={logout}
                className="bg-purple-400 text-gray-900 px-3 py-1 rounded hover:bg-purple-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-purple-400 hover:underline">
                Login
              </Link>
              <Link to="/signup" className="text-purple-400 hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
