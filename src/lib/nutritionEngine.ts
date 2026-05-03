export type MealUnit = 'item' | 'gram' | 'cup' | 'bowl' | 'katori' | 'small bowl' | 'slice' | 'plate' | 'glass' | 'spoon' | 'piece' | 'packet' | 'pint' | 'can' | 'bottle';

export interface MacroBase {
  cals: number;
  p: number;
  c: number;
  f: number;
  isPiece?: boolean;
}

export const mealCalibrations: Record<string, MacroBase> = {
  // Breads (AI Optimized)
  'roti': { cals: 85, p: 3, c: 18, f: 0.5, isPiece: true },
  'plain roti': { cals: 80, p: 2.5, c: 16, f: 0.2, isPiece: true },
  'butter roti': { cals: 110, p: 3, c: 18, f: 3.5, isPiece: true },
  'tandoori roti': { cals: 120, p: 4, c: 22, f: 1, isPiece: true },
  'rumali roti': { cals: 140, p: 3, c: 28, f: 1.5, isPiece: true },
  'phulka': { cals: 75, p: 2.5, c: 15, f: 0.2, isPiece: true },
  'chapati': { cals: 90, p: 3, c: 18, f: 1, isPiece: true },
  'butter chapati': { cals: 120, p: 3, c: 18, f: 4.5, isPiece: true },
  'paratha': { cals: 220, p: 5, c: 28, f: 12, isPiece: true },
  'aloo paratha': { cals: 310, p: 7, c: 42, f: 14, isPiece: true },
  'paneer paratha': { cals: 340, p: 12, c: 38, f: 16, isPiece: true },
  'gobi paratha': { cals: 260, p: 6, c: 35, f: 11, isPiece: true },
  'puri': { cals: 120, p: 2, c: 14, f: 8, isPiece: true },
  'naan': { cals: 280, p: 9, c: 48, f: 6, isPiece: true },
  'butter naan': { cals: 330, p: 9, c: 48, f: 12, isPiece: true },
  'garlic naan': { cals: 310, p: 10, c: 50, f: 8, isPiece: true },
  'luchi': { cals: 140, p: 2, c: 16, f: 9, isPiece: true },
  'chole bhature': { cals: 600, p: 18, c: 70, f: 30 },
  'puri sabzi': { cals: 450, p: 10, c: 50, f: 25 },
  'bedmi puri': { cals: 220, p: 6, c: 28, f: 12, isPiece: true },
  'bread pakora': { cals: 300, p: 7, c: 25, f: 20, isPiece: true },
  'namkeen seviyan': { cals: 300, p: 6, c: 45, f: 12 },
  'moong dal cheela': { cals: 180, p: 9, c: 22, f: 7, isPiece: true },
  'stuffed kulcha': { cals: 250, p: 8, c: 40, f: 8, isPiece: true },
  // Rice & Biryani
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
  // Dals & Curries
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
  // Breakfast & Snacks
  'idli': { cals: 60, p: 2, c: 12, f: 0.2, isPiece: true },
  'dosa': { cals: 120, p: 4, c: 22, f: 3 },
  'plain dosa': { cals: 120, p: 4, c: 22, f: 3 },
  'masala dosa': { cals: 350, p: 8, c: 48, f: 14 },
  'medhu vada': { cals: 180, p: 5, c: 18, f: 10, isPiece: true },
  'ven pongal': { cals: 350, p: 9, c: 45, f: 15 },
  'uttapam': { cals: 250, p: 7, c: 40, f: 8 },
  'appam': { cals: 120, p: 3, c: 22, f: 4, isPiece: true },
  'puttu': { cals: 300, p: 5, c: 55, f: 5 },
  'idiyappam': { cals: 100, p: 2, c: 22, f: 2, isPiece: true },
  'pesarattu': { cals: 180, p: 8, c: 22, f: 8 },
  'neer dosa': { cals: 100, p: 2, c: 18, f: 3, isPiece: true },
  'poha': { cals: 210, p: 4, c: 35, f: 8 },
  'kanda poha': { cals: 300, p: 6, c: 45, f: 12 },
  'upma': { cals: 190, p: 5, c: 32, f: 6 },
  'rava upma': { cals: 300, p: 6, c: 45, f: 12 },
  'bread upma': { cals: 280, p: 6, c: 40, f: 12 },
  'vada': { cals: 110, p: 3, c: 10, f: 8, isPiece: true },
  'samosa': { cals: 240, p: 4, c: 28, f: 14, isPiece: true },
  'pav bhaji': { cals: 480, p: 12, c: 65, f: 22 },
  'bun maska': { cals: 240, p: 4, c: 35, f: 10 },
  'aloo tikki burger': { cals: 380, p: 9, c: 55, f: 14, isPiece: true },
  'sprouts salad': { cals: 120, p: 9, c: 15, f: 3 },
  'misal pav': { cals: 500, p: 15, c: 60, f: 25 },
  'sabudana khichdi': { cals: 380, p: 4, c: 58, f: 15 },
  'thalipeeth': { cals: 180, p: 5, c: 22, f: 8, isPiece: true },
  'dhokla': { cals: 180, p: 5, c: 28, f: 6, isPiece: true },
  'thepla': { cals: 140, p: 4, c: 18, f: 6, isPiece: true },
  'khandvi': { cals: 60, p: 3, c: 6, f: 3, isPiece: true },
  'fafda jalebi': { cals: 700, p: 12, c: 90, f: 38 },
  'dal pakwan': { cals: 480, p: 12, c: 58, f: 25 },
  'luchi alur dom': { cals: 480, p: 10, c: 58, f: 25 },
  'radhaballavi': { cals: 300, p: 8, c: 35, f: 18, isPiece: true },
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
  'momos': { cals: 200, p: 8, c: 35, f: 4, isPiece: true },
  'dim sum': { cals: 200, p: 8, c: 35, f: 4, isPiece: true },
  'spring roll': { cals: 150, p: 3, c: 15, f: 9, isPiece: true },
  'manchow soup': { cals: 150, p: 4, c: 18, f: 7 },
  // Italian
  'margherita pizza': { cals: 250, p: 12, c: 30, f: 10, isPiece: true },
  'pepperoni pizza': { cals: 320, p: 15, c: 30, f: 18, isPiece: true },
  'pasta arrabbiata': { cals: 400, p: 12, c: 65, f: 8 },
  'pasta alfredo': { cals: 750, p: 20, c: 50, f: 45 },
  'pasta pesto': { cals: 550, p: 15, c: 50, f: 32 },
  'lasagna': { cals: 600, p: 35, c: 45, f: 30 },
  'risotto': { cals: 450, p: 12, c: 60, f: 18 },
  'garlic bread': { cals: 150, p: 4, c: 18, f: 7, isPiece: true },
  'bruschetta': { cals: 120, p: 3, c: 15, f: 6, isPiece: true },
  'boiled egg': { cals: 75, p: 6, c: 1, f: 5, isPiece: true },
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
  'rosogolla': { cals: 150, p: 3, c: 32, f: 1 },
  'gulab jamun': { cals: 180, p: 3, c: 25, f: 10 },
  'mishti doi': { cals: 210, p: 6, c: 30, f: 8 },
  // Accompaniments
  'raita': { cals: 80, p: 4, c: 6, f: 4 },
  'kachumber': { cals: 45, p: 1, c: 6, f: 2 },
  'papad': { cals: 45, p: 1, c: 8, f: 1 },
  'chutney': { cals: 30, p: 1, c: 6, f: 1 },
  'chaas': { cals: 65, p: 3, c: 6, f: 3 },
  'buttermilk': { cals: 65, p: 3, c: 6, f: 3 },
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
  'peach iced tea': { cals: 120, p: 0, c: 30, f: 0 }
};

export const unitModifiers: Record<MealUnit, number> = {
  'item': 1, 'gram': 0.01, 'cup': 1.2, 'bowl': 1.5, 'katori': 1, 'small bowl': 0.8,
  'slice': 0.8, 'plate': 1.8, 'glass': 2, 'spoon': 0.2, 'piece': 1, 'packet': 4,
  'pint': 0.93, 'can': 1.4, 'bottle': 1.83
};

export const getSmartEstimate = (name: string, quantity: string, unit: MealUnit) => {
  const q = parseFloat(quantity) || 1;
  const lowerName = name.toLowerCase().trim();
  
  // AI Base defaults (balanced mix)
  let base: MacroBase = { cals: 150, p: 5, c: 20, f: 5 };
  
  // Sophisticated matching (sort by length descending to match 'green tea' before 'tea')
  const sortedKeys = Object.keys(mealCalibrations).sort((a, b) => b.length - a.length);
  for (const item of sortedKeys) {
    if (lowerName.includes(item)) {
      base = mealCalibrations[item];
      break;
    }
  }

  const mult = q * unitModifiers[unit];
  let totalCals = base.cals * mult;
  let totalP = base.p * mult;
  let totalC = base.c * mult;
  let totalF = base.f * mult;

  // Smart Portion Calibration for Piece-based items
  if (base.isPiece) {
    let pieceMult = q;
    if (unit === 'plate') pieceMult = q * 3; // Standard Indian plate = 3 pieces
    if (unit === 'bowl') pieceMult = q * 2;  // Standard bowl = 2 pieces
    
    if (unit === 'plate' || unit === 'bowl') {
      totalCals = base.cals * pieceMult;
      totalP = base.p * pieceMult;
      totalC = base.c * pieceMult;
      totalF = base.f * pieceMult;
    }
  }

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
