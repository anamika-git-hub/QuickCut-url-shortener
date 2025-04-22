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
    <div className="form-container">
      <h2>Shorten a URL</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="originalUrl">URL to shorten</label>
          <input
            type="url"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <button 
          type="submit" 
          className="form-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default UrlForm;