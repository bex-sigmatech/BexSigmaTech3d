/* ==========================================================================
   BEX SIGMA TECH — SECTOR ARTICLES
   Basic general article details for each orbital department / sector.
   Used by MissionControl and MissionBriefing.
   ========================================================================== */

export const SECTOR_ARTICLES = {
  mission_control: {
    id: 'mission_control',
    title: 'Mission Control',
    subtitle: 'BEX Sigma Tech — Core Command & Enterprise Digital Hub',
    badge: 'BEX SIGMA TECH',
    overview: `BEX Sigma Tech is your end-to-end digital engineering partner. From our central Mission Control hub, we design, engineer, and deploy high-impact digital solutions across 8 specialized disciplines: Software Development, Multi-Platform Applications, Corporate & E-Commerce Websites, Immersive 3D Spatial Websites, Performance Digital Marketing, Strategic Content & Copywriting, Autonomous AI Automation, and Intelligent Note Generation & Knowledge Synthesis.`,
    services: [
      {
        title: 'Software',
        subtitle: 'Enterprise Backend & SaaS Architecture',
        desc: 'Custom web apps, administrative portals, CRMs, scalable microservices, and enterprise cloud software engineered around your unique workflow — secure, robust, and lightning fast.',
        image: '/sector_software.jpg',
        badge: 'ENGINEERING',
        targetSector: 'web_dev',
        specs: {
          latency: '< 48h Sprint Ready',
          integrity: '100% CI/CD & Automated QA',
          security: 'Post-Quantum & SOC2 Compliant',
          sla: '24/7 Continuous Mainframe Monitoring'
        }
      },
      {
        title: 'Application',
        subtitle: 'iOS, Android & Desktop Multi-Platform Matrix',
        desc: 'Native iOS & Android mobile apps, cross-platform Flutter/React Native solutions, and high-speed desktop software built for 60 FPS performance, offline sync, and flawless usability.',
        image: '/sector_application.jpg',
        badge: 'APP MATRIX',
        targetSector: 'cloud',
        specs: {
          latency: 'Rapid Prototype in 3 Days',
          integrity: '60 FPS Native Rendering Engine',
          security: 'Biometric Auth & AES-256 Storage',
          sla: 'App Store & Play Store Ready'
        }
      },
      {
        title: 'Website',
        subtitle: 'High-Conversion Corporate & E-Commerce Portals',
        desc: 'Ultra-fast business websites, conversion-focused landing pages, and scalable e-commerce systems engineered for peak SEO visibility, responsiveness, and revenue growth.',
        image: '/sector_website.jpg',
        badge: 'WEB CORE',
        targetSector: 'web_dev',
        specs: {
          latency: '< 1.2s Global Page Load',
          integrity: '100% Mobile & Tablet Responsive',
          security: 'End-to-End SSL & Edge CDN',
          sla: '99.9% Production Uptime SLA'
        }
      },
      {
        title: '3D Website',
        subtitle: 'Spatial WebGL & Interactive Three.js Experiences',
        desc: 'Cutting-edge 3D spatial web experiences, interactive 3D product visualizers, WebXR environments, and cinematic visual journeys that set your brand decades ahead.',
        image: '/sector_3d_website.jpg',
        badge: '3D SPATIAL',
        targetSector: 'web_dev',
        specs: {
          latency: 'Smooth 60 FPS WebGL Pipeline',
          integrity: 'Procedural Shader & Particle Graphs',
          security: 'Cross-Device WebGL2 Standard',
          sla: 'Hardware Accelerated Polyphase Sync'
        }
      },
      {
        title: 'Digital Marketing',
        subtitle: 'Data-Driven Growth & Acquisition Funnels',
        desc: 'Precision performance marketing, conversion funnel optimization, viral social media distribution, and organic technical SEO architectures to scale brand visibility and customer acquisition.',
        image: '/sector_marketing.jpg',
        badge: 'GROWTH MATRIX',
        targetSector: 'client_projects',
        specs: {
          latency: 'Real-Time ROI & Conversion Analytics',
          integrity: 'Omni-Channel Attribution Matrix',
          security: 'Privacy-First & Cookie-less Tracking',
          sla: 'Continuous Growth & A/B Testing'
        }
      },
      {
        title: 'Content',
        subtitle: 'Brand Storytelling, Copywriting & Media Production',
        desc: 'High-impact creative copywriting, video motion storyboards, technical documentation, and strategic digital content that captivates audiences and turns interest into loyal customers.',
        image: '/sector_content.jpg',
        badge: 'CREATIVE LAB',
        targetSector: 'client_projects',
        specs: {
          latency: 'Rapid Turnaround Asset Delivery',
          integrity: 'Multi-Format Cross-Platform Output',
          security: '100% Original Intellectual Property',
          sla: 'Full Brand Voice & Tone Alignment'
        }
      },
      {
        title: 'AI Automation',
        subtitle: 'Autonomous Multimodal Agents & Neural Workflows',
        desc: 'Intelligent autonomous AI agents that automate customer inquiries, synchronize databases, process documentation, and streamline repetitive business operations around the clock.',
        image: '/sector_ai_automation.jpg',
        badge: 'NEURAL CORE',
        targetSector: 'ai_auto',
        specs: {
          latency: 'Sub-second AI Inference Latency',
          integrity: 'Multimodal LLM & Vision Pipelines',
          security: 'Zero Data Retention & Self-Hosted',
          sla: '24/7 Autonomous Agent Execution'
        }
      },
      {
        title: 'Generate Notes',
        subtitle: 'AI Knowledge Synthesis & Smart Summaries',
        desc: 'Automated AI note generation, real-time meeting transcript synthesis, intelligent document summarization, and structured custom knowledge base generation tailored to your data.',
        image: '/sector_generate_notes.jpg',
        badge: 'KNOWLEDGE AI',
        targetSector: 'ai_auto',
        specs: {
          latency: 'Instant Markdown & PDF Synthesis',
          integrity: 'Semantic Fact-Checked Validation',
          security: 'Encrypted Knowledge Vault Storage',
          sla: 'Custom Template & Export Formats'
        }
      },
    ],
    benefits: [
      'One unified engineering partner for all 8 digital pillars — zero vendor chaos',
      'Ideas transformed into production-ready software, live apps & scalable websites',
      'AI-powered velocity paired with bespoke human craft, 3D polish & 24/7 support',
      'Transparent sprint roadmaps with real-time interactive previews and weekly demos'
    ],
    process: [
      '1. Share your idea, project scope or technical specifications',
      '2. We architect wireframes, visual prototypes & robust tech stack',
      '3. Rapid agile development, rigorous QA testing & live staging refinement',
      '4. Production deployment, growth marketing launch & continuous support'
    ],
    stats: [
      { value: '8', label: 'Core Pillars' },
      { value: '100%', label: 'Custom Built' },
      { value: '24/7', label: 'Direct Support' }
    ],
    whyChoose: 'BEX Sigma Tech delivers all 8 core disciplines under one roof. Whether you need an enterprise software suite, a 3D spatial website, high-converting digital marketing, autonomous AI workflows, or automated note synthesis, we engineer with speed, precision, and excellence.',
    tech: ['Software Engineering', 'Autonomous Apps', 'Modern Web', '3D WebGL Spatial', 'Digital Marketing', 'Creative Content', 'AI Automation', 'Generate Notes AI'],
  },

  web_dev: {
    id: 'web_dev',
    title: 'Web Development',
    subtitle: 'Quantum Spatial Web & Next-Gen Interfaces',
    badge: 'WEB DIVISION',
    overview: `Web Development at BEX Sigma Tech builds fast, secure and scalable websites that work flawlessly on every device. Whether you need a corporate site, a custom web application or a complete e-commerce store, we engineer for speed, SEO and future growth. Every build is responsive, accessible and optimized for real-world business results — not just good looks.`,
    services: [
      { title: 'Corporate & Landing Websites', subtitle: 'Conversion-Focused Architecture', desc: 'Clean, high-performance websites that communicate trust and convert visitors into customers.', image: '/sector_website.jpg', badge: 'WEB CORE' },
      { title: '3D Spatial Web Experiences', subtitle: 'Three.js & WebGL 3D Interfaces', desc: 'Interactive Three.js & WebGL 3D websites with spatial navigation and hardware-accelerated graphics.', image: '/sector_3d_website.jpg', badge: '3D SPATIAL' },
      { title: 'Custom Web Applications', subtitle: 'Cloud Dashboards & Portals', desc: 'Tailored web apps for bookings, dashboards, portals and internal tools — built to scale.', image: '/sector_software.jpg', badge: 'ENGINEERING' },
      { title: 'E-Commerce Platforms', subtitle: 'Global Checkout & Stores', desc: 'Secure stores with payment integration, inventory, and analytics ready for growth from day one.', image: '/finexhub_web_preview.jpg', badge: 'COMMERCE' },
    ],
    benefits: ['Lightning-fast load times (<1.2s)', 'SEO-ready structure for top organic rankings', 'Mobile-first responsive design across all screens', 'Secure, maintainable code engineered to scale'],
    process: ['1. Discovery & wireframe architecture', '2. UI/UX design & interactive prototype', '3. Development & rigorous cross-browser testing', '4. Live launch, CDN deployment & support'],
    stats: [{ value: '<1.2s', label: 'Avg Load' }, { value: '100%', label: 'Responsive' }, { value: '99.9%', label: 'Uptime' }],
    whyChoose: 'We combine technical precision with business velocity. You get a web platform that looks breathtaking and is engineered to perform — fast, accessible, and built to scale.',
    tech: ['Spatial Web', 'React Advanced', 'Three.js / WebGL', 'Tailwind & Vanilla CSS', 'Node.js Backend'],
  },

  cloud: {
    id: 'cloud',
    title: 'Autonomous Applications',
    subtitle: 'Autonomous Application Matrix · Mobile & Desktop Software',
    badge: 'APP MATRIX',
    overview: `Autonomous Applications at BEX Sigma Tech engineers native mobile apps, cross-platform mobile apps (iOS & Android), progressive web applications, and enterprise software. Explore our production-ready products Future Path and UrDay, or architect custom software in our engineering lab.`,
    services: [
      { title: 'iOS & Android Mobile Apps', subtitle: 'React Native & Flutter', desc: 'Native and cross-platform mobile applications built with React Native and Flutter for 60 FPS performance.', image: '/sector_application.jpg', badge: 'MOBILE' },
      { title: 'Custom SaaS & Web Apps', subtitle: 'Subscription & Admin Systems', desc: 'Scalable subscription software, administrative dashboards, and internal business tools.', image: '/sector_software.jpg', badge: 'SAAS CORE' },
      { title: 'Desktop & Progressive Web Apps', subtitle: 'macOS, Windows & Linux PWAs', desc: 'High-speed desktop and offline-capable PWAs that run smoothly on every operating system.', image: '/future_path_logo.jpg', badge: 'DESKTOP' },
      { title: 'Real-Time IoT & Telemetry Sync', subtitle: 'Zero-Latency Data Pipeline', desc: 'Zero-latency telemetry aggregation, live websockets, and distributed cloud database architectures.', image: '/urday_logo.png', badge: 'TELEMETRY' },
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
      { title: 'Enterprise Web & 3D Platforms', subtitle: 'Global Digital Showcases', desc: 'Custom high-performance web applications and immersive 3D spatial showcases delivered for global clients.', image: '/sector_3d_website.jpg', badge: 'SHOWCASE' },
      { title: 'Performance Marketing & Branding', subtitle: 'High-Conversion Acquisition', desc: 'End-to-end digital marketing funnels, creative content campaigns, and high-impact acquisition pipelines.', image: '/sector_marketing.jpg', badge: 'GROWTH' },
      { title: 'AI Automation & Workflow Systems', subtitle: '20+ Hours Weekly Saved', desc: 'Autonomous AI agents, automated summary generators, and intelligent CRM integrations that save client teams 20+ hours weekly.', image: '/sector_ai_automation.jpg', badge: 'AI AGENTS' },
      { title: 'E-Commerce & High-Volume Portals', subtitle: 'Multi-Currency Gateways', desc: 'Scalable e-commerce stores and customer portals featuring seamless payment gateways, live inventory, and multi-currency billing.', image: '/finexhub_insta_preview.jpg', badge: 'COMMERCE' },
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
      { title: 'Workflow Automation & Agent Swarms', subtitle: 'Autonomous Operational Pipelines', desc: 'Automate approvals, data entry, CRM sync, notifications and handoffs between departments with autonomous AI agents.', image: '/sector_ai_automation.jpg', badge: 'AI AGENTS' },
      { title: 'Generate Notes & Knowledge Synthesis', subtitle: 'Smart Documentation & Summaries', desc: 'Extract, classify, summarize and generate custom structured notes, meeting summaries and documentation automatically.', image: '/sector_generate_notes.jpg', badge: 'NOTES AI' },
      { title: 'AI Multimodal Chat Assistants', subtitle: '24/7 Voice & Text Support', desc: 'Voice and text support bots for sales, customer care and internal operations that learn from your data.', image: '/omnicoder_ai.jpg', badge: 'VOICE AI' },
      { title: 'Predictive Insights & Data Analytics', subtitle: 'Neural Forecast & Decision Intel', desc: 'Forecast customer demand, prevent churn and automate executive decision intelligence with neural models.', image: '/sector_software.jpg', badge: 'NEURAL' },
    ],
    benefits: ['Save 15–30 hours per team per week', 'Reduce human error in repetitive workflows', 'Scale operations seamlessly without scaling headcount', '24/7 availability for customer inquiries and automated tasks'],
    process: ['1. Map your repetitive tasks & bottlenecks', '2. Build, train & evaluate custom AI agents', '3. Seamless integration with your existing tools', '4. Continuous monitoring, telemetry & optimization'],
    stats: [{ value: '80%', label: 'Tasks Automated' }, { value: '24/7', label: 'Operation' }, { value: '3x', label: 'Faster Response' }],
    whyChoose: 'We build practical AI systems tied directly to measurable business outcomes — hours saved, tickets resolved, conversions accelerated, and revenue unlocked.',
    tech: ['Agentic Cognitive AI', 'Neural Synthesis', 'LLM Automation', 'Voice Gateways', 'Knowledge Bases'],
  },
}

export default SECTOR_ARTICLES
