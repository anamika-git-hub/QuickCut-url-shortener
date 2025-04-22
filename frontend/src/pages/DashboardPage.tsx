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
      <h1>Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      
      <UrlForm onUrlCreated={handleUrlCreated} />
      
      <div key={refreshKey}>
        <UrlList />
      </div>
    </div>
  );
};

export default DashboardPage;