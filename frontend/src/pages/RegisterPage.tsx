import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create an Account</h1>
      <RegisterForm />
      <p className="text-center mt-6 text-gray-600">
        Already have an account? <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;