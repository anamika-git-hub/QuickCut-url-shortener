import { useState, useEffect } from 'react';
import { getUrls, deleteUrl, getShortUrl, Url } from '../services/url.service';

const UrlList = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<Url | null>(null);

  useEffect(() => {
    if (!document.getElementById('modal-animation-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'modal-animation-style';
      styleElement.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        const element = document.getElementById('modal-animation-style');
        if (element) {
          document.head.removeChild(element);
        }
      };
    }
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal) {
        setShowDeleteModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showDeleteModal]);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const data = await getUrls();
      
      const urlMap = new Map<string, number>();
      const processedData = data.map(url => {
        const originalUrl = url.originalUrl;
        
        if (urlMap.has(originalUrl)) {
          const count = urlMap.get(originalUrl)! + 1;
          urlMap.set(originalUrl, count);
          
          return {
            ...url,
            displayUrl: `${originalUrl} (${count})`
          };
        } else {
          urlMap.set(originalUrl, 0);
          return {
            ...url,
            displayUrl: originalUrl
          };
        }
      });
      
      setUrls(processedData);
      setError('');
    } catch (error) {
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const confirmDelete = (url: Url) => {
    setUrlToDelete(url);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!urlToDelete) return;
    
    try {
      await deleteUrl(urlToDelete.id);
      setUrls(urls.filter(url => url.id !== urlToDelete.id));
      
      const totalPages = Math.ceil((urls.length - 1) / itemsPerPage);
      if (currentPage > 1 && currentPage > totalPages) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setError('Failed to delete URL');
    } finally {
      setShowDeleteModal(false);
      setUrlToDelete(null);
    }
  };

  const handleCopy = (shortCode: string, id: string) => {
    const shortUrl = getShortUrl(shortCode);
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUrls = urls.filter(url => 
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUrls = filteredUrls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const modalAnimation = {
    animation: 'fadeIn 0.2s ease-out',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center text-teal-700 min-h-[200px] flex items-center justify-center">
        <p className="text-lg">No URLs yet. Create your first shortened URL above!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-bold text-teal-800 flex items-center mb-3 md:mb-0">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Your Shortened URLs
        </h2>
        
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-200 min-h-[300px]">
        {currentUrls.length > 0 ? (
          currentUrls.map((url, index) => (
            <div key={url.id} className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-grow mb-3 md:mb-0">
                  <div className="flex items-center mb-2">
                    <div className="bg-teal-100 rounded-full p-1 mr-2">
                      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <h3 className="text-md font-medium text-gray-800 truncate" title={url.originalUrl}>
                      {url.displayUrl}
                    </h3>
                  </div>
                  <div className="flex items-center ml-7">
                    <a 
                      href={getShortUrl(url.shortCode)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 font-medium"
                    >
                      {getShortUrl(url.shortCode)}
                    </a>
                    <button 
                      onClick={() => handleCopy(url.shortCode, url.id)}
                      className="ml-3 text-teal-500 hover:text-teal-600 focus:outline-none"
                    >
                      <span className="text-xs bg-teal-100 hover:bg-teal-200 rounded px-2 py-1 transition-colors">
                        {copiedId === url.id ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-7 md:ml-0">
                  <div className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {url.clicks} clicks
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => confirmDelete(url)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No URLs match your search' : 'No URLs on this page'}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredUrls.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredUrls.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === i + 1
                          ? 'bg-teal-50 border-teal-500 text-teal-600 z-10'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && urlToDelete && (
        <div className="fixed inset-0 backdrop-brightness-50 z-50 flex items-center justify-center p-4">
          
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full" style={modalAnimation}>
            <div className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-medium text-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Confirm Delete
              </h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-white hover:text-red-100 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this shortened URL? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <div className="mb-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Original URL</p>
                  <div className="bg-white rounded p-3 break-all text-gray-700 text-sm border border-gray-200 max-h-24 overflow-auto">
                    {urlToDelete.originalUrl}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Short URL</p>
                  <div className="bg-white rounded p-3 text-teal-600 break-all text-sm font-medium border border-gray-200">
                    {getShortUrl(urlToDelete.shortCode)}
                  </div>
                </div>
              </div>

              <div className="text-gray-500 text-sm flex items-center mb-2">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                This URL has {urlToDelete.clicks} click{urlToDelete.clicks !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
              >
                Delete URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlList;