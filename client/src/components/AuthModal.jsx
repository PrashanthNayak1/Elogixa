import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CloudCog, Eye, EyeOff, Mail, User, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';


const AuthModal = ({ isOpen, onClose, onUserAuthenticated }) => {
    const navigate = useNavigate();
    const [roleTab, setRoleTab] = useState('user'); // 'user' or 'admin'
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setError('');
        setRoleTab('user');
        setMode('login');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const normalizeAuthUser = (data) => ({
        id: data._id,
        username: data.username,
        email: data.email,
        role: data.role || 'user',
        token: data.token,
    });

    const redirectToAdminLogin = () => {
        handleClose();
        navigate('/admin/login');
    };

    const redirectToAdminDashboard = (token) => {
        localStorage.setItem('adminToken', token);
        handleClose();
        navigate('/admin/dashboard');
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/google`, {
                token: credentialResponse.credential, // the JWT from Google
            });

            if (data.role === 'admin') {
                redirectToAdminDashboard(data.token);
                return;
            }

            const authUser = normalizeAuthUser(data);

            localStorage.setItem('elogixaUser', JSON.stringify(authUser));
            onUserAuthenticated(authUser);
            toast.success(`Welcome back, ${data.username || 'User'}!`);
            handleClose();
        } catch (err) {
            console.error('Google Auth Error:', err);
            setError(err.response?.data?.message || 'Google Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google Sign In was unsuccessful. Try again later.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signup') {
                const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                    username,
                    email,
                    password,
                    role: roleTab,
                });

                if (roleTab === 'admin') {
                    toast.success(data.message || 'Admin registration submitted for approval.');
                    handleClose();
                    redirectToAdminLogin();
                    return;
                }

                const authUser = normalizeAuthUser(data);
                localStorage.setItem('elogixaUser', JSON.stringify(authUser));
                onUserAuthenticated(authUser);
                toast.success('Account created successfully!');
                handleClose();
                return;
            }

            const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password,
            });

            if (roleTab === 'admin' && data.role !== 'admin') {
                setError('Authorization failed. Admin credentials required.');
                setLoading(false);
                return;
            }

            if (data.role === 'admin') {
                redirectToAdminDashboard(data.token);
                return;
            }

            const authUser = normalizeAuthUser(data);
            localStorage.setItem('elogixaUser', JSON.stringify(authUser));
            onUserAuthenticated(authUser);
            toast.success(`Welcome back, ${data.username || 'User'}!`);
            handleClose();
        } catch (err) {
            const message = err.response?.data?.message || 'Authentication failed';
            setError(mode === 'login' && message === 'Invalid username or password'
                ? 'Invalid credentials. Please verify your details or sign up.'
                : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/35 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleClose}>
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#ece7d8] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7d8] bg-[#fff8e8]">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {roleTab === 'admin' ? 'Admin Portal' : (mode === 'login' ? 'Login' : 'Sign Up')}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {roleTab === 'admin' ? 'Secure access for Elogixa administrators.' : 'Welcome to the Elogixa user portal.'}
                        </p>
                    </div>
                    <button onClick={handleClose} className="text-slate-500 hover:text-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex rounded-xl p-1 mb-6 bg-[#f0eee4] shadow-inner font-medium">
                        <button
                            onClick={() => { setRoleTab('user'); setMode('login'); setError(''); }}
                            className={`flex flex-1 items-center justify-center py-2.5 rounded-lg text-sm transition-all duration-200 ${roleTab === 'user' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User size={16} className="mr-2" />
                            User Account
                        </button>
                        <button
                            onClick={() => { setRoleTab('admin'); setMode('login'); setError(''); }}
                            className={`flex flex-1 items-center justify-center py-2.5 rounded-lg text-sm transition-all duration-200 ${roleTab === 'admin' ? 'bg-white text-amber-700 shadow-sm ring-1 ring-amber-100' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <CloudCog size={16} className="mr-2" />
                            Admin Access
                        </button>
                    </div>

                    {roleTab === 'user' && (
                        <div className="grid grid-cols-2 gap-2 bg-[#f7f5ec] rounded-xl p-1 mb-5">
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('signup'); setError(''); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {roleTab === 'admin' && mode === 'login' && (
                        <div className="mb-4 text-center">
                            <div className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                                Administrator login only
                            </div>
                        </div>
                    )}

                    {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input-field pl-10 disabled:opacity-50"
                                        placeholder="Your name"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10 disabled:opacity-50"
                                    placeholder="you@example.com"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-10 disabled:opacity-50"
                                    placeholder="Enter password"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2" disabled={loading}>
                            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            {loading ? (mode === 'login' ? 'Logging in...' : 'Creating account...') : (mode === 'login' ? 'Login' : 'Create Account')}
                        </button>
                    </form>

                    {roleTab === 'user' && (
                        <div className="mt-6">
                            <div className="relative flex py-2 items-center mb-4">
                                <div className="flex-grow border-t border-[#ece7d8]"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">Or continue with</span>
                                <div className="flex-grow border-t border-[#ece7d8]"></div>
                            </div>

                            <div className="flex justify-center flex-col items-center w-full pointer-events-auto overflow-hidden">
                                {!loading ? (
                                    <div className="flex justify-center w-full">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            useOneTap={false}
                                            theme="outline"
                                            shape="pill"
                                            size="large"
                                            text="signin_with"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-[40px] rounded-full border border-slate-200 bg-slate-50 animate-pulse w-full"></div>
                                )}
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-sm text-slate-500 text-center">
                        {roleTab === 'user' ? (
                            mode === 'login' ? 'No account yet? Switch to Sign Up.' : 'Already have an account? Switch to Login.'
                        ) : (
                            <button
                                onClick={redirectToAdminLogin}
                                className="text-amber-600 hover:text-amber-700 hover:underline transition-colors block mx-auto pt-1"
                            >
                                Need to register an admin? Go to Admin Portal
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
