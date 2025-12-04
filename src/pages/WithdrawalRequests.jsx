// // Location: admin-panel/src/pages/WithdrawalRequests.jsx

// import React, { useState, useEffect } from 'react';
// import { adminAPI, handleAPIError } from '../utils/api';

// const WithdrawalRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [statusFilter, setStatusFilter] = useState('pending');
//   const [processing, setProcessing] = useState(null);

//   // Reject modal
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectRequestId, setRejectRequestId] = useState(null);
//   const [rejectNote, setRejectNote] = useState('');

//   useEffect(() => {
//     fetchRequests();
//   }, [statusFilter]);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getWithdrawalRequests(statusFilter);
//       if (response.data.success) {
//         setRequests(response.data.data.requests);
//       }
//     } catch (err) {
//       setError(handleAPIError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (requestId) => {
//     if (!window.confirm('Are you sure you want to approve this withdrawal? Coins will be deducted from user wallet.')) {
//       return;
//     }

//     setProcessing(requestId);
//     try {
//       const response = await adminAPI.approveWithdrawal(requestId);
//       if (response.data.success) {
//         alert('Withdrawal approved successfully. Please process the payment to user.');
//         fetchRequests();
//       }
//     } catch (err) {
//       alert(handleAPIError(err));
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const openRejectModal = (requestId) => {
//     setRejectRequestId(requestId);
//     setShowRejectModal(true);
//   };

//   const handleReject = async (e) => {
//     e.preventDefault();

//     setProcessing(rejectRequestId);
//     try {
//       const response = await adminAPI.rejectWithdrawal(rejectRequestId, rejectNote);
//       if (response.data.success) {
//         alert('Withdrawal request rejected successfully');
//         setShowRejectModal(false);
//         setRejectNote('');
//         setRejectRequestId(null);
//         fetchRequests();
//       }
//     } catch (err) {
//       alert(handleAPIError(err));
//     } finally {
//       setProcessing(null);
//     }
//   };

//   return (
//     <div>
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
//         <p className="text-gray-600 mt-2">Manage user withdrawal requests</p>
//       </div>

//       {/* Status Filter */}
//       <div className="card mb-6">
//         <div className="flex items-center space-x-4">
//           <span className="text-sm font-medium text-gray-700">Filter by status:</span>
//           <div className="flex space-x-2">
//             {['pending', 'approved', 'rejected'].map((status) => (
//               <button
//                 key={status}
//                 onClick={() => setStatusFilter(status)}
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
//                   statusFilter === status
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Requests Table */}
//       <div className="card">
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="spinner"></div>
//           </div>
//         ) : requests.length === 0 ? (
//           <div className="text-center py-12">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//             </svg>
//             <p className="mt-4 text-gray-600">No {statusFilter} withdrawal requests found</p>
//           </div>
//         ) : (
//           <div className="table-container">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Phone</th>
//                   <th>Amount</th>
//                   <th>Current Balance</th>
//                   <th>Payment Method</th>
//                   <th>Payment Details</th>
//                   <th>Status</th>
//                   <th>Requested On</th>
//                   {statusFilter === 'pending' && <th>Actions</th>}
//                   {statusFilter !== 'pending' && <th>Processed On</th>}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {requests.map((request) => (
//                   <tr key={request._id} className="hover:bg-gray-50">
//                     <td className="font-medium">{request.user_id?.name}</td>
//                     <td>{request.user_id?.phone}</td>
//                     <td>
//                       <span className="font-semibold text-red-600">
//                         ₹{request.amount?.toLocaleString()}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="text-gray-600">
//                         ₹{request.user_id?.balance?.toLocaleString()}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded uppercase">
//                         {request.payment_method}
//                       </span>
//                     </td>
//                     <td>
//                       {request.payment_method === 'bank' ? (
//                         <div className="text-xs">
//                           <p><strong>A/C:</strong> {request.bank_details?.account_number}</p>
//                           <p><strong>IFSC:</strong> {request.bank_details?.ifsc_code}</p>
//                           <p><strong>Name:</strong> {request.bank_details?.account_holder_name}</p>
//                         </div>
//                       ) : (
//                         <div className="text-xs">
//                           <p><strong>UPI:</strong> {request.upi_id}</p>
//                         </div>
//                       )}
//                     </td>
//                     <td>
//                       <span className={`badge ${
//                         request.status === 'pending' ? 'badge-warning' :
//                         request.status === 'approved' ? 'badge-success' :
//                         'badge-danger'
//                       }`}>
//                         {request.status}
//                       </span>
//                     </td>
//                     <td className="text-gray-500 text-sm">
//                       {new Date(request.created_at).toLocaleString()}
//                     </td>
//                     {statusFilter === 'pending' ? (
//                       <td>
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleApprove(request._id)}
//                             disabled={processing === request._id}
//                             className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
//                           >
//                             {processing === request._id ? 'Processing...' : 'Approve'}
//                           </button>
//                           <button
//                             onClick={() => openRejectModal(request._id)}
//                             disabled={processing === request._id}
//                             className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </td>
//                     ) : (
//                       <td className="text-gray-500 text-sm">
//                         {request.processed_at ? new Date(request.processed_at).toLocaleString() : '-'}
//                         {request.note && (
//                           <p className="text-xs text-gray-500 mt-1">Note: {request.note}</p>
//                         )}
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Important Note */}
//       <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//         <div className="flex">
//           <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-yellow-800">Important</h3>
//             <div className="mt-2 text-sm text-yellow-700">
//               <ul className="list-disc list-inside space-y-1">
//                 <li>When you approve a withdrawal, coins are automatically deducted from user's wallet</li>
//                 <li>You must manually process the payment to user's bank/UPI after approval</li>
//                 <li>Keep proof of payment for records</li>
//                 <li>User cannot place bets if balance becomes insufficient</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Reject Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Withdrawal Request</h3>
//             <form onSubmit={handleReject}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason for rejection
//                 </label>
//                 <textarea
//                   value={rejectNote}
//                   onChange={(e) => setRejectNote(e.target.value)}
//                   placeholder="Enter reason (optional)"
//                   className="input-field"
//                   rows="4"
//                 ></textarea>
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   type="submit"
//                   disabled={processing}
//                   className="flex-1 btn-danger disabled:opacity-50"
//                 >
//                   {processing ? 'Rejecting...' : 'Reject Request'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowRejectModal(false);
//                     setRejectNote('');
//                     setRejectRequestId(null);
//                   }}
//                   className="flex-1 btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WithdrawalRequests;
// Location: admin-panel/src/pages/WithdrawalRequests.jsx

