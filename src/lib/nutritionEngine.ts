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
  'oats porridge': { cals: 150, p: 5, c: 27, f: 3 },
  'milk oats': { cals: 220, p: 8, c: 32, f: 6 },
  'overnight oats': { cals: 250, p: 10, c: 35, f: 8 },
  'cornflakes with milk': { cals: 220, p: 6, c: 40, f: 4 },
  'muesli': { cals: 280, p: 8, c: 45, f: 8 },
  'granola with yogurt': { cals: 300, p: 10, c: 40, f: 10 },
  'banana smoothie': { cals: 180, p: 4, c: 35, f: 3 },
  'protein smoothie': { cals: 250, p: 20, c: 25, f: 6 },
  'peanut butter toast': { cals: 200, p: 8, c: 20, f: 12 },
  'butter toast': { cals: 160, p: 3, c: 20, f: 8 },
  'jam toast': { cals: 180, p: 3, c: 30, f: 4 },
  'paneer tikka': { cals: 280, p: 18, c: 8, f: 20, isPiece: true },
  'chicken tikka': { cals: 220, p: 25, c: 4, f: 12, isPiece: true },
  'chicken tikka roll': { cals: 420, p: 28, c: 35, f: 20 },
  'chicken kathi roll': { cals: 400, p: 25, c: 30, f: 22 },
  'egg roll': { cals: 380, p: 12, c: 30, f: 22 },
  'paneer roll': { cals: 420, p: 15, c: 35, f: 25 },
  'mutton roll': { cals: 450, p: 22, c: 30, f: 25 },
  'chicken lollipop': { cals: 220, p: 12, c: 8, f: 18, isPiece: true },
  'fish fingers': { cals: 180, p: 15, c: 10, f: 8, isPiece: true },
  'paneer tikka roll': { cals: 380, p: 15, c: 30, f: 22 },
  'khakra': { cals: 70, p: 3, c: 10, f: 3, isPiece: true },

  // Chinese & Indo-Chinese
  'veg manchurian': { cals: 280, p: 4, c: 25, f: 18 },
  'gobi manchurian': { cals: 300, p: 5, c: 30, f: 18 },
  'hakka noodles': { cals: 450, p: 12, c: 55, f: 20 },
  'veg fried rice': { cals: 350, p: 6, c: 60, f: 10 },
  'chilli chicken': { cals: 420, p: 26, c: 22, f: 25 }, // Increased carbs for cornflour coating
  'chilli paneer': { cals: 380, p: 14, c: 25, f: 26 },
  'momos': { cals: 45, p: 2, c: 8, f: 1, isPiece: true },
  'dim sum': { cals: 45, p: 3, c: 7, f: 1, isPiece: true },
  "cocktail spring roll": { "cals": 70, "p": 1, "c": 8, "f": 4, "isPiece": true },
  "spring roll": { "cals": 150, "p": 3, "c": 18, "f": 8, "isPiece": true },
  "jumbo spring roll": { "cals": 220, "p": 5, "c": 28, "f": 12, "isPiece": true },
  'manchow soup': { cals: 150, p: 4, c: 18, f: 7 },
  // Italian
  'margherita pizza': { cals: 250, p: 12, c: 30, f: 10, isPiece: true },
  'pepperoni pizza': { cals: 320, p: 15, c: 30, f: 18, isPiece: true },
  'white sauce pasta': { cals: 550, p: 18, c: 45, f: 32 },
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
  'jalebi': { cals: 150, p: 1, c: 28, f: 4, isPiece: true },
  'gajar ka halwa': { cals: 280, p: 5, c: 35, f: 14 },
  'kheer': { cals: 240, p: 6, c: 38, f: 7 },
  'mysore pak': { cals: 180, p: 2, c: 20, f: 10, isPiece: true },
  'rasmalai': { cals: 160, p: 5, c: 18, f: 8, isPiece: true },
  'fresh cream': { "cals": 208, "p": 2, "c": 4, "f": 20 },
  'hung curd': { "cals": 61, "p": 10, "c": 3, "f": 1 },

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
  'peach iced tea': { cals: 120, p: 0, c: 30, f: 0 },
  // Lassi variations
  'plain lassi': { cals: 150, p: 5, c: 20, f: 5 },
  'sweet lassi': { cals: 200, p: 5, c: 30, f: 5 },
  'mango lassi': { cals: 220, p: 6, c: 40, f: 4 },
  // Fruits
  'apple': { cals: 95, p: 0.5, c: 25, f: 0.3 },
  'mango': { cals: 135, p: 1, c: 35, f: 0.6 },
  'grapes': { cals: 62, p: 0.6, c: 16, f: 0.3 },
  'banana': { cals: 105, p: 1.3, c: 27, f: 0.4 },
  'watermelon': { cals: 30, p: 0.6, c: 8, f: 0.2 },
  'pomegranate': { cals: 105, p: 2, c: 25, f: 1 },
  'orange': { cals: 62, p: 1.2, c: 15.4, f: 0.2 },
  'strawberry': { cals: 33, p: 0.7, c: 8, f: 0.3 },
  'pineapple': { cals: 50, p: 0.5, c: 13, f: 0.1 },
  'kiwi': { cals: 42, p: 0.8, c: 10, f: 0.4 },
  'papaya': { cals: 43, p: 0.5, c: 11, f: 0.1 },
  'peach': { cals: 58, p: 1.4, c: 14, f: 0.4 },
  'pear': { cals: 101, p: 0.6, c: 27, f: 0.2 },
  'cherry': { cals: 50, p: 1, c: 12, f: 0.3 },
  'lemon': { cals: 17, p: 0.6, c: 5.4, f: 0.2 },
  'lime': { cals: 20, p: 0.5, c: 7, f: 0.1 },
  'guava': { cals: 68, p: 2.6, c: 14, f: 0.9 },
  'lychee': { cals: 66, p: 0.8, c: 16, f: 0.1 },
  'blueberries': { cals: 57, p: 0.7, c: 14, f: 0.3 },

  // Healthy / Modern Breakfast
  'avocado toast': { cals: 250, p: 6, c: 28, f: 14 },
  'chia pudding': { cals: 180, p: 6, c: 20, f: 9 },
  'quinoa porridge': { cals: 220, p: 8, c: 35, f: 6 },
  'smoothie bowl': { cals: 300, p: 8, c: 45, f: 10 },
  'protein pancakes': { cals: 280, p: 20, c: 30, f: 8 },
  'banana pancakes': { cals: 260, p: 6, c: 45, f: 6 },
  'multigrain toast': { cals: 120, p: 5, c: 20, f: 2, isPiece: true },
  'almond milk oats': { cals: 180, p: 6, c: 28, f: 5 },


  // Eggs
  'egg fried rice': { cals: 350, p: 12, c: 45, f: 14 },
  'egg omelette': { cals: 180, p: 13, c: 2, f: 14 },
  'scrambled eggs': { cals: 200, p: 12, c: 2, f: 16 },
  'egg white omelette': { cals: 100, p: 12, c: 2, f: 2 },
  'boiled egg white': { cals: 17, p: 4, c: 0, f: 0, isPiece: true },
  'egg salad': { cals: 250, p: 14, c: 6, f: 20 },
  'poached egg': { cals: 70, p: 6, c: 1, f: 5, isPiece: true },

  // Paneer
  'matar paneer': { cals: 320, p: 15, c: 15, f: 24 },
  'shahi paneer': { cals: 400, p: 16, c: 12, f: 32 },
  'kadai paneer': { cals: 350, p: 16, c: 12, f: 28 },
  'paneer tikka masala': { cals: 380, p: 18, c: 15, f: 28 },
  'paneer bhurji': { cals: 300, p: 18, c: 8, f: 24 },
  // Chicken
  'chicken tikka masala': { cals: 380, p: 30, c: 12, f: 24 },
  'tandoori chicken': { cals: 260, p: 35, c: 2, f: 12, isPiece: true },
  'kadai chicken': { cals: 350, p: 28, c: 10, f: 22 },
  'chicken korma': { cals: 450, p: 32, c: 12, f: 30 },
  'chicken 65': { cals: 350, p: 25, c: 18, f: 22 },
  'chicken fry': { cals: 380, p: 28, c: 12, f: 26 },
  // Mutton
  'mutton curry': { cals: 400, p: 30, c: 8, f: 28 },
  'rogan josh': { cals: 450, p: 32, c: 10, f: 32 },
  'mutton keema': { cals: 380, p: 28, c: 6, f: 26 },
  'mutton korma': { cals: 500, p: 35, c: 12, f: 35 },
  // Fish
  'fish fry': { cals: 320, p: 22, c: 12, f: 20 },
  'bengali fish curry': { cals: 260, p: 24, c: 6, f: 15 },
  'apollo fish': { cals: 350, p: 20, c: 18, f: 22 },
  // Dal Variants
  'chana dal': { cals: 220, p: 12, c: 35, f: 4 },
  'toor dal': { cals: 210, p: 11, c: 34, f: 3 },
  'moong dal': { cals: 200, p: 12, c: 33, f: 3 },
  'masoor dal': { cals: 215, p: 13, c: 35, f: 3 },
  'urad dal': { cals: 240, p: 14, c: 38, f: 4 },
  // Rice & Breads
  'jeera rice': { cals: 250, p: 4, c: 45, f: 6 },
  'peas pulao': { cals: 260, p: 6, c: 46, f: 6 },
  'bajra roti': { cals: 140, p: 4, c: 28, f: 2, isPiece: true },
  'jowar roti': { cals: 130, p: 4, c: 26, f: 1.5, isPiece: true },
  'makki ki roti': { cals: 150, p: 4, c: 30, f: 2, isPiece: true },
  'missi roti': { cals: 160, p: 6, c: 28, f: 3, isPiece: true },
  // Veg Curries
  'mixed veg': { cals: 170, p: 4, c: 16, f: 10 },
  'dum aloo': { cals: 250, p: 4, c: 30, f: 12 },
  'navratan korma': { cals: 350, p: 8, c: 28, f: 24 },
  // Street Food & Snacks
  'kachori': { cals: 250, p: 4, c: 25, f: 15, isPiece: true },
  'vada pav': { cals: 300, p: 6, c: 40, f: 14, isPiece: true },
  'bhel puri': { cals: 280, p: 5, c: 50, f: 8 },
  'pani puri': { cals: 150, p: 3, c: 25, f: 5 },
  'sev puri': { cals: 250, p: 4, c: 35, f: 10 },
  'dahi puri': { cals: 280, p: 6, c: 38, f: 12 },
  'fafda': { cals: 300, p: 6, c: 35, f: 18 },
  'muthia': { cals: 180, p: 5, c: 25, f: 6 },
  'medu vada': { cals: 150, p: 4, c: 18, f: 8, isPiece: true },
  'mysore masala dosa': { cals: 450, p: 10, c: 65, f: 18 },
  // Fast Food & Global
  'cheeseburger': { cals: 450, p: 25, c: 40, f: 22, isPiece: true },
  'veg burger': { cals: 350, p: 12, c: 45, f: 15, isPiece: true },
  'chicken burger': { cals: 420, p: 22, c: 42, f: 18, isPiece: true },
  'french fries': { cals: 365, p: 4, c: 48, f: 18 },
  'potato wedges': { cals: 280, p: 4, c: 38, f: 12 },
  'mac and cheese': { cals: 500, p: 18, c: 55, f: 24 },
  'veg sandwich': { cals: 250, p: 8, c: 35, f: 8, isPiece: true },
  'club sandwich': { cals: 450, p: 25, c: 45, f: 20, isPiece: true },
  'grilled cheese': { cals: 380, p: 15, c: 35, f: 22, isPiece: true },
  'caesar salad': { cals: 350, p: 12, c: 15, f: 28 },
  'greek salad': { cals: 250, p: 8, c: 12, f: 18 },
  // Sweets & Desserts
  'barfi': { cals: 150, p: 4, c: 20, f: 8, isPiece: true },
  'kaju katli': { cals: 120, p: 3, c: 15, f: 6, isPiece: true },
  'peda': { cals: 110, p: 2, c: 18, f: 4, isPiece: true },
  'besan laddu': { cals: 180, p: 4, c: 22, f: 10, isPiece: true },
  'motichoor laddu': { cals: 160, p: 2, c: 25, f: 8, isPiece: true },
  'soan papdi': { cals: 140, p: 2, c: 18, f: 8, isPiece: true },
  'moong dal halwa': { cals: 350, p: 8, c: 40, f: 18 },
  'rabri': { cals: 280, p: 10, c: 30, f: 15 },
  'falooda': { cals: 350, p: 8, c: 55, f: 12 },
  'brownie': { cals: 300, p: 4, c: 40, f: 15, isPiece: true },
  'chocolate chip cookie': { cals: 150, p: 2, c: 20, f: 8, isPiece: true },
  'cheesecake': { cals: 350, p: 6, c: 30, f: 24 },
  'ice cream': { cals: 200, p: 4, c: 24, f: 10 },
  'chocolate cake': { cals: 350, p: 5, c: 45, f: 18 },
  'cupcake': { cals: 200, p: 3, c: 25, f: 10 },
  'donut': { cals: 250, p: 4, c: 30, f: 14 },

  // North Indian Additions
  'soya chaap': { cals: 320, p: 20, c: 18, f: 18 },
  'soya chaap masala': { cals: 380, p: 22, c: 20, f: 24 },
  'paneer lababdar': { cals: 420, p: 16, c: 14, f: 34 },
  'amritsari kulcha': { cals: 300, p: 9, c: 45, f: 10, isPiece: true },
  'chole kulche': { cals: 450, p: 14, c: 65, f: 16 },

  // Bengali / Eastern
  'ghugni': { cals: 220, p: 8, c: 30, f: 8 },
  'posto bata': { cals: 180, p: 4, c: 10, f: 14 },
  'beguni': { cals: 150, p: 3, c: 12, f: 10, isPiece: true },
  'mochar ghonto': { cals: 200, p: 6, c: 25, f: 10 },

  // Global Breakfast
  'waffles': { cals: 300, p: 6, c: 45, f: 10 },
  'french toast': { cals: 280, p: 10, c: 35, f: 12 },
  'croissant': { cals: 230, p: 5, c: 26, f: 12, isPiece: true },
  'bagel': { cals: 270, p: 9, c: 50, f: 2, isPiece: true },
  'bagel with cream cheese': { cals: 350, p: 10, c: 50, f: 12 },

  // Asian (non-Indo-Chinese)
  'sushi': { cals: 50, p: 3, c: 8, f: 1, isPiece: true },
  'ramen': { cals: 450, p: 18, c: 60, f: 15 },
  'udon noodles': { cals: 400, p: 12, c: 65, f: 10 },
  'tempura': { cals: 350, p: 10, c: 30, f: 22 },
  'teriyaki chicken': { cals: 300, p: 25, c: 20, f: 12 },

  // Salads & Light Meals
  'coleslaw': { cals: 200, p: 2, c: 15, f: 15 },
  'fruit yogurt bowl': { cals: 200, p: 8, c: 30, f: 6 },
  'quinoa salad': { cals: 250, p: 9, c: 35, f: 8 },
  'chicken salad': { cals: 300, p: 25, c: 10, f: 18 },
  'tuna salad': { cals: 280, p: 22, c: 8, f: 18 },

  // Middle Eastern
  'hummus': { cals: 180, p: 6, c: 14, f: 10 },
  'pita bread': { cals: 170, p: 6, c: 35, f: 1, isPiece: true },
  'falafel': { cals: 80, p: 3, c: 10, f: 4, isPiece: true },
  'shawarma': { cals: 400, p: 20, c: 35, f: 20 },

  // Drinks (expanded)
  'coconut water': { cals: 45, p: 1, c: 10, f: 0 },
  'sugarcane juice': { cals: 180, p: 0, c: 45, f: 0 },
  'orange juice': { cals: 110, p: 2, c: 26, f: 0 },
  'apple juice': { cals: 120, p: 0, c: 28, f: 0 },
  'protein shake': { cals: 200, p: 25, c: 10, f: 5 }

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
