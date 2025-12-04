// Location: admin-panel/src/pages/UserDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminAPI, handleAPIError } from '../utils/api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentBets, setRecentBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Coin management
  const [showAddCoins, setShowAddCoins] = useState(false);
  const [showSubtractCoins, setShowSubtractCoins] = useState(false);
  const [coinAmount, setCoinAmount] = useState('');
  const [coinNote, setCoinNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetail(id);
      if (response.data.success) {
        setUser(response.data.data.user);
        setStats(response.data.data.stats);
        setRecentBets(response.data.data.recentBets);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoins = async (e) => {
    e.preventDefault();
    if (!coinAmount || coinAmount <= 0) {
      alert('Please enter valid amount');
      return;
    }

    setProcessing(true);
    try {
      const response = await adminAPI.addCoins(id, parseInt(coinAmount), coinNote);
      if (response.data.success) {
        alert('Coins added successfully');
        setShowAddCoins(false);
        setCoinAmount('');
        setCoinNote('');
        fetchUserDetail();
      }
    } catch (err) {
      alert(handleAPIError(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleSubtractCoins = async (e) => {
    e.preventDefault();
    if (!coinAmount || coinAmount <= 0) {
      alert('Please enter valid amount');
      return;
    }

    if (parseInt(coinAmount) > user.balance) {
      alert('Amount exceeds user balance');
      return;
    }

    setProcessing(true);
    try {
      const response = await adminAPI.subtractCoins(id, parseInt(coinAmount), coinNote);
      if (response.data.success) {
        alert('Coins deducted successfully');
        setShowSubtractCoins(false);
        setCoinAmount('');
        setCoinNote('');
        fetchUserDetail();
      }
    } catch (err) {
      alert(handleAPIError(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!window.confirm(`Are you sure you want to ${user.status === 'active' ? 'block' : 'unblock'} this user?`)) {
      return;
    }

    try {
      const response = await adminAPI.toggleUserStatus(id);
      if (response.data.success) {
        setUser({ ...user, status: response.data.data.status });
        alert(`User ${response.data.data.status === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
      }
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
        <Link
          to="/users"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors duration-200 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* User Card */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-blue-100">
                  <span className="text-white font-bold text-4xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`absolute bottom-0 right-0 w-6 h-6 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} rounded-full border-4 border-white`}></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mt-1 font-medium">{user.phone}</p>
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mt-3 ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Balance:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{user.balance?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Joined:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Role:</span>
                  <span className="font-semibold text-gray-900 capitalize">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setShowAddCoins(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Coins
              </button>
              <button
                onClick={() => setShowSubtractCoins(true)}
                className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                Subtract Coins
              </button>
              <button
                onClick={handleToggleStatus}
                className={`w-full px-4 py-3 ${user.status === 'active' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {user.status === 'active' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {user.status === 'active' ? 'Block User' : 'Unblock User'}
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Total Bets:</span>
                  <span className="text-xl font-bold text-blue-600">{stats?.totalBets || 0}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Won Bets:</span>
                  <span className="text-xl font-bold text-green-600">{stats?.wonBets || 0}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Lost Bets:</span>
                  <span className="text-xl font-bold text-red-600">{stats?.lostBets || 0}</span>
                </div>
              </div>
              <div className="pt-3 border-t-2 border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Bet Amount:</span>
                  <span className="font-bold text-gray-900">₹{stats?.totalBetAmount?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Win Amount:</span>
                  <span className="font-bold text-green-600">₹{stats?.totalWinAmount?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Bets */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-purple-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Recent Bets
              </h3>
            </div>

            <div className="p-6">
              {recentBets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">No bets placed yet</p>
                  <p className="text-sm text-gray-500 mt-2">This user hasn't placed any bets</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Game</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Number</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Win Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentBets.map((bet) => (
                          <tr key={bet._id} className="hover:bg-purple-50/50 transition-colors duration-150">
                            <td className="px-4 py-3 font-semibold text-gray-900">{bet.game_id?.name || 'N/A'}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                {bet.bet_type.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-blue-600">{bet.number}</td>
                            <td className="px-4 py-3 font-bold text-gray-900">₹{bet.amount}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bet.status === 'win' ? 'bg-green-100 text-green-800' :
                                  bet.status === 'loss' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {bet.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {bet.status === 'win' ? (
                                <span className="font-bold text-green-600">
                                  ₹{bet.winning_amount?.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-sm">
                              {new Date(bet.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-3">
                    {recentBets.map((bet) => (
                      <div key={bet._id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{bet.game_id?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-600 mt-1">{bet.bet_type.replace('_', ' ').toUpperCase()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bet.status === 'win' ? 'bg-green-100 text-green-800' :
                              bet.status === 'loss' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {bet.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-600">Number</p>
                            <p className="font-mono font-bold text-blue-600">{bet.number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Bet Amount</p>
                            <p className="font-bold text-gray-900">₹{bet.amount}</p>
                          </div>
                          {bet.status === 'win' && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-600">Win Amount</p>
                              <p className="font-bold text-green-600">₹{bet.winning_amount?.toLocaleString()}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                          {new Date(bet.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Coins Modal */}
      {showAddCoins && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Add Coins</h3>
            </div>
            <form onSubmit={handleAddCoins}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  min="1"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Note (Optional)</label>
                <textarea
                  value={coinNote}
                  onChange={(e) => setCoinNote(e.target.value)}
                  placeholder="Reason for adding coins"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 resize-none"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {processing ? 'Adding...' : 'Add Coins'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCoins(false);
                    setCoinAmount('');
                    setCoinNote('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subtract Coins Modal */}
      {showSubtractCoins && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Subtract Coins</h3>
            </div>
            <form onSubmit={handleSubtractCoins}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  min="1"
                  max={user.balance}
                  required
                />
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Available balance: <span className="text-green-600 font-bold">₹{user.balance?.toLocaleString()}</span>
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700mb-2">Note (Optional)</label>
                <textarea
                  value={coinNote}
                  onChange={(e) => setCoinNote(e.target.value)}
                  placeholder="Reason for deducting coins"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {processing ? 'Deducting...' : 'Subtract Coins'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubtractCoins(false);
                    setCoinAmount('');
                    setCoinNote('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserDetail;
