'use client';

import { useState, useEffect } from 'react';
import MealTracker from '@/components/MealTracker';
import ActivityTracker from '@/components/ActivityTracker';
import Dashboard from '@/components/Dashboard';
import UserProfile from '@/components/UserProfile';
import HowTo from '@/components/HowTo';
import { Heart, LogOut, Mail, ArrowRight, CloudSync, User, LayoutDashboard, Settings, BookOpen, X, Zap, Code } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'guide'>('dashboard');
  const [showDevModal, setShowDevModal] = useState(false);
  
  // Login/Signup state
  const [isSignUp, setIsSignUp] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [tempName, setTempName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('health_user_email');
    const savedName = localStorage.getItem('health_user_name');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setUserName(savedName || 'User');
      
      // Update last login on refresh
      supabase.from('profiles').update({
        last_login: new Date().toISOString()
      }).eq('email', savedEmail).then(() => {});
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail) return;
    setLoading(true);

    try {
      const email = tempEmail.toLowerCase().trim();
      const now = new Date().toISOString();
      
      if (isSignUp) {
        await supabase.from('profiles').upsert({
          email: email,
          name: tempName || 'User',
          last_login: now
        });
        setUserName(tempName || 'User');
        localStorage.setItem('health_user_name', tempName || 'User');
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('email', email)
          .single();
        
        // Update last login timestamp even for existing users
        await supabase.from('profiles').update({
          last_login: now
        }).eq('email', email);

        const finalName = data?.name || 'User';
        setUserName(finalName);
        localStorage.setItem('health_user_name', finalName);
      }

      setUserEmail(email);
      localStorage.setItem('health_user_email', email);
    } catch (err) {
      console.error(err);
      alert('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('health_user_email');
    localStorage.removeItem('health_user_name');
    setUserEmail(null);
    setUserName(null);
  };

  if (!userEmail) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        background: '#fff',
        overflow: 'hidden'
      }}>
        {/* Left Side: Photo Hero (Desktop Only) */}
        <div style={{ 
          flex: '1.2', 
          position: 'relative'
        }} className="login-hero">
          <img 
            src="/login-bg.png" 
            alt="Vitality Health" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(4, 47, 46, 0.4), rgba(4, 47, 46, 0.8))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '4rem',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1' }}>
              Your health is your<br/>greatest wealth.
            </h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '500px', lineHeight: '1.6', fontWeight: '500' }}>
              Join thousands of high-performers who use Vitality to track their data with precision and intent.
            </p>
            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>100%</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Data Privacy</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>AI</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Powered Tracking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form (Light on Desktop, Stealth on Mobile) */}
        <div style={{ 
          flex: '1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '1.5rem',
          position: 'relative'
        }} className="login-container-mobile">
          <div className="glass-card login-card-mobile" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '3.5rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'var(--primary)', color: 'white', width: '64px', height: '64px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <Heart size={32} fill="currentColor" />
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.75rem', color: '#042f2e', letterSpacing: '-0.025em' }} className="mobile-login-title">
              {isSignUp ? 'Get Started' : 'Welcome Back'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem', fontWeight: '500' }} className="mobile-login-p">
              {isSignUp ? 'Precision health starts today.' : 'Track your progress with intent.'}
            </p>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {isSignUp && (
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '1.25rem' }}
                  />
                  <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '1.25rem' }}
                />
                <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              </div>
              <button 
                className="primary" 
                disabled={loading}
                style={{ width: '100%', padding: '1.2rem', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', fontSize: '1.1rem', fontWeight: '800' }}
              >
                {loading ? 'Authenticating...' : (isSignUp ? 'Launch Journey' : 'Enter Dashboard')}
                {!loading && <ArrowRight size={22} />}
              </button>
            </form>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}
              >
                {isSignUp ? 'Already a member? Sign In' : 'New to Vitality? Join Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <main style={{ padding: '1rem', width: '100%', maxWidth: '1200px', margin: '0 auto', overflowX: 'hidden' }}>
      <header style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={28} fill="currentColor" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#042f2e', margin: 0 }}>
              Hello, {userName}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.8rem' }}>{userEmail}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.3)', padding: '0.4rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.5)', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{ 
            flex: '1 1 100px', padding: '0.75rem 0.5rem', borderRadius: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: activeTab === 'dashboard' ? 'white' : 'transparent',
            color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '700', boxShadow: activeTab === 'dashboard' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <LayoutDashboard size={18} /> Daily Stats
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ 
            flex: '1 1 100px', padding: '0.75rem 0.5rem', borderRadius: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: activeTab === 'profile' ? 'white' : 'transparent',
            color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '700', boxShadow: activeTab === 'profile' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Settings size={18} /> Profile
        </button>
        <button 
          onClick={() => setActiveTab('guide')}
          style={{ 
            flex: '1 1 100px', padding: '0.75rem 0.5rem', borderRadius: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: activeTab === 'guide' ? 'white' : 'transparent',
            color: activeTab === 'guide' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '700', boxShadow: activeTab === 'guide' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <BookOpen size={18} /> Guide
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="responsive-grid" style={{ display: 'grid', gap: '1.5rem', marginBottom: '120px' }}>
          <div className="full-width">
            <Dashboard userEmail={userEmail} />
          </div>
          <MealTracker userEmail={userEmail} />
          <ActivityTracker userEmail={userEmail} />
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div style={{ marginBottom: '120px' }}>
          <UserProfile userEmail={userEmail} onNameUpdate={(name) => setUserName(name)} />
        </div>
      )}

      {activeTab === 'guide' && (
        <div style={{ marginBottom: '120px' }}>
          <HowTo />
        </div>
      )}

      {/* Developer Link */}
      <footer style={{ marginTop: '2rem', paddingBottom: '8rem', textAlign: 'center' }}>
        <button 
          onClick={() => setShowDevModal(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.6, cursor: 'pointer', textDecoration: 'underline', fontStyle: 'italic' }}
        >
          Built with ❤️ by Arnab Mitra
        </button>
      </footer>

      {/* Dev Modal Overlay */}
      {showDevModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', position: 'relative', textAlign: 'center', padding: '2.5rem' }}>
            <button onClick={() => setShowDevModal(false)} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <div style={{ background: 'var(--primary)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
              <Code size={30} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: '#042f2e' }}>The Mind Behind Vitality</h2>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4b5563', marginBottom: '2rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Hey! I’m <strong>Arnab Mitra</strong>, a product strategist and data enthusiast who believes health tracking should be as smart as it is simple.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                From engineering models at <strong>J.P. Morgan</strong> to solving global strategy at <strong>BCG</strong>, I’ve spent my career obsessing over precision and impact.
              </p>
              <p>
                Vitality is my personal mission to bring that same strategic rigor to your daily wellness. No friction, just pure data-driven progress.
              </p>
            </div>
            <a 
              href="https://www.linkedin.com/in/arnab-mitra96/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: '#0077b5', color: 'white', padding: '1rem 2rem', borderRadius: '1.25rem', textDecoration: 'none', fontWeight: '700', fontSize: '1rem',
                transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(0, 119, 181, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              Let's Connect on LinkedIn
            </a>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 2rem',
          borderRadius: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          border: '1px solid rgba(255,255,255,0.5)',
          zIndex: 1000
        }} className="floating-save-bar">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Update cloud progress
          </p>
          <button 
            className="primary" 
            disabled={isSaving}
            onClick={() => {
              setIsSaving(true);
              window.dispatchEvent(new Event('health-save-trigger'));
              
              setTimeout(() => {
                window.dispatchEvent(new Event('health-data-saved'));
                setIsSaving(false);
                alert(`Progress synced for ${userName}!`);
              }, 1500);
            }}
            style={{ 
              padding: '0.75rem 2rem', 
              borderRadius: '1.25rem', 
              fontSize: '1rem',
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isSaving ? (
              <>
                <CloudSync size={18} className="animate-spin" />
                Saving...
              </>
            ) : 'Save Progress'}
          </button>
        </div>
      )}
    </main>
  );
}
