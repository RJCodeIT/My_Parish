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
    router.push('/admin/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-[#FFF8E7]/80 backdrop-blur-sm rounded-xl shadow-xl border border-[#8B4513]/20">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#8B4513]">
            Panel administracyjny
          </h2>
          <p className="mt-2 text-center text-sm text-[#8B4513]/80">
            Zaloguj się aby zarządzać parafią
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#8B4513] mb-1">
                Login
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-3 py-2 border border-[#8B4513]/20 rounded-lg 
                         text-[#8B4513] bg-white/70 
                         focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]
                         placeholder-[#8B4513]/50 transition-all duration-200"
                placeholder="Wprowadź login"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#8B4513] mb-1">
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-3 py-2 border border-[#8B4513]/20 rounded-lg 
                         text-[#8B4513] bg-white/70 
                         focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]
                         placeholder-[#8B4513]/50 transition-all duration-200"
                placeholder="Wprowadź hasło"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white 
                       bg-[#8B4513] hover:bg-[#8B4513]/90 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513]/50 
                       transition-all duration-200"
            >
              Zaloguj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}