'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, Utensils, Moon, Plus, Sun, Sunrise, Trash2, CloudSync, Search, Calculator, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getSmartEstimate,
  mealCalibrations,
  unitModifiers,
  MealUnit,
  MacroBase
} from '@/lib/nutritionEngine';

type MealType = 'breakfast' | 'morning snack' | 'lunch' | 'evening snack' | 'dinner';

// Feedback form for missing items
export function FeedbackForm({ userEmail }: { userEmail: string }) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await supabase.from('feedback').insert({
        email: userEmail,
        comment: feedback,
        created_at: new Date().toISOString(),
      });
      setSubmitted(true);
      setFeedback('');
    } catch (e) {
      console.error('Feedback submit error', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ marginTop: '0', padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Didn't find something? Let us know here</h3>
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        rows={3}
        placeholder="e.g., missing food or activity type"
        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.1)' }}
      />
      <button
        onClick={handleSubmit}
        className="primary"
        style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          borderRadius: '1.25rem',
          fontSize: '1rem',
          opacity: (submitted || isSubmitting) ? 0.7 : 1,
          cursor: (submitted || isSubmitting) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '700'
        }}
        disabled={submitted || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <CloudSync size={18} className="animate-spin" />
            Processing...
          </>
        ) : submitted ? (
          <>
            <CheckCircle size={18} />
            Thank you!
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Feedback
          </>
        )}
      </button>
    </div>
  );
}


interface Meal {
  id: string;
  type: MealType;
  name: string;
  quantity: number;
  unit: MealUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}


