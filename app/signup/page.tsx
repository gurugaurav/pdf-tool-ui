'use client'; // Ensure client-side code

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                // Show error message
                setError(result.message || 'Something went wrong');
                setSuccess(null);
            } else {
                // Show success message and redirect
                setSuccess('User created successfully! Redirecting to login...');
                setError(null);
                setTimeout(() => {
                    router.push('/login'); // Redirect to login page
                }, 2000); // Delay to show success message
            }
        } catch (error) {
            setError('An unexpected error occurred');
            setSuccess(null);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            minLength={3}
                            name="username"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            minLength={5}
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordagain" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            minLength={5}
                            name="passwordagain"
                            id="passwordagain"
                            type="password"
                            placeholder="Confirm your password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="submit"
                            value="Sign Up"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                        />
                    </div>
                </form>
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                        {success}
                    </div>
                )}
            </div>
        </div>
    );
}
