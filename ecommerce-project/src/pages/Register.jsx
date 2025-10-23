import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const validateForm = () => {
        const Error = {}
        if (!form.name.trim()) {
            Error.name = "Name is required"
        }
        if (!form.email.trim()) {
            Error.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            Error.email = "Email is invalid"
        }
        if (!form.password.trim()) {
            Error.password = "Password is required"
        } else if (form.password.length < 6) {
            Error.password = "Password must be at least 6 characters"
        }
        if (!form.confirmPassword.trim()) {
            Error.confirmPassword = "Confirm Password is required"
        }
        if (form.password.trim() !== form.confirmPassword.trim()) {
            Error.confirmPassword = "Passwords do not match"
        }
        return Error
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })

        if (errors[name]) {
            const updatedErrors = { ...errors }
            delete updatedErrors[name]
            setErrors(updatedErrors)
        }
        if (serverError) {
            setServerError('');
        }
    }
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formErrors = validateForm();
    //     if (Object.keys(formErrors).length > 0) {
    //         setErrors(formErrors);
    //         return;
    //     }
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch('http://localhost:8000/api/auth/register', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 name: form.name,
    //                 email: form.email,
    //                 password: form.password,
    //             })
    //         });

    //         // First check if we have a response body
    //         const text = await response.text();
    //         const data = await response.json();


    //         if (!response.ok) {
    //             console.log(response.status);
    //             throw new Error(data.message || 'Registration failed. Please try again.');
    //         }

    //         // If we get here, registration was successful
    //         console.log('Registration successful:', data);
    //         navigate('/login');
    //     } catch (error) {
    //         console.error('Registration error:', error);
    //         setServerError(error.message || 'Failed to connect to the server. Please try again.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formErrors = validateForm();
    //     if (Object.keys(formErrors).length > 0) {
    //         setErrors(formErrors);
    //         return;
    //     }
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.post('http://localhost:8000/api/auth/register', {
    //             name: form.name,
    //             email: form.email,
    //             password: form.password,
    //         });

    //         // Axios automatically parses JSON and puts it in response.data
    //         console.log('Registration successful:', response.data);
    //         navigate('/login');

    //     } catch (error) {
    //         console.error('Registration error:', error);

    //         // Handle axios error response
    //         if (error.response) {
    //             // Server responded with error status
    //             setServerError(error.response.data.message || 'Registration failed. Please try again.');
    //         } else if (error.request) {
    //             // Request was made but no response received
    //             setServerError('Failed to connect to the server. Please try again.');
    //         } else {
    //             // Something else happened
    //             setServerError(error.message || 'An error occurred. Please try again.');
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted!'); // Add this

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        console.log('Sending request...', form); 

        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            console.log('Success!', response.data); 
            navigate('/login');

        } catch (error) {
            console.error('Full error object:', error); 
            console.error('Error response:', error.response); 

            if (error.response) {
                setServerError(error.response.data.message || 'Registration failed. Please try again.');
            } else if (error.request) {
                setServerError('Failed to connect to the server. Please try again.');
            } else {
                setServerError(error.message || 'An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className='flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden fixed inset-0'>
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 ">Register</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
                    <input type="text" name="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 bg-white text-black" placeholder="Name" value={form.name} onChange={handleChange} />
                    <input type="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 bg-white text-black" placeholder="Email" value={form.email} onChange={handleChange} />
                    <input type="password" name="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 bg-white text-black" placeholder="Password" value={form.password} onChange={handleChange} />
                    <input type="password" name="confirmPassword" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 bg-white text-black" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
                    <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mt-2">Register</button>
                    {serverError && <p className="text-red-500 mt-2">{serverError}</p>}
                </form>
            </div>
        </div>
    )

}
export default Register;
