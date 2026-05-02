'use client';

import React, { useState, useEffect } from 'react';
import { User, Scale, Ruler, Calendar as AgeIcon, Zap, Save, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile {
  name: string;
  weight: string;
  height: string;
  age: string;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
}

export default function UserProfile({ userEmail, onNameUpdate }: { userEmail: string, onNameUpdate: (name: string) => void }) {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (data) {
        setProfile({
          name: data.name || '',
          weight: data.weight || '',
          height: data.height || '',
          age: data.age || '',
          gender: data.gender || 'male',
          activityLevel: data.activity_level || 'sedentary'
        });
        if (data.name) onNameUpdate(data.name);
      }
    }
    loadProfile();
  }, [userEmail]);

  const saveProfile = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      email: userEmail,
      name: profile.name,
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      activity_level: profile.activityLevel,
      updated_at: new Date().toISOString()
    });

    if (!error) {
      localStorage.setItem('health_user_name', profile.name);
      onNameUpdate(profile.name);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      window.dispatchEvent(new Event('health-data-saved')); // Refresh BMR in dashboard if needed
    }
    setIsSaving(false);
  };

  const calculateBMR = () => {
    if (!profile.weight || !profile.height || !profile.age) return 0;
    const w = parseFloat(profile.weight);
    const h = parseFloat(profile.height);
    const a = parseFloat(profile.age);
    
    if (profile.gender === 'male') {
      return Math.round(10 * w + 6.25 * h - 5 * a + 5);
    } else {
      return Math.round(10 * w + 6.25 * h - 5 * a - 161);
    }
  };

  const bmr = calculateBMR();
  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
  const tdee = Math.round(bmr * multipliers[profile.activityLevel]);

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} /> Personal Profile
        </h2>
        <button 
          className="primary" 
          onClick={saveProfile} 
          disabled={isSaving}
          style={{ padding: '0.6rem 1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showSuccess ? <CheckCircle size={18} /> : (isSaving ? 'Saving...' : <Save size={18} />)}
          {showSuccess ? 'Saved!' : (isSaving ? '' : 'Update Profile')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="responsive-grid">
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>YOUR NAME</label>
          <input 
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            placeholder="How should we call you?"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>EMAIL (READ-ONLY)</label>
          <input 
            value={userEmail}
            disabled
            style={{ width: '100%', background: 'rgba(0,0,0,0.05)', cursor: 'not-allowed' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <Scale size={14} style={{ marginRight: '0.3rem' }} /> WEIGHT (KG)
          </label>
          <input 
            type="number" 
            value={profile.weight}
            onChange={(e) => setProfile({...profile, weight: e.target.value})}
            placeholder="70"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <Ruler size={14} style={{ marginRight: '0.3rem' }} /> HEIGHT (CM)
          </label>
          <input 
            type="number" 
            value={profile.height}
            onChange={(e) => setProfile({...profile, height: e.target.value})}
            placeholder="175"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <AgeIcon size={14} style={{ marginRight: '0.3rem' }} /> AGE
          </label>
          <input 
            type="number" 
            value={profile.age}
            onChange={(e) => setProfile({...profile, age: e.target.value})}
            placeholder="25"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>GENDER</label>
          <select 
            value={profile.gender}
            onChange={(e) => setProfile({...profile, gender: e.target.value as 'male' | 'female'})}
            style={{ width: '100%' }}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <Zap size={14} style={{ marginRight: '0.3rem' }} /> LIFESTYLE / ACTIVITY
          </label>
          <select 
            value={profile.activityLevel}
            onChange={(e) => setProfile({...profile, activityLevel: e.target.value as any})}
            style={{ width: '100%' }}
          >
            <option value="sedentary">Sedentary (Office Job)</option>
            <option value="light">Lightly Active (Light Exercise)</option>
            <option value="moderate">Moderately Active (3-5 days/week)</option>
            <option value="active">Very Active (6-7 days/week)</option>
            <option value="extra">Extra Active (Athlete/Physical Job)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>BASE BMR</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{bmr}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>kcal / day</div>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.25rem', borderRadius: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>MAINTENANCE (TDEE)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>{tdee}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>kcal / day</div>
        </div>
      </div>
    </div>
  );
}