export default function MealTracker({ userEmail }: { userEmail: string }) {
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const [meals, setMeals] = useState<Meal[]>([]);
  const storageKey = `health_meals_${userEmail}`;
  const [isSyncing, setIsSyncing] = useState(false);

  const [savedMealTotals, setSavedMealTotals] = useState<Record<MealType, number>>({
    breakfast: 0, 'morning snack': 0, lunch: 0, 'evening snack': 0, dinner: 0
  });

  const [inputs, setInputs] = useState<Record<MealType, { name: string, quantity: string, unit: MealUnit, calories: string }>>({
    breakfast: { name: '', quantity: '1', unit: 'item', calories: '0' },
    'morning snack': { name: '', quantity: '1', unit: 'item', calories: '0' },
    'lunch': { name: '', quantity: '1', unit: 'item', calories: '0' },
    'evening snack': { name: '', quantity: '1', unit: 'item', calories: '0' },
    'dinner': { name: '', quantity: '1', unit: 'item', calories: '0' }
  });

  const [activeDropdown, setActiveDropdown] = useState<MealType | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSelectSuggestion = (type: MealType, name: string) => {
    const est = getSmartEstimate(name, inputs[type].quantity, inputs[type].unit);
    setInputs({ ...inputs, [type]: { ...inputs[type], name, calories: est.calories.toString() } });
    setActiveDropdown(null);
  };


  const calculateSavedTotals = (allMeals: Meal[]) => {
    const todayMeals = allMeals.filter(m => m.date === selectedDate);
    const totals: Record<MealType, number> = {
      breakfast: 0, 'morning snack': 0, lunch: 0, 'evening snack': 0, dinner: 0
    };
    todayMeals.forEach(m => {
      if (totals[m.type] !== undefined) totals[m.type] += m.calories;
    });
    setSavedMealTotals(totals);
  };

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('meals').select('*').eq('email', userEmail);
      if (data) {
        const loaded = data.map(m => ({
          id: m.id,
          type: m.type as MealType,
          name: m.name,
          quantity: Number(m.quantity),
          unit: m.unit as MealUnit,
          calories: m.calories,
          protein: m.protein || 0,
          carbs: m.carbs || 0,
          fat: m.fat || 0,
          date: m.date
        }));
        setMeals(loaded);
        calculateSavedTotals(loaded);
        localStorage.setItem(storageKey, JSON.stringify(loaded));
      }
    }
    loadData();
  }, [userEmail, selectedDate]);

  useEffect(() => {
    const handleSync = async () => {
      setIsSyncing(true);
      try {
        await supabase.from('meals').delete().eq('email', userEmail);
        await supabase.from('meals').insert(
          meals.map(m => ({
            email: userEmail,
            type: m.type,
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
            date: m.date
          }))
        );
        window.dispatchEvent(new Event('health-data-saved'));
      } finally {
        setIsSyncing(false);
      }
    };
    window.addEventListener('health-save-trigger', handleSync);
    return () => window.removeEventListener('health-save-trigger', handleSync);
  }, [meals, userEmail]);

  const addMeal = (type: MealType) => {
    const input = inputs[type];
    if (!input.name || !input.quantity) return;

    const estimate = getSmartEstimate(input.name, input.quantity, input.unit);
    const calories = input.calories !== '0' ? Number(input.calories) : estimate.calories;

    const newMeal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: input.name,
      quantity: Number(input.quantity),
      unit: input.unit,
      calories,
      protein: estimate.protein,
      carbs: estimate.carbs,
      fat: estimate.fat,
      date: selectedDate
    };

    const updated = [...meals, newMeal];
    setMeals(updated);
    calculateSavedTotals(updated);
    setInputs({ ...inputs, [type]: { name: '', quantity: '1', unit: 'item', calories: '0' } });
  };

  const removeMeal = (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    calculateSavedTotals(updated);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Utensils size={24} /> Meal Tracker
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

      {(['breakfast', 'morning snack', 'lunch', 'evening snack', 'dinner'] as const).map((type) => (
        <div key={type} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
              {type === 'breakfast' && <Sunrise size={18} color="#f59e0b" />}
              {type === 'morning snack' && <Sun size={18} color="#f59e0b" />}
              {type === 'lunch' && <Sun size={18} color="#f59e0b" />}
              {type === 'evening snack' && <Coffee size={18} color="#8b5cf6" />}
              {type === 'dinner' && <Moon size={18} color="#334155" />}
              {type}
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>
              {savedMealTotals[type]} kcal
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative', flex: '2 1 200px' }}>
              <input
                placeholder={`What did you have?`}
                value={inputs[type].name}
                onChange={(e) => {
                  const name = e.target.value;
                  const est = getSmartEstimate(name, inputs[type].quantity, inputs[type].unit);
                  setInputs({ ...inputs, [type]: { ...inputs[type], name, calories: est.calories.toString() } });

                  if (name.length > 1) {
                    const searchLower = name.toLowerCase();
                    const filtered = Object.keys(mealCalibrations)
                      .filter(item => item.toLowerCase().includes(searchLower))
                      .sort((a, b) => {
                        const aLower = a.toLowerCase();
                        const bLower = b.toLowerCase();
                        const aStarts = aLower.startsWith(searchLower) ? 1 : 0;
                        const bStarts = bLower.startsWith(searchLower) ? 1 : 0;
                        // Prioritize startsWith, then by length
                        if (aStarts !== bStarts) return bStarts - aStarts;
                        return aLower.length - bLower.length;
                      });
                    setSuggestions(filtered.slice(0, 6));
                    setActiveDropdown(type);
                  } else {
                    setActiveDropdown(null);
                  }
                }}
                onBlur={() => {
                  // Small delay to allow click on suggestion
                  setTimeout(() => setActiveDropdown(null), 200);
                }}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.4 }} />

              {activeDropdown === type && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  marginTop: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(type, suggestion)}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s',
                        borderBottom: '1px solid rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 150px' }}>
              <input
                type="number"
                placeholder="Qty"
                value={inputs[type].quantity}
                onChange={(e) => {
                  const qty = e.target.value;
                  const est = getSmartEstimate(inputs[type].name, qty, inputs[type].unit);
                  setInputs({ ...inputs, [type]: { ...inputs[type], quantity: qty, calories: est.calories.toString() } });
                }}
                style={{ width: '60px' }}
              />
              <select
                value={inputs[type].unit}
                onChange={(e) => {
                  const val = e.target.value as MealUnit;
                  const est = getSmartEstimate(inputs[type].name, inputs[type].quantity, val);
                  setInputs({ ...inputs, [type]: { ...inputs[type], unit: val, calories: est.calories.toString() } });
                }}
                style={{ flex: 1 }}
              >
                {Object.keys(unitModifiers).map(u => {
                  const isDrinkUnit = ['pint', 'can', 'bottle'].includes(u);
                  const alcoholKeywords = [
                    'beer', 'wine', 'vodka', 'whiskey', 'rum', 'gin', 'margarita', 'mojito', 'martini',
                    'liit', 'cocktail', 'mocktail', 'sangria', 'cosmopolitan', 'pina colada'
                  ];
                  const isAlcoholOrMocktail = alcoholKeywords.some(kw => inputs[type].name.toLowerCase().includes(kw));

                  if (isDrinkUnit && !isAlcoholOrMocktail) return null;
                  return <option key={u} value={u}>{u}</option>;
                })}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 160px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="number"
                  value={inputs[type].calories}
                  onChange={(e) => setInputs({ ...inputs, [type]: { ...inputs[type], calories: e.target.value } })}
                  style={{ width: '100%', paddingLeft: '2.2rem' }}
                />
                <Calculator size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.4 }} />
              </div>
              <button onClick={() => addMeal(type)} className="primary" style={{ width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {meals.filter(m => m.type === type && m.date === selectedDate).map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>{m.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    ({m.quantity} {m.unit}) • {m.protein}g P
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{m.calories} kcal</span>
                  <button onClick={() => removeMeal(m.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
