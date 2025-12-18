import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({
                error: 'Supabase client not initialized',
                env: {
                    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                }
            }, { status: 500 })
        }

        const { data: articles, error: artError } = await supabase
            .from('articles')
            .select('id, title, status, created_at')
            .order('created_at', { ascending: false })

        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id, name')

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
            database: {
                articles: {
                    count: articles?.length || 0,
                    error: artError?.message || null,
                    items: articles?.map(a => ({ title: a.title, status: a.status })) || []
                },
                categories: {
                    count: categories?.length || 0,
                    error: catError?.message || null,
                    items: categories?.map(c => c.name) || []
                }
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
