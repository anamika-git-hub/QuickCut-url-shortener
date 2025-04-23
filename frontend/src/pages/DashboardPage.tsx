import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUrlCreated = () => {
    // Force a refresh of the URL list
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome, {user?.username || 'User'}!</p>
      </div>
      
      <UrlForm onUrlCreated={handleUrlCreated} />
      
      <div key={refreshKey}>
        <UrlList />
      </div>
    </div>
  );
};

export default DashboardPage;