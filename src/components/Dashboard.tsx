'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LayoutDashboard, Calendar, TrendingUp } from 'lucide-react';
import NoSSR from './NoSSR';
import { supabase } from '@/lib/supabase';

const getDayName = (offset: number) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return days[d.getDay()];
};

const initialWeeklyData = [
  { day: getDayName(6), calories: 0, burned: 0 },
  { day: getDayName(5), calories: 0, burned: 0 },
  { day: getDayName(4), calories: 0, burned: 0 },
  { day: getDayName(3), calories: 0, burned: 0 },
  { day: getDayName(2), calories: 0, burned: 0 },
  { day: getDayName(1), calories: 0, burned: 0 },
  { day: getDayName(0), calories: 0, burned: 0 },
];

const initialYearlyData = [
  { month: 'Jan', avg: 0 },
  { month: 'Feb', avg: 0 },
  { month: 'Mar', avg: 0 },
  { month: 'Apr', avg: 0 },
  { month: 'May', avg: 0 },
];

export default function Dashboard({ userEmail }: { userEmail: string }) {
  const [view, setView] = useState<'daily' | 'weekly' | 'yearly'>('weekly');
  const [stats, setStats] = useState({ 
    caloriesIn: 0, 
    caloriesOut: 0, 
    exerciseCalories: 0, 
    weeklyIn: 0, 
    weeklyEx: 0, 
    weeklyOut: 0, 
    yearlyIn: 0, 
    yearlyEx: 0, 
    yearlyOut: 0, 
    weeklyWeightLoss: 0,
    yearlyWeightLoss: 0,
    dailyChange: 0,
    hasYesterdayData: false
  });
  const [weeklyData, setWeeklyData] = useState(initialWeeklyData);
  const [yearlyData, setYearlyData] = useState(initialYearlyData);

  useEffect(() => {
    const calculateStats = async () => {
      // 1. Fetch ALL data from Supabase
      const [mealsRes, activitiesRes, profileRes] = await Promise.all([
        supabase.from('meals').select('*').eq('email', userEmail),
        supabase.from('activities').select('*').eq('email', userEmail),
        supabase.from('profiles').select('*').eq('email', userEmail).single()
      ]);

      const meals = mealsRes.data || [];
      const activities = activitiesRes.data || [];
      const profile = profileRes.data || {};
      
      const todayDate = new Date().toLocaleDateString('en-CA');
      const todayMeals = meals.filter((m: any) => m.date === todayDate);
      const todayActivities = activities.filter((a: any) => a.date === todayDate);

      const totalIn = todayMeals.reduce((acc: number, m: any) => acc + (m.calories || 0), 0);
      const totalOutActivities = todayActivities.reduce((acc: number, a: any) => acc + (a.calories_burned || 0), 0);

      const getTDEE = (p: any) => {
        if (!p.weight || !p.height || !p.age) return 2000;
        const w = parseFloat(p.weight);
        const h = parseFloat(p.height);
        const a = parseFloat(p.age);
        const bmr = p.gender === 'male' ? (10 * w + 6.25 * h - 5 * a + 5) : (10 * w + 6.25 * h - 5 * a - 161);
        const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
        return Math.round(bmr * (multipliers[p.activity_level as keyof typeof multipliers] || 1.2));
      };

      const baseTDEE = getTDEE(profile);
      const totalOutToday = baseTDEE + totalOutActivities;

      let weeklyDeficit = 0, yearlyDeficit = 0, weeklyIn = 0, weeklyOutTotal = 0, weeklyEx = 0, yearlyIn = 0, yearlyOutTotal = 0, yearlyEx = 0;

      // ... rest of the complex calculation logic remains the same but uses cloud data ...
      const now = new Date();
      const allLogs = [
        ...meals.map((m: any) => ({ ...m, type: 'meal' })),
        ...activities.map((a: any) => ({ ...a, type: 'activity' }))
      ];

      const datesToProcess = Array.from(new Set(allLogs.map(l => l.date || todayDate)));
      
      const newWeeklyData = initialWeeklyData.map(dayObj => ({ ...dayObj, calories: 0, burned: 0 }));

      datesToProcess.forEach(dateStr => {
        const dMeals = meals.filter((m: any) => m.date === dateStr);
        const dActs = activities.filter((a: any) => a.date === dateStr);
        const dIn = dMeals.reduce((acc: number, m: any) => acc + (m.calories || 0), 0);
        const dEx = dActs.reduce((acc: number, a: any) => acc + (a.calories_burned || 0), 0);
        const dOut = baseTDEE + dEx;

        // Populate weekly chart data
        const dayName = new Date(dateStr!).toLocaleDateString('en-US', { weekday: 'short' });
        const chartDay = newWeeklyData.find(d => d.day === dayName);
        if (chartDay) {
          chartDay.calories = dIn;
          chartDay.burned = dOut;
        }

        // Aggregate stats
        const dDate = new Date(dateStr!);
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const yearAgo = new Date(); yearAgo.setFullYear(yearAgo.getFullYear() - 1);

        if (dDate >= weekAgo) {
          weeklyIn += dIn; weeklyEx += dEx; weeklyOutTotal += dOut;
          weeklyDeficit += (dOut - dIn);
        }
        if (dDate >= yearAgo) {
          yearlyIn += dIn; yearlyEx += dEx; yearlyOutTotal += dOut;
          yearlyDeficit += (dOut - dIn);
        }
      });

      // Simple yesterday change
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toLocaleDateString('en-CA');
      const yesterdayIn = meals.filter((m: any) => m.date === yesterdayDate).reduce((acc: number, m: any) => acc + (m.calories || 0), 0);

      setStats({
        caloriesIn: totalIn,
        caloriesOut: totalOutToday,
        exerciseCalories: totalOutActivities,
        weeklyIn, weeklyOut: weeklyOutTotal, weeklyEx,
        yearlyIn, yearlyOut: yearlyOutTotal, yearlyEx,
        weeklyWeightLoss: Math.max(0, weeklyDeficit / 7700),
        yearlyWeightLoss: Math.max(0, yearlyDeficit / 7700),
        dailyChange: yesterdayIn > 0 ? ((totalIn - yesterdayIn) / yesterdayIn) * 100 : 0,
        hasYesterdayData: yesterdayIn > 0
      });
      setWeeklyData(newWeeklyData);
    };

    calculateStats();
    window.addEventListener('health-data-saved', calculateStats);
    return () => window.removeEventListener('health-data-saved', calculateStats);
  }, [userEmail]);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutDashboard size={24} /> Health Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem', borderRadius: '1rem' }}>
          {(['daily', 'weekly', 'yearly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                background: view === v ? 'white' : 'transparent',
                color: view === v ? 'var(--primary)' : 'var(--text-main)',
                borderRadius: '0.75rem',
                boxShadow: view === v ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: '300px', width: '100%' }}>
        {view === 'daily' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Today's Summary</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              <div style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1.5rem', flex: '1 1 140px', maxWidth: '200px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.caloriesIn.toLocaleString()}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase' }}>Daily Intake</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '1.5rem', flex: '1 1 140px', maxWidth: '200px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{stats.exerciseCalories.toLocaleString()}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase' }}>Exercise Burn</div>
              </div>
              <div style={{ textAlign: 'center', background: stats.caloriesOut - stats.caloriesIn >= 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '1.5rem', flex: '1 1 140px', maxWidth: '200px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: stats.caloriesOut - stats.caloriesIn >= 0 ? '#3b82f6' : '#ef4444' }}>
                  {Math.round(stats.caloriesOut - stats.caloriesIn).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase' }}>Net Deficit</div>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
              {stats.caloriesIn === 0 && stats.caloriesOut === 0 ? "Start logging your meals and activities to see stats!" : "Keep tracking to reach your goals!"}
            </p>
          </div>
        ) : (
          <>
            <div style={{ width: '100%', minHeight: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '1.5rem', padding: '1rem' }}>
              <NoSSR>
                {view === 'weekly' ? (
                  <BarChart data={weeklyData} width={320} height={220} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                    />
                    <Bar dataKey="calories" fill="var(--primary)" radius={[4, 4, 0, 0]} name="In" isAnimationActive={false} minPointSize={5} />
                    <Bar dataKey="burned" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Out" isAnimationActive={false} minPointSize={5} />
                  </BarChart>
                ) : (
                  <LineChart data={yearlyData} width={320} height={220} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                    />
                    <Line type="monotone" dataKey="avg" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} isAnimationActive={false} />
                  </LineChart>
                )}
              </NoSSR>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '1.25rem', flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {Math.round(view === 'weekly' ? stats.weeklyIn : stats.yearlyIn).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase' }}>Intake</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '1.25rem', flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f59e0b' }}>
                  {Math.round(view === 'weekly' ? stats.weeklyEx : stats.yearlyEx).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase' }}>Exercise</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '1.25rem', flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#3b82f6' }}>
                  {(view === 'weekly' ? stats.weeklyWeightLoss : stats.yearlyWeightLoss).toFixed(2)} kg
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase' }}>Weight Lost</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <TrendingUp size={20} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {stats.hasYesterdayData ? `${stats.dailyChange > 0 ? '+' : ''}${stats.dailyChange.toFixed(1)}%` : '--'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {stats.hasYesterdayData ? 'vs Yesterday' : 'No data for T-1'}
          </div>
        </div>
      </div>
    </div>
  );
}
