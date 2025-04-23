import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome Back</h1>
      <LoginForm />
      <p className="text-center mt-6 text-gray-600">
        Don't have an account? <Link to="/register" className="text-gray-600 hover:text-gray-800 font-medium">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;