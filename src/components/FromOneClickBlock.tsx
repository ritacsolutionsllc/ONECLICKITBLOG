import { Link } from "react-router-dom";
export default function FromOneClickBlock({ posts=[] }: { posts: any[] }) {
  if (!posts.length) return null;
  return (
    <section className="w-full py-8 bg-gray-900/30 border-y border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">From OneClick</span>
            <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded border border-gray-700">Sponsored Content</span>
          </div>
          <span className="text-[10px] text-gray-600">Editorial disclosure: OneClick products</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {posts.slice(0,3).map((post) => (
            <Link key={post.id||post.slug} to={`/post/${post.slug}`} className="group p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/30 transition-all flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-300 leading-snug line-clamp-2 group-hover:text-white transition-colors">{post.title}</p>
              {post.excerpt && <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
