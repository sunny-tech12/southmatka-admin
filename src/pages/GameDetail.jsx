// Location: admin-panel/src/pages/GameDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameAPI, handleAPIError } from '../utils/api';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betsLoading, setBetsLoading] = useState(false);
  const [error, setError] = useState('');
  const [betStatusFilter, setBetStatusFilter] = useState('');

  useEffect(() => {
    fetchGameDetail();
  }, [id]);

  useEffect(() => {
    if (game) {
      fetchBets();
    }
  }, [betStatusFilter]);

  const fetchGameDetail = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getGameDetail(id);
      if (response.data.success) {
        setGame(response.data.data.game);
        setResult(response.data.data.result);
        setStats(response.data.data.stats);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchBets = async () => {
    try {
      setBetsLoading(true);
      const response = await gameAPI.getGameBets(id, betStatusFilter);
      if (response.data.success) {
        setBets(response.data.data.bets);
      }
    } catch (err) {
      console.error('Error fetching bets:', err);
    } finally {
      setBetsLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!window.confirm('Activate this game? Users will be able to place bets.')) {
      return;
    }

    try {
      const response = await gameAPI.activateGame(id);
      if (response.data.success) {
        alert('Game activated successfully');
        fetchGameDetail();
      }
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const handleCloseBetting = async () => {
    if (!window.confirm('Close betting for this game? No more bets will be accepted.')) {
      return;
    }

    try {
      const response = await gameAPI.closeBetting(id);
      if (response.data.success) {
        alert('Betting closed successfully');
        fetchGameDetail();
      }
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this game? It will be removed from user view.')) {
      return;
    }

    try {
      const response = await gameAPI.deleteGame(id);
      if (response.data.success) {
        alert('Game deleted successfully');
        navigate('/games');
      }
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'betting_closed': return 'bg-orange-100 text-orange-800';
      case 'open_declared': return 'bg-purple-100 text-purple-800';
      case 'declared': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
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
        <p className="mt-4 text-gray-600 font-medium">Loading game details...</p>
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
            onClick={() => navigate('/games')} 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 via-yellow-50 to-blue-50 rounded-2xl p-6 border border-orange-200 shadow-sm">
        <Link 
          to="/games" 
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 transition-colors duration-200 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Games
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              {game.name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Game Details & Bets</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(game.status)} shadow-sm inline-block`}>
            {game.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Game Info Card */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Game Information
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Betting Start</p>
              <p className="font-bold text-gray-900 text-sm">{formatDateTime(game.betting_start)}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Betting End</p>
              <p className="font-bold text-gray-900 text-sm">{formatDateTime(game.betting_end)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Result Time</p>
              <p className="font-bold text-gray-900 text-sm">{formatDateTime(game.result_time)}</p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Created On</p>
              <p className="font-bold text-gray-900 text-sm">{formatDateTime(game.created_at)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            {game.status === 'created' && (
              <button onClick={handleActivate} className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl">
                Activate Game
              </button>
            )}
            {game.status === 'active' && (
              <button onClick={handleCloseBetting} className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl">
                Close Betting
              </button>
            )}
            {game.status === 'betting_closed' && (
              <Link to={`/games/${id}/declare-open`} className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-center transition-all duration-200 shadow-lg hover:shadow-xl">
                Declare OPEN Result
              </Link>
            )}
            {game.status === 'open_declared' && (
              <Link to={`/games/${id}/declare-close`} className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-center transition-all duration-200 shadow-lg hover:shadow-xl">
                Declare CLOSE Result
              </Link>
            )}
            {game.status === 'declared' && (
              <button onClick={handleDelete} className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl">
                Delete Game
              </button>
            )}
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
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2 font-medium">Total Bets</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalBets || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-2 font-medium">Total Bet Amount</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{stats?.totalBetAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Result
          </h3>
          {result ? (
            <div className="space-y-3">
              {result.open_panna && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Open Panna</p>
                  <p className="text-2xl font-bold text-blue-600">{result.open_panna}</p>
                  <p className="text-sm text-gray-600 mt-1">Ank: <span className="font-bold">{result.open_ank}</span></p>
                  {result.open_declared_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Declared: {formatDateTime(result.open_declared_at)}
                    </p>
                  )}
                </div>
              )}
              
              {result.close_panna ? (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Close Panna</p>
                  <p className="text-2xl font-bold text-green-600">{result.close_panna}</p>
                  <p className="text-sm text-gray-600 mt-1">Ank: <span className="font-bold">{result.close_ank}</span></p>
                  {result.close_declared_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Declared: {formatDateTime(result.close_declared_at)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-300 text-center">
                  <p className="text-sm font-semibold text-yellow-700">Close result pending</p>
                </div>
              )}
              
              {result.jodi && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Jodi</p>
                  <p className="text-3xl font-bold text-purple-600">{result.jodi}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Result not declared yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bets Section */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              All Bets
            </h3>
            
            {/* Bet Status Filter */}
            <div className="flex flex-wrap gap-2">
              {['', 'pending', 'win', 'loss'].map((status) => (
                <button
                  key={status}
                  onClick={() => setBetStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    betStatusFilter === status
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {betsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading bets...</p>
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-700">No bets placed yet</p>
              <p className="text-sm text-gray-500 mt-2">Bets will appear here once users start playing</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Bet Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Number</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Win Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bets.map((bet) => (
                      <tr key={bet._id} className="hover:bg-orange-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{bet.user_id?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{bet.user_id?.phone || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            {bet.bet_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-blue-600">{bet.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">₹{bet.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            bet.status === 'win' ? 'bg-green-100 text-green-800' :
                            bet.status === 'loss' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bet.status === 'win' ? (
                            <span className="font-bold text-green-600 text-lg">
                              ₹{bet.winning_amount?.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {new Date(bet.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {bets.map((bet) => (
                  <div key={bet._id} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{bet.user_id?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{bet.user_id?.phone || 'N/A'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bet.status === 'win' ? 'bg-green-100 text-green-800' :
                        bet.status === 'loss' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bet.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Bet Type</p>
                        <p className="text-sm font-bold text-gray-900">{bet.bet_type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Number</p>
                        <p className="text-sm font-mono font-bold text-blue-600">{bet.number}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Bet Amount</p>
                        <p className="text-sm font-bold text-gray-900">₹{bet.amount}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Win Amount</p>
                        {bet.status === 'win' ? (
                          <p className="text-sm font-bold text-green-600">₹{bet.winning_amount?.toLocaleString()}</p>
                        ) : (
                          <p className="text-sm text-gray-400">-</p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Time: {new Date(bet.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetail;