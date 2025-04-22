import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <h1>URL Shortener</h1>
      <p>A simple way to shorten long URLs</p>
      
      {isAuthenticated ? (
        <div>
          <p>Logged in! Ready to create short URLs?</p>
          <Link 
            to="/dashboard" 
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4a90e2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '1rem',
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div>
          <p>Sign up or login to start shortening URLs</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <Link 
              to="/register" 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4a90e2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              Register
            </Link>
            <Link 
              to="/login" 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#4a90e2',
                textDecoration: 'none',
                borderRadius: '4px',
                border: '1px solid #4a90e2',
              }}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;