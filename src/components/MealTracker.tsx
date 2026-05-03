'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, Utensils, Moon, Plus, Sun, Sunrise, Trash2, CloudSync, Search, Calculator } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type MealType = 'breakfast' | 'morning snack' | 'lunch' | 'evening snack' | 'dinner';
type MealUnit = 'item' | 'gram' | 'cup' | 'bowl' | 'katori' | 'small bowl' | 'slice' | 'plate' | 'glass' | 'spoon' | 'piece' | 'packet' | 'pint' | 'can' | 'bottle';

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

interface MacroBase {
  cals: number;
  p: number;
  c: number;
  f: number;
}

const mealCalibrations: Record<string, MacroBase> = {
  // Breads (AI Optimized)
  'roti': { cals: 85, p: 3, c: 18, f: 0.5 },
  'plain roti': { cals: 80, p: 2.5, c: 16, f: 0.2 },
  'butter roti': { cals: 110, p: 3, c: 18, f: 3.5 },
  'tandoori roti': { cals: 120, p: 4, c: 22, f: 1 },
  'rumali roti': { cals: 140, p: 3, c: 28, f: 1.5 },
  'phulka': { cals: 75, p: 2.5, c: 15, f: 0.2 },
  'chapati': { cals: 90, p: 3, c: 18, f: 1 },
  'butter chapati': { cals: 120, p: 3, c: 18, f: 4.5 },
  'paratha': { cals: 220, p: 5, c: 28, f: 12 },
  'aloo paratha': { cals: 310, p: 7, c: 42, f: 14 },
  'paneer paratha': { cals: 340, p: 12, c: 38, f: 16 },
  'gobi paratha': { cals: 260, p: 6, c: 35, f: 11 },
  'puri': { cals: 120, p: 2, c: 14, f: 8 },
  'naan': { cals: 280, p: 9, c: 48, f: 6 },
  'butter naan': { cals: 330, p: 9, c: 48, f: 12 },
  'garlic naan': { cals: 310, p: 10, c: 50, f: 8 },
  'luchi': { cals: 140, p: 2, c: 16, f: 9 },
  'chole bhature': { cals: 600, p: 18, c: 70, f: 30 },
  'puri sabzi': { cals: 450, p: 10, c: 50, f: 25 },
  'bedmi puri': { cals: 220, p: 6, c: 28, f: 12 },
  'bread pakora': { cals: 300, p: 7, c: 25, f: 20 },
  'namkeen seviyan': { cals: 300, p: 6, c: 45, f: 12 },
  'moong dal cheela': { cals: 180, p: 9, c: 22, f: 7 },
  'stuffed kulcha': { cals: 250, p: 8, c: 40, f: 8 },
  // Rice & Biryani (AI Optimized for 1 Plate/Cup)
  'rice': { cals: 130, p: 2.5, c: 28, f: 0.3 },
  'brown rice': { cals: 110, p: 3, c: 23, f: 1 },
  'chicken biryani': { cals: 450, p: 25, c: 45, f: 18 },
  'veg biryani': { cals: 350, p: 8, c: 55, f: 12 },
  'pulao': { cals: 180, p: 4, c: 32, f: 6 },
  'veg pulao': { cals: 350, p: 8, c: 55, f: 12 },
  'sambar rice': { cals: 280, p: 7, c: 50, f: 6 },
  'curd rice': { cals: 220, p: 6, c: 35, f: 8 },
  'lemon rice': { cals: 320, p: 5, c: 55, f: 12 },
  'bisi bele bath': { cals: 400, p: 9, c: 60, f: 12 },
  'fish curry rice': { cals: 450, p: 30, c: 45, f: 20 },
  'khichdi': { cals: 160, p: 6, c: 28, f: 4 },
  'oats khichdi': { cals: 220, p: 10, c: 35, f: 6 },
  'dalia': { cals: 180, p: 6, c: 38, f: 2 },
  'ragi malt': { cals: 120, p: 3, c: 18, f: 3 },
  // Dals & Curries (AI Optimized for 1 Katori)
  'dal': { cals: 120, p: 7, c: 18, f: 4 },
  'dal tadka': { cals: 150, p: 7, c: 16, f: 8 },
  'dal makhani': { cals: 250, p: 9, c: 22, f: 16 },
  'rajma': { cals: 180, p: 10, c: 28, f: 5 },
  'chole': { cals: 210, p: 9, c: 32, f: 7 },
  'paneer butter masala': { cals: 380, p: 15, c: 12, f: 32 },
  'palak paneer': { cals: 240, p: 14, c: 8, f: 18 },
  'butter chicken': { cals: 520, p: 32, c: 22, f: 35 },
  'mutton rogan josh': { cals: 500, p: 32, c: 15, f: 30 },
  'keema matar': { cals: 420, p: 30, c: 15, f: 25 },
  'kosha mangsho': { cals: 480, p: 30, c: 15, f: 30 },
  'malai kofta': { cals: 500, p: 10, c: 25, f: 38 },
  'mix veg': { cals: 140, p: 4, c: 15, f: 9 },
  'aloo gobi': { cals: 250, p: 5, c: 30, f: 12 },
  'bhindi masala': { cals: 200, p: 4, c: 20, f: 12 },
  'baingan bharta': { cals: 200, p: 4, c: 20, f: 12 },
  'shukto': { cals: 200, p: 4, c: 25, f: 12 },
  'undhiyu': { cals: 380, p: 6, c: 38, f: 20 },
  'baati chokha': { cals: 400, p: 10, c: 60, f: 12 },
  'dal baati churma': { cals: 750, p: 20, c: 90, f: 40 },
  'puran poli': { cals: 350, p: 9, c: 55, f: 12 },
  'chicken curry': { cals: 320, p: 28, c: 8, f: 18 },
  'fish curry': { cals: 220, p: 22, c: 6, f: 12 },
  'egg curry': { cals: 250, p: 14, c: 8, f: 18 },
  // Breakfast & Snacks (AI Optimized)
  'idli': { cals: 60, p: 2, c: 12, f: 0.2 },
  'dosa': { cals: 120, p: 4, c: 22, f: 3 },
  'plain dosa': { cals: 120, p: 4, c: 22, f: 3 },
  'masala dosa': { cals: 350, p: 8, c: 48, f: 14 },
  'medhu vada': { cals: 180, p: 5, c: 18, f: 10 },
  'ven pongal': { cals: 350, p: 9, c: 45, f: 15 },
  'uttapam': { cals: 250, p: 7, c: 40, f: 8 },
  'appam': { cals: 120, p: 3, c: 22, f: 4 },
  'puttu': { cals: 300, p: 5, c: 55, f: 5 },
  'idiyappam': { cals: 100, p: 2, c: 22, f: 2 },
  'pesarattu': { cals: 180, p: 8, c: 22, f: 8 },
  'neer dosa': { cals: 100, p: 2, c: 18, f: 3 },
  'poha': { cals: 210, p: 4, c: 35, f: 8 },
  'kanda poha': { cals: 300, p: 6, c: 45, f: 12 },
  'upma': { cals: 190, p: 5, c: 32, f: 6 },
  'rava upma': { cals: 300, p: 6, c: 45, f: 12 },
  'bread upma': { cals: 280, p: 6, c: 40, f: 12 },
  'vada': { cals: 110, p: 3, c: 10, f: 8 },
  'samosa': { cals: 240, p: 4, c: 28, f: 14 },
  'pav bhaji': { cals: 480, p: 12, c: 65, f: 22 },
  'bun maska': { cals: 240, p: 4, c: 35, f: 10 },
  'aloo tikki burger': { cals: 380, p: 9, c: 55, f: 14 },
  'sprouts salad': { cals: 120, p: 9, c: 15, f: 3 },
  'misal pav': { cals: 500, p: 15, c: 60, f: 25 },
  'sabudana khichdi': { cals: 380, p: 4, c: 58, f: 15 },
  'thalipeeth': { cals: 180, p: 5, c: 22, f: 8 },
  'dhokla': { cals: 180, p: 5, c: 28, f: 6 },
  'thepla': { cals: 140, p: 4, c: 18, f: 6 },
  'khandvi': { cals: 60, p: 3, c: 6, f: 3 },
  'fafda jalebi': { cals: 700, p: 12, c: 90, f: 38 },
  'dal pakwan': { cals: 480, p: 12, c: 58, f: 25 },
  'luchi alur dom': { cals: 480, p: 10, c: 58, f: 25 },
  'radhaballavi': { cals: 300, p: 8, c: 35, f: 18 },
  'chira polao': { cals: 300, p: 5, c: 50, f: 12 },
  'mughlai paratha': { cals: 500, p: 20, c: 48, f: 32 },
  'jhal muri': { cals: 250, p: 5, c: 35, f: 12 },
  'assamese jolpan': { cals: 400, p: 9, c: 65, f: 10 },
  'thukpa': { cals: 400, p: 15, c: 50, f: 15 },
  // Chinese & Indo-Chinese
  'veg manchurian': { cals: 280, p: 4, c: 25, f: 18 },
  'gobi manchurian': { cals: 300, p: 5, c: 30, f: 18 },
  'hakka noodles': { cals: 450, p: 12, c: 55, f: 20 },
  'veg fried rice': { cals: 320, p: 7, c: 50, f: 10 },
  'chilli chicken': { cals: 420, p: 35, c: 15, f: 25 },
  'chilli paneer': { cals: 380, p: 15, c: 20, f: 28 },
  'momos': { cals: 200, p: 8, c: 35, f: 4 },
  'dim sum': { cals: 200, p: 8, c: 35, f: 4 },
  'spring roll': { cals: 150, p: 3, c: 15, f: 9 },
  'manchow soup': { cals: 150, p: 4, c: 18, f: 7 },
  // Italian
  'margherita pizza': { cals: 250, p: 12, c: 30, f: 10 },
  'pepperoni pizza': { cals: 320, p: 15, c: 30, f: 18 },
  'pasta arrabbiata': { cals: 400, p: 12, c: 65, f: 8 },
  'pasta alfredo': { cals: 750, p: 20, c: 50, f: 45 },
  'pasta pesto': { cals: 550, p: 15, c: 50, f: 32 },
  'lasagna': { cals: 600, p: 35, c: 45, f: 30 },
  'risotto': { cals: 450, p: 12, c: 60, f: 18 },
  'garlic bread': { cals: 150, p: 4, c: 18, f: 7 },
  'bruschetta': { cals: 120, p: 3, c: 15, f: 6 },
  'boiled egg': { cals: 75, p: 6, c: 1, f: 5 },
  'omelette': { cals: 180, p: 13, c: 2, f: 14 },
  'masala omelette': { cals: 220, p: 13, c: 4, f: 18 },
  'egg bhurji': { cals: 280, p: 16, c: 6, f: 22 },
  'bombay toast': { cals: 300, p: 12, c: 25, f: 18 },
  // Beverages & Sweets
  'chai': { cals: 80, p: 3, c: 12, f: 3 },
  'tea': { cals: 80, p: 3, c: 12, f: 3 },
  'masala chai': { cals: 100, p: 4, c: 15, f: 4 },
  'ginger tea': { cals: 10, p: 0, c: 2, f: 0 },
  'adrak chai': { cals: 90, p: 3, c: 14, f: 3 },
  'green tea': { cals: 2, p: 0, c: 0.5, f: 0 },
  'black tea': { cals: 2, p: 0, c: 0.5, f: 0 },
  'lemon tea': { cals: 15, p: 0, c: 4, f: 0 },
  'coffee': { cals: 90, p: 3, c: 12, f: 4 },
  'black coffee': { cals: 5, p: 0, c: 0, f: 0 },
  'espresso': { cals: 5, p: 0, c: 0, f: 0 },
  'cappuccino': { cals: 100, p: 6, c: 10, f: 5 },
  'latte': { cals: 150, p: 8, c: 15, f: 7 },
  'cold coffee': { cals: 250, p: 6, c: 40, f: 8 },
  'filter coffee': { cals: 110, p: 4, c: 18, f: 4 },
  // Alcohol & Cocktails
  'beer': { cals: 150, p: 1, c: 13, f: 0 },
  'light beer': { cals: 100, p: 0.5, c: 5, f: 0 },
  'wine': { cals: 125, p: 0, c: 4, f: 0 },
  'red wine': { cals: 125, p: 0, c: 4, f: 0 },
  'white wine': { cals: 120, p: 0, c: 3, f: 0 },
  'vodka': { cals: 97, p: 0, c: 0, f: 0 },
  'whiskey': { cals: 97, p: 0, c: 0, f: 0 },
  'rum': { cals: 97, p: 0, c: 0, f: 0 },
  'gin': { cals: 97, p: 0, c: 0, f: 0 },
  'margarita': { cals: 250, p: 0, c: 25, f: 0 },
  'mojito': { cals: 200, p: 0, c: 20, f: 0 },
  'martini': { cals: 140, p: 0, c: 1, f: 0 },
  'old fashioned': { cals: 160, p: 0, c: 8, f: 0 },
  'gin and tonic': { cals: 170, p: 0, c: 18, f: 0 },
  'long island iced tea': { cals: 400, p: 0, c: 35, f: 0 },
  'liit': { cals: 400, p: 0, c: 35, f: 0 },
  'cosmopolitan': { cals: 180, p: 0, c: 12, f: 0 },
  'pina colada': { cals: 500, p: 2, c: 45, f: 15 },
  'sangria': { cals: 200, p: 0, c: 22, f: 0 },
  // Mocktails
  'virgin mojito': { cals: 150, p: 0, c: 35, f: 0 },
  'shirley temple': { cals: 130, p: 0, c: 32, f: 0 },
  'virgin pina colada': { cals: 350, p: 2, c: 50, f: 12 },
  'virgin mary': { cals: 45, p: 2, c: 8, f: 0 },
  'fruit punch': { cals: 100, p: 0.5, c: 25, f: 0 },
  'blue lagoon': { cals: 80, p: 0, c: 20, f: 0 },
  'watermelon cooler': { cals: 80, p: 1, c: 18, f: 0 },
  'virgin margarita': { cals: 150, p: 0, c: 35, f: 0 },
  'peach iced tea': { cals: 120, p: 0, c: 30, f: 0 },
  'rosogolla': { cals: 150, p: 3, c: 32, f: 1 },
  'gulab jamun': { cals: 180, p: 3, c: 25, f: 10 },
  'mishti doi': { cals: 210, p: 6, c: 30, f: 8 },
  // Accompaniments
  'raita': { cals: 80, p: 4, c: 6, f: 4 },
  'kachumber': { cals: 45, p: 1, c: 6, f: 2 },
  'papad': { cals: 45, p: 1, c: 8, f: 1 },
  'chutney': { cals: 30, p: 1, c: 6, f: 1 },
  'chaas': { cals: 65, p: 3, c: 6, f: 3 },
  'buttermilk': { cals: 65, p: 3, c: 6, f: 3 }
};

