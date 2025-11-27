'use client'

import { useEffect, useState } from 'react'
import { supabase, Category } from '@/lib/supabase'
import {
    FolderOpen,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    FileText
} from 'lucide-react'

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showNewForm, setShowNewForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    })
    const [articleCounts, setArticleCounts] = useState<Record<string, number>>({})

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error

            setCategories(data || [])

            // Fetch article counts for each category
            if (data) {
                const counts: Record<string, number> = {}
                for (const category of data) {
                    const { count, error: countError } = await supabase
                        .from('articles')
                        .select('*', { count: 'exact', head: true })
                        .eq('category_id', category.id)

                    if (!countError && count !== null) {
                        counts[category.id] = count
                    }
                }
                setArticleCounts(counts)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            alert('Name and slug are required')
            return
        }

        try {
            const { error } = await supabase
                .from('categories')
                .insert({
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                    description: formData.description.trim() || null
                })

            if (error) throw error

            setFormData({ name: '', slug: '', description: '' })
            setShowNewForm(false)
            fetchCategories()
        } catch (error: any) {
            console.error('Error creating category:', error)
            alert(error.message || 'Failed to create category')
        }
    }

    const handleUpdate = async (id: string) => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            alert('Name and slug are required')
            return
        }

        try {
            const { error } = await supabase
                .from('categories')
                .update({
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                    description: formData.description.trim() || null
                })
                .eq('id', id)

            if (error) throw error

            setEditingId(null)
            setFormData({ name: '', slug: '', description: '' })
            fetchCategories()
        } catch (error: any) {
            console.error('Error updating category:', error)
            alert(error.message || 'Failed to update category')
        }
    }

    const handleDelete = async (id: string, name: string) => {
        const articleCount = articleCounts[id] || 0
        const confirmMessage = articleCount > 0
            ? `Are you sure you want to delete "${name}"? This will unassign ${articleCount} article(s) from this category.`
            : `Are you sure you want to delete "${name}"?`

        if (!confirm(confirmMessage)) return

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)

            if (error) throw error

            fetchCategories()
        } catch (error: any) {
            console.error('Error deleting category:', error)
            alert(error.message || 'Failed to delete category')
        }
    }

    const startEdit = (category: Category) => {
        setEditingId(category.id)
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || ''
        })
        setShowNewForm(false)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setShowNewForm(false)
        setFormData({ name: '', slug: '', description: '' })
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        })
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading categories...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categories</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        Manage article categories
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowNewForm(true)
                        setEditingId(null)
                        setFormData({ name: '', slug: '', description: '' })
                    }}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                </button>
            </div>

            {/* New Category Form */}
            {showNewForm && (
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Create New Category
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Technology"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="technology"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Category description"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Create
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    {categories.length === 0 ? (
                        <div className="text-center py-8">
                            <FolderOpen className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">No categories</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Get started by creating a new category.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                            Articles
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            {editingId === category.id ? (
                                                <>
                                                    <td className="px-6 py-4" colSpan={4}>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                                        Name *
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={formData.name}
                                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                                        Slug *
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={formData.slug}
                                                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    rows={2}
                                                                    value={formData.description}
                                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleUpdate(category.id)}
                                                                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                                >
                                                                    <Save className="h-3 w-3 mr-1" />
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="inline-flex items-center px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
                                                                >
                                                                    <X className="h-3 w-3 mr-1" />
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                                    <FolderOpen className="h-5 w-5 text-white" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                    {category.name}
                                                                </div>
                                                                {category.description && (
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {category.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                        {category.slug}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                            <FileText className="h-4 w-4 mr-1" />
                                                            {articleCounts[category.id] || 0}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => startEdit(category)}
                                                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category.id, category.name)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
