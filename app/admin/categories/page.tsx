'use client'

import { useAuth } from '@/components/AuthProvider'
import { AdminLayout } from '@/components/AdminLayout'
import { CategoryManager } from '@/components/CategoryManager'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminCategoriesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <AdminLayout>
            <CategoryManager />
        </AdminLayout>
    )
}
