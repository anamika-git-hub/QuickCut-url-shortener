import { useState, useEffect } from 'react';
import { getUrls, deleteUrl, getShortUrl, Url } from '../services/url.service';

const UrlList = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const data = await getUrls();
      setUrls(data);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      setUrls(urls.filter(url => url.id !== id));
      
      const totalPages = Math.ceil((urls.length - 1) / itemsPerPage);
      if (currentPage > 1 && currentPage > totalPages) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setError('Failed to delete URL');
    }
  };

  const handleCopy = (shortCode: string, id: string) => {
    const shortUrl = getShortUrl(shortCode);
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUrls = urls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(urls.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <h2 className="text-xl font-bold text-teal-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        Your Shortened URLs
      </h2>
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-200 min-h-[300px]">
        {currentUrls.map((url, index) => (
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
                    {url.originalUrl}
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
                  onClick={() => handleDelete(url.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {currentUrls.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No URLs on this page
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
                    {Math.min(indexOfLastItem, urls.length)}
                  </span>{' '}
                  of <span className="font-medium">{urls.length}</span> results
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
    </div>
  );
};

export default UrlList;