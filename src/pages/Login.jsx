import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      const routes = { admin: '/admin', faculty: '/faculty', hod: '/hod', student: '/student' };
      navigate(routes[result.role] || '/student');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotLoading(true);
    const result = await forgotPassword(forgotEmail);
    if (result.success) {
      setForgotMsg('Password reset email sent! Check your inbox.');
    } else {
      setForgotMsg(result.error);
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 py-12 px-4">
      <div className="max-w-md w-full">

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full blur-xl opacity-30 scale-110"></div>
              <img
                src="/image/logo.jpeg"
                alt="JJMMC"
                className="relative h-28 w-28 object-contain rounded-full shadow-xl border-4 border-white"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            JJMMC
          </h1>
          <h2 className="text-xl font-bold text-gray-700 mt-1">Medical College Davangere</h2>
          <p className="text-sm text-gray-500 mt-1">Patient Registration System · Dermatology Dept.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
          {!showForgot ? (
            <>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-1">Welcome back!</h3>
              <p className="text-center text-sm text-gray-500 mb-6">Sign in to continue</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@jjmmc.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/30 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/30 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-blue-600 hover:text-pink-600 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                New user?{' '}
                <span className="text-blue-600 font-semibold">Contact Administrator</span>
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-1">Reset Password</h3>
              <p className="text-center text-sm text-gray-500 mb-6">
                Enter your email to receive a password reset link
              </p>

              {forgotMsg && (
                <div className={`px-4 py-3 rounded-xl text-sm mb-4 ${
                  forgotMsg.includes('sent') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {forgotMsg}
                </div>
              )}

              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@jjmmc.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:opacity-50 transition-all"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </form>

              <button
                onClick={() => { setShowForgot(false); setForgotMsg(''); setForgotEmail(''); }}
                className="w-full mt-4 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
              >
                ← Back to Login
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 JJMMC. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
