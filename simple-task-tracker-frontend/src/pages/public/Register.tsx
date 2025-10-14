import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import heroImage from '../../assets/hero.png';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('One lowercase letter');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('One number');
    }

    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password complexity
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setError(`Password must contain: ${errors.join(', ')}`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">

      {/* Left Side - Register Form */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center">
        <div className="space-y-8 px-16 w-full max-w-md">
          {/* Title */}
          <div>
            <h1 className="text-6xl font-bold text-gray-900">
              Sign Up
            </h1>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-black text-lg"
              />
            </div>

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
                onChange={handlePasswordChange}
                required
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-black text-lg"
              />
              {password && passwordErrors.length > 0 && (
                <div className="mt-2 px-4 text-sm text-gray-600">
                  <p className="font-medium mb-1">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={password.length >= 8 ? 'text-green-600' : 'text-red-600'}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                      • One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                      • One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                      • One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-black text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="text-gray-600 text-base">
              Already have an account? <span onClick={() => navigate('/login')} className="text-black font-semibold cursor-pointer hover:underline">Login</span>
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

export default Register;
