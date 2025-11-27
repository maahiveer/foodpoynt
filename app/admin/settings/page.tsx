'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Save, Image as ImageIcon } from 'lucide-react'

export default function SettingsPage() {
    const [leftBanner, setLeftBanner] = useState('')
    const [rightBanner, setRightBanner] = useState('')
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
                .in('setting_key', ['homepage_left_banner', 'homepage_right_banner'])

            if (error) throw error

            if (data) {
                const leftBannerData = data.find(s => s.setting_key === 'homepage_left_banner')
                const rightBannerData = data.find(s => s.setting_key === 'homepage_right_banner')

                setLeftBanner(leftBannerData?.setting_value || '')
                setRightBanner(rightBannerData?.setting_value || '')
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            setError('Failed to load settings')
        } finally {
            setFetching(false)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            // Update left banner
            const { error: leftError } = await supabase
                .from('site_settings')
                .upsert({
                    setting_key: 'homepage_left_banner',
                    setting_value: leftBanner.trim() || null,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                })

            if (leftError) throw leftError

            // Update right banner
            const { error: rightError } = await supabase
                .from('site_settings')
                .upsert({
                    setting_key: 'homepage_right_banner',
                    setting_value: rightBanner.trim() || null,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                })

            if (rightError) throw rightError

            setSuccess('Homepage banners updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (error) {
            console.error('Error saving settings:', error)
            setError('Failed to save settings')
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
                        Homepage Settings
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Manage banners that appear on the left and right sides of your homepage
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

                    {/* Left Banner */}
                    <div>
                        <label htmlFor="left-banner" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Left Banner (9:16 ratio)
                            </div>
                        </label>
                        <textarea
                            id="left-banner"
                            rows={6}
                            value={leftBanner}
                            onChange={(e) => setLeftBanner(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                            placeholder='HTML code or image: <a href="URL"><img src="banner.jpg" alt="Ad" /></a>'
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Enter HTML code for the left banner (e.g., affiliate ad script or image with link). Recommended 9:16 aspect ratio.
                        </p>
                    </div>

                    {/* Right Banner */}
                    <div>
                        <label htmlFor="right-banner" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Right Banner (9:16 ratio)
                            </div>
                        </label>
                        <textarea
                            id="right-banner"
                            rows={6}
                            value={rightBanner}
                            onChange={(e) => setRightBanner(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                            placeholder='HTML code or image: <a href="URL"><img src="banner.jpg" alt="Ad" /></a>'
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Enter HTML code for the right banner (e.g., affiliate ad script or image with link). Recommended 9:16 aspect ratio.
                        </p>
                    </div>

                    {/* Example Code */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Example Banner Code:</h3>
                        <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
                            {`<a href="https://example.com" target="_blank">
  <img 
    src="https://example.com/banner.jpg" 
    alt="Advertisement" 
    style="width:100%; height:100%; object-fit:cover;" 
  />
</a>`}
                        </pre>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
