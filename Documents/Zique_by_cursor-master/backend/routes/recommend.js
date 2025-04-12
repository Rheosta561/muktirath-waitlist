const router = require('express').Router();
const Palate = require("../models/Palate");
const Mood = require(`../models/Mood`);
const newDish = require('../models/newDish');
const Restaurant = require('../models/restaurantSchema');
const path = require('path');
const xlsx = require('xlsx');
require('dotenv').config();

router.get('/zique/recommendations/:userid/:restaurantid', async (req, res) => {
    try {
        const { priority } = req.body; // priority lvl used to implement the refresh logic
        if (!priority || priority < 1 || priority > 4) {
            return res.status(400).json({ message: "Invalid priority level. Must be between 1 and 4." });
        }

        const palate = await Palate.findOne({ userId: req.params.userid });
        console.log(palate);
        if (!palate) return res.status(404).json({ message: "User palate not found" });

        let dishes = await newDish.find({ restaurant_id: req.params.restaurantid });
        let recommendationMessages = [];

        console.log("Initial dishes:", dishes);

        // first level of priority filtering 
        if (priority >= 1) {
            const dietDishes = dishes.filter(dish => 
                dish.diet.some(d => palate.diet.includes(d))
            );
            if (dietDishes.length > 0) {
                dishes = dietDishes;
                // Add personalized messages for diet matches
                dishes.forEach(dish => {
                    const matchingDiets = dish.diet.filter(d => palate.diet.includes(d));
                    if (matchingDiets.length > 0) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because you have a ${matchingDiets.join(', ')} diet`
                        });
                    }
                });
            }
            console.log("After diet filtering:", dishes);
        }

        // 2nd level of priortiy filtering 
        if (priority >= 2) {
            const antiAllergicDishes = dishes.filter(dish => 
                !dish.allergens.some(allergen => palate.allergies.includes(allergen))
            );
            if (antiAllergicDishes.length > 0) {
                dishes = antiAllergicDishes;
                // Add messages for allergen-free dishes
                dishes.forEach(dish => {
                    if (!recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: "Recommended because it's free of your allergens"
                        });
                    }
                });
            }
            console.log("After allergen filtering:", dishes);
        }

        // 3rd lvl of priority filtering Prioritize cuisines (Priority Level 4, 3)
        if (priority >= 3) {
            const preferredCuisines = new Set(palate.cuisine);
            dishes.sort((a, b) => {
                const aHasCuisine = a.cuisine.some(c => preferredCuisines.has(c));
                const bHasCuisine = b.cuisine.some(c => preferredCuisines.has(c));
                return bHasCuisine - aHasCuisine; 
            });
            // Add messages for cuisine matches
            dishes.forEach(dish => {
                const matchingCuisines = dish.cuisine.filter(c => preferredCuisines.has(c));
                if (matchingCuisines.length > 0 && !recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                    recommendationMessages.push({
                        dishId: dish._id,
                        message: `Recommended because it matches your preferred ${matchingCuisines.join(', ')} cuisine`
                    });
                }
            });
            console.log("After cuisine prioritization:", dishes);
        }

        // final lvl of priority filtering Prioritize staple ingredients (Priority Level 4)
        if (priority >= 4) {
            const stapleSet = new Set(palate.staple);
            dishes.sort((a, b) => {
                const aStapleCount = a.ingredients.filter(i => stapleSet.has(i)).length;
                const bStapleCount = b.ingredients.filter(i => stapleSet.has(i)).length;
                return bStapleCount - aStapleCount; 
            });

            const nonDislikedDishes = dishes.filter(dish => 
                !dish.ingredients.some(ingredient => palate.dislikes.includes(ingredient))
            );
            if (nonDislikedDishes.length > 0) {
                dishes = nonDislikedDishes;
                // Add messages for staple ingredients and non-disliked dishes
                dishes.forEach(dish => {
                    const matchingStaples = dish.ingredients.filter(i => stapleSet.has(i));
                    if (matchingStaples.length > 0 && !recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it contains your preferred ingredients: ${matchingStaples.join(', ')}`
                        });
                    }
                });
            }
            console.log("After staple prioritization:", dishes);
        }

        // Attach recommendation messages to each dish
        const dishesWithMessages = dishes.map(dish => {
            const messages = recommendationMessages
                .filter(m => m.dishId.equals(dish._id))
                .map(m => m.message);
            return {
                ...dish.toObject(),
                recommendationMessages: messages
            };
        });

        res.json(dishesWithMessages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/zique/mood-recommendations/:userid/:restaurantid', async (req, res) => {
    try {
        const { priority } = req.body; // Fetch priority level
        if (!priority || priority < 1 || priority > 4) {
            return res.status(400).json({ message: "Invalid priority level. Must be between 1 and 4." });
        }

        // Fetch user's mood preferences
        const mood = await Mood.findOne({ userId: req.params.userid });
        console.log(mood);
        const palate = await Palate.findOne({userId:req.params.userid});
        if (!mood) return res.status(404).json({ message: "User mood not found" });

        // Fetch all dishes
        let dishes = await newDish.find({restaurant_id:req.params.restaurantid});
        let recommendationMessages = [];
        console.log("Initial dishes:", dishes);

        if (priority >= 1) {
            const dietDishes = dishes.filter(dish => 
                dish.diet.some(d => palate.diet.includes(d))
            );
            if (dietDishes.length > 0) {
                dishes = dietDishes;
                // Add personalized messages for diet matches
                dishes.forEach(dish => {
                    const matchingDiets = dish.diet.filter(d => palate.diet.includes(d));
                    if (matchingDiets.length > 0) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because you have a ${matchingDiets.join(', ')} diet`
                        });
                    }
                });
            }
            console.log("After diet type filtering:", dishes);
        }

        if (priority >= 2) {
            const flavorFeelDishes = dishes.filter(dish => 
                dish.flavor.some(fl => mood.flavour.includes(fl)) ||
                dish.feel.some(fe => mood.feel.includes(fe))
            );
            if (flavorFeelDishes.length > 0) {
                dishes = flavorFeelDishes;
                // Add messages for flavor and feel matches
                dishes.forEach(dish => {
                    const matchingFlavors = dish.flavor.filter(fl => mood.flavour.includes(fl));
                    const matchingFeels = dish.feel.filter(fe => mood.feel.includes(fe));
                    
                    if (matchingFlavors.length > 0 && !recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your preferred flavors: ${matchingFlavors.join(', ')}`
                        });
                    }
                    if (matchingFeels.length > 0 && !recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your preferred textures: ${matchingFeels.join(', ')}`
                        });
                    }
                });
            }
            console.log("After flavor & feel filtering:", dishes);
        }

        if (priority >= 3) {
            const methodDishes = dishes.filter(dish => 
                dish.ingredients.some(ingredient => mood.method.includes(ingredient))
            );
            if (methodDishes.length > 0) {
                dishes = methodDishes;
                // Add messages for cooking method matches
                dishes.forEach(dish => {
                    const matchingMethods = dish.ingredients.filter(ingredient => mood.method.includes(ingredient));
                    if (matchingMethods.length > 0 && !recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your preferred cooking methods: ${matchingMethods.join(', ')}`
                        });
                    }
                });
            }
            console.log("After cooking method filtering:", dishes);
        }

        if (priority >= 4) {
            const stapleSet = new Set(mood.meal);
            const stapleDishes = dishes.filter(dish =>
                dish.ingredients.some(ingredient => stapleSet.has(ingredient))
            );
            if (stapleDishes.length > 0) {
                dishes = stapleDishes;
                // Add messages for meal type matches
                dishes.forEach(dish => {
                    const matchingMeals = dish.ingredients.filter(ingredient => stapleSet.has(ingredient));
                    if (matchingMeals.length > 0 && !recommendationMessages.find(m => m.dishId.equals(dish._id))) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your preferred meal types: ${matchingMeals.join(', ')}`
                        });
                    }
                });
            }
            console.log("After staple ingredient filtering:", dishes);
        }

        // Attach recommendation messages to each dish
        const dishesWithMessages = dishes.map(dish => {
            const messages = recommendationMessages
                .filter(m => m.dishId.equals(dish._id))
                .map(m => m.message);
            return {
                ...dish.toObject(),
                recommendationMessages: messages
            };
        });

        res.json(dishesWithMessages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/zique/fitness-recommendations/:userid/:restaurantid', async (req, res) => {
    try {
        const { priority } = req.body; // priority level for filtering
        if (!priority || priority < 1 || priority > 4) {
            return res.status(400).json({ message: "Invalid priority level. Must be between 1 and 4." });
        }

        // Fetch user's mood preferences (which includes fitness goals)
        const mood = await Mood.findOne({ userId: req.params.userid });
        console.log(mood);
        if (!mood) return res.status(404).json({ message: "User mood not found" });

        // Check if user has fitness mode enabled
        if (!mood.fit) {
            return res.json([]); // Return empty array if fitness mode is not enabled
        }

        // Fetch all dishes
        let dishes = await newDish.find({ restaurant_id: req.params.restaurantid });
        let recommendationMessages = [];
        console.log("Initial dishes:", dishes);

        // Define calorie and macronutrient ranges
        const CALORIE_RANGE = 50;
        const MACRO_RANGE = 5;

        if (priority >= 1) {
            // Filter dishes based on calorie range
            const calorieDishes = dishes.filter(dish => {
                const calorieDiff = Math.abs(dish.calorie - mood.calorie);
                return calorieDiff <= CALORIE_RANGE;
            });

            if (calorieDishes.length > 0) {
                dishes = calorieDishes;
                // Add messages for calorie matches
                dishes.forEach(dish => {
                    const calorieDiff = Math.abs(dish.calorie - mood.calorie);
                    if (calorieDiff <= CALORIE_RANGE) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your calorie goal (${dish.calorie} calories)`
                        });
                    }
                });
            }
            console.log("After calorie filtering:", dishes);
        }

        if (priority >= 2) {
            // Filter dishes based on protein range
            const proteinDishes = dishes.filter(dish => {
                const proteinDiff = Math.abs(dish.protein - mood.protein);
                return proteinDiff <= MACRO_RANGE;
            });

            if (proteinDishes.length > 0) {
                dishes = proteinDishes;
                // Add messages for protein matches
                dishes.forEach(dish => {
                    const proteinDiff = Math.abs(dish.protein - mood.protein);
                    if (proteinDiff <= MACRO_RANGE) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your protein goal (${dish.protein}g protein)`
                        });
                    }
                });
            }
            console.log("After protein filtering:", dishes);
        }

        if (priority >= 3) {
            // Filter dishes based on carbs range
            const carbDishes = dishes.filter(dish => {
                const carbDiff = Math.abs(dish.carbs - mood.carbs);
                return carbDiff <= MACRO_RANGE;
            });

            if (carbDishes.length > 0) {
                dishes = carbDishes;
                // Add messages for carb matches
                dishes.forEach(dish => {
                    const carbDiff = Math.abs(dish.carbs - mood.carbs);
                    if (carbDiff <= MACRO_RANGE) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your carb goal (${dish.carbs}g carbs)`
                        });
                    }
                });
            }
            console.log("After carb filtering:", dishes);
        }

        if (priority >= 4) {
            // Filter dishes based on fats range
            const fatDishes = dishes.filter(dish => {
                const fatDiff = Math.abs(dish.fats - mood.fats);
                return fatDiff <= MACRO_RANGE;
            });

            if (fatDishes.length > 0) {
                dishes = fatDishes;
                // Add messages for fat matches
                dishes.forEach(dish => {
                    const fatDiff = Math.abs(dish.fats - mood.fats);
                    if (fatDiff <= MACRO_RANGE) {
                        recommendationMessages.push({
                            dishId: dish._id,
                            message: `Recommended because it matches your fat goal (${dish.fats}g fats)`
                        });
                    }
                });
            }
            console.log("After fat filtering:", dishes);
        }

        // Sort dishes by how well they match all macronutrient goals
        dishes.sort((a, b) => {
            const aCalorieDiff = Math.abs(a.calorie - mood.calorie);
            const bCalorieDiff = Math.abs(b.calorie - mood.calorie);
            const aProteinDiff = Math.abs(a.protein - mood.protein);
            const bProteinDiff = Math.abs(b.protein - mood.protein);
            const aCarbDiff = Math.abs(a.carbs - mood.carbs);
            const bCarbDiff = Math.abs(b.carbs - mood.carbs);
            const aFatDiff = Math.abs(a.fats - mood.fats);
            const bFatDiff = Math.abs(b.fats - mood.fats);

            // Calculate total difference from goals
            const aTotalDiff = aCalorieDiff + aProteinDiff + aCarbDiff + aFatDiff;
            const bTotalDiff = bCalorieDiff + bProteinDiff + bCarbDiff + bFatDiff;

            return aTotalDiff - bTotalDiff;
        });

        // Attach recommendation messages to each dish
        const dishesWithMessages = dishes.map(dish => {
            const messages = recommendationMessages
                .filter(m => m.dishId.equals(dish._id))
                .map(m => m.message);
            return {
                ...dish.toObject(),
                recommendationMessages: messages,
                macroDifferences: {
                    calories: Math.abs(dish.calorie - mood.calorie),
                    protein: Math.abs(dish.protein - mood.protein),
                    carbs: Math.abs(dish.carbs - mood.carbs),
                    fats: Math.abs(dish.fats - mood.fats)
                }
            };
        });

        res.json(dishesWithMessages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/zique/combined-recommendations/:userid/:restaurantid', async (req, res) => {
    try {
        const normalize = str => (str || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();

        const palate = await Palate.findOne({ userId: req.params.userid });
        const mood = await Mood.findOne({ userId: req.params.userid });

        if (!palate) return res.status(404).json({ message: "User palate not found" });
        if (!mood) return res.status(404).json({ message: "User mood not found" });

        const dishes = await newDish.find({restaurant_id:req.params.restaurantid});

        const userAllergies = palate.allergies.map(normalize);
        const userDiets = palate.diet.map(normalize);

        const filteredDishes = dishes.filter(dish => {
            const dishAllergens = dish.allergens.map(normalize);
            const dishDiets = dish.diet.map(normalize);

            const hasAllergy = dishAllergens.some(a => userAllergies.includes(a));
            if (hasAllergy) return false;

            const hasAllDiets = userDiets.every(d => dishDiets.includes(d));
            return hasAllDiets;
        });

        const scoredDishes = filteredDishes.map(dish => {
            let score = 0;
            const matchReasons = [];
            const matchingLabels = [];

            const dietMatches = dish.diet.filter(d =>
                userDiets.includes(normalize(d))
            );
            if (dietMatches.length > 0) {
                score += dietMatches.length * 2;
                matchReasons.push(`Matches your dietary preferences: ${dietMatches.join(', ')}`);
                matchingLabels.push(...dietMatches.map(normalize));
            }

            const cuisineMatches = dish.cuisine.filter(c =>
                palate.cuisine.map(normalize).includes(normalize(c))
            );
            if (cuisineMatches.length > 0) {
                score += cuisineMatches.length * 2;
                matchReasons.push(`Matches your preferred cuisines: ${cuisineMatches.join(', ')}`);
                matchingLabels.push(...cuisineMatches.map(normalize));
            }

            const stapleMatches = dish.ingredients.filter(i =>
                palate.staple.map(normalize).includes(normalize(i))
            );
            if (stapleMatches.length > 0) {
                score += stapleMatches.length * 2;
                matchReasons.push(`Contains your preferred ingredients: ${stapleMatches.join(', ')}`);
                matchingLabels.push('favorite ingredient');
            }

            const flavorMatches = dish.flavor.filter(f =>
                mood.flavour.map(normalize).includes(normalize(f))
            );
            if (flavorMatches.length > 0) {
                score += flavorMatches.length * 2;
                matchReasons.push(`Matches your flavor preferences: ${flavorMatches.join(', ')}`);
                matchingLabels.push('flavor match');
            }

            const feelMatches = dish.feel.filter(f =>
                mood.feel.map(normalize).includes(normalize(f))
            );
            if (feelMatches.length > 0) {
                score += feelMatches.length * 2;
                matchReasons.push(`Matches your feel preferences: ${feelMatches.join(', ')}`);
                matchingLabels.push('feel match');
            }

            const methodMatches = dish.ingredients.filter(i =>
                mood.method.map(normalize).includes(normalize(i))
            );
            if (methodMatches.length > 0) {
                score += methodMatches.length;
                matchReasons.push(`Matches your preferred cooking methods: ${methodMatches.join(', ')}`);
                matchingLabels.push('cooking method');
            }

            if (mood.fit === true) {
                const calorieDiff = Math.abs(dish.calorie - mood.calorie);
                const proteinDiff = Math.abs(dish.protein - mood.protein);
                const carbDiff = Math.abs(dish.carbs - mood.carbs);
                const fatDiff = Math.abs(dish.fats - mood.fats);

                if (calorieDiff <= 50) {
                    score += 2;
                    matchReasons.push(`Matches your calorie goal (${dish.calorie} calories)`);
                    matchingLabels.push('calorie goal');
                }

                if (proteinDiff <= 5) {
                    score += 2;
                    matchReasons.push(`Matches your protein goal (${dish.protein}g protein)`);
                    matchingLabels.push('protein goal');
                }

                if (carbDiff <= 5) {
                    score += 1;


                }

                if (fatDiff <= 5) {
                    score += 1;


                }
            }

            const dislikedMatches = dish.ingredients.filter(i =>
                palate.dislikes.map(normalize).includes(normalize(i))
            );
            if (dislikedMatches.length > 0) {
                score -= dislikedMatches.length * 2;
                matchReasons.push(`Contains ingredients you dislike: ${dislikedMatches.join(', ')}`);
                matchingLabels.push('contains disliked items');
            }

            return {
                ...dish.toObject(),
                score,
                matchReasons:[],
                matchingLabels
            };
        });

        const recommendedDishes = scoredDishes
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score);

        res.status(200).json(recommendedDishes);

    } catch (error) {
        console.error('Error in personalized recommendations:', error);
        res.status(500).json({
            message: "Error generating recommendations",
            error: error.message
        });
    }
});
router.get('/zique/personalized-recommendations/:userid', async (req, res) => {
    try {
        const normalize = str => (str || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
        const toTitleCase = str => {
            if (!str) return '';
            return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        };

        const palate = await Palate.findOne({ userId: req.params.userid });
        const mood = await Mood.findOne({ userId: req.params.userid });

        if (!palate) return res.status(404).json({ message: "User palate not found" });
        if (!mood) return res.status(404).json({ message: "User mood not found" });

        const dishes = await newDish.find();

        const userAllergies = palate.allergies.map(normalize);
        const userDiets = palate.diet.map(normalize);

        const filteredDishes = dishes.filter(dish => {
            const dishAllergens = dish.allergens.map(normalize);
            const dishDiets = dish.diet.map(normalize);

            const hasAllergy = dishAllergens.some(a => userAllergies.includes(a));
            if (hasAllergy) return false;

            const hasAllDiets = userDiets.every(d => dishDiets.includes(d));
            return hasAllDiets;
        });

        const scoredDishes = filteredDishes.map(dish => {
            let score = 0;
            const matchReasons = [];
            const matchingLabels = [];

            const dietMatches = dish.diet.filter(d =>
                userDiets.includes(normalize(d))
            );
            if (dietMatches.length > 0) {
                score += dietMatches.length * 2;
                matchReasons.push(`Matches your dietary preferences: ${dietMatches.join(', ')}`);
                dietMatches.forEach(match => matchingLabels.push({ diet: toTitleCase(match) }));
            }

            const cuisineMatches = dish.cuisine.filter(c =>
                palate.cuisine.map(normalize).includes(normalize(c))
            );
            if (cuisineMatches.length > 0) {
                score += cuisineMatches.length * 2;
                matchReasons.push(`Matches your preferred cuisines: ${cuisineMatches.join(', ')}`);
                cuisineMatches.forEach(match => matchingLabels.push({ cuisine: toTitleCase(match) }));
            }

            const stapleMatches = dish.ingredients.filter(i =>
                palate.staple.map(normalize).includes(normalize(i))
            );
            if (stapleMatches.length > 0) {
                score += stapleMatches.length * 2;
                matchReasons.push(`Contains your preferred ingredients: ${stapleMatches.join(', ')}`);
                stapleMatches.forEach(match => matchingLabels.push({ ingredient: toTitleCase(match) }));
            }

            const flavorMatches = dish.flavor.filter(f =>
                mood.flavour.map(normalize).includes(normalize(f))
            );
            if (flavorMatches.length > 0) {
                score += flavorMatches.length * 2;
                matchReasons.push(`Matches your flavor preferences: ${flavorMatches.join(', ')}`);
                flavorMatches.forEach(match => matchingLabels.push({ flavor: toTitleCase(match) }));
            }

            const feelMatches = dish.feel.filter(f =>
                mood.feel.map(normalize).includes(normalize(f))
            );
            if (feelMatches.length > 0) {
                score += feelMatches.length * 2;
                matchReasons.push(`Matches your feel preferences: ${feelMatches.join(', ')}`);
                feelMatches.forEach(match => matchingLabels.push({ feel: toTitleCase(match) }));
            }

            const methodMatches = dish.ingredients.filter(i =>
                mood.method.map(normalize).includes(normalize(i))
            );
            if (methodMatches.length > 0) {
                score += methodMatches.length;
                matchReasons.push(`Matches your preferred cooking methods: ${methodMatches.join(', ')}`);
                methodMatches.forEach(match => matchingLabels.push({ method: toTitleCase(match) }));
            }

            if (mood.fit === true) {
                const calorieDiff = Math.abs(dish.calorie - mood.calorie);
                const proteinDiff = Math.abs(dish.protein - mood.protein);
                // Removed carbDiff and fatDiff

                if (calorieDiff <= 50) {
                    score += 2;
                    matchReasons.push(`Matches your calorie goal (${dish.calorie} calories)`);
                    matchingLabels.push({ calorieGoal: dish.calorie });
                }

                if (proteinDiff <= 5) {
                    score += 2;
                    matchReasons.push(`Matches your protein goal (${dish.protein}g protein)`);
                    matchingLabels.push({ proteinGoal: dish.protein });
                }

                // Removed carb and fat scoring
            }

            const dislikedMatches = dish.ingredients.filter(i =>
                palate.dislikes.map(normalize).includes(normalize(i))
            );
            if (dislikedMatches.length > 0) {
                score -= dislikedMatches.length * 2;
                matchReasons.push(`Contains ingredients you dislike: ${dislikedMatches.join(', ')}`);
                dislikedMatches.forEach(match => matchingLabels.push({ dislikedIngredient: toTitleCase(match) }));
            }

            return {
                ...dish.toObject(),
                score,
                matchReasons,
                matchingLabels
            };
        });

        const recommendedDishes = scoredDishes
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score);

        res.status(200).json(recommendedDishes);

    } catch (error) {
        console.error('Error in personalized recommendations:', error);
        res.status(500).json({
            message: "Error generating recommendations",
            error: error.message
        });
    }
});





