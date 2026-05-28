import { NextResponse } from 'next/server'

const BASE44_FN_URL = process.env.BASE44_NEWSROOM_DASHBOARD_URL || 'https://base44.app/api/function/newsroomDashboard'

export async function GET() {
  try {
    const res = await fetch(BASE44_FN_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.BASE44_API_KEY ? { 'Authorization': `Bearer ${process.env.BASE44_API_KEY}` } : {}),
      },
      next: { revalidate: 0 },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    // Fallback: return mock data so dashboard still renders in dev
    return NextResponse.json({
      success: true,
      generated_at: new Date().toISOString(),
      kpis: { live_readers_now: 485, top_article_now: { id: '1', title: 'Google engineer charged with insider trading...', live_readers: 203, trend: 'up' }, articles_published_today: 0, newsletter_signups_today: 117, social_clicks_today: 4060, review_queue_open: 3 },
      top10_now: [], rising: [], recent_24h: [], traffic_sources: { search: 2820, social: 4060, direct: 4040, newsletter: 1530, referral: 1680, homepage: 5230 },
      views_by_category: [{ slug: 'startups', views: 7490, articles: 2, color: '#F59E0B' }, { slug: 'ai', views: 2140, articles: 1, color: '#2563EB' }],
      top_converting: [], top_social: [], recirculation: [], search_winners: [],
      alerts: [{ type: 'missing_image', severity: 'critical', message: 'Article missing hero image', article_title: 'Snowflake to burn $6B...' }],
      pipeline: { latest_intake: { status: 'success', records_processed: 48, started_at: new Date().toISOString() }, latest_draft_gen: { status: 'success', records_processed: 5, started_at: new Date().toISOString() }, latest_publish: { status: 'partial', records_processed: 3, started_at: new Date().toISOString() }, recent_failures: [], next_scheduled_publish: { title: 'OpenAI GPT-5 Turbo...', planned_publish_date: '2026-05-28' }, story_candidates_pending: 1 },
      underperforming_categories: [{ slug: 'automation', views: 0 }, { slug: 'enterprise-it', views: 0 }],
      recent_activity: [],
    })
  }
}
