import { useState, useEffect } from 'react';
import { getUrls, deleteUrl, getShortUrl, Url } from '../services/url.service';

const UrlList = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const data = await getUrls();
      setUrls(data);
      setError('');
    } catch (error: any) {
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
      setUrls(urls.filter(url => url._id !== id));
    } catch (error: any) {
      setError('Failed to delete URL');
    }
  };

  const handleCopy = (shortCode: string) => {
    const shortUrl = getShortUrl(shortCode);
    navigator.clipboard.writeText(shortUrl);
    alert('Short URL copied to clipboard!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (urls.length === 0) {
    return <div>No URLs yet. Create your first shortened URL above!</div>;
  }

  return (
    <div className="url-list">
      <h2>Your Shortened URLs</h2>
      {urls.map((url) => (
        <div key={url._id} className="url-item">
          <div className="url-item-header">
            <span className="url-item-title">
              {url.originalUrl.length > 50 ? `${url.originalUrl.substring(0, 50)}...` : url.originalUrl}
            </span>
            <span 
              className="url-item-delete"
              onClick={() => handleDelete(url._id)}
            >
              Delete
            </span>
          </div>
          <div>
            <a 
              href={getShortUrl(url.shortCode)} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {getShortUrl(url.shortCode)}
            </a>
            <button 
              onClick={() => handleCopy(url.shortCode)}
              style={{ marginLeft: '10px', padding: '2px 5px' }}
            >
              Copy
            </button>
          </div>
          <div className="url-item-stats">
            Clicks: {url.clicks} | Created: {new Date(url.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UrlList;