// Location: admin-panel/src/pages/Games.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameAPI, handleAPIError } from '../utils/api';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchGames();
  }, [statusFilter]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const response = await gameAPI.getAllGames(params);
      if (response.data.success) {
        setGames(response.data.data.games);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (gameId) => {
    if (!window.confirm('Are you sure you want to activate this game? Users will be able to place bets.')) {
      return;
    }

    try {
      const response = await gameAPI.activateGame(gameId);
      if (response.data.success) {
        alert('Game activated successfully');
        fetchGames();
      }
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const handleCloseBetting = async (gameId) => {
    if (!window.confirm('Are you sure you want to close betting for this game?')) {
      return;
    }

    try {
      const response = await gameAPI.closeBetting(gameId);
      if (response.data.success) {
        alert('Betting closed successfully');
        fetchGames();
      }
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const handleDelete = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game? This will remove it from user view.')) {
      return;
    }

    try {
      const response = await gameAPI.deleteGame(gameId);
      if (response.data.success) {
        alert('Game deleted successfully');
        fetchGames();
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
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-50 via-yellow-50 to-blue-50 rounded-2xl p-6 border border-orange-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Games Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Create and manage games</p>
            </div>
          </div>
          <Link 
            to="/games/create" 
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Game
          </Link>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter by status:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${statusFilter === ''
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
            >
              All
            </button>
            {['created', 'active', 'betting_closed', 'open_declared', 'declared'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${statusFilter === status
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Games Table */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">No games found</p>
            <p className="text-sm text-gray-500 mb-6">Create your first game to get started</p>
            <Link 
              to="/games/create" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Game
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Game Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Betting Start</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Betting End</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Result Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {games.map((game) => (
                    <tr key={game._id} className="hover:bg-orange-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{game.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{formatDateTime(game.betting_start)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{formatDateTime(game.betting_end)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{formatDateTime(game.result_time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(game.status)}`}>
                          {game.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/games/${game._id}`}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                          >
                            View
                          </Link>

                          {game.status === 'created' && (
                            <>
                              <button
                                onClick={() => handleActivate(game._id)}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                              >
                                Activate
                              </button>
                              <button
                                onClick={() => handleDelete(game._id)}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </>
                          )}

                          {game.status === 'active' && (
                            <button
                              onClick={() => handleCloseBetting(game._id)}
                              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                            >
                              Close Betting
                            </button>
                          )}

                          {game.status === 'betting_closed' && (
                            <Link
                              to={`/games/${game._id}/declare-open`}
                              className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                            >
                              Declare Open
                            </Link>
                          )}

                          {game.status === 'open_declared' && (
                            <Link
                              to={`/games/${game._id}/declare-close`}
                              className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                            >
                              Declare Close
                            </Link>
                          )}

                          {game.status === 'declared' && (
                            <button
                              onClick={() => handleDelete(game._id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {games.map((game) => (
                <div key={game._id} className="p-4 hover:bg-orange-50/50 transition-colors duration-150">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{game.name}</h3>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(game.status)}`}>
                        {game.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Betting Start:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(game.betting_start)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Betting End:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(game.betting_end)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Result Time:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(game.result_time)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/games/${game._id}`}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm text-center transition-colors duration-200"
                    >
                      View Details
                    </Link>

                    {game.status === 'created' && (
                      <>
                        <button
                          onClick={() => handleActivate(game._id)}
                          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleDelete(game._id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {game.status === 'active' && (
                      <button
                        onClick={() => handleCloseBetting(game._id)}
                        className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        Close Betting
                      </button>
                    )}

                    {game.status === 'betting_closed' && (
                      <Link
                        to={`/games/${game._id}/declare-open`}
                        className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm text-center transition-colors duration-200"
                      >
                        Declare Open
                      </Link>
                    )}

                    {game.status === 'open_declared' && (
                      <Link
                        to={`/games/${game._id}/declare-close`}
                        className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm text-center transition-colors duration-200"
                      >
                        Declare Close
                      </Link>
                    )}

                    {game.status === 'declared' && (
                      <button
                        onClick={() => handleDelete(game._id)}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Games;