const unitModifiers: Record<MealUnit, number> = {
  'item': 1, 'gram': 0.01, 'cup': 1.8, 'bowl': 2.2, 'katori': 1.5, 'small bowl': 1.2,
  'slice': 0.8, 'plate': 3.5, 'glass': 2, 'spoon': 0.2, 'piece': 1, 'packet': 4,
  'pint': 0.93, 'can': 1.4, 'bottle': 1.83
};

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

  const getSmartEstimate = (name: string, quantity: string, unit: MealUnit) => {
    const q = parseFloat(quantity) || 1;
    const lowerName = name.toLowerCase().trim();
    
    // AI Base defaults (balanced mix)
    let base: MacroBase = { cals: 150, p: 5, c: 20, f: 5 };
    
    // Sophisticated matching
    for (const [item, data] of Object.entries(mealCalibrations)) {
      if (lowerName.includes(item)) {
        base = data;
        break;
      }
    }

    const mult = q * unitModifiers[unit];
    let totalCals = base.cals * mult;
    let totalP = base.p * mult;
    let totalC = base.c * mult;
    let totalF = base.f * mult;

    // AI Dynamic Context Adjustments
    if (lowerName.includes('sugar-free') || lowerName.includes('without sugar')) { totalCals *= 0.7; totalC *= 0.5; }
    if (lowerName.includes('oil-free') || lowerName.includes('roasted')) { totalCals *= 0.8; totalF *= 0.4; }
    if (lowerName.includes('fried') || lowerName.includes('crispy')) { totalCals *= 1.4; totalF *= 1.8; }
    if (lowerName.includes('extra butter') || lowerName.includes('with ghee')) { totalCals *= 1.3; totalF *= 1.5; }
    
    return {
      calories: Math.round(totalCals),
      protein: Math.round(totalP * 10) / 10,
      carbs: Math.round(totalC * 10) / 10,
      fat: Math.round(totalF * 10) / 10
    };
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
                    const filtered = Object.keys(mealCalibrations).filter(item => 
                      item.toLowerCase().includes(name.toLowerCase())
                    );
                    setSuggestions(filtered.slice(0, 5));
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
