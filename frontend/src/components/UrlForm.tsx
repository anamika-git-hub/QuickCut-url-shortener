import { useState } from 'react';
import { createUrl } from '../services/url.service';

interface UrlFormProps {
  onUrlCreated: () => void;
}

const UrlForm = ({ onUrlCreated }: UrlFormProps) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

  return (
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
  );
};

export default UrlForm;