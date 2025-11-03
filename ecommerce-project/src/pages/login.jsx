import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const validateForm = () => {
        const error = {}
        if (!form.email.trim()) {
            error.email = "Email is required!"
        }
        if (!form.password.trim()) {
            error.password = "Password is required!"
        }
        return error
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
        if (errors[name]) {
            const newErrors = { ...errors }
            delete newErrors[name]
            setErrors(newErrors)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted!', form);

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        console.log('Sending request...', form);

        try {
             const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const apiUrl = `${baseUrl}/api/auth/login`;
            console.log('Making request to:', apiUrl);
            const response = await axios.post(apiUrl, {
                email: form.email,
                password: form.password,
            });
            console.log('Login successful', response.data);
            navigate('/')
        } catch (error) {
            console.log('Full error object:', error);
            console.log('Error response:', error.response);
            setServerError(error.response?.data?.message || 'An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 to-green-600 overflow-hidden fixed inset-0'>
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 ">Login</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
                    <input type="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mt-4 bg-white text-black" placeholder="Email" value={form.email} onChange={handleChange} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    <input type="password" name="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mt-4 bg-white text-black" placeholder="Password" value={form.password} onChange={handleChange} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {serverError && <p className="text-red-500 mt-2">{serverError}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;