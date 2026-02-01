'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Save, Key, Eye, EyeOff, Sparkles } from 'lucide-react'

interface SiteSetting {
    setting_key: string
    setting_value: string | null
}

export default function SettingsPage() {
    const [openrouterKey, setOpenrouterKey] = useState('')
    const [replicateKey, setReplicateKey] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [openRouterModel, setOpenRouterModel] = useState('anthropic/claude-3.5-sonnet') // New state
    const [showOpenrouterKey, setShowOpenrouterKey] = useState(false)
    const [showReplicateKey, setShowReplicateKey] = useState(false)
    const [showGeminiKey, setShowGeminiKey] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setFetching(true)
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('setting_key, setting_value')
                .in('setting_key', ['openrouter_api_key', 'replicate_api_token', 'gemini_api_key', 'openrouter_model']) // Added openrouter_model

            if (error) throw error

            if (data) {
                const settings = data as SiteSetting[]
                const openrouterData = settings.find(s => s.setting_key === 'openrouter_api_key')
                const replicateData = settings.find(s => s.setting_key === 'replicate_api_token')
                const geminiData = settings.find(s => s.setting_key === 'gemini_api_key')
                const modelData = settings.find(s => s.setting_key === 'openrouter_model') // New

                setOpenrouterKey(openrouterData?.setting_value || '')
                setReplicateKey(replicateData?.setting_value || '')
                setGeminiKey(geminiData?.setting_value || '')
                setOpenRouterModel(modelData?.setting_value || 'anthropic/claude-3.5-sonnet') // New
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            // Don't show error if table doesn't exist yet
        } finally {
            setFetching(false)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const updates = [
                { setting_key: 'openrouter_api_key', setting_value: openrouterKey.trim() || null, updated_at: new Date().toISOString() },
                { setting_key: 'replicate_api_token', setting_value: replicateKey.trim() || null, updated_at: new Date().toISOString() },
                { setting_key: 'gemini_api_key', setting_value: geminiKey.trim() || null, updated_at: new Date().toISOString() },
                { setting_key: 'openrouter_model', setting_value: openRouterModel.trim() || 'anthropic/claude-3.5-sonnet', updated_at: new Date().toISOString() }
            ]

            const { error: upsertError } = await supabase
                .from('site_settings')
                .upsert(updates, { onConflict: 'setting_key' })

            if (upsertError) throw upsertError

            setSuccess('Settings saved successfully! You are ready to generate.')
            setTimeout(() => setSuccess(''), 5000)
            fetchSettings()
        } catch (err: any) {
            console.error('Error saving settings:', err)
            setError(err.message || 'Failed to save settings. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-slate-600 dark:text-slate-400">Loading settings...</div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        AI Generator Settings
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Configure API keys for the Advanced AI Article Generator
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                            🚀 Enable Advanced AI Features
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                            Add your API keys below to unlock the Advanced AI Generator with 200-word descriptions and high-quality images.
                        </p>
                        <div className="space-y-2 text-xs text-blue-700 dark:text-blue-400">
                            <p>• <strong>Google Gemini (FREE):</strong> Get your key at <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">makersuite.google.com</a></p>
                            <p>• <strong>OpenRouter:</strong> Get your key at <a href="https://openrouter.ai/keys" target="_blank" className="underline">openrouter.ai/keys</a></p>
                            <p>• <strong>Replicate:</strong> Get your token at <a href="https://replicate.com/account/api-tokens" target="_blank" className="underline">replicate.com/account/api-tokens</a></p>
                        </div>
                    </div>

                    {/* Gemini API Key */}
                    <div>
                        <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                Google Gemini API Key (FREE) ⭐
                            </div>
                        </label>
                        <div className="relative">
                            <input
                                id="gemini-key"
                                type={showGeminiKey ? 'text' : 'password'}
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                className="block w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                                placeholder="AIza..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowGeminiKey(!showGeminiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <strong className="text-green-600 dark:text-green-400">FREE!</strong> Used for generating article text with Gemini Pro (60 requests/min free tier)
                        </p>
                    </div>

                    {/* OpenRouter Model ID Setting */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <label htmlFor="openrouter-model" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                OpenRouter Model ID (Premium)
                            </div>
                        </label>
                        <input
                            id="openrouter-model"
                            type="text"
                            value={openRouterModel}
                            onChange={(e) => setOpenRouterModel(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                            placeholder="anthropic/claude-3.5-sonnet"
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Default: <code>anthropic/claude-3.5-sonnet</code>. You can change this to <code>openai/gpt-4o</code> or any other OpenRouter model ID.
                        </p>
                    </div>

                    {/* OpenRouter API Key */}
                    <div>
                        <label htmlFor="openrouter-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                OpenRouter API Key
                            </div>
                        </label>
                        <div className="relative">
                            <input
                                id="openrouter-key"
                                type={showOpenrouterKey ? 'text' : 'password'}
                                value={openrouterKey}
                                onChange={(e) => setOpenrouterKey(e.target.value)}
                                className="block w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                                placeholder="sk-or-v1-..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showOpenrouterKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Used for generating article text with Claude 3.5 Sonnet
                        </p>
                    </div>

                    {/* Replicate API Token */}
                    <div>
                        <label htmlFor="replicate-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                Replicate API Token
                            </div>
                        </label>
                        <div className="relative">
                            <input
                                id="replicate-key"
                                type={showReplicateKey ? 'text' : 'password'}
                                value={replicateKey}
                                onChange={(e) => setReplicateKey(e.target.value)}
                                className="block w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                                placeholder="r8_..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowReplicateKey(!showReplicateKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showReplicateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Used for generating high-quality photorealistic images
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'Saving...' : 'Save API Keys'}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
