import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Instagram, Facebook, LayoutDashboard, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Listen for auth changes
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        subscription.unsubscribe();
      };
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Vehículos', href: '/#vehiculos' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHomePage ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className={`text-2xl font-display font-bold tracking-tight ${scrolled || !isHomePage ? 'text-brand-navy' : 'text-white'}`}>
              ANDES <span className="text-brand-orange">WAY</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled || !isHomePage ? 'text-brand-navy hover:text-brand-orange' : 'text-white hover:text-brand-orange'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {session && (
                <Link to="/admin" className={`p-2 rounded-full transition-colors ${scrolled || !isHomePage ? 'text-brand-navy hover:text-brand-orange' : 'text-white hover:text-brand-orange'}`} title="Admin Panel">
                  <LayoutDashboard size={20} />
                </Link>
              ) }
              <button className="btn-primary py-2 px-5 text-sm">
                Reservar
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {session ? (
              <Link to="/admin" className={`${scrolled || !isHomePage ? 'text-brand-navy' : 'text-white'}`}>
                <LayoutDashboard size={20} />
              </Link>
            ) : (
              <Link to="/login" className={`${scrolled || !isHomePage ? 'text-brand-navy' : 'text-white'}`}>
                <LogIn size={20} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled || !isHomePage ? 'text-brand-navy' : 'text-white'
              } hover:text-brand-orange focus:outline-none`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-navy hover:text-brand-orange hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {session ? (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-navy hover:text-brand-orange hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Panel Admin
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-navy hover:text-brand-orange hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
              <div className="px-3 py-2">
                <button className="w-full btn-primary">Reservar Ahora</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
