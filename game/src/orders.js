import { RECIPES, GAME_CONSTANTS } from './config.js';

export const generateOrder = () => {
    const recipeNames = Object.keys(RECIPES);
    const recipeName = recipeNames[Math.floor(Math.random() * recipeNames.length)];
    const recipe = RECIPES[recipeName];

    return {
        id: Math.random().toString(36).slice(2, 9),
        recipe: recipeName,
        ingredients: [...recipe.ingredients],
        patience: 100,
        maxPatience: 100,
        served: false,
        expired: false
    };
};

export const updateOrders = (orders, deltaTime, isRush) => {
    const drain = isRush ? GAME_CONSTANTS.patienceDrainRush : GAME_CONSTANTS.patienceDrainNormal;

    return orders.map(order => ({
        ...order,
        patience: Math.max(0, order.patience - deltaTime * drain)
    }));
};

export const checkOrderMatch = (plateIngredients, order) => {
    const recipe = RECIPES[order.recipe];
    if (!recipe) return false;

    if (plateIngredients.length !== recipe.ingredients.length) {
        return false;
    }

    const plateNames = plateIngredients.map(p => p.name).sort();
    const orderNames = [...recipe.ingredients].sort();

    for (let i = 0; i < plateNames.length; i++) {
        if (plateNames[i] !== orderNames[i]) {
            return false;
        }
    }

    if (recipe.cooked) {
        return plateIngredients.every(p => p.state === 'cooked');
    }

    return plateIngredients.every(p => p.state === 'chopped');
};

export const calculateOrderValue = (order, streak = 0) => {
    const base = RECIPES[order.recipe].price || 10;
    const patienceRatio = order.patience / order.maxPatience;
    const patienceBonus = Math.floor(base * patienceRatio);
    const fastBonus = patienceRatio >= GAME_CONSTANTS.fastServiceThreshold ? GAME_CONSTANTS.fastServiceBonus : 0;
    return base + patienceBonus + fastBonus + streak;
};
