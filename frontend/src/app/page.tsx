'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

interface Content {
  id: number;
  title: string;
  body: string;
  type: 'article' | 'video';
  url?: string;
}

interface DecodedToken {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export default function Home() {
  const [contents, setContents] = useState<Content[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Token not found. Please login.');
      return;
    }

    const decoded: DecodedToken = jwtDecode(token);
    setRole(decoded.role);

    axios.get('http://localhost:3000/api/content', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setContents(res.data))
    .catch(() => setError('Failed to fetch content'));

    axios.get(`http://localhost:3000/api/auth/${decoded.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setName(res.data.name))
    .catch(() => setName('User'));
  }, []);

  const articleCount = contents.filter(c => c.type === 'article').length;
  const videoCount = contents.filter(c => c.type === 'video').length;

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Welcome, {name}</h1>
        <p className="text-gray-700 text-sm">
          Role: <span className="font-medium">{role}</span> | Articles: <span className="text-blue-600">{articleCount}</span> | Videos: <span className="text-green-600">{videoCount}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contents.map(item => (
          <div key={item.id} className="bg-white shadow rounded-xl overflow-hidden">
            {item.type === 'video' && item.url ? (
              <iframe
                className="w-full h-48"
                src={item.url.replace("watch?v=", "embed/")}
                title={item.title}
                allowFullScreen
              />
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
                📄
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.body}</p>
              <p className="mt-1 text-xs text-blue-500 capitalize">Type: {item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
