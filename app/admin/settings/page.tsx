'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Save, Key, Eye, EyeOff, Sparkles, Image as ImageIcon } from 'lucide-react'

interface SiteSetting {
    setting_key: string
    setting_value: string | null
}

export default function SettingsPage() {
    const [openrouterKey, setOpenrouterKey] = useState('')
    const [replicateKey, setReplicateKey] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [openRouterModel, setOpenRouterModel] = useState('anthropic/claude-3.5-sonnet')

    // APIFree Settings
    const [apiFreeKey, setApiFreeKey] = useState('')
    const [apiFreeModel, setApiFreeModel] = useState('gpt-4o')
    const [apiFreeImageModel, setApiFreeImageModel] = useState('dall-e-3')
    const [showApiFreeKey, setShowApiFreeKey] = useState(false)

    // Legacy display toggles
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
            const keysToFetch = [
                'openrouter_api_key', 'replicate_api_token', 'gemini_api_key', 'openrouter_model',
                'apifree_api_key', 'apifree_model', 'apifree_image_model'
            ]

            const { data, error } = await supabase
                .from('site_settings')
                .select('setting_key, setting_value')
                .in('setting_key', keysToFetch)

            if (error) throw error

            if (data) {
                const settings = data as SiteSetting[]
                const openrouterData = settings.find(s => s.setting_key === 'openrouter_api_key')
                const replicateData = settings.find(s => s.setting_key === 'replicate_api_token')
                const geminiData = settings.find(s => s.setting_key === 'gemini_api_key')
                const modelData = settings.find(s => s.setting_key === 'openrouter_model')

                const apiFreeKeyData = settings.find(s => s.setting_key === 'apifree_api_key')
                const apiFreeModelData = settings.find(s => s.setting_key === 'apifree_model')
                const apiFreeImageModelData = settings.find(s => s.setting_key === 'apifree_image_model')

                setOpenrouterKey(openrouterData?.setting_value || '')
                setReplicateKey(replicateData?.setting_value || '')
                setGeminiKey(geminiData?.setting_value || '')
                setOpenRouterModel(modelData?.setting_value || 'anthropic/claude-3.5-sonnet')

                setApiFreeKey(apiFreeKeyData?.setting_value || '')
                setApiFreeModel(apiFreeModelData?.setting_value || 'gpt-4o')
                setApiFreeImageModel(apiFreeImageModelData?.setting_value || 'dall-e-3')
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
                { setting_key: 'openrouter_model', setting_value: openRouterModel.trim() || 'anthropic/claude-3.5-sonnet', updated_at: new Date().toISOString() },

                { setting_key: 'apifree_api_key', setting_value: apiFreeKey.trim() || null, updated_at: new Date().toISOString() },
                { setting_key: 'apifree_model', setting_value: apiFreeModel.trim() || 'gpt-4o', updated_at: new Date().toISOString() },
                { setting_key: 'apifree_image_model', setting_value: apiFreeImageModel.trim() || 'dall-e-3', updated_at: new Date().toISOString() }
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
                            🚀 Enable APIFree.ai (Recommended)
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                            Use APIFree.ai for both text and image generation. It provides access to GPT-4, Claude, and more via a single key.
                        </p>
                        <div className="space-y-2 text-xs text-blue-700 dark:text-blue-400">
                            <p>• <strong>APIFree.ai:</strong> Get your key at <a href="https://apifree.ai" target="_blank" className="underline">apifree.ai</a></p>
                        </div>
                    </div>

                    {/* APIFree API Key */}
                    <div>
                        <label htmlFor="apifree-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                APIFree.ai API Key
                            </div>
                        </label>
                        <div className="relative">
                            <input
                                id="apifree-key"
                                type={showApiFreeKey ? 'text' : 'password'}
                                value={apiFreeKey}
                                onChange={(e) => setApiFreeKey(e.target.value)}
                                className="block w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                                placeholder="sk-..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowApiFreeKey(!showApiFreeKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showApiFreeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* APIFree Text Model */}
                    <div>
                        <label htmlFor="apifree-model" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                Text Model ID
                            </div>
                        </label>
                        <input
                            id="apifree-model"
                            type="text"
                            value={apiFreeModel}
                            onChange={(e) => setApiFreeModel(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                            placeholder="gpt-4o"
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            e.g., <code>gpt-4o</code>, <code>claude-3-5-sonnet</code>
                        </p>
                    </div>

                    {/* APIFree Image Model */}
                    <div>
                        <label htmlFor="apifree-image-model" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-pink-500" />
                                Image Model ID
                            </div>
                        </label>
                        <input
                            id="apifree-image-model"
                            type="text"
                            value={apiFreeImageModel}
                            onChange={(e) => setApiFreeImageModel(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                            placeholder="dall-e-3"
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Default: <code>dall-e-3</code>. You can change this if APIFree supports other image models.
                        </p>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-700" />

                    {/* Legacy/Alternative Keys (Collapsed or Secondary) */}
                    <div className="opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Legacy Providers (Optional)</h3>

                        {/* OpenRouter API Key */}
                        <div className="mb-4">
                            <label htmlFor="openrouter-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                OpenRouter API Key
                            </label>
                            <input
                                id="openrouter-key"
                                type="password"
                                value={openrouterKey}
                                onChange={(e) => setOpenrouterKey(e.target.value)}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm"
                            />
                        </div>

                        {/* Replicate API Token */}
                        <div>
                            <label htmlFor="replicate-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Replicate API Token
                            </label>
                            <input
                                id="replicate-key"
                                type="password"
                                value={replicateKey}
                                onChange={(e) => setReplicateKey(e.target.value)}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm"
                            />
                        </div>
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
