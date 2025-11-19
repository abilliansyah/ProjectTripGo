import React, { FC, useState } from 'react';
import { Mail, Lock, User, Loader2, X, AlertTriangle } from 'lucide-react';

// Interfaces for component props
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fungsi yang dipanggil dari useAuth, dengan parameter (email, password, firstName)
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, login, register, isLoading, error }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      login(email, password);
    } else {
      register(email, password, firstName);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    // Reset fields and error when toggling view
    setEmail('');
    setPassword('');
    setFirstName('');
    // Note: error is reset by Navbar when modal is closed, but we can do it here too
  };

  const title = isLoginView ? 'Masuk ke Akun Anda' : 'Buat Akun Baru';
  const buttonText = isLoginView ? 'Masuk' : 'Daftar';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#15406A]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-3" />
            <span className="text-sm font-medium">Terjadi Kesalahan: {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* First Name Field (Only for Register) */}
          {!isLoginView && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nama Depan"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 karakter)"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#15406A] text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg hover:bg-[#12385e] transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading && <Loader2 size={20} className="animate-spin" />}
            <span>{buttonText}</span>
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 text-center text-sm">
          {isLoginView ? (
            <p>
              Belum punya akun?{' '}
              <button type="button" onClick={toggleView} className="text-[#15406A] font-semibold hover:underline">
                Daftar Sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button type="button" onClick={toggleView} className="text-[#15406A] font-semibold hover:underline">
                Masuk
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;