import { Link } from "react-router-dom";
const CAT_COLORS: Record<string,string> = { ai:"#2563EB", cybersecurity:"#DC2626", cloud:"#0891B2", saas:"#7C3AED", startups:"#F59E0B", "enterprise-it":"#10B981", automation:"#F97316", explainers:"#6366F1" };
function timeAgo(iso: string) { const d=(Date.now()-new Date(iso).getTime())/1000; if(d<3600) return `${Math.round(d/60)}m ago`; if(d<86400) return `${Math.round(d/3600)}h ago`; return `${Math.round(d/86400)}d ago`; }
export default function HomepageHero({ post }: { post: any }) {
  if (!post) return null;
  const color = CAT_COLORS[post.primary_topic_slug] || "#2563EB";
  return (
    <section className="w-full bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white" style={{backgroundColor:color}}>{post.primary_topic_slug?.replace(/-/g," ")}</span>
            {post.featured && <span className="text-xs bg-yellow-400/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full font-semibold">Featured</span>}
            {post.published_at && <span className="text-xs text-gray-500">{timeAgo(post.published_at)}</span>}
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
            <Link to={`/post/${post.slug}`} className="hover:text-blue-400 transition-colors">{post.title}</Link>
          </h1>
          {post.excerpt && <p className="text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">{post.excerpt}</p>}
          <div className="flex items-center gap-4 pt-2">
            <Link to={`/post/${post.slug}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">Read story →</Link>
            {post.author_name && <span className="text-xs text-gray-500">By {post.author_name}</span>}
          </div>
        </div>
        {post.cover_image_url && (
          <div className="lg:col-span-2">
            <Link to={`/post/${post.slug}`}>
              <img src={post.cover_image_url} alt={post.title} className="w-full aspect-video object-cover rounded-xl border border-gray-800 hover:opacity-90 transition-opacity" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
