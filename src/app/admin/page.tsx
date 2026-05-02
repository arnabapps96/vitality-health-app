'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Utensils, Activity, ArrowLeft, RefreshCw, ShieldCheck, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAIL = 'arnab.apps96@gmail.com';

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeals: 0,
    totalActivities: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedEmail = localStorage.getItem('health_user_email');
      if (savedEmail === ADMIN_EMAIL) {
        setAuthorized(true);
        fetchStats();
      } else {
        setAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [users, meals, acts] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('meals').select('*', { count: 'exact' }),
        supabase.from('activities').select('*', { count: 'exact' })
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalMeals: meals.count || 0,
        totalActivities: acts.count || 0
      });

      // Fetch most recent active users
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);
      
      setRecentUsers(data || []);
    } finally {
      setLoading(false);
    }
  };

  if (authorized === false) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)' }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ color: '#ef4444', marginBottom: '1rem' }}><ShieldCheck size={48} /></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Access Denied</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Only the administrator (Arnab Mitra) can view this page.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '1rem', textDecoration: 'none', fontWeight: '700' }}>
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (authorized === null || loading && stats.totalUsers === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)' }}>
        <div className="animate-spin text-emerald-600"><RefreshCw size={48} /></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Console</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#042f2e' }}>Engagement Hub</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchStats} className="glass-card" style={{ padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'white', color: 'var(--text-main)', borderRadius: '1rem', textDecoration: 'none', fontWeight: '700', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={18} /> Back to App
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '1.5rem' }}><Users size={32} /></div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.totalUsers}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Users</div>
            </div>
          </div>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '1.5rem' }}><Utensils size={32} /></div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.totalMeals}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Meals Logged</div>
            </div>
          </div>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '1.5rem' }}><Activity size={32} /></div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.totalActivities}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Exercises Recorded</div>
            </div>
          </div>
        </div>

        {/* User Activity List */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} /> Recent User Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentUsers.map((user, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user.name || 'Anonymous User'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={12} /> {user.email}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    Last Active
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
