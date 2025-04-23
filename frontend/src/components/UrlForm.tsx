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
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-gray-700 py-3 px-6">
        <h2 className="text-lg font-semibold text-white">Shorten a URL</h2>
      </div>
      <div className="p-6">
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="originalUrl" className="sr-only">URL to shorten</label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors whitespace-nowrap"
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