import { useState, useEffect } from 'react';
import { createUrl, getUrls } from '../services/url.service';

interface UrlFormProps {
  onUrlCreated: () => void;
}

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

const modalAnimation = {
  animation: 'fadeIn 0.2s ease-out',
};

const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const UrlForm = ({ onUrlCreated }: UrlFormProps) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingUrl, setExistingUrl] = useState<UrlData | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [userUrls, setUserUrls] = useState<UrlData[]>([]);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (!document.getElementById('modal-animation-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'modal-animation-style';
      styleElement.innerHTML = globalStyles;
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
    const fetchUserUrls = async () => {
      try {
        const urls = await getUrls();
        setUserUrls(urls);
      } catch (error) {
        console.error('Failed to fetch user URLs', error);
      }
    };
    
    fetchUserUrls();
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDuplicateModal) {
        setShowDuplicateModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showDuplicateModal]);

  const checkForDuplicate = () => {
    const duplicate = userUrls.find(url => url.originalUrl === originalUrl);
    if (duplicate) {
      setExistingUrl(duplicate);
      setShowDuplicateModal(true);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent, forceDuplicate = false) => {
    e.preventDefault();
    setError('');
    
    if (!forceDuplicate && checkForDuplicate()) {
      return;
    }
    
    setShowDuplicateModal(false);
    setIsLoading(true);
    
    try {
      await createUrl({ originalUrl });
      setOriginalUrl('');
      onUrlCreated();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create shortened URL');
    } finally {
      setIsLoading(false);
    }
  };

  const getBaseUrl = () => {
    return window.location.origin;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border-t-4 border-teal-600">
        <div className="bg-teal-600 py-3 px-6">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            Shorten a URL
          </h2>
        </div>
        <div className="p-6 bg-gradient-to-b from-teal-50 to-white">
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="originalUrl" className="block text-sm font-medium text-teal-700 mb-2">
                Enter a long URL
              </label>
              <input
                type="url"
                id="originalUrl"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="self-end px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Shorten URL'}
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 backdrop-brightness-50 z-50 flex items-center justify-center p-4">
          
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-lg w-full" style={modalAnimation}>
            <div className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-medium text-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                URL Already Shortened
              </h3>
              <button 
                onClick={() => setShowDuplicateModal(false)}
                className="text-white hover:text-teal-100 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                You already have a shortened link for this URL. Would you like to use the existing one or create a new one?
              </p>
              
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-100 mb-6">
                <div className="mb-4">
                  <p className="text-xs text-teal-700 font-medium uppercase tracking-wide mb-1">Original URL</p>
                  <div className="bg-white rounded p-3 break-all text-gray-700 text-sm border border-teal-100 max-h-24 overflow-auto">
                    {existingUrl?.originalUrl}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-teal-700 font-medium uppercase tracking-wide mb-1">Short URL</p>
                  <div className="flex items-center bg-white rounded p-3 border border-teal-100">
                    <a 
                      href={`${getBaseUrl()}/${existingUrl?.shortCode}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 break-all mr-2 flex-grow text-sm font-medium"
                    >
                      {`${getBaseUrl()}/${existingUrl?.shortCode}`}
                    </a>
                    <button 
                      onClick={() => existingUrl && copyToClipboard(`${getBaseUrl()}/${existingUrl.shortCode}`)}
                      className={`text-white p-2 rounded-md transition-colors ${copied ? 'bg-green-500' : 'bg-teal-500 hover:bg-teal-600'}`}
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 mt-2 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {existingUrl?.clicks} click{existingUrl?.clicks !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button 
                onClick={() => setShowDuplicateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors"
              >
                Use Existing
              </button>
              <button 
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors"
              >
                Create New
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UrlForm;