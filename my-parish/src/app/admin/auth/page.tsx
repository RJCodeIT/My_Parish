'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/mojaParafia/admin/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-neutral/30">
        <div>
          <h2 className="text-center text-2xl font-bold text-primary">
            Panel administracyjny
          </h2>
          <p className="mt-2 text-center text-sm text-neutral italic">
            Zaloguj się aby zarządzać parafią
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-primary mb-1">
              Login
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 rounded-md border border-neutral/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
              value={formData.username}
              onChange={handleChange}
              placeholder="Wprowadź login"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
              Hasło
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-md border border-neutral/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
              value={formData.password}
              onChange={handleChange}
              placeholder="Wprowadź hasło"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 transition-all font-medium"
            >
              Zaloguj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}