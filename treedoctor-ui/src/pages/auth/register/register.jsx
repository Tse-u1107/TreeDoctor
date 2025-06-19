import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import toast, { Toaster } from 'react-hot-toast';


const Register = () => {
    const navigate = useNavigate();
    const auth = getAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    // Update the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setError('Passwords do not match');
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading('Creating your account...');

        try {
            // Create authentication user
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            ).catch(error => {
                // Handle specific Firebase auth errors
                if (error.code === 'auth/network-request-failed') {
                    throw new Error('Network error. Please check your connection or disable ad blockers.');
                }
                if (error.code === 'auth/email-already-in-use') {
                    throw new Error('This email is already registered.');
                }
                throw error;
            });

            // If authentication successful, create user document
            const userCollectionId = `${userCredential.user.uid.slice(0,5)}${userCredential.user.uid.slice(-5)}`;
            
            await setDoc(doc(db, 'userTrees', userCollectionId), {
                email: userCredential.user.email,
                createdAt: new Date(),
                uid: userCredential.user.uid
            }).catch(error => {
                throw new Error('Failed to initialize user data. Please try again.');
            });

            // Success - dismiss loading toast and show success
            toast.dismiss(loadingToast);
            toast.success('Account created successfully!');
            navigate('/home');
        } catch (error) {
            // Dismiss loading toast and show error
            toast.dismiss(loadingToast);
            const errorMessage = error.message.replace('Firebase: ', '').replace(/\(auth.*\)/, '');
            toast.error(errorMessage);
            setError(errorMessage);
            
            // Log for debugging
            console.error('Registration error:', {
                code: error.code,
                message: error.message,
                name: error.name
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
                Create Account
            </button>

            <Toaster 
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: '#ecfdf5',
                            border: '1px solid #059669',
                            color: '#065f46',
                        },
                        iconTheme: {
                            primary: '#059669',
                            secondary: '#ecfdf5',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            border: '1px solid #dc2626',
                            color: '#991b1b',
                        },
                    },
                    duration: 3000,
                }}
            />
        </form>
    );
};

export default Register;