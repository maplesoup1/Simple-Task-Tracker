import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import heroImage from '../../assets/hero.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">

      {/* Left Side - Login Form */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center">
        <div className="space-y-8 px-16 w-full max-w-md">
          {/* Title */}
          <div>
            <h1 className="text-6xl font-bold text-gray-900">
              Login
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-black text-lg"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-black text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-gray-600 text-base">
              Don't have an account? <span onClick={() => navigate('/register')} className="text-black font-semibold cursor-pointer hover:underline">Sign up</span>
            </p>

            <p onClick={() => navigate('/')} className="text-gray-600 text-base cursor-pointer hover:underline">
               ← Back to home
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
      </div>

    </div>
  );
};

export default Login;
