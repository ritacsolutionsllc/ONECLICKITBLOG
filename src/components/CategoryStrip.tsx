import { Link } from "react-router-dom";
const CAT_COLORS: Record<string,string> = { ai:"#2563EB", cybersecurity:"#DC2626", cloud:"#0891B2", saas:"#7C3AED", startups:"#F59E0B", "enterprise-it":"#10B981", automation:"#F97316", explainers:"#6366F1" };
function timeAgo(iso: string) { if(!iso) return ""; const d=(Date.now()-new Date(iso).getTime())/1000; if(d<3600) return `${Math.round(d/60)}m ago`; if(d<86400) return `${Math.round(d/3600)}h ago`; return `${Math.round(d/86400)}d ago`; }
export default function CategoryStrip({ categoryName, categorySlug, posts=[] }: { categoryName:string; categorySlug:string; posts:any[] }) {
  if (!posts.length) return null;
  const color = CAT_COLORS[categorySlug] || "#2563EB";
  return (
    <section className="w-full py-8 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3"><div className="w-1 h-6 rounded-full" style={{backgroundColor:color}}/><h2 className="text-base font-black text-white uppercase tracking-wider">{categoryName}</h2></div>
          <Link to={`/category/${categorySlug}`} className="text-xs font-medium text-gray-500 hover:text-white transition-colors">See all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.slice(0,4).map((post) => (
            <Link key={post.id||post.slug} to={`/post/${post.slug}`} className="group flex flex-col gap-3 p-3 rounded-xl border border-gray-800 hover:border-gray-600 hover:bg-gray-900/50 transition-all">
              {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="w-full aspect-video object-cover rounded-lg"/>}
              <div>
                <p className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">{post.title}</p>
                {post.published_at && <p className="text-xs text-gray-600 mt-1">{timeAgo(post.published_at)}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
