import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Menu, X, Gift } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              Δ
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:inline">
              Delta Stars
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleNavigate('/profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    location === '/profile'
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  مكافآتي
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleNavigate('/profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    location === '/profile'
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  الملف الشخصي
                </motion.button>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400">
                  {user?.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </>
            ) : (
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                دخول
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-2"
          >
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400"
            >
              <Gift className="w-4 h-4" />
              مكافآتي
            </button>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400"
            >
              <User className="w-4 h-4" />
              الملف الشخصي
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
