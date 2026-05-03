'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Plus, Trash2, CloudSync, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ActivityLog {
  id: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

const activityMET: Record<string, number> = {
  'walk': 3.5, 'walking': 3.5, 'brisk walk': 4.5,
  'run': 8.0, 'running': 8.0, 'jogging': 7.0,
  'cycle': 6.0, 'cycling': 6.0,
  'gym': 5.0, 'weight lifting': 5.0, 'strength': 5.0,
  'yoga': 2.5, 'pilates': 3.0,
  'swim': 7.0, 'swimming': 7.0,
  'hiit': 10.0, 'cardio': 8.0,
  'dance': 4.5, 'zumba': 6.5,
  'cricket': 5.0, 'football': 8.0, 'badminton': 5.5
};

export default function ActivityTracker({ userEmail }: { userEmail: string }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'light' | 'medium' | 'heavy' | 'athlete'>('medium');
  const [manualCalories, setManualCalories] = useState('');
  const storageKey = `health_activities_${userEmail}`;
  const [isSyncing, setIsSyncing] = useState(false);

  // Get user weight for better MET calculation
  const [userWeight, setUserWeight] = useState(70); 

  useEffect(() => {
    async function loadData() {
      // Load profile to get weight for MET
      const { data: profile } = await supabase.from('profiles').select('weight').eq('email', userEmail).single();
      if (profile?.weight) setUserWeight(parseFloat(profile.weight));

      const { data } = await supabase.from('activities').select('*').eq('email', userEmail);
      if (data && data.length > 0) {
        const loaded = data.map(a => ({
          id: a.id,
          name: a.name,
          duration: a.duration,
          caloriesBurned: a.calories_burned,
          date: a.date
        }));
        setActivities(loaded);
        localStorage.setItem(storageKey, JSON.stringify(loaded));
      } else {
        const saved = localStorage.getItem(storageKey);
        if (saved) setActivities(JSON.parse(saved));
      }
    }
    loadData();
  }, [userEmail]);

  useEffect(() => {
    const handleSync = async () => {
      setIsSyncing(true);
      try {
        await supabase.from('activities').delete().eq('email', userEmail);
        await supabase.from('activities').insert(
          activities.map(a => ({
            email: userEmail,
            date: a.date,
            name: a.name,
            duration: a.duration,
            calories_burned: a.caloriesBurned
          }))
        );
        localStorage.setItem(storageKey, JSON.stringify(activities));
      } finally {
        setIsSyncing(false);
      }
    };

    window.addEventListener('health-save-trigger', handleSync);
    return () => window.removeEventListener('health-save-trigger', handleSync);
  }, [activities, userEmail]);

  const getActivityEstimate = (actName: string, mins: string, intLevel: string = intensity) => {
    const d = parseFloat(mins) || 0;
    const lower = actName.toLowerCase();
    let met = 4.0; // default moderate activity

    for (const [key, value] of Object.entries(activityMET)) {
      if (lower.includes(key)) {
        met = value;
        break;
      }
    }

    let multiplier = 1.0;
    if (intLevel === 'light') multiplier = 0.7;
    if (intLevel === 'heavy') multiplier = 1.3;
    if (intLevel === 'athlete') multiplier = 1.6;

    return Math.round((met * multiplier * 3.5 * userWeight) / 200 * d);
  };

  const addActivity = () => {
    if (!name || !duration) return;
    
    const caloriesBurned = manualCalories ? Number(manualCalories) : getActivityEstimate(name, duration, intensity);

    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      duration: Number(duration),
      caloriesBurned,
      date: selectedDate
    };
    const updated = [...activities, newActivity];
    setActivities(updated);
    setName('');
    setDuration('');
    setManualCalories('');
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const currentActivities = activities.filter(a => a.date === selectedDate);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} /> Activity Tracker
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.1)' }}
          />
          {isSyncing && <div style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CloudSync size={16} className="animate-spin" />
          </div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 2 }}>
          <input 
            placeholder="Activity? (e.g. Walking)" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setManualCalories(getActivityEstimate(e.target.value, duration, intensity).toString());
            }}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
        </div>
        <select
          value={intensity}
          onChange={(e) => {
            const newInt = e.target.value as 'light' | 'medium' | 'heavy' | 'athlete';
            setIntensity(newInt);
            setManualCalories(getActivityEstimate(name, duration, newInt).toString());
          }}
          style={{ width: '100px' }}
        >
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
          <option value="athlete">Athlete</option>
        </select>
        <input 
          type="number" 
          placeholder="Min" 
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            setManualCalories(getActivityEstimate(name, e.target.value, intensity).toString());
          }}
          style={{ width: '70px' }}
        />
        <div style={{ position: 'relative', width: '90px' }}>
          <input 
            type="number" 
            placeholder="kcal" 
            value={manualCalories}
            onChange={(e) => setManualCalories(e.target.value)}
            style={{ width: '100%', paddingLeft: '0.5rem' }}
          />
        </div>
        <button onClick={addActivity} className="primary" style={{ width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {currentActivities.map((a) => (
          <div key={a.id} style={{ background: 'white', padding: '1rem', borderRadius: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{a.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {a.duration} mins
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>{a.caloriesBurned} kcal</div>
              <button onClick={() => removeActivity(a.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
