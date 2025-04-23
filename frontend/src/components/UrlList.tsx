import { useState, useEffect } from 'react';
import { getUrls, deleteUrl, getShortUrl, Url } from '../services/url.service';

const UrlList = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-black">
        <p className="text-lg">No URLs yet. Create your first shortened URL above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-700 py-3 px-6">
        <h2 className="text-lg font-semibold text-white">Your Shortened URLs</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {urls.map((url) => (
          <li key={url.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-grow mb-3 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-1 truncate" title={url.originalUrl}>
                  {url.originalUrl}
                </h3>
                <div className="mt-2 flex items-center">
                  <a 
                    href={getShortUrl(url.shortCode)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    {getShortUrl(url.shortCode)}
                  </a>
                  <button 
                    onClick={() => handleCopy(url.shortCode, url.id)}
                    className="ml-3 text-gray-500 hover:text-gray-600 focus:outline-none"
                  >
                    <span className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 transition-colors">
                      {copiedId === url.id ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  <span className="mr-4">Clicks: {url.clicks}</span>
                  <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <button 
                  onClick={() => handleDelete(url.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UrlList;