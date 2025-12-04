// Location: admin-panel/src/pages/DeclareResult.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameAPI, handleAPIError } from '../utils/api';

const DeclareResult = ({ type = 'open' }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [declaring, setDeclaring] = useState(false);
  const [error, setError] = useState('');

  const [panna, setPanna] = useState(['', '', '']);

  const isOpenDeclaration = type === 'open';
  const isCloseDeclaration = type === 'close';

  useEffect(() => {
    fetchGameDetail();
  }, [id]);

  const fetchGameDetail = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getGameDetail(id);
      if (response.data.success) {
        const gameData = response.data.data.game;
        const resultData = response.data.data.result;
        
        // Validation based on type
        if (isOpenDeclaration && gameData.status !== 'betting_closed') {
          setError('Open result can only be declared when betting is closed');
        }
        
        if (isCloseDeclaration && gameData.status !== 'open_declared') {
          setError('Close result can only be declared after open result');
        }
        
        setGame(gameData);
        setResult(resultData);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePannaChange = (index, value) => {
    // Only allow single digit
    if (value === '' || (value.length === 1 && /^\d$/.test(value))) {
      const newPanna = [...panna];
      newPanna[index] = value;
      setPanna(newPanna);
    }
  };

  const calculateAnk = (pannaArray) => {
    const sum = pannaArray.reduce((acc, digit) => acc + parseInt(digit || 0), 0);
    return sum % 10;
  };

  const getAnk = () => {
    if (panna.every(d => d !== '')) {
      return calculateAnk(panna);
    }
    return '-';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (panna.some(d => d === '')) {
      setError('Please enter all 3 digits');
      return;
    }

    const pannaStr = panna.join('');
    const titleText = isOpenDeclaration ? 'OPEN' : 'CLOSE';
    
    if (!window.confirm(
      `Are you sure you want to declare ${titleText} result?\n\n` +
      `${titleText} Panna: ${pannaStr}\n` +
      `${titleText} Ank: ${getAnk()}\n\n` +
      `This will automatically calculate winners and add coins to their wallets.`
    )) {
      return;
    }

    setDeclaring(true);

    try {
      let response;
      if (isOpenDeclaration) {
        response = await gameAPI.declareOpen(id, pannaStr);
      } else {
        response = await gameAPI.declareClose(id, pannaStr);
      }

      if (response.data.success) {
        alert(`${titleText} result declared successfully! Winners have been calculated and coins distributed.`);
        navigate(`/games/${id}`);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setDeclaring(false);
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
        <p className="mt-4 text-gray-600 font-medium">Loading game details...</p>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
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

  const titleText = isOpenDeclaration ? 'OPEN' : 'CLOSE';
  const gradientClass = isOpenDeclaration ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600';
  const bgGradientClass = isOpenDeclaration ? 'from-blue-50 to-blue-100' : 'from-green-50 to-green-100';
  const borderClass = isOpenDeclaration ? 'border-blue-300' : 'border-green-300';
  const textClass = isOpenDeclaration ? 'text-blue-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${bgGradientClass} rounded-2xl p-6 border ${borderClass} shadow-sm`}>
        <Link 
          to={`/games/${id}`} 
          className={`inline-flex items-center ${textClass} hover:opacity-80 font-medium mb-4 transition-all duration-200 group`}
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Game Details
        </Link>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
              Declare {titleText} Result
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">{game?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
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

        {/* Game Info */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Game Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Game Name</p>
              <p className="font-bold text-gray-900">{game?.name}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Status</p>
              <p className="font-bold text-gray-900">{game?.status?.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Result Time</p>
              <p className="font-bold text-gray-900 text-sm">
                {new Date(game?.result_time).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Show Open Result if declaring Close */}
        {isCloseDeclaration && result?.open_panna && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 shadow-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Already Declared - OPEN Result
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-2 font-medium">Open Panna</p>
                <p className="text-3xl font-bold text-blue-900">{result.open_panna}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-2 font-medium">Open Ank</p>
                <p className="text-3xl font-bold text-blue-900">{result.open_ank}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Form */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className={`w-8 h-8 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center mr-2`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
            Enter {titleText} Result
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Panna Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                {titleText} Panna (3 Digits) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {panna.map((digit, index) => (
                    <input
                      key={`panna-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handlePannaChange(index, e.target.value)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 text-center text-3xl font-bold border-3 ${borderClass} rounded-xl focus:ring-4 focus:ring-${isOpenDeclaration ? 'blue' : 'green'}-200 focus:border-transparent shadow-lg transition-all duration-200`}
                      placeholder="0"
                      required
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <div className={`bg-gradient-to-br ${bgGradientClass} rounded-xl p-4 border ${borderClass} shadow-md`}>
                  <p className="text-xs text-gray-600 mb-1 font-medium text-center">Calculated Ank:</p>
                  <p className={`text-4xl sm:text-5xl font-bold ${textClass} text-center`}>{getAnk()}</p>
                </div>
              </div>
            </div>

            {/* Result Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {titleText} Result Summary:
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-gray-600 font-medium">{titleText} Panna:</span>
                  <span className="font-mono font-bold text-lg">
                    {panna.every(d => d !== '') ? panna.join('') : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-gray-600 font-medium">{titleText} Ank:</span>
                  <span className="font-mono font-bold text-lg">{getAnk()}</span>
                </div>
                
                {/* Show Jodi if Close declaration */}
                {isCloseDeclaration && result?.open_ank && getAnk() !== '-' && (
                  <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-300 shadow-sm">
                    <span className="text-purple-700 font-bold">Jodi:</span>
                    <span className="font-mono font-bold text-2xl text-purple-600">
                      {result.open_ank}{getAnk()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-5 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ Important Warning</h3>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                      <p>Once declared, {titleText.toLowerCase()} result cannot be changed</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                      <p>Winners will be automatically calculated</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                      <p>Winning amounts will be added to user wallets</p>
                    </div>
                    {isOpenDeclaration && (
                      <div className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                        <p>After this, users can only bet on Close, Jodi, and Sangam</p>
                      </div>
                    )}
                    {isCloseDeclaration && (
                      <div className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                        <p>After this, no more betting will be allowed</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="submit"
                disabled={declaring || panna.some(d => d === '')}
                className={`flex-1 px-6 py-4 bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-base flex items-center justify-center`}
              >
                {declaring ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Declaring {titleText} Result...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Declare {titleText} Result
                  </>
                )}
              </button>
              <Link 
                to={`/games/${id}`} 
                className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-center transition-all duration-200 text-base flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeclareResult;