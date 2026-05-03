'use client';

import React from 'react';
import { BookOpen, Utensils, Activity, CloudSync, User, Zap, CheckCircle2 } from 'lucide-react';

export default function HowTo() {
  const steps = [
    {
      title: "Set up your Profile",
      icon: <User size={24} />,
      content: "Go to the 'My Profile' tab and enter your weight, height, and activity level. This calculates your BMR (Base Metabolic Rate) and TDEE (Maintenance Calories). Do this once to get accurate daily targets.",
      color: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6"
    },
    {
      title: "Log your Meals",
      icon: <Utensils size={24} />,
      content: "Use the 'Daily Stats' tab to log meals. Our AI knows regional Indian measures like 'katori', 'plate', and 'glass'. Just type 'roti' or 'dal' and it will estimate the calories for you!",
      color: "rgba(16, 185, 129, 0.1)",
      iconColor: "#10b981"
    },
    {
      title: "Track Activities",
      icon: <Activity size={24} />,
      content: "Log exercises like 'Brisk Walk', 'Running', or 'Gym'. Our engine uses MET (Metabolic Equivalent) standards combined with your weight to calculate exactly how many calories you burned.",
      color: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b"
    },
    {
      title: "Sync to Cloud",
      icon: <CloudSync size={24} />,
      content: "Crucial! Always hit the 'Save Progress' button at the bottom before closing the app. This pushes your data to the cloud so it's available on your phone and desktop instantly.",
      color: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6"
    }
  ];

  const tips = [
    "Use 'katori' for dal and vegetables for accurate Indian portion sizing.",
    "The Weekly chart shows your 'In' vs 'Out' calories to visualize your deficit.",
    "Log for yesterday using the date picker if you forget to log a late-night snack.",
    "Your data is tied to your email—use the same email on all devices to sync."
  ];

  return (
    <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#042f2e' }}>
          <BookOpen size={32} /> Vitality Guide
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Master your health journey in 2 minutes</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '1.25rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}>
            <div style={{ background: step.color, color: step.iconColor, width: '56px', height: '56px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {step.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>{step.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', background: 'rgba(59, 130, 246, 0.05)', padding: '2rem', borderRadius: '2rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', color: '#1e3a8a' }}>📊 Understanding Your Dashboard</h3>
        <div style={{ display: 'grid', gap: '1rem', fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
          <p>
            <strong>• Balance:</strong> Think of this as your <b>Calorie Budget</b>. If it's a positive number, you're "under budget" (good for weight loss). If it's negative, you've eaten more than your body burned.
          </p>
          <p>
            <strong>• Est. Loss:</strong> This converts your calorie balance into actual <b>Kilograms</b>. We use the scientific 7,700 kcal = 1kg conversion. 
          </p>
          <p>
            <strong>• Weekly vs Daily:</strong> Switch to 'Weekly' to see your <b>total progress</b> for the last 7 days. Your 'Balance' will look much larger because it's showing your budget for the whole week!
          </p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.4)', padding: '2rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.6)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} color="#f59e0b" fill="#f59e0b" /> Pro Tips
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
