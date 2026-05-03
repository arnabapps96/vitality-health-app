'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { supabase } from '@/lib/supabase';
import NoSSR from './NoSSR';
import { LayoutDashboard, TrendingUp, Calendar, Zap, PieChart as PieIcon, CloudSync, Sparkles, Flame } from 'lucide-react';

interface Meal {
  calories: number;
  date: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface Activity {
  calories_burned: number;
  date: string;
}

export default function Dashboard({ userEmail }: { userEmail: string }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'yearly'>('daily');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAISummary = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const todayMeals = meals.filter(m => m.date === today);
    const proteinGrams = todayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
    const carbGrams = todayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
    const { consumed, burned } = getAggregatedStats();
    const net = consumed - burned;
    const balance = tdee - net;
    
    let summary = "";
    
    if (todayMeals.length === 0) {
      summary = "You haven't logged any meals today. Start tracking to get a personalized AI analysis of your nutrition!";
    } else {
      if (balance > 200) {
        summary = `You're currently in a calorie deficit of ${balance} kcal. `;
      } else if (balance < -200) {
        summary = `You've exceeded your daily goal by ${Math.abs(balance)} kcal. `;
      } else {
        summary = "You're right on track with your calorie goals today! ";
      }
      
      const proteinPct = consumed > 0 ? (proteinGrams * 4) / consumed : 0;
      if (proteinPct < 0.15) {
        summary += "Your protein intake is a bit low; consider adding paneer, dal, or eggs. ";
      } else if (proteinPct > 0.25) {
        summary += "Excellent protein focus! This will help with satiety. ";
      }
      
      const heavyItems = todayMeals.filter(m => 
        ['biryani', 'butter chicken', 'chole bhature', 'pakora', 'paratha', 'burger', 'naan'].some(h => m.name.toLowerCase().includes(h))
      );
      
      if (heavyItems.length > 0) {
        summary += `I noticed some calorie-dense items like ${heavyItems[0].name}. Try balancing these with a fresh Kachumber salad or Chaas.`;
      } else {
        summary += "Your meal choices look well-balanced and light. Keep up the great work!";
      }
    }
    
    setAiSummary(summary);
    setIsGenerating(false);
  };

  useEffect(() => {
    async function loadData() {
      const [mRes, aRes, pRes] = await Promise.all([
        supabase.from('meals').select('*').eq('email', userEmail),
        supabase.from('activities').select('*').eq('email', userEmail),
        supabase.from('profiles').select('*').eq('email', userEmail).single()
      ]);
      if (mRes.data) setMeals(mRes.data);
      if (aRes.data) setActivities(aRes.data);
      if (pRes.data) setProfile(pRes.data);
    }
    loadData();

    window.addEventListener('health-data-saved', loadData);
    return () => window.removeEventListener('health-data-saved', loadData);
  }, [userEmail]);

  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getFormattedDate(new Date());
  
