'use client';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  console.log('Google Client ID:', googleClientId); // untuk debugging

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      Cookies.set('token', data.token);
      router.push('/');
    } catch (err) {
      alert('Login gagal');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      console.log('Google Login Response:', credentialResponse); // untuk debugging
      const { credential } = credentialResponse;
      const { data } = await axios.post('http://localhost:3000/api/auth/google-login', { 
        idToken: credential,
        token: credential // coba kedua format
      });
      Cookies.set('token', data.token);
      router.push('/');
    } catch (err: any) {
      console.error('Google Login Error:', err);
      alert(`Google Login gagal: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Error: Invalid client');
    alert('Google Login error - kemungkinan masalah konfigurasi client ID');
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
          
          {!googleClientId && (
            <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
              Warning: Google Client ID tidak ditemukan
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4"
          >
            Login
          </button>          <div className="text-center mb-2 text-sm text-gray-500">or</div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap={false}
              auto_select={false}
            />
          </div>

<p className="mt-2 text-center">
  Belum punya akun?{' '}
  <a href="/register" className="text-blue-600 hover:underline">Daftar</a>
</p>

        </div>
        
      </div>
    </GoogleOAuthProvider>
  );
}
