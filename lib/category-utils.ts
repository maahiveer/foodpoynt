import { 
    Utensils, 
    Coffee, 
    Beef, 
    Cake, 
    Wine, 
    Pizza, 
    Sandwich, 
    Salad, 
    Soup, // Note: Check if Soup exists, otherwise fallback to Utensils
    Carrot,
    ChefHat,
    Beer,
    Martini,
    IceCream,
    LucideIcon 
} from 'lucide-react'

export const getCategoryIcon = (name: string): LucideIcon => {
    const lowerName = name.toLowerCase()
    // Meals
    if (lowerName.includes('breakfast') || lowerName.includes('morning')) return Coffee
    if (lowerName.includes('lunch') || lowerName.includes('sandwich')) return Sandwich
    if (lowerName.includes('dinner') || lowerName.includes('steak') || lowerName.includes('beef')) return Beef
    
    // Dish Types
    if (lowerName.includes('pizza') || lowerName.includes('italian')) return Pizza
    if (lowerName.includes('salad') || lowerName.includes('healthy') || lowerName.includes('veg')) return Salad
    if (lowerName.includes('soup') || lowerName.includes('stew')) return Soup
    if (lowerName.includes('dessert') || lowerName.includes('cake') || lowerName.includes('sweet')) return Cake
    if (lowerName.includes('ice cream') || lowerName.includes('gelato')) return IceCream

    // Drinks
    if (lowerName.includes('drink') || lowerName.includes('cocktail') || lowerName.includes('alcohol')) return Martini
    if (lowerName.includes('beer') || lowerName.includes('brew')) return Beer
    if (lowerName.includes('wine')) return Wine
    if (lowerName.includes('coffee') || lowerName.includes('tea')) return Coffee

    // General
    if (lowerName.includes('recipe') || lowerName.includes('cook')) return ChefHat
    if (lowerName.includes('ingredient') || lowerName.includes('fresh')) return Carrot

    // High-quality random fallback icons
    const fallbacks = [Utensils, ChefHat, Carrot, Pizza, Coffee, Wine]
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return fallbacks[charSum % fallbacks.length]
}

export const getCategoryGradient = (name: string): string => {
    const lowerName = name.toLowerCase()
    
    // Warm/Hot (Spicy, Meats, Pizza)
    if (lowerName.includes('dinner') || lowerName.includes('beef') || lowerName.includes('pizza') || lowerName.includes('spicy')) 
        return 'from-red-600/40 to-orange-600/40 hover:border-red-500/50'

    // Fresh/Green (Salads, Veggies, Healthy)
    if (lowerName.includes('salad') || lowerName.includes('veg') || lowerName.includes('healthy') || lowerName.includes('garden')) 
        return 'from-green-600/40 to-emerald-600/40 hover:border-green-500/50'

    // Sweet/Pink (Desserts, Cakes)
    if (lowerName.includes('dessert') || lowerName.includes('cake') || lowerName.includes('sweet') || lowerName.includes('ice cream')) 
        return 'from-pink-600/40 to-rose-600/40 hover:border-pink-500/50'

    // Drinks (Purple, Blue, Amber)
    if (lowerName.includes('cocktail') || lowerName.includes('wine')) 
        return 'from-purple-600/40 to-violet-600/40 hover:border-purple-500/50'
    if (lowerName.includes('beer') || lowerName.includes('breakfast') || lowerName.includes('coffee')) 
        return 'from-amber-600/40 to-yellow-600/40 hover:border-amber-500/50'

    // Cold/Water (Seafood, Drinks)
    if (lowerName.includes('water') || lowerName.includes('fish') || lowerName.includes('seafood'))
        return 'from-cyan-600/40 to-blue-600/40 hover:border-cyan-500/50'

    // Fallback
    const gradients = [
        'from-orange-600/40 to-amber-600/40 hover:border-orange-500/50',
        'from-red-600/40 to-rose-600/40 hover:border-red-500/50',
        'from-emerald-600/40 to-teal-600/40 hover:border-emerald-500/50',
        'from-indigo-600/40 to-violet-600/40 hover:border-indigo-500/50'
    ]
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return gradients[charSum % gradients.length]
}

export const getIconColor = (name: string): string => {
    const lowerName = name.toLowerCase()
    
    if (lowerName.includes('dinner') || lowerName.includes('beef') || lowerName.includes('pizza')) 
        return 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]'
        
    if (lowerName.includes('salad') || lowerName.includes('veg') || lowerName.includes('healthy')) 
        return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
        
    if (lowerName.includes('dessert') || lowerName.includes('cake')) 
        return 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]'
        
    if (lowerName.includes('cocktail') || lowerName.includes('wine')) 
        return 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]'
        
    if (lowerName.includes('beer') || lowerName.includes('coffee')) 
        return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'

    // Fallbacks
    const colors = [
        'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]',
        'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]',
        'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
    ]
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[charSum % colors.length]
}