  // Dynamic Stats Calculation based on Active Tab
  const getAggregatedStats = () => {
    if (activeTab === 'daily') {
      const todayMeals = meals.filter(m => m.date === today);
      const todayActs = activities.filter(a => a.date === today);
      return {
        consumed: todayMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0),
        burned: todayActs.reduce((acc, a) => acc + Number(a.calories_burned || 0), 0)
      };
    } else {
      // Last 7 days aggregation
      const last7Dates = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return getFormattedDate(d);
      });
      const weeklyMeals = meals.filter(m => last7Dates.includes(m.date));
      const weeklyActs = activities.filter(a => last7Dates.includes(a.date));
      return {
        consumed: weeklyMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0),
        burned: weeklyActs.reduce((acc, a) => acc + Number(a.calories_burned || 0), 0)
      };
    }
  };

  const { consumed, burned } = getAggregatedStats();
  
  // Macros (Always today for the Pie chart)
  const todayMealsForMacros = meals.filter(m => m.date === today);
  const totalP = Math.round(todayMealsForMacros.reduce((acc, m) => acc + (m.protein || 0), 0));
  const totalC = Math.round(todayMealsForMacros.reduce((acc, m) => acc + (m.carbs || 0), 0));
  const totalF = Math.round(todayMealsForMacros.reduce((acc, m) => acc + (m.fat || 0), 0));

  const macroData = [
    { name: 'Protein', value: totalP * 4, grams: totalP, color: '#10b981' },
    { name: 'Carbs', value: totalC * 4, grams: totalC, color: '#3b82f6' },
    { name: 'Fat', value: totalF * 9, grams: totalF, color: '#f59e0b' }
  ].filter(d => d.grams > 0);

  // BMR/TDEE logic
  const calculateTDEE = () => {
    if (!profile) return 2000;
    const w = parseFloat(profile.weight);
    const h = parseFloat(profile.height);
    const a = parseFloat(profile.age);
    const bmr = profile.gender === 'male' ? (10 * w + 6.25 * h - 5 * a + 5) : (10 * w + 6.25 * h - 5 * a - 161);
    const mults = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
    const baseTdee = Math.round(bmr * (mults[profile.activity_level as keyof typeof mults] || 1.2));
    return activeTab === 'daily' ? baseTdee : baseTdee * 7; // Goal for the week
  };

  const calculateStreak = () => {
    const allDates = new Set([
      ...meals.map(m => m.date),
      ...activities.map(a => a.date)
    ]);
    
    if (allDates.size === 0) return 0;
    
    let streak = 0;
    const checkDate = new Date();
    const todayStr = getFormattedDate(new Date());
    
    // If today is empty, we start checking from yesterday to see if streak is alive
    if (!allDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dStr = getFormattedDate(checkDate);
      if (allDates.has(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const tdee = calculateTDEE();
  const streak = calculateStreak();
  const net = consumed - burned;
  const balance = tdee - net;

  // Chart data
  const getWeeklyData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Robust YYYY-MM-DD formatter
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }).reverse();

    return last7Days.map(targetDate => {
      const dayMeals = meals.filter(m => m.date === targetDate);
      const dayActs = activities.filter(a => a.date === targetDate);
      
      return {
        date: targetDate.split('-').slice(1).join('/'), // Label as MM/DD
        consumed: dayMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0),
        burned: dayActs.reduce((acc, a) => acc + Number(a.calories_burned || 0), 0)
      };
    });
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Summary Cards */}
      <div className="responsive-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          background: streak > 0 ? 'linear-gradient(135deg, #ff9d00 0%, #ff4d00 100%)' : 'rgba(255,255,255,0.8)',
          color: streak > 0 ? 'white' : 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {streak > 0 && <div className="streak-glow" style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', top: 0, left: 0 }}></div>}
          <div style={{ fontSize: '0.7rem', opacity: streak > 0 ? 0.9 : 1, fontWeight: '700', textTransform: 'uppercase' }}>Streak</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={20} className={streak > 0 ? "animate-pulse" : ""} fill={streak > 0 ? "white" : "none"} color={streak > 0 ? "white" : "#94a3b8"} />
            <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{streak}</div>
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Calorie Intake (Kcal)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>{consumed}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Exercise (Kcal)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f59e0b' }}>{burned}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Net Deficit (Kcal)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#3b82f6' }}>{net}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1rem', border: balance < 0 ? '1px solid #ef4444' : 'none' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            {activeTab === 'daily' ? 'Day Balance' : 'Week Balance'}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: balance >= 0 ? '#10b981' : '#ef4444' }}>
            {balance > 10000 ? `${(balance/1000).toFixed(1)}k` : balance}
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1rem', background: 'var(--primary)', color: 'white' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase' }}>Est. Loss</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>
            {Math.max(0, (balance / 7700)).toFixed(2)} <span style={{ fontSize: '0.8rem' }}>kg</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Main Stats Toggler */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {activeTab === 'weekly' ? <TrendingUp size={20} /> : <PieIcon size={20} />} 
              {activeTab === 'weekly' ? 'Weekly Progress' : 'Today\'s Nutrition'}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => window.dispatchEvent(new Event('health-data-saved'))}
                className="glass-card" 
                style={{ padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}
                title="Refresh Data"
              >
                <CloudSync size={16} />
              </button>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '0.75rem' }}>
                <button onClick={() => setActiveTab('daily')} style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', background: activeTab === 'daily' ? 'white' : 'transparent', cursor: 'pointer', fontWeight: '700', boxShadow: activeTab === 'daily' ? 'var(--shadow-sm)' : 'none' }}>Daily</button>
                <button onClick={() => setActiveTab('weekly')} style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', background: activeTab === 'weekly' ? 'white' : 'transparent', cursor: 'pointer', fontWeight: '700', boxShadow: activeTab === 'weekly' ? 'var(--shadow-sm)' : 'none' }}>Weekly</button>
              </div>
            </div>
          </div>

          {activeTab === 'weekly' ? (
            <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              <NoSSR>
                <BarChart 
                  key={meals.length + activities.length} 
                  width={Math.min(window.innerWidth - 60, 600)} 
                  height={300}
                  data={getWeeklyData()} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  />
                  <Bar dataKey="consumed" name="In" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="burned" name="Out" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </NoSSR>
            </div>
          ) : (
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              {/* Macro Pie */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {macroData.length > 0 ? (
                  <div style={{ width: '100%', height: '220px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <NoSSR>
                      <PieChart width={220} height={220}>
                        <Pie
                          data={macroData}
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${props.payload.grams}g`, name]} />
                      </PieChart>
                    </NoSSR>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>{totalP}g</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Protein</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    Log today's meals to<br/>see your nutrition balance
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {macroData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{d.name[0]} {d.grams}g</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Goals */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', padding: '1rem', borderLeft: '1px solid rgba(0,0,0,0.05)' }} className="hide-on-mobile-border">
                 <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '1rem' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CALORIE BUDGET</div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                     <span style={{ fontSize: '1.25rem', fontWeight: '900' }}>{net} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>/ {tdee}</span></span>
                     <span style={{ fontSize: '0.9rem', fontWeight: '800', color: balance >= 0 ? 'var(--primary)' : '#ef4444' }}>
                       {balance >= 0 ? `${balance} left` : `${Math.abs(balance)} over`}
                     </span>
                   </div>
                   <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', marginTop: '0.75rem', overflow: 'hidden' }}>
                     <div style={{ width: `${Math.min((net/tdee)*100, 100)}%`, height: '100%', background: net > tdee ? '#ef4444' : 'var(--primary)', transition: 'width 0.5s ease' }} />
                   </div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="glass-card" style={{ padding: '1rem', background: 'white' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>BURNED</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b' }}>{burned}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem', background: 'white' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>CONSUMED</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary)' }}>{consumed}</div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'daily' && (
          <div className="glass-card" style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,244,0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    AI Insight
                    <span style={{ fontSize: '0.6rem', background: '#f59e0b', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '1rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Premium</span>
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personalized daily nutrition analysis</p>
                </div>
              </div>
              <button 
                onClick={generateAISummary}
                disabled={isGenerating}
                className="primary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {isGenerating ? <CloudSync size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {aiSummary ? 'Refresh Summary' : 'Generate AI Summary'}
              </button>
            </div>

            {isGenerating ? (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', width: '90%' }} className="animate-pulse"></div>
                <div style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', width: '70%' }} className="animate-pulse"></div>
              </div>
            ) : aiSummary ? (
              <div style={{ 
                padding: '1rem', 
                background: 'white', 
                borderRadius: '1rem', 
                fontSize: '0.9rem', 
                lineHeight: '1.6', 
                color: '#334155',
                border: '1px solid rgba(0,0,0,0.05)',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                {aiSummary}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Tap the button above to get your personalized nutrition insight for today.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
