import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginMutation } from '@/graphql/generated/graphql';

// 1) Define a Zod schema for form validation
const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = ()=> {

    const navigate = useNavigate();
    const { token } = useAuth();
    const [loginMut, { loading, error }] = useLoginMutation();

    useEffect(() => {
        if (token) navigate('/', { replace: true });
    }, [token, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (values: LoginForm) => {
        try {
            const { data } = await loginMut({ variables: values });
            const jwt = data?.login?.token;
            if (!jwt) throw new Error('No token returned');
            localStorage.setItem('jwtToken', jwt);
            navigate('/', { replace: true });
        } catch {
            // error shown via error.message below
        }
    };

    return (
        <div className="min-h-fit bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-[500px] bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    Sign In
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register('username')}
                            className="w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            style={{height:40, padding:'10px 4px'}}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-danger">{errors.username.message}</p>
                        )}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label htmlFor="password" className="block text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="w-full h-12 px-4 border border-blue-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                            style={{height:40, padding:'10px 4px'}}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-center text-sm text-danger">{error.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 bg-primary text-white font-medium rounded hover:bg-primary/90 transition disabled:opacity-50"
                        style={{ marginTop: '1.5rem', padding: 10 }}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );

}
