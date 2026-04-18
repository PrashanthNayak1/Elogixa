import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const API_BASE_URL = '/api';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('adminToken', token);
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, searchParams]);

    const clearForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isRegister ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`;
            const payload = isRegister ? { username, password, email, role: 'admin' } : { email, password };

            const { data } = await axios.post(endpoint, payload);

            if (isRegister) {
                setIsRegister(false);
                clearForm();
                setError('');
                toast.success(data.message || 'Registration submitted. Please wait for approval before logging in.');
            } else {
                clearForm();
                localStorage.setItem('adminToken', data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#fffefb] via-[#fff8df] to-[#f6f8f2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-10">
                <div className="grid lg:grid-cols-[1.1fr_480px] gap-10 lg:gap-16 items-center w-full">
                    <div className="hidden lg:block">
                        <img src="/elogixa-logo.png" alt="Elogixa" className="h-16 w-auto object-contain mb-8" />
                        <div className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm font-medium text-amber-700 mb-5">
                            Secure Admin Workspace
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-slate-800 leading-tight mb-6">
                            Manage jobs, track applications, and oversee activity in one place
                        </h1>
                        <p className="text-lg text-slate-600 max-w-xl mb-8">
                            Access jobs, applications, and contact requests from a dashboard that matches the public brand experience.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                            <div className="card bg-white/90 shadow-lg shadow-amber-100/40">
                                <ShieldCheck className="text-[#44b649] mb-3" size={24} />
                                <h3 className="font-semibold text-slate-800 mb-1">Protected Access</h3>
                                <p className="text-sm text-slate-600">Admin-only login flow with a clean and focused workspace.</p>
                            </div>
                            <div className="card bg-white/90 shadow-lg shadow-lime-100/40">
                                <Lock className="text-accent mb-3" size={24} />
                                <h3 className="font-semibold text-slate-800 mb-1">Unified Brand UI</h3>
                                <p className="text-sm text-slate-600">Designed with consistent branding for a cohesive experience.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card w-full max-w-md mx-auto p-6 sm:p-8 bg-white/95 shadow-2xl shadow-amber-100/50 border-[#ece7d8]">
                        <div className="flex justify-center mb-6">
                            <img src="/elogixa-logo.png" alt="Elogixa" className="h-12 sm:h-14 w-auto object-contain" />
                        </div>
                        <div className="flex justify-center mb-5">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-accent border border-amber-200">
                                <Lock size={24} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
                            {isRegister ? 'Admin Registration' : 'Admin Login'}
                        </h2>
                        <p className="text-sm text-center text-slate-500 mb-6">
                            {isRegister ? 'Create an admin account for the Elogixa dashboard.' : 'Sign in to manage jobs, applications, and messages.'}
                        </p>

                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isRegister && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700">Username</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input-field pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isRegister ? 'Registering...' : 'Logging in...'}
                                    </>
                                ) : (
                                    isRegister ? 'Register' : 'Login'
                                )}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                            >
                                {isRegister ? 'Already have an account? Login' : 'Need an admin account? Register'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
