import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-12 sm:py-20">
      <div className="text-center mx-auto max-w-3xl px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-teal-700">QuickCut</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">A professional way to shorten, manage, and track your URLs</p>
        
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-full p-3 mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Easy URL Shortening</h2>
            <p className="text-gray-600 mb-6 text-center">Transform long, unwieldy links into clean, memorable, and trackable short URLs.</p>
            
            {isAuthenticated ? (
              <div className="w-full">
                <Link 
                  to="/dashboard" 
                  className="block w-full text-center py-3 px-4 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="w-full space-y-3">
                <Link 
                  to="/register" 
                  className="block w-full text-center py-3 px-4 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/login" 
                  className="block w-full text-center py-3 px-4 bg-white text-teal-600 font-medium rounded-md border border-teal-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Simple & Fast</h3>
            <p className="text-gray-600">Create shortened URLs in seconds with our user-friendly interface.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Track & Analyze</h3>
            <p className="text-gray-600">Monitor clicks and engagement with comprehensive analytics.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Secure & Reliable</h3>
            <p className="text-gray-600">Your links are always available and protected with our secure platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;