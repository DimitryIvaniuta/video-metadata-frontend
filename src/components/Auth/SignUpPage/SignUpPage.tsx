import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/contexts/AuthContext';
import { useSignUpMutation,
    useLoginMutation
} from '@/graphql/generated/graphql';


// 1) Validation schema
const signupSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email:    z.string().email('Must be a valid email'),
    password: z.string().min(6, 'Password must be ≥ 6 characters'),
});
type SignupForm = z.infer<typeof signupSchema>;

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { token, login: setAuthToken } = useAuth();

    // 2) GraphQL mutations
    const [signUp,   { loading: signupLoading,   error: signupError   }] = useSignUpMutation();
    const [login,{ loading: loginLoading,    error: loginError    }] = useLoginMutation();

    // 3) If already authenticated, send to import cabinet
    useEffect(() => {
        if (token) navigate('/videos/import', { replace: true });
    }, [token, navigate]);

    // 4) Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    // 5) On submit: sign up → login → set token → redirect
    const onSubmit = async (values: SignupForm) => {
        try {
            // a) Create user
            await signUp({ variables: { input: values } });

            // b) Immediately log them in
            const { data } = await login({
                variables: { username: values.username, password: values.password },
            });

            const jwt = data?.login?.token;
            if (!jwt) throw new Error('No token received after signup');

            // c) Persist & update context
            localStorage.setItem('jwtToken', jwt);
            setAuthToken(values.username, values.password); // internally navigates to '/'
            // but we want to go to /videos/import
            navigate('/videos/import', { replace: true });

        } catch {
            // errors surface via `signupError` or `loginError`
        }
    };

    const isLoading = signupLoading || loginLoading;
    const serverError = signupError?.message || loginError?.message;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register('username')}
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-danger">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-danger">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="At least 6 characters"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-danger">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Server error */}
                    {serverError && (
                        <p className="text-center text-sm text-danger">{serverError}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center h-12 bg-primary text-white font-medium
                       rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Creating account…' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}
