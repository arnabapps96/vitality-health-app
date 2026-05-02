'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, Utensils, Moon, Plus, Sun, Sunrise, Trash2, CloudSync, Search, Calculator } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type MealType = 'breakfast' | 'morning snack' | 'lunch' | 'evening snack' | 'dinner';
type MealUnit = 'item' | 'gram' | 'cup' | 'bowl' | 'katori' | 'small bowl' | 'slice' | 'plate' | 'glass' | 'spoon' | 'piece' | 'packet';

interface Meal {
  id: string;
  type: MealType;
  name: string;
  quantity: number;
  unit: MealUnit;
  calories: number;
  date: string;
}

const mealCalibrations: Record<string, number> = {
  // Breads (Normalized to 'item')
  'roti': 75, 'phulka': 75, 'chapati': 75, 'paratha': 180, 'aloo paratha': 290, 'puri': 110, 'naan': 260, 'bhatura': 220, 'luchi': 150,
  // Rice (Normalized to base, Cup = 1.8x)
  'rice': 115, 'steamed rice': 115, 'brown rice': 120, 'jeera rice': 140, 'veg biryani': 180, 'chicken biryani': 210, 'pulao': 140,
  // Dals & Legumes (Normalized to base, Katori = 1.5x)
  'dal tadka': 100, 'dal yellow': 100, 'dal makhani': 185, 'rajma': 160, 'chole': 175, 'sambhar': 75, 'dal': 100,
  // Vegetables (Normalized to base, Katori = 1.5x)
  'aloo gobhi': 105, 'bhindi masala': 95, 'baingan bharta': 85, 'palak paneer': 165, 'mix veg': 120,
  // Breakfast (Normalized to 'item' or 'large')
  'idli': 65, 'plain dosa': 140, 'masala dosa': 320, 'poha': 180, 'upma': 220, 'vada': 100, 'uttapam': 190,
  // Meat & Fish (Normalized to 'serving' or 'piece')
  'chicken curry': 280, 'fish fry': 220, 'egg curry': 240, 'mutton rogan josh': 450, 'fish curry': 180,
  // Snacks
  'samosa': 260, 'singara': 260, 'dhokla': 80, 'paneer tikka': 90, 'pav bhaji': 450, 'pani puri': 160, 'bhel puri': 210,
  // Dairy & Sweets
  'chai': 75, 'tea': 75, 'coffee': 90, 'lassi': 280, 'buttermilk': 40, 'chaas': 40,
  'gulab jamun': 150, 'jalebi': 60, 'rice kheer': 155, 'gajar halwa': 215, 'sandesh': 120, 'rosogolla': 150, 'mishti doi': 180,
  // Accompaniments
  'chutney': 15, 'raita': 80, 'pickle': 25, 'papad': 35
};

const unitModifiers: Record<MealUnit, number> = {
  'item': 1, 'gram': 0.01, 'cup': 1.8, 'bowl': 2.2, 'katori': 1.5, 'small bowl': 1.2,
  'slice': 0.8, 'plate': 3.5, 'glass': 2, 'spoon': 0.2, 'piece': 1, 'packet': 4
};

