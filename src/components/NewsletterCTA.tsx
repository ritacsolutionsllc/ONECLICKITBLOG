import { useState } from "react";
export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success">("idle");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email||!email.includes("@")) return;
    setStatus("loading");
    // TODO: wire to email provider (Resend/ConvertKit/Mailchimp)
    setTimeout(() => setStatus("success"), 800);
  }
  return (
    <section className="w-full bg-gradient-to-r from-blue-950 to-gray-950 border-t border-blue-900/30 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Newsletter</p>
        <h2 className="text-2xl font-black text-white mb-2">Tech & AI news that actually matters</h2>
        <p className="text-gray-400 text-sm mb-6">Daily digest. No noise. Unsubscribe anytime.</p>
        {status==="success" ? (
          <p className="text-emerald-400 font-semibold">✓ You're in! Check your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" required/>
            <button type="submit" disabled={status==="loading"} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-60">{status==="loading"?"...":"Subscribe"}</button>
          </form>
        )}
        <p className="text-[11px] text-gray-600 mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
