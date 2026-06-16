import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'vgclj2r6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

async function seed() {
  console.log('Seeding Sanity content...\n')

  // ── Site Settings ───────────────────────────────────────
  console.log('Creating site settings...')
  const settings = await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'OneClickIT',
    description: 'Tech news, buyer guides, and trend analysis delivered daily.',
    enableAds: false,
    enableAffiliate: true,
    socialLinks: {
      twitter: 'https://twitter.com/oneclickit',
      github: 'https://github.com/ritacsolutionsllc',
    },
  })
  console.log(`  ✓ Site settings created`)

  // ── Categories ──────────────────────────────────────────
  console.log('Creating categories...')
  const categories = [
    { title: 'AI & Machine Learning', slug: 'ai-ml', icon: 'brain', description: 'Artificial intelligence, large language models, and machine learning tools and techniques.' },
    { title: 'Cloud & DevOps', slug: 'cloud-devops', icon: 'cloud', description: 'Cloud platforms, infrastructure, CI/CD, containers, and deployment strategies.' },
    { title: 'Cybersecurity', slug: 'cybersecurity', icon: 'shield', description: 'Security tools, vulnerabilities, best practices, and threat intelligence.' },
    { title: 'Development Tools', slug: 'dev-tools', icon: 'code', description: 'IDEs, frameworks, libraries, and productivity tools for developers.' },
    { title: 'Hardware & Gadgets', slug: 'hardware', icon: 'monitor', description: 'Laptops, peripherals, servers, and consumer electronics reviews.' },
    { title: 'Networking', slug: 'networking', icon: 'wifi', description: 'Routers, switches, firewalls, SD-WAN, and network management.' },
  ]

  const catRefs = {}
  for (const cat of categories) {
    const doc = await client.createIfNotExists({
      _id: `category-${cat.slug}`,
      _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      icon: cat.icon,
      description: cat.description,
    })
    catRefs[cat.slug] = doc._id
    console.log(`  ✓ ${cat.title}`)
  }

  // ── Author ──────────────────────────────────────────────
  console.log('Creating author...')
  const author = await client.createIfNotExists({
    _id: 'author-oneclickit',
    _type: 'author',
    name: 'OneClickIT Editorial',
    slug: { _type: 'slug', current: 'oneclickit-editorial' },
    bio: 'The OneClickIT editorial team covers the latest in tech, from AI breakthroughs to hardware reviews. We cut through the noise to deliver actionable insights for IT professionals and tech enthusiasts.',
  })
  console.log(`  ✓ ${author.name}`)

  // ── Sources ─────────────────────────────────────────────
  console.log('Creating RSS sources...')
  const sources = [
    // AI & Machine Learning
    { name: 'OpenAI Blog',             slug: 'openai-blog',         url: 'https://openai.com/blog/rss.xml',                                       cat: 'ai-ml' },
    { name: 'Anthropic News',          slug: 'anthropic-news',      url: 'https://www.anthropic.com/news/rss.xml',                                 cat: 'ai-ml' },
    { name: 'Google AI Blog',          slug: 'google-ai-blog',      url: 'https://research.google/blog/rss/',                                      cat: 'ai-ml' },
    { name: 'Hugging Face Blog',       slug: 'huggingface-blog',    url: 'https://huggingface.co/blog/feed.xml',                                   cat: 'ai-ml' },
    { name: 'MIT Tech Review – AI',    slug: 'mit-tech-ai',         url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',   cat: 'ai-ml' },
    { name: 'VentureBeat AI',          slug: 'venturebeat-ai',      url: 'https://venturebeat.com/category/ai/feed/',                              cat: 'ai-ml' },
    { name: 'Google DeepMind Blog',    slug: 'deepmind-blog',       url: 'https://deepmind.google/blog/rss.xml',                                   cat: 'ai-ml' },
    { name: 'The Batch (deeplearning.ai)', slug: 'the-batch',       url: 'https://read.deeplearning.ai/the-batch/rss/',                            cat: 'ai-ml' },

    // Cybersecurity
    { name: 'Krebs on Security',       slug: 'krebs-security',      url: 'https://krebsonsecurity.com/feed/',                                      cat: 'cybersecurity' },
    { name: 'Schneier on Security',    slug: 'schneier',            url: 'https://www.schneier.com/feed/',                                         cat: 'cybersecurity' },
    { name: 'The Hacker News',         slug: 'thehackernews',       url: 'https://feeds.feedburner.com/TheHackersNews',                            cat: 'cybersecurity' },
    { name: 'Bleeping Computer',       slug: 'bleepingcomputer',    url: 'https://www.bleepingcomputer.com/feed/',                                  cat: 'cybersecurity' },
    { name: 'Dark Reading',            slug: 'darkreading',         url: 'https://www.darkreading.com/rss.xml',                                    cat: 'cybersecurity' },
    { name: 'SecurityWeek',            slug: 'securityweek',        url: 'https://feeds.feedburner.com/Securityweek',                              cat: 'cybersecurity' },

    // Cloud & DevOps
    { name: 'AWS News Blog',           slug: 'aws-blog',            url: 'https://aws.amazon.com/blogs/aws/feed/',                                 cat: 'cloud-devops' },
    { name: 'Google Cloud Blog',       slug: 'google-cloud-blog',   url: 'https://cloud.google.com/feeds/gcp-news-rss.xml',                        cat: 'cloud-devops' },
    { name: 'Azure Updates',           slug: 'azure-updates',       url: 'https://azurecomcdn.azureedge.net/en-us/updates/feed/',                  cat: 'cloud-devops' },
    { name: 'The New Stack',           slug: 'thenewstack',         url: 'https://thenewstack.io/feed',                                            cat: 'cloud-devops' },
    { name: 'DevOps.com',              slug: 'devopscom',           url: 'https://devops.com/feed/',                                               cat: 'cloud-devops' },

    // Developer Tools & Open Source
    { name: 'GitHub Blog',             slug: 'github-blog',         url: 'https://github.blog/feed/',                                              cat: 'dev-tools' },
    { name: 'InfoQ',                   slug: 'infoq',               url: 'https://feed.infoq.com/',                                                cat: 'dev-tools' },
    { name: 'Dev.to',                  slug: 'devto',               url: 'https://dev.to/feed',                                                    cat: 'dev-tools' },
    { name: 'Hacker News',             slug: 'hacker-news',         url: 'https://hnrss.org/frontpage',                                            cat: 'dev-tools' },

    // General Tech & Startups
    { name: 'TechCrunch',              slug: 'techcrunch',          url: 'https://techcrunch.com/feed/',                                           cat: 'ai-ml' },
    { name: 'The Verge',               slug: 'the-verge',           url: 'https://www.theverge.com/rss/index.xml',                                 cat: 'dev-tools' },
    { name: 'Ars Technica',            slug: 'ars-technica',        url: 'https://feeds.arstechnica.com/arstechnica/index',                        cat: 'hardware' },
    { name: 'Wired',                   slug: 'wired',               url: 'https://www.wired.com/feed/rss',                                         cat: 'dev-tools' },
    { name: 'MIT Technology Review',   slug: 'mit-tech-review',     url: 'https://www.technologyreview.com/feed/',                                 cat: 'dev-tools' },
    { name: 'VentureBeat',             slug: 'venturebeat',         url: 'https://venturebeat.com/feed/',                                          cat: 'ai-ml' },
    { name: 'ZDNet',                   slug: 'zdnet',               url: 'https://www.zdnet.com/news/rss.xml',                                     cat: 'dev-tools' },

    // Hardware & Consumer Tech
    { name: "Tom's Hardware",          slug: 'tomshardware',        url: 'https://www.tomshardware.com/feeds/all',                                 cat: 'hardware' },
    { name: 'Engadget',                slug: 'engadget',            url: 'https://www.engadget.com/rss.xml',                                       cat: 'hardware' },
    { name: '9to5Mac',                 slug: '9to5mac',             url: 'https://9to5mac.com/feed/',                                              cat: 'hardware' },
    { name: '9to5Google',              slug: '9to5google',          url: 'https://9to5google.com/feed/',                                           cat: 'hardware' },

    // Networking
    { name: 'Network World',           slug: 'network-world',       url: 'https://www.networkworld.com/index.rss',                                 cat: 'networking' },
  ]

  const sourceRefs = {}
  for (const src of sources) {
    const doc = await client.createIfNotExists({
      _id: `source-${src.slug}`,
      _type: 'source',
      name: src.name,
      slug: { _type: 'slug', current: src.slug },
      url: src.url,
      type: 'rss',
      active: true,
      category: { _type: 'reference', _ref: catRefs[src.cat] },
    })
    sourceRefs[src.slug] = doc._id
    console.log(`  ✓ ${src.name}`)
  }

  // ── Original Posts ──────────────────────────────────────
  console.log('Creating posts...')
  const posts = [
    {
      slug: 'best-ai-coding-assistants-2026',
      title: 'The Best AI Coding Assistants in 2026: A Comprehensive Comparison',
      excerpt: 'We tested every major AI coding assistant — from Claude to GitHub Copilot to Cursor — across real-world tasks. Here are the results that matter.',
      category: 'ai-ml',
      featured: true,
      body: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'AI coding assistants have evolved from simple autocomplete tools to full-fledged pair programmers. In 2026, the landscape is more competitive than ever, with multiple strong contenders vying for a spot in your development workflow.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'How We Tested' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'We evaluated each assistant on five dimensions: code quality, context understanding, speed, multi-file refactoring capability, and debugging assistance. Each tool was tested on identical real-world codebases in TypeScript, Python, and Go.' }] },
        { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'The Results' }] },
        { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Claude Code emerged as the top performer for complex refactoring tasks, while GitHub Copilot retained its edge in single-line completions. Cursor impressed with its IDE integration depth. The choice ultimately depends on your workflow — whether you value autonomous task execution or inline suggestions.' }] },
        { _type: 'block', _key: 'b6', style: 'h2', children: [{ _type: 'span', _key: 's6', text: 'Our Recommendation' }] },
        { _type: 'block', _key: 'b7', style: 'normal', children: [{ _type: 'span', _key: 's7', text: 'For teams working on large codebases with complex architecture, Claude Code offers the best balance of understanding and execution. For individual developers who want seamless IDE integration, Cursor is hard to beat. And for enterprises already in the GitHub ecosystem, Copilot remains a solid default.' }] },
      ],
    },
    {
      slug: 'zero-trust-network-guide-smb',
      title: 'Zero Trust Networking for Small Business: A Practical Guide',
      excerpt: 'Zero trust isn\'t just for enterprises anymore. Here\'s how to implement it on a small business budget without hiring a security team.',
      category: 'cybersecurity',
      featured: true,
      body: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'The concept of "zero trust" has been enterprise jargon for years, but the tools have finally caught up to make it practical for businesses with fewer than 50 employees. This guide walks through a real implementation from start to finish.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'What Zero Trust Actually Means' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'At its core, zero trust means "never trust, always verify." Every access request — whether from inside or outside your network — must be authenticated and authorized. No more relying on VPNs and firewalls as your only line of defense.' }] },
        { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'Step 1: Identity is Your New Perimeter' }] },
        { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Start with a strong identity provider. Microsoft Entra ID, Google Workspace, or Okta all offer SSO and MFA that form the foundation of zero trust. Enable MFA for every user — no exceptions.' }] },
        { _type: 'block', _key: 'b6', style: 'h2', children: [{ _type: 'span', _key: 's6', text: 'Step 2: Microsegmentation on a Budget' }] },
        { _type: 'block', _key: 'b7', style: 'normal', children: [{ _type: 'span', _key: 's7', text: 'Use Cloudflare Access or Tailscale to create microsegmented access to your internal tools. Both offer free tiers that cover most small business needs and take less than an hour to set up.' }] },
      ],
    },
    {
      slug: 'nextjs-vs-remix-vs-astro-2026',
      title: 'Next.js vs Remix vs Astro: Which Framework Should You Pick in 2026?',
      excerpt: 'The JavaScript framework wars continue. We break down when to use each, based on real project needs — not hype.',
      category: 'dev-tools',
      featured: true,
      body: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Choosing a web framework in 2026 means weighing trade-offs between developer experience, performance, and ecosystem maturity. Next.js, Remix, and Astro have all carved out strong positions — but for very different use cases.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'Next.js: The Full-Stack Default' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Next.js remains the most popular choice for full-stack React applications. Server Components, the App Router, and deep Vercel integration make it the path of least resistance for teams already in the React ecosystem. Best for: SaaS dashboards, e-commerce, and content-heavy sites that need dynamic functionality.' }] },
        { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'Remix: Web Standards First' }] },
        { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Remix bets heavily on web platform APIs — form actions, progressive enhancement, and nested routing. If your app works without JavaScript and gets enhanced by it, Remix is the right call. Best for: Form-heavy apps, progressive web apps, and teams who care deeply about accessibility.' }] },
        { _type: 'block', _key: 'b6', style: 'h2', children: [{ _type: 'span', _key: 's6', text: 'Astro: Content Sites Done Right' }] },
        { _type: 'block', _key: 'b7', style: 'normal', children: [{ _type: 'span', _key: 's7', text: 'Astro ships zero JavaScript by default and lets you sprinkle in React, Vue, or Svelte components only where needed. For blogs, documentation sites, and marketing pages, nothing beats Astro\'s performance. Best for: Blogs, landing pages, and documentation.' }] },
      ],
    },
    {
      slug: 'cloud-cost-optimization-2026',
      title: '7 Cloud Cost Mistakes That Are Burning Your Budget (and How to Fix Them)',
      excerpt: 'Most teams overspend on cloud by 30-40%. Here are the seven most common mistakes and the exact steps to fix each one.',
      category: 'cloud-devops',
      featured: false,
      body: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Cloud bills have a way of surprising people. What starts as a manageable monthly expense can balloon into a budget crisis within a quarter. After auditing cloud spending for dozens of companies, these are the seven mistakes we see most often.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: '1. Running Dev/Staging 24/7' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Your development and staging environments don\'t need to run overnight or on weekends. A simple scheduled shutdown saves 65% of those costs immediately. AWS Instance Scheduler and GCP Cloud Scheduler make this trivial.' }] },
        { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: '2. Oversized Instances' }] },
        { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Most workloads use less than 40% of their allocated CPU and memory. Right-sizing is the single highest-impact optimization. Use AWS Compute Optimizer or GCP Recommender to identify oversized instances.' }] },
        { _type: 'block', _key: 'b6', style: 'h2', children: [{ _type: 'span', _key: 's6', text: '3. Ignoring Reserved Instances and Savings Plans' }] },
        { _type: 'block', _key: 'b7', style: 'normal', children: [{ _type: 'span', _key: 's7', text: 'If you have predictable baseline usage, reserved instances or savings plans can cut costs by 30-60% compared to on-demand pricing. Start with a 1-year commitment for workloads you know will persist.' }] },
      ],
    },
    {
      slug: 'home-network-upgrade-2026',
      title: 'The Ultimate Home Network Setup for Remote Workers in 2026',
      excerpt: 'Wi-Fi 7 is here, mesh networks are smarter than ever, and VLANs are no longer just for offices. Here\'s the ideal home network stack.',
      category: 'networking',
      featured: false,
      body: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Working from home permanently means your network needs to be as reliable as the office. Dropped video calls, laggy VPN connections, and buffering are not acceptable when your livelihood depends on connectivity.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'The Router: Wi-Fi 7 or Wi-Fi 6E?' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Wi-Fi 7 routers are available but pricey. For most remote workers, a quality Wi-Fi 6E mesh system (like the TP-Link Deco XE75 or ASUS ZenWiFi Pro) delivers more than enough throughput at half the cost. Save Wi-Fi 7 for 2027 when prices normalize.' }] },
        { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'Separate Your Networks with VLANs' }] },
        { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Put your work devices on a separate VLAN from your smart home gadgets and family devices. This isn\'t paranoia — it\'s basic hygiene. Most prosumer routers now support VLANs through their web interface.' }] },
      ],
    },
  ]

  for (const post of posts) {
    const doc = await client.createIfNotExists({
      _id: `post-${post.slug}`,
      _type: 'original_post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      author: { _type: 'reference', _ref: author._id },
      publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      categories: [{ _type: 'reference', _ref: catRefs[post.category], _key: post.category }],
      excerpt: post.excerpt,
      body: post.body,
      featured: post.featured,
    })
    console.log(`  ✓ ${post.title.slice(0, 60)}...`)
  }

  // ── News Digest ─────────────────────────────────────────
  console.log('Creating news digest...')
  const today = new Date()
  const dateSlug = today.toISOString().split('T')[0]

  await client.createIfNotExists({
    _id: `digest-${dateSlug}`,
    _type: 'news_digest',
    title: `Daily Brief – ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    slug: { _type: 'slug', current: `daily-brief-${dateSlug}` },
    publishedAt: today.toISOString(),
    summary: 'Today\'s top stories from across the tech landscape — AI advances, security alerts, and developer tools worth your attention.',
    status: 'published',
    items: [
      {
        _type: 'digestItem', _key: 'd1',
        headline: 'OpenAI Announces GPT-5 with Native Code Execution',
        sourceUrl: 'https://example.com/gpt5',
        summary: 'The next generation model can run code in a sandboxed environment during inference, enabling real-time data analysis and tool use without external plugins.',
        aiTake: 'This is the biggest shift since function calling. Models that can execute code natively will fundamentally change how we build AI-powered applications.',
        source: { _type: 'reference', _ref: sourceRefs['techcrunch'] },
      },
      {
        _type: 'digestItem', _key: 'd2',
        headline: 'Critical Vulnerability Found in Popular npm Package with 40M Weekly Downloads',
        sourceUrl: 'https://example.com/npm-vuln',
        summary: 'A prototype pollution vulnerability in a widely-used utility library could allow remote code execution. Patches are available — update immediately.',
        aiTake: 'This is a reminder to audit your dependency tree regularly. Tools like Socket.dev and npm audit can catch these before they hit production.',
        source: { _type: 'reference', _ref: sourceRefs['krebs-security'] },
      },
      {
        _type: 'digestItem', _key: 'd3',
        headline: 'Vercel Ships Edge Middleware v3 with 10x Cold Start Improvement',
        sourceUrl: 'https://example.com/vercel-edge',
        summary: 'The latest Edge Middleware update dramatically reduces cold start times and adds native support for streaming responses and WebSocket upgrades.',
        source: { _type: 'reference', _ref: sourceRefs['hacker-news'] },
      },
      {
        _type: 'digestItem', _key: 'd4',
        headline: 'Apple Silicon M5 Benchmarks Leak: 40% Faster Single-Core Performance',
        sourceUrl: 'https://example.com/m5-leak',
        summary: 'Leaked Geekbench results for the M5 chip show significant gains in both single-core and multi-core performance, with the M5 Pro expected at WWDC.',
        source: { _type: 'reference', _ref: sourceRefs['ars-technica'] },
      },
      {
        _type: 'digestItem', _key: 'd5',
        headline: 'Tailwind CSS v4.1 Adds Container Queries and Cascade Layers by Default',
        sourceUrl: 'https://example.com/tailwind-4',
        summary: 'The latest Tailwind update embraces modern CSS features natively, reducing the need for custom plugins and making responsive design more intuitive.',
        aiTake: 'Container queries were the missing piece for component-driven design. This update makes Tailwind even more compelling for design systems.',
        source: { _type: 'reference', _ref: sourceRefs['the-verge'] },
      },
    ],
  })
  console.log(`  ✓ Daily Brief – ${dateSlug}`)

  // ── Trend Radar ─────────────────────────────────────────
  console.log('Creating trend radar...')
  await client.createIfNotExists({
    _id: `trend-${dateSlug}`,
    _type: 'trend_radar',
    title: `Trend Radar – ${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    slug: { _type: 'slug', current: `trend-radar-${dateSlug}` },
    publishedAt: today.toISOString(),
    description: 'This month\'s emerging topics and demand signals across the tech landscape.',
    trends: [
      { _type: 'trendItem', _key: 't1', title: 'AI Code Generation', description: 'Search volume for AI coding tools up 180% YoY. Claude Code, Cursor, and Copilot dominating interest.', momentum: 'rising', category: { _type: 'reference', _ref: catRefs['ai-ml'] } },
      { _type: 'trendItem', _key: 't2', title: 'Zero Trust Architecture', description: 'Enterprise adoption accelerating. SMB interest growing as tools become more accessible.', momentum: 'rising', category: { _type: 'reference', _ref: catRefs['cybersecurity'] } },
      { _type: 'trendItem', _key: 't3', title: 'Wi-Fi 7 Routers', description: 'Consumer interest growing but purchases still limited by device compatibility and price.', momentum: 'rising', category: { _type: 'reference', _ref: catRefs['networking'] } },
      { _type: 'trendItem', _key: 't4', title: 'Kubernetes Alternatives', description: 'Growing interest in simpler orchestration — Docker Swarm revival, Fly.io, Railway gaining traction.', momentum: 'rising', category: { _type: 'reference', _ref: catRefs['cloud-devops'] } },
      { _type: 'trendItem', _key: 't5', title: 'Edge Computing', description: 'Stable enterprise adoption. Cloudflare Workers and Vercel Edge leading developer mindshare.', momentum: 'stable', category: { _type: 'reference', _ref: catRefs['cloud-devops'] } },
      { _type: 'trendItem', _key: 't6', title: 'Traditional VPN', description: 'Declining as zero trust and SASE architectures replace perimeter-based security models.', momentum: 'declining', category: { _type: 'reference', _ref: catRefs['cybersecurity'] } },
    ],
  })
  console.log(`  ✓ Trend Radar`)

  console.log('\n✅ Seeding complete!')
}

seed().catch(console.error)