export default function MealTracker({ userEmail }: { userEmail: string }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
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

  const getSmartEstimate = (name: string, quantity: string, unit: MealUnit) => {
    const q = parseFloat(quantity) || 1;
    const lowerName = name.toLowerCase().trim();
    
    // Find base calories from our calibration map
    let baseCals = 150; // default fallback
    for (const [item, cals] of Object.entries(mealCalibrations)) {
      if (lowerName.includes(item)) {
        baseCals = cals;
        break;
      }
    }

    // Apply unit multiplier
    let total = baseCals * q * unitModifiers[unit];

    // AI Context modifiers
    if (lowerName.includes('sugar-free') || lowerName.includes('without sugar')) total *= 0.6;
    if (lowerName.includes('oil-free') || lowerName.includes('roasted')) total *= 0.7;
    if (lowerName.includes('fried') || lowerName.includes('deep fry')) total *= 1.5;
    if (lowerName.includes('butter') || lowerName.includes('ghee')) total *= 1.3;
    
    return Math.round(total);
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
      if (data && data.length > 0) {
        const loaded = data.map(m => ({
          id: m.id,
          type: m.type as MealType,
          name: m.name,
          quantity: Number(m.quantity),
          unit: m.unit as MealUnit,
          calories: m.calories,
          date: m.date
        }));
        setMeals(loaded);
        calculateSavedTotals(loaded);
        localStorage.setItem(storageKey, JSON.stringify(loaded));
      } else {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const local = JSON.parse(saved);
          setMeals(local);
          calculateSavedTotals(local);
        }
      }
    }
    loadData();
  }, [userEmail]);

  useEffect(() => {
    const handleSync = async () => {
      setIsSyncing(true);
      try {
        await supabase.from('meals').delete().eq('email', userEmail);
        await supabase.from('meals').insert(
          meals.map(m => ({
            email: userEmail,
            date: m.date,
            type: m.type,
            name: m.name,
            quantity: m.quantity.toString(),
            unit: m.unit,
            calories: m.calories
          }))
        );
        localStorage.setItem(storageKey, JSON.stringify(meals));
      } finally {
        setIsSyncing(false);
      }
    };

    window.addEventListener('health-save-trigger', handleSync);
    return () => window.removeEventListener('health-save-trigger', handleSync);
  }, [meals, userEmail]);

  const addMeal = (type: MealType) => {
    const input = inputs[type];
    if (!input.name) return;

    // Use smart estimate if user hasn't manually set a high calorie count
    const calories = (input.calories === '0' || input.calories === '100') 
      ? getSmartEstimate(input.name, input.quantity, input.unit)
      : Number(input.calories);

    const newMeal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: input.name,
      quantity: Number(input.quantity),
      unit: input.unit,
      calories,
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
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <div key={type} style={{ background: 'rgba(255,255,255,0.3)', padding: '1.25rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ textTransform: 'capitalize', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              {type === 'breakfast' && <Sunrise size={18} />}
              {type.includes('snack') && <Sun size={18} />}
              {type === 'lunch' && <Utensils size={18} />}
              {type === 'dinner' && <Moon size={18} />}
              {type}
            </h3>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)', background: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
              {savedMealTotals[type]} kcal
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: '2 1 120px' }}>
              <input
                placeholder="What did you eat?"
                value={inputs[type].name}
                onChange={(e) => {
                  const val = e.target.value;
                  const est = getSmartEstimate(val, inputs[type].quantity, inputs[type].unit);
                  setInputs({ ...inputs, [type]: { ...inputs[type], name: val, calories: est.toString() } });
                }}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 180px' }}>
              <input
                type="number"
                value={inputs[type].quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  const est = getSmartEstimate(inputs[type].name, val, inputs[type].unit);
                  setInputs({ ...inputs, [type]: { ...inputs[type], quantity: val, calories: est.toString() } });
                }}
                style={{ width: '60px' }}
              />
              <select
                value={inputs[type].unit}
                onChange={(e) => {
                  const val = e.target.value as MealUnit;
                  const est = getSmartEstimate(inputs[type].name, inputs[type].quantity, val);
                  setInputs({ ...inputs, [type]: { ...inputs[type], unit: val, calories: est.toString() } });
                }}
                style={{ flex: 1 }}
              >
                {Object.keys(unitModifiers).map(u => <option key={u} value={u}>{u}</option>)}
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
                <Calculator size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              </div>
              <button onClick={() => addMeal(type)} className="primary" style={{ width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {meals.filter(m => m.type === type && m.date === selectedDate).map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontSize: '0.9rem' }}>
                <span>{m.name} ({m.quantity} {m.unit})</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: '600' }}>{m.calories} kcal</span>
                  <button onClick={() => removeMeal(m.id)} style={{ color: '#ef4444', border: 'none', background: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
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
