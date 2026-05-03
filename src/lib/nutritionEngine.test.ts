import { getSmartEstimate } from './nutritionEngine';

describe('Nutrition Engine', () => {
  test('Keyword Priority: "Green Tea" matches correctly (low cal) vs "Tea" (high cal)', () => {
    const greenTea = getSmartEstimate('Green Tea', '1', 'cup');
    const tea = getSmartEstimate('Tea', '1', 'cup');
    
    expect(greenTea.calories).toBeLessThan(10);
    expect(tea.calories).toBeGreaterThan(50);
  });

  test('Portion Calibration: Dish-based (Poha) plate scaling', () => {
    const pohaPlate = getSmartEstimate('Poha', '1', 'plate');
    // base 210 * plate mult 1.8 = 378
    expect(pohaPlate.calories).toBeGreaterThan(300);
    expect(pohaPlate.calories).toBeLessThan(450);
  });

  test('Portion Calibration: Piece-based (Idli) plate scaling (3 pieces)', () => {
    const idliPlate = getSmartEstimate('Idli', '1', 'plate');
    // base 60 * 3 pieces = 180
    expect(idliPlate.calories).toBe(180);
  });

  test('Portion Calibration: Piece-based (Samosa) plate scaling (3 pieces)', () => {
    const samosaPlate = getSmartEstimate('Samosa', '1', 'plate');
    // base 240 * 3 pieces = 720
    expect(samosaPlate.calories).toBe(720);
  });

  test('Smart Modifiers: Extra Butter increases calories', () => {
    const plainRoti = getSmartEstimate('Roti', '1', 'item');
    const butterRoti = getSmartEstimate('Extra Butter Roti', '1', 'item');
    
    expect(butterRoti.calories).toBeGreaterThan(plainRoti.calories);
  });

  test('Smart Modifiers: Sugar-free reduces calories', () => {
    const tea = getSmartEstimate('Tea', '1', 'cup');
    const sugarFreeTea = getSmartEstimate('Sugar-free Tea', '1', 'cup');
    
    expect(sugarFreeTea.calories).toBeLessThan(tea.calories);
  });

  test('Alcohol Units: Pint scaling (330ml / 0.93x)', () => {
    const beerItem = getSmartEstimate('Beer', '1', 'item');
    const beerPint = getSmartEstimate('Beer', '1', 'pint');
    
    // base 150 * 0.93 = 139.5 -> 140
    expect(beerPint.calories).toBe(Math.round(150 * 0.93));
  });
});
