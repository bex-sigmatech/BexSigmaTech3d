/* ==========================================================================
   BEX SIGMA TECH — SECTOR ARTICLES
   Basic general article details for each orbital department / sector.
   Used by MissionBriefing to render full detail view before MAINFRAME.
   ========================================================================== */

export const SECTOR_ARTICLES = {
  mission_control: {
    id: 'mission_control',
    title: 'Mission Control',
    subtitle: 'Global Orbital Command & Telemetry Hub',
    badge: 'CENTRAL COMMAND',
    overview: `Mission Control is the central coordination hub of BEX Sigma Tech. It brings together project tracking, team coordination and live telemetry into a single command view. From planning to delivery, every task, milestone and resource is visible in real time. The goal is simple: complete transparency, zero missed deadlines and smooth collaboration across all departments.`,
    services: [
      { title: 'Project Orchestration', desc: 'Plan, assign and track projects across web, AI, cloud and design teams with live status updates and clear ownership.' },
      { title: 'Resource Allocation', desc: 'Assign people, time and budget where they are needed most with workload balancing and capacity forecasts.' },
      { title: 'Live Telemetry Dashboards', desc: 'Central dashboards for progress, risks, costs and performance — updated automatically as work happens.' },
      { title: 'Risk & Compliance Monitor', desc: 'Early warning for delays, bottlenecks and compliance gaps so issues are fixed before they become problems.' },
    ],
    benefits: ['Single source of truth for all operations', 'Faster decisions with real-time data', 'Reduced delays through proactive alerts', 'Better collaboration across remote teams'],
    process: ['1. Connect your tools and teams', '2. Define milestones and owners', '3. Track live via dashboards', '4. Review, optimize and deliver'],
    stats: [{ value: '360°', label: 'Visibility' }, { value: '40%', label: 'Faster Delivery' }, { value: '24/7', label: 'Monitoring' }],
    whyChoose: 'If you manage multiple projects or teams, Mission Control replaces scattered sheets and chats with one clear command center. It is built for leaders who need clarity at a glance and control without micromanagement.',
    tech: ['Orbital Telemetry', 'Planetary Mesh', 'NASA Deep Space Net'],
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

  cloud: {
    id: 'cloud',
    title: 'Cloud Systems',
    subtitle: 'Orbital Distributed Quantum Cloud',
    badge: 'CLOUD DIVISION',
    overview: `Cloud Systems provides reliable hosting, storage and infrastructure for your applications and data. We migrate you to the cloud, keep systems online with high availability, and ensure backups and scaling are automatic. Whether you are starting fresh or modernizing legacy servers, you get a secure, cost-efficient foundation that grows with your business.`,
    services: [
      { title: 'Cloud Migration', desc: 'Move servers, databases and apps to AWS, Azure or GCP with zero-downtime planning.' },
      { title: 'Managed Hosting', desc: 'Fully managed environments with monitoring, patches and backups handled for you.' },
      { title: 'Auto-Scaling & Backups', desc: 'Resources scale with traffic and data is backed up continuously.' },
      { title: 'DevOps & CI/CD', desc: 'Faster, safer deployments with automated testing and release pipelines.' },
    ],
    benefits: ['Pay only for what you use', 'Automatic scaling and backup', 'High uptime with distributed architecture', 'Enterprise-grade security by default'],
    process: ['1. Audit current infrastructure', '2. Plan migration & architecture', '3. Migrate & validate', '4. Optimize cost and performance'],
    stats: [{ value: '99.95%', label: 'Uptime SLA' }, { value: '50%', label: 'Cost Saving' }, { value: 'Auto', label: 'Scaling' }],
    whyChoose: 'We design cloud that just works — secure, affordable and invisible when it should be. Your team ships faster, your customers experience no downtime, and you keep control of costs.',
    tech: ['Orbital Cloud Mesh', 'Quantum Compute', 'Zero-Downtime Edge'],
  },

  cyber: {
    id: 'cyber',
    title: 'Cyber Security',
    subtitle: 'Post-Quantum Cryptographic Defense Grid',
    badge: 'SECURITY DIVISION',
    overview: `Cyber Security protects your data, customers and reputation. We audit your systems, fix vulnerabilities, and put continuous protection in place — from firewalls and encryption to employee awareness. In a world where a single breach can cost everything, we make security simple, proactive and always on.`,
    services: [
      { title: 'Security Audits', desc: 'Comprehensive assessment of apps, networks and processes to find gaps before attackers do.' },
      { title: 'Threat Monitoring', desc: '24/7 detection and response for intrusions, malware and data leaks.' },
      { title: 'Data Protection', desc: 'Encryption, access controls and backups so sensitive data stays private and recoverable.' },
      { title: 'Compliance Support', desc: 'Help meeting GDPR, SOC2, ISO and industry-specific requirements.' },
    ],
    benefits: ['Reduced breach risk and downtime', 'Customer trust through proven protection', 'Compliance readiness for audits', 'Rapid incident response when needed'],
    process: ['1. Scan & assess threats', '2. Patch & harden systems', '3. Deploy monitoring', '4. Train team & run drills'],
    stats: [{ value: '24/7', label: 'Threat Watch' }, { value: 'Zero', label: 'Trust Shortcuts' }, { value: '100%', label: 'Encrypted' }],
    whyChoose: 'Security is not a product — it is a practice. We make it practical: clear reports, prioritized fixes and ongoing vigilance without slowing your business down.',
    tech: ['Post-Quantum Armor', 'Zero-Trust Matrix', 'AI Intrusion Sentinel'],
  },

  analytics: {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Planetary Intelligence & Real-Time Data Engine',
    badge: 'DATA DIVISION',
    overview: `Analytics turns scattered data into clear decisions. We connect your sources — sales, marketing, finance, operations — and present them in live dashboards and predictive models. Leaders see what is happening, why it is happening, and what is likely to happen next, all without wrestling spreadsheets.`,
    services: [
      { title: 'Business Intelligence Dashboards', desc: 'Live, interactive dashboards for KPI, revenue, funnel and operational metrics.' },
      { title: 'Data Integration', desc: 'Unify data from CRM, ERP, ads and sheets into one reliable layer.' },
      { title: 'Predictive Modeling', desc: 'Forecast sales, demand and churn with explainable models.' },
      { title: 'Automated Reporting', desc: 'Scheduled reports that send themselves — no manual compilation.' },
    ],
    benefits: ['Decisions based on facts, not guesses', 'Hours saved on manual reporting', 'Early warnings on trends and anomalies', 'Clear ROI on every campaign and product'],
    process: ['1. Connect data sources', '2. Clean & model data', '3. Build dashboards', '4. Train team & automate alerts'],
    stats: [{ value: '10x', label: 'Faster Insights' }, { value: '50+', label: 'Connectors' }, { value: 'Live', label: 'Dashboards' }],
    whyChoose: 'We make data usable for everyone — not just analysts. Clean visuals, plain-English insights and automation mean you spend time acting on data, not preparing it.',
    tech: ['Real-Time Telemetry', 'Predictive Synthesis', '8K Spatial Data'],
  },

  ui_ux: {
    id: 'ui_ux',
    title: 'UI / UX Design',
    subtitle: 'Spatial Industrial Design & Holographic UX',
    badge: 'DESIGN DIVISION',
    overview: `Great design is good business. Our UI/UX team crafts interfaces that are beautiful, intuitive and accessible. We research how people actually use your product, prototype quickly, and deliver designs that developers love to build and users love to use — on web, mobile and spatial platforms.`,
    services: [
      { title: 'User Research & Flows', desc: 'Understand real user needs through interviews, journeys and usability testing.' },
      { title: 'Interface Design', desc: 'High-fidelity screens that balance aesthetics, performance and accessibility.' },
      { title: 'Prototyping & Testing', desc: 'Clickable prototypes validated with users before a line of code is written.' },
      { title: 'Design Systems', desc: 'Reusable components and guidelines that keep your product consistent as you scale.' },
    ],
    benefits: ['Higher conversion and retention', 'Reduced development rework', 'Inclusive, accessible experiences', 'Strong, memorable brand impression'],
    process: ['1. Discover & research', '2. Sketch & prototype', '3. Test & refine', '4. Handoff & scale'],
    stats: [{ value: '2x', label: 'Conversion Lift' }, { value: '30%', label: 'Less Rework' }, { value: 'A11y', label: 'Inclusive' }],
    whyChoose: 'We design for humans first. Every pixel has a purpose — to make the next step obvious and effortless for your user.',
    tech: ['Spatial Holography', 'Apple Design System', 'Ergonomic Optics'],
  },

  marketing: {
    id: 'marketing',
    title: 'Digital Marketing',
    subtitle: 'Global Neural Outreach & Brand Ascension',
    badge: 'GROWTH DIVISION',
    overview: `Digital Marketing helps you be found, remembered and chosen. We run data-driven campaigns across search, social, content and email — tracking every rupee to pipeline. From brand awareness to lead generation, we focus on measurable growth and clear reporting, not vanity metrics.`,
    services: [
      { title: 'Search & Performance Ads', desc: 'Google, LinkedIn and Meta campaigns optimized for ROI, not just clicks.' },
      { title: 'Social & Content', desc: 'Stories, posts and videos that build authority and community around your brand.' },
      { title: 'SEO & Website Growth', desc: 'Technical SEO and content that brings consistent organic traffic.' },
      { title: 'Marketing Automation', desc: 'Email flows, lead scoring and CRM nurture that turn interest into revenue.' },
    ],
    benefits: ['More qualified leads and sales', 'Lower cost per acquisition', 'Clear attribution from spend to revenue', 'Consistent brand presence across channels'],
    process: ['1. Audit & strategy', '2. Campaign setup & content', '3. Launch & optimize', '4. Report & scale winners'],
    stats: [{ value: '3.5x', label: 'Avg ROI' }, { value: '-42%', label: 'Lower CPA' }, { value: 'Daily', label: 'Reporting' }],
    whyChoose: 'We treat marketing as a system. Every channel is measured, every creative is tested, and every decision is tied to revenue.',
    tech: ['Planetary Outreach', 'Cinematic Media', 'Neural Targeting'],
  },

  finance: {
    id: 'finance',
    title: 'Finance Engineering',
    subtitle: 'Algorithmic Asset Matrix & Orbital Economics',
    badge: 'FINANCE DIVISION',
    overview: `Finance Engineering automates money movements so nothing is missed and everything is auditable. From invoices and collections to payouts and reporting, we build secure payment flows, subscription billing and financial dashboards that give you real-time control over cash, costs and compliance.`,
    services: [
      { title: 'Billing & Invoicing', desc: 'Automated invoices, reminders and reconciliation that work while you sleep.' },
      { title: 'Payment Integration', desc: 'Secure gateways for UPI, cards, wallets and global methods with Cashfree, Stripe and more.' },
      { title: 'Subscription Management', desc: 'Plans, proration, renewals and dunning handled without manual work.' },
      { title: 'Financial Reporting', desc: 'Live P&L, cashflow and tax-ready reports at your fingertips.' },
    ],
    benefits: ['Faster payments and fewer dues', 'Zero manual billing errors', 'Full audit trail for every transaction', 'Real-time view of revenue and costs'],
    process: ['1. Map money flows', '2. Design secure architecture', '3. Integrate & test', '4. Go live with monitoring'],
    stats: [{ value: '99.9%', label: 'Payment Success' }, { value: 'Auto', label: 'Reconciliation' }, { value: 'Secure', label: 'PCI-Ready' }],
    whyChoose: 'Money deserves precision. We engineer finance systems that are reliable, compliant and pleasant for both your team and your customers.',
    tech: ['Orbital Ledger', 'Algorithmic Capital', 'Real-Time Governance'],
  },

  innovation: {
    id: 'innovation',
    title: 'Innovation Lab',
    subtitle: 'Advanced Aerospace & Experimental AI R&D',
    badge: 'R&D LAB',
    overview: `Innovation Lab is where future products are born. We experiment with emerging tech — AI, spatial computing, robotics, new materials — and turn promising ideas into working prototypes. Businesses bring us hard problems; we bring research, rapid builds and honest answers about what is possible, practical and worth scaling.`,
    services: [
      { title: 'Research & Discovery', desc: 'Deep dives into new technologies with clear feasibility and business impact assessments.' },
      { title: 'Rapid Prototyping', desc: 'Functional prototypes in weeks, not months, to test with real users.' },
      { title: 'Proof of Concepts', desc: 'Small, focused builds that de-risk big investments before full production.' },
      { title: 'Tech Transfer', desc: 'Handover of proven solutions to production teams with documentation and training.' },
    ],
    benefits: ['De-risk innovation before major spend', 'Faster learning cycles with real prototypes', 'Access to frontier expertise without hiring it', 'Clear go / no-go decisions based on evidence'],
    process: ['1. Define the challenge', '2. Research options', '3. Build prototype', '4. Validate & decide to scale'],
    stats: [{ value: '6–8w', label: 'Prototype' }, { value: 'Lab', label: 'Grade Rigor' }, { value: 'Future', label: 'Ready' }],
    whyChoose: 'We explore boldly but build practically. You get innovation that is not just exciting — it is viable, tested and ready to become your next advantage.',
    tech: ['AGI Research', 'Advanced Materials', 'Deep Space R&D'],
  },
}

export default SECTOR_ARTICLES