router.get('/zique/personalized-recommendations/:userid/:restaurant_id', async (req, res) => {
    try {
        const normalize = str => (str || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();

        const palate = await Palate.findOne({ userId: req.params.userid });
        const mood = await Mood.findOne({ userId: req.params.userid });

        if (!palate) return res.status(404).json({ message: "User palate not found" });
        if (!mood) return res.status(404).json({ message: "User mood not found" });

        const dishes = await newDish.find({ restaurant_id: req.params.restaurant_id });

        const userAllergies = palate.allergies.map(normalize);
        const userDiets = palate.diet.map(normalize);

        const filteredDishes = dishes.filter(dish => {
            const dishAllergens = dish.allergens.map(normalize);
            const dishDiets = dish.diet.map(normalize);

            const hasAllergy = dishAllergens.some(a => userAllergies.includes(a));
            if (hasAllergy) return false;

            const hasAllDiets = userDiets.every(d => dishDiets.includes(d));
            return hasAllDiets;
        });

        const scoredDishes = filteredDishes.map(dish => {
            let score = 0;
            const matchReasons = [];
            const matchingLabels = [];

            const dietMatches = dish.diet.filter(d =>
                userDiets.includes(normalize(d))
            );
            if (dietMatches.length > 0) {
                score += dietMatches.length * 2;
                matchReasons.push(`Matches your dietary preferences: ${dietMatches.join(', ')}`);
                matchingLabels.push(...dietMatches.map(normalize));
            }

            const cuisineMatches = dish.cuisine.filter(c =>
                palate.cuisine.map(normalize).includes(normalize(c))
            );
            if (cuisineMatches.length > 0) {
                score += cuisineMatches.length * 2;
                matchReasons.push(`Matches your preferred cuisines: ${cuisineMatches.join(', ')}`);
                matchingLabels.push(...cuisineMatches.map(normalize));
            }

            const stapleMatches = dish.ingredients.filter(i =>
                palate.staple.map(normalize).includes(normalize(i))
            );
            if (stapleMatches.length > 0) {
                score += stapleMatches.length * 2;
                matchReasons.push(`Contains your preferred ingredients: ${stapleMatches.join(', ')}`);
                matchingLabels.push('favorite ingredient');
            }

            const flavorMatches = dish.flavor.filter(f =>
                mood.flavour.map(normalize).includes(normalize(f))
            );
            if (flavorMatches.length > 0) {
                score += flavorMatches.length * 2;
                matchReasons.push(`Matches your flavor preferences: ${flavorMatches.join(', ')}`);
                matchingLabels.push('flavor match');
            }

            const feelMatches = dish.feel.filter(f =>
                mood.feel.map(normalize).includes(normalize(f))
            );
            if (feelMatches.length > 0) {
                score += feelMatches.length * 2;
                matchReasons.push(`Matches your feel preferences: ${feelMatches.join(', ')}`);
                matchingLabels.push('feel match');
            }

            const methodMatches = dish.ingredients.filter(i =>
                mood.method.map(normalize).includes(normalize(i))
            );
            if (methodMatches.length > 0) {
                score += methodMatches.length;
                matchReasons.push(`Matches your preferred cooking methods: ${methodMatches.join(', ')}`);
                matchingLabels.push('cooking method');
            }

            if (mood.fit === true) {
                const calorieDiff = Math.abs(dish.calorie - mood.calorie);
                const proteinDiff = Math.abs(dish.protein - mood.protein);

                if (calorieDiff <= 50) {
                    score += 2;
                    matchReasons.push(`Matches your calorie goal (${dish.calorie} calories)`);
                    matchingLabels.push('calorie goal');
                }

                if (proteinDiff <= 5) {
                    score += 2;
                    matchReasons.push(`Matches your protein goal (${dish.protein}g protein)`);
                    matchingLabels.push('protein goal');
                }
            }

            const dislikedMatches = dish.ingredients.filter(i =>
                palate.dislikes.map(normalize).includes(normalize(i))
            );
            if (dislikedMatches.length > 0) {
                score -= dislikedMatches.length * 2;
                matchReasons.push(`Contains ingredients you dislike: ${dislikedMatches.join(', ')}`);
                matchingLabels.push('contains disliked items');
            }

            return {
                ...dish.toObject(),
                score,
                matchReasons,
                matchingLabels
            };
        });

        const recommendedDishes = scoredDishes
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score);

        res.status(200).json(recommendedDishes);

    } catch (error) {
        console.error('Error in personalized recommendations:', error);
        res.status(500).json({
            message: "Error generating recommendations",
            error: error.message
        });
    }
});


