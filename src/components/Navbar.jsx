import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch, FaHospital } from 'react-icons/fa';

const Navbar = () => {
  const { logout, currentUser, userRole, userName } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const getRoleLabel = (role) => ({
    admin: 'Administrator',
    student: 'Student',
    faculty: 'Faculty',
    hod: 'Head of Department'
  }[role] || role);

  const getRoleBadge = (role) => ({
    admin: 'bg-purple-100 text-purple-700',
    hod: 'bg-blue-100 text-blue-700',
    faculty: 'bg-pink-100 text-pink-700',
    student: 'bg-green-100 text-green-700'
  }[role] || 'bg-gray-100 text-gray-700');

  return (
    <nav className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
            onClick={() => navigate(userRole === 'admin' ? '/admin' : userRole === 'faculty' ? '/faculty' : userRole === 'hod' ? '/hod' : '/student')}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow">
              <FaHospital className="text-white text-base" />
            </div>
            <div>
              <p className="text-base font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                JJMMC
              </p>
              <p className="text-xs text-gray-400 leading-tight hidden sm:block">Dermatology Dept.</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-blue-50/50"
              />
            </div>
          </form>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{userName || currentUser?.email}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleBadge(userRole)}`}>
                {getRoleLabel(userRole)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transition-all shadow"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-50 space-y-3">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-blue-50/50"
                />
              </div>
            </form>
            <div className="flex items-center gap-2 px-2 text-sm">
              <FaUser className="text-gray-400" />
              <span className="font-medium text-gray-700 truncate">{userName || currentUser?.email}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${getRoleBadge(userRole)}`}>
                {getRoleLabel(userRole)}
              </span>
            </div>
            <div className="px-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-pink-500"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
