/* ==========================================================================
   BEX SIGMA TECH — SECTOR ARTICLES
   Basic general article details for each orbital department / sector.
   Used by MissionControl and MissionBriefing.
   ========================================================================== */

export const SECTOR_ARTICLES = {
  mission_control: {
    id: 'mission_control',
    title: 'Mission Control',
    subtitle: 'BEX Sigma Tech — Core Command & Company Hub',
    badge: 'BEX SIGMA TECH',
    overview: `BEX Sigma Tech is your end-to-end digital partner. From our Mission Control hub, we design and deliver software, websites, immersive 3D websites, custom applications, digital marketing, content creation, AI automation and your own generated notes — all under one roof. We take your idea from concept to launch, with clear communication, creative execution and reliable support after delivery.`,
    services: [
      { title: 'Software & Applications', desc: 'Custom web apps, dashboards, CRMs and SaaS products built around your workflow — secure, scalable and easy to use.' },
      { title: 'Websites & 3D Websites', desc: 'Normal business websites and immersive 3D spatial websites with Three.js / WebGL — fast, SEO-ready and unforgettable.' },
      { title: 'Digital Marketing & Content', desc: 'Performance marketing, social, SEO and content creation that grows your reach and converts attention into customers.' },
      { title: 'AI Automation & Generate Notes', desc: 'AI agents that automate repetitive work and generate your own custom notes, summaries and content at scale.' },
    ],
    benefits: ['One team for all digital needs — no juggling vendors', 'Ideas turned into live products, not just designs', 'AI-powered speed with human creativity and support', 'Transparent process from brief to launch and beyond'],
    process: ['1. Share your idea or requirement', '2. We plan scope, design and tech', '3. Build, test and refine with you', '4. Launch, market and support growth'],
    stats: [{ value: '7+', label: 'Services' }, { value: '100%', label: 'Custom Built' }, { value: '24/7', label: 'Support' }],
    whyChoose: 'BEX Sigma Tech combines software engineering, 3D creativity, marketing and AI in one Mission Control. Whether you need a simple website or a full custom platform with generated notes, we deliver with speed, quality and care — your vision, our execution.',
    tech: ['Software', 'Websites', '3D Web', 'AI Automation', 'Digital Marketing', 'Content'],
  },

  web_dev: {
    id: 'web_dev',
    title: 'Web Development',
    subtitle: 'Quantum Spatial Web & Next-Gen Interfaces',
    badge: 'WEB DIVISION',
    overview: `Web Development at BEX Sigma Tech builds fast, secure and scalable websites that work flawlessly on every device. Whether you need a corporate site, a custom web application or a complete e-commerce store, we engineer for speed, SEO and future growth. Every build is responsive, accessible and optimized for real-world business results — not just good looks.`,
    services: [
      { title: 'Corporate & Landing Websites', desc: 'Clean, high-performance websites that communicate trust and convert visitors into customers.' },
      { title: 'Custom Web Applications', desc: 'Tailored web apps for bookings, dashboards, portals and internal tools — built to scale.' },
      { title: 'E-Commerce Platforms', desc: 'Secure stores with payment integration, inventory, and analytics ready for growth from day one.' },
      { title: 'CMS & No-Code Solutions', desc: 'Easy-to-manage content systems so your team can update pages without developer help.' },
    ],
    benefits: ['Lightning-fast load times', 'SEO-ready structure for better ranking', 'Mobile-first responsive design', 'Secure, maintainable code that scales'],
    process: ['1. Discovery & wireframe', '2. Design & prototype', '3. Develop & test', '4. Launch & support'],
    stats: [{ value: '<1.2s', label: 'Avg Load' }, { value: '100%', label: 'Responsive' }, { value: '99.9%', label: 'Uptime' }],
    whyChoose: 'We combine technical precision with business thinking. You get a website that not only looks premium but is engineered to perform — fast to load, easy to manage and built to grow with you.',
    tech: ['Spatial Web', 'Zero-Latency Core', 'React Advanced'],
  },

  cloud: {
    id: 'cloud',
    title: 'Autonomous Applications',
    subtitle: 'Autonomous Application Matrix · Mobile & Desktop Software',
    badge: 'APP MATRIX',
    overview: `Autonomous Applications at BEX Sigma Tech engineers native mobile apps, cross-platform mobile apps (iOS & Android), progressive web applications, and enterprise software. Explore our production-ready products Future Path and Track Me, or architect custom software in our engineering lab.`,
    services: [
      { title: 'iOS & Android Mobile Apps', desc: 'Native and cross-platform mobile applications built with React Native and Flutter for high performance.' },
      { title: 'Custom SaaS & Web Apps', desc: 'Scalable subscription software, administrative dashboards, and internal business tools.' },
      { title: 'Desktop & Progressive Web Apps', desc: 'High-speed desktop and offline-capable PWAs that run smoothly on every operating system.' },
      { title: 'API Integration & Backend Scale', desc: 'Secure REST/GraphQL backends, real-time sync, and scalable cloud database architectures.' },
    ],
    benefits: ['Smooth 60 FPS Native Performance', 'Cross-Platform Code Reusability', 'Secure Offline & Real-Time Sync', 'App Store & Play Store Deployment Ready'],
    process: ['1. Architecture & UX Wireframes', '2. UI Design & Interactive Prototype', '3. Development & API Integration', '4. Store Submission & Support'],
    stats: [{ value: '60fps', label: 'Performance' }, { value: 'iOS/Android', label: 'Cross-Platform' }, { value: '99.9%', label: 'Stability' }],
    whyChoose: 'We build applications that users love and businesses rely on. From early-stage MVP apps to enterprise multi-tenant software, our engineering guarantees speed, stability, and scale.',
    tech: ['React Native', 'Flutter', 'iOS & Android', 'SaaS Architecture', 'Cloud APIs', 'Real-Time Sync'],
  },

  client_projects: {
    id: 'client_projects',
    title: 'Our Client Projects',
    subtitle: 'Proven Case Studies, Enterprise Deployments & Client Success',
    badge: 'CLIENT SUCCESS',
    overview: `Explore real-world client success stories architected and deployed by BEX Sigma Tech. From custom enterprise web platforms and high-conversion e-commerce systems to AI agent workflow automations and cloud infrastructure migrations, our client projects demonstrate our commitment to delivering tangible business value, rapid turnarounds, and exceptional digital experiences.`,
    services: [
      { title: 'Enterprise Web & 3D Platforms', desc: 'Custom high-performance web applications and immersive 3D spatial showcases delivered for global clients.' },
      { title: 'AI Automation & Workflow Systems', desc: 'Autonomous AI agents, automated summary generators, and intelligent CRM integrations that save client teams 20+ hours weekly.' },
      { title: 'E-Commerce & High-Volume Portals', desc: 'Scalable e-commerce stores and customer portals featuring seamless payment gateways, live inventory, and multi-currency billing.' },
      { title: 'Cloud Modernization & Security', desc: 'Zero-downtime cloud migrations and post-quantum security hardening engineered for mission-critical client infrastructure.' },
    ],
    benefits: ['100% On-Time Delivery Track Record', 'Transparent Milestones & Live Staging Previews', 'Post-Launch Support, Maintenance & Optimization', 'Scalable Codebases Engineered for Long-Term Growth'],
    process: ['1. Discovery & Goal Alignment', '2. Rapid Prototyping & Architecture', '3. Agile Development & Testing', '4. Live Deployment & Support'],
    stats: [{ value: '50+', label: 'Delivered' }, { value: '99.8%', label: 'Satisfaction' }, { value: 'Zero', label: 'Downtime' }],
    whyChoose: 'Every project we build is measured by business impact. We partner closely with founders and enterprise leaders to transform complex challenges into elegant, reliable, and high-ROI digital solutions.',
    tech: ['Full-Stack Web', '3D WebGL', 'AI Agents', 'Cloud Systems', 'Custom APIs', 'Payment Gateways'],
  },

  ai_auto: {
    id: 'ai_auto',
    title: 'AI Automation',
    subtitle: 'Autonomous Multimodal Agent Matrix',
    badge: 'AI DIVISION',
    overview: `AI Automation helps businesses save time by letting intelligent agents handle repetitive work. From auto-replying to inquiries to sorting data, generating reports and managing workflows, our AI systems work alongside your team 24/7. You focus on strategy while automation handles the routine — accurately, consistently and at scale.`,
    services: [
      { title: 'Workflow Automation', desc: 'Automate approvals, data entry, notifications and handoffs between departments.' },
      { title: 'AI Chat Assistants', desc: 'Support bots for sales, support and internal help that learn from your data.' },
      { title: 'Document Intelligence', desc: 'Extract, classify and summarize invoices, contracts and reports automatically.' },
      { title: 'Predictive Insights', desc: 'Forecast demand, churn or maintenance needs before they happen.' },
    ],
    benefits: ['Save 15–30 hours per team per week', 'Reduce human error in repetitive tasks', 'Scale operations without scaling headcount', '24/7 availability for customers and ops'],
    process: ['1. Map your repetitive tasks', '2. Build & train AI agents', '3. Integrate with existing tools', '4. Monitor & continuously improve'],
    stats: [{ value: '80%', label: 'Tasks Automated' }, { value: '24/7', label: 'Operation' }, { value: '3x', label: 'Faster Response' }],
    whyChoose: 'We build practical AI — not hype. Every agent is tied to a measurable outcome: hours saved, tickets closed, or revenue recovered, with human oversight always in control.',
    tech: ['Agentic Cognitive AI', 'Neural Synthesis', 'LLM Automation'],
  },
}

export default SECTOR_ARTICLES

