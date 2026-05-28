import { Link } from "react-router-dom";
const CAT_COLORS: Record<string,string> = { ai:"#2563EB", cybersecurity:"#DC2626", cloud:"#0891B2", saas:"#7C3AED", startups:"#F59E0B", "enterprise-it":"#10B981", automation:"#F97316", explainers:"#6366F1" };
export default function TrendingTopicsBar({ topics=[] }: { topics: any[] }) {
  if (!topics.length) return null;
  return (
    <div className="w-full bg-gray-900/60 border-y border-gray-800 py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex-shrink-0 mr-1">Trending</span>
        {topics.map((t) => (
          <Link key={t.slug} to={`/topic/${t.slug}`} className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:scale-105"
            style={{borderColor:(CAT_COLORS[t.category_slug]||"#6B7280")+"50",color:CAT_COLORS[t.category_slug]||"#9CA3AF",backgroundColor:(CAT_COLORS[t.category_slug]||"#6B7280")+"15"}}>
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