import React, { useState, useEffect } from 'react';
import { adminAPI, handleAPIError } from '../utils/api';

const WithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [processing, setProcessing] = useState(null);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWithdrawalRequests(statusFilter);
      if (response.data.success) {
        setRequests(response.data.data.requests);
      }
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this withdrawal? Coins will be deducted from user wallet.')) {
      return;
    }

    setProcessing(requestId);
    try {
      const response = await adminAPI.approveWithdrawal(requestId);
      if (response.data.success) {
        alert('Withdrawal approved successfully. Please process the payment to user.');
        fetchRequests();
      }
    } catch (err) {
      alert(handleAPIError(err));
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (requestId) => {
    setRejectRequestId(requestId);
    setShowRejectModal(true);
  };

  const handleReject = async (e) => {
    e.preventDefault();

    setProcessing(rejectRequestId);
    try {
      const response = await adminAPI.rejectWithdrawal(rejectRequestId, rejectNote);
      if (response.data.success) {
        alert('Withdrawal request rejected successfully');
        setShowRejectModal(false);
        setRejectNote('');
        setRejectRequestId(null);
        fetchRequests();
      }
    } catch (err) {
      alert(handleAPIError(err));
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border border-red-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Withdrawal Requests
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user withdrawal requests</p>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter by status:</span>
          <div className="flex flex-wrap gap-2">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
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

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">No {statusFilter} withdrawal requests</p>
            <p className="text-sm text-gray-500">Requests will appear here once users submit them</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-red-50 to-orange-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Balance</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Details</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Requested</th>
                    {statusFilter === 'pending' && <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>}
                    {statusFilter !== 'pending' && <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Processed</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-orange-50/50 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xs">
                              {request.user_id?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">{request.user_id?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{request.user_id?.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-red-600 text-lg">
                          ₹{request.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-gray-600 font-medium">
                          ₹{request.user_id?.balance?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase">
                          {request.payment_method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {request.payment_method === 'bank' ? (
                          <div className="text-xs space-y-1">
                            <p className="font-mono"><strong>A/C:</strong> {request.bank_details?.account_number}</p>
                            <p className="font-mono"><strong>IFSC:</strong> {request.bank_details?.ifsc_code}</p>
                            <p><strong>Name:</strong> {request.bank_details?.account_holder_name}</p>
                          </div>
                        ) : (
                          <div className="text-xs">
                            <p className="font-mono"><strong>UPI:</strong> {request.upi_id}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                        {new Date(request.created_at).toLocaleString()}
                      </td>
                      {statusFilter === 'pending' ? (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(request._id)}
                              disabled={processing === request._id}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              {processing === request._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => openRejectModal(request._id)}
                              disabled={processing === request._id}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      ) : (
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          <p>{request.processed_at ? new Date(request.processed_at).toLocaleString() : '-'}</p>
                          {request.note && (
                            <p className="text-xs text-gray-500 mt-1 italic">Note: {request.note}</p>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {requests.map((request) => (
                <div key={request._id} className="p-4 hover:bg-orange-50/50 transition-colors duration-150">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {request.user_id?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{request.user_id?.name}</p>
                        <p className="text-sm text-gray-600">{request.user_id?.phone}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Withdrawal Amount</p>
                      <p className="font-bold text-red-600 text-lg">₹{request.amount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Current Balance</p>
                      <p className="font-semibold text-blue-600">₹{request.user_id?.balance?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Payment Method:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase">
                        {request.payment_method}
                      </span>
                    </div>
                    {request.payment_method === 'bank' ? (
                      <div className="text-xs space-y-1">
                        <p className="font-mono"><strong>A/C:</strong> {request.bank_details?.account_number}</p>
                        <p className="font-mono"><strong>IFSC:</strong> {request.bank_details?.ifsc_code}</p>
                        <p><strong>Name:</strong> {request.bank_details?.account_holder_name}</p>
                      </div>
                    ) : (
                      <div className="text-xs">
                        <p className="font-mono"><strong>UPI ID:</strong> {request.upi_id}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <p>Requested: {new Date(request.created_at).toLocaleString()}</p>
                    {request.processed_at && (
                      <p>Processed: {new Date(request.processed_at).toLocaleString()}</p>
                    )}
                    {request.note && (
                      <p className="mt-1 italic">Note: {request.note}</p>
                    )}
                  </div>

                  {statusFilter === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={processing === request._id}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {processing === request._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => openRejectModal(request._id)}
                        disabled={processing === request._id}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Important Note */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-5 shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ Important Guidelines</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <p>When you approve a withdrawal, coins are automatically deducted from user's wallet</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <p>You must manually process the payment to user's bank/UPI after approval</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <p>Keep proof of payment for records</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                <p>User cannot place bets if balance becomes insufficient</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Withdrawal Request</h3>
            </div>
            
            <form onSubmit={handleReject}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for rejection
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Enter reason (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {processing ? 'Rejecting...' : 'Reject Request'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectNote('');
                    setRejectRequestId(null);
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

export default WithdrawalRequests;