// router.post('/upload/:restaurant_name/:restaurant_id' , async(req,res)=>{
//     const filePath = path.join(__dirname, 'uploads', 'Evedata.xlsx');
//             const workbook = xlsx.readFile(filePath);
//             const sheet = workbook.Sheets[workbook.SheetNames[0]];
//             const dishes = xlsx.utils.sheet_to_json(sheet);
//             console.log(dishes);
//     for(let i =0 ; i<dishes.length ; i++){
//         const dish = dishes[i];
//         const calorie = parseFloat(dish['calorie']?dish['calorie']:0);
//             const protein = parseFloat(dish['protein']?dish['protein']:0);
//             const carbs = parseFloat(dish['fats']?dish['fats']:0);
//             const fats = parseFloat(dish['carbs']?dish['carbs']:0);

//             const Dish = await newDish.create({
//                 restaurant_name: req.params.restaurant_name,
//                 restaurant_id: req.params.restaurant_id,
//                 name: dish['name'],
//                 category: dish['category']?.split(',').map(item => item.trim()),
//                 diet: dish['diet']?.split(',').map(item => item.trim()),
//                 ingredients: dish['ingredients']?.split(',').map(item => item.trim()),
//                 cuisine: dish['cuisine']?.split(',').map(item => item.trim()),
//                 allergens: dish['allergens'] ? dish['allergens'].split(',').map(item => item.trim()) : [],
//                 feel: dish['feel'] ? dish['feel'].split(',').map(item => item.trim()) : [],
//                 flavor: dish['Flavor_Profile'] ? dish['Flavor_Profile'].split(',').map(item => item.trim()) : [],
//                 calorie: calorie || 0,
//                 protein: protein || 0,
//                 fats: fats || 0,
//                 carbs: carbs || 0,
//                 description: dish['description'],
//                 image: dish['image']
//             });
//             console.log(Dish);
            


//     }

// });
router.post('/upload/:restaurant_name/:restaurant_id' , async(req,res)=>{
    const filePath = path.join(__dirname, 'uploads', 'Evedata.xlsx');
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const dishes = xlsx.utils.sheet_to_json(sheet);

            try {
                const restaurant = await Restaurant.findOne({_id: req.params.restaurant_id});
                if(!restaurant){
                    return res.status(404).json({message: "Restaurant not found"});
                }
                const dishesArray = [];
                for(let i =0 ; i<dishes.length ; i++){
                    const dish = dishes[i];
                    console.log(dish['diet']);
                    const calorie = parseFloat(dish['calorie']?dish['calorie']:0);
                        const protein = parseFloat(dish['protein']?dish['protein']:0);
                        const carbs = parseFloat(dish['fats']?dish['fats']:0);
                        const fats = parseFloat(dish['carbs']?dish['carbs']:0);
            
                        const Dish = await newDish.create({
                            restaurant_name: req.params.restaurant_name,
                            restaurant_id: req.params.restaurant_id,
                            name: dish['name'],
                            category: dish['category']?.split(',').map(item => item.trim()),
                            diet: dish['diet']?.split(',').map(item => item.trim()),
                            ingredients: dish['ingredients']?.split(',').map(item => item.trim()),
                            cuisine: dish['cuisine']?.split(',').map(item => item.trim()),
                            allergens: dish['allergens'] ? dish['allergens'].split(',').map(item => item.trim()) : [],
                            feel: dish['feel'] ? dish['feel'].split(',').map(item => item.trim()) : [],
                            flavor: dish['Flavor_Profile'] ? dish['Flavor_Profile'].split(',').map(item => item.trim()) : [],
                            calorie: calorie || 0,
                            protein: protein || 0,
                            fats: fats || 0,
                            carbs: carbs || 0,
                            description: dish['description'],
                            image: dish['image']
                        });

                        dishesArray.push(Dish);



            
            
                }
                const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.restaurant_id, {menuItems: dishesArray}, {new: true}).populate('menuItems');
                return res.status(200).json(updatedRestaurant);
                
                
            } catch (error) {
                return res.status(500).json({message: "Error uploading dishes", error: error.message});
            }


});

// route to delete all dishes 
router.delete('/dish' , async(req,res)=>{
    const dishes = await newDish.deleteMany();
    return res.status(200).json({message: "All dishes deleted", dishes});
});


router.get('/dish' , async(req,res)=>{
    const dishes = await newDish.find();
    console.log(dishes);
    res.status(200).json(dishes);
    
});

module.exports = router;