import { Leaf, Sprout, Flower, Sun, CloudRain, Shovel, Trees, Mountain, LucideIcon } from 'lucide-react'

export const getCategoryIcon = (name: string): LucideIcon => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('vegetable') || lowerName.includes('food') || lowerName.includes('harvest')) return Sprout
    if (lowerName.includes('flower') || lowerName.includes('bloom') || lowerName.includes('rose')) return Flower
    if (lowerName.includes('indoor') || lowerName.includes('house') || lowerName.includes('pot')) return Sun
    if (lowerName.includes('tool') || lowerName.includes('gear') || lowerName.includes('equipment')) return Shovel
    if (lowerName.includes('tree') || lowerName.includes('shrub') || lowerName.includes('bush')) return Trees
    if (lowerName.includes('landscape') || lowerName.includes('garden') || lowerName.includes('design')) return Mountain
    if (lowerName.includes('water') || lowerName.includes('irrigation')) return CloudRain
    if (lowerName.includes('soil') || lowerName.includes('dirt')) return Shovel // Fallback to shovel for soil

    // High-quality random fallback icons
    const fallbacks = [Leaf, Sprout, Flower, Trees, Sun, Shovel, Mountain]
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return fallbacks[charSum % fallbacks.length]
}

export const getCategoryGradient = (name: string): string => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('italian')) return 'from-green-600/40 to-red-600/40 hover:border-green-500/50'
    if (lowerName.includes('asian')) return 'from-orange-600/40 to-yellow-600/40 hover:border-orange-500/50'
    if (lowerName.includes('dessert')) return 'from-pink-600/40 to-purple-600/40 hover:border-pink-500/50'
    if (lowerName.includes('breakfast')) return 'from-amber-600/40 to-orange-600/40 hover:border-amber-500/50'
    if (lowerName.includes('healthy')) return 'from-emerald-600/40 to-teal-600/40 hover:border-emerald-500/50'
    if (lowerName.includes('vegan')) return 'from-lime-600/40 to-green-600/40 hover:border-lime-500/50'
    if (lowerName.includes('quick')) return 'from-blue-600/40 to-cyan-600/40 hover:border-blue-500/50'
    if (lowerName.includes('comfort')) return 'from-rose-600/40 to-red-600/40 hover:border-rose-500/50'

    // High-quality random fallback gradients (more vibrant)
    const gradients = [
        'from-indigo-600/40 to-blue-600/40 hover:border-indigo-500/50 shadow-indigo-500/10',
        'from-violet-600/40 to-fuchsia-600/40 hover:border-violet-500/50 shadow-violet-500/10',
        'from-amber-600/40 to-yellow-600/40 hover:border-amber-500/50 shadow-amber-500/10',
        'from-emerald-600/40 to-cyan-600/40 hover:border-emerald-500/50 shadow-emerald-500/10',
        'from-rose-600/40 to-pink-600/40 hover:border-rose-500/50 shadow-rose-500/10',
        'from-cyan-600/40 to-blue-600/40 hover:border-cyan-500/50 shadow-cyan-500/10'
    ]
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return gradients[charSum % gradients.length]
}

export const getIconColor = (name: string): string => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('italian')) return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
    if (lowerName.includes('asian')) return 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]'
    if (lowerName.includes('dessert')) return 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]'
    if (lowerName.includes('breakfast')) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
    if (lowerName.includes('healthy')) return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
    if (lowerName.includes('vegan')) return 'text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]'
    if (lowerName.includes('quick')) return 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]'
    if (lowerName.includes('comfort')) return 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]'

    // High-quality random fallback colors (more vibrant with glow)
    const colors = [
        'text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.6)]',
        'text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]',
        'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]',
        'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]',
        'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]',
        'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.6)]',
        'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]'
    ]
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[charSum % colors.length]
}
