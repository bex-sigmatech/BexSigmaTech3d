/* ==========================================================================
   BEX SIGMA TECH — SERVICE DETAIL ARTICLES
   Detailed breakdown for each What We Build service.
   ========================================================================== */

export const SERVICE_DETAILS = {
  normal: {
    id: 'normal',
    title: 'Normal Business Website',
    subtitle: 'Professional, fast and SEO-ready — your digital front door',
    accent: '#38bdf8',
    intro: `A normal business website is your 24/7 sales team. It tells visitors who you are, what you do, and why they should trust you — in under 3 seconds. Whether you're a startup, shop, agency or personal brand, we build sites that are clean on the surface and powerful underneath: lightning fast, mobile-perfect and ranked to be found.`,
    types: [
      {
        name: 'Frontend Only Website',
        badge: 'STATIC · FAST · LIGHTWEIGHT',
        desc: `A beautiful, high-performance site with no backend server — perfect for portfolios, landing pages, brochures and company profiles. Content is fixed and managed via code or simple CMS. Hosted on edge for instant loads worldwide.`,
        includes: [
          'Responsive design (mobile, tablet, desktop)',
          'Home, About, Services, Contact + up to 5 custom sections',
          'Contact form with email delivery',
          'SEO basics: meta, sitemap, Open Graph',
          'Fast hosting setup (Vercel / Netlify) + domain connect',
          'Support & updates included'
        ],
        tech: ['React / Next.js', 'Tailwind CSS', 'Vercel Edge', 'Framer Motion'],
        idealFor: 'Portfolios, restaurants, clinics, agencies, landing pages, personal brands.'
      },
      {
        name: 'Full Website (Frontend + Backend)',
        badge: 'DYNAMIC · CMS · DATABASE',
        desc: `Everything in Frontend Only plus a secure backend, database and admin panel. Add, edit or delete content yourself, manage users, take orders, or collect leads — no developer needed for daily updates.`,
        includes: [
          'Everything in Frontend Only, plus:',
          'Admin dashboard to manage content, users & orders',
          'Database (MongoDB / PostgreSQL) + secure authentication',
          'Dynamic pages, blogs, product catalogs or bookings',
          'Payment, email and file upload integrations',
          'Support, backup & security monitoring'
        ],
        tech: ['Next.js + Node.js', 'Express', 'MongoDB / SQL', 'JWT Auth', 'Cloud Storage'],
        idealFor: 'E-commerce, blogs, booking systems, memberships, startups needing growth.'
      }
    ],
    comparison: [
      { feature: 'Best for', frontend: 'Showcase & leads', full: 'Manage & scale content' },
      { feature: 'Admin Panel', frontend: '—', full: '✓ Full CMS' },
      { feature: 'Database', frontend: '—', full: '✓ Included' },
      { feature: 'Dynamic Content', frontend: 'Code update', full: 'Self-edit instantly' },
      { feature: 'Flexibility', frontend: 'Simple & focused', full: 'Powerful & extensible' }
    ],
    cta: 'Not sure which fits? Tell us your idea and we’ll recommend the simplest path.'
  },

  threed: {
    id: 'threed',
    title: '3D Interactive Website',
    subtitle: 'Spatial storytelling that stops the scroll',
    accent: '#a78bfa',
    intro: `A 3D website turns visitors into explorers. Using Three.js and WebGL, we build spatial scenes, depth, and cinematic motion — from floating product showcases to full Apple Vision-style canvases. It feels premium because it is: your brand is remembered long after the tab is closed.`,
    types: [
      {
        name: 'Normal 3D Website (Frontend 3D)',
        badge: 'VISUAL · INTERACTIVE · SHOWCASE',
        desc: `Stunning 3D visuals with no backend complexity. Models, particle fields, and scroll-triggered 3D scenes that run smoothly on desktop and mobile. Great for storytelling, launches and wow-factor without database needs.`,
        includes: [
          '3D hero with models, lights and shadows',
          'Scroll-driven camera & section animations',
          'Optimized 3D assets (Draco compressed)',
          'Responsive fallback for low-end devices',
          'Contact / lead form (email only)',
          'Performance tuned to 60fps',
        ],
        tech: ['Three.js', 'React Three Fiber', 'GSAP / Framer Motion', 'Blender Assets'],
        idealFor: 'Product launches, creative agencies, portfolios, luxury brands.'
      },
      {
        name: 'Full Stack 3D Website',
        badge: '3D + BACKEND · CMS · AUTH',
        desc: `All the 3D spectacle plus a powerful backend. Users can log in, save, customize, buy or manage content in 3D — admin can update models, texts and media without touching code.`,
        includes: [
          'Everything in Normal 3D, plus:',
          'User accounts, auth & saved preferences',
          'Admin CMS for 3D models, content & orders',
          'Database + cloud storage for assets',
          'Payments, analytics and real-time updates',
          'Ongoing 3D performance monitoring',
        ],
        tech: ['Next.js + R3F', 'Node.js / Express', 'MongoDB', 'Cloudinary / S3', 'WebSockets'],
        idealFor: '3D configurators, marketplaces, e-commerce with 3D preview, SaaS with spatial UI.'
      }
    ],
    comparison: [
      { feature: '3D Experience', frontend: '✓ Full cinematic', full: '✓ Full cinematic' },
      { feature: 'Backend / Login', frontend: '—', full: '✓ Users & CMS' },
      { feature: 'Content Updates', frontend: 'Developer', full: 'Self-serve admin' },
      { feature: 'Use Case', frontend: 'Showcase', full: 'Interactive product' },
      { feature: 'Scalability', frontend: 'Focused', full: 'Scale-ready' }
    ],
    cta: 'Want to start simple and grow later? We can begin with Normal 3D and expand to Full Stack when you’re ready.'
  },

  software: {
    id: 'software',
    title: 'Custom Software Application',
    subtitle: 'Your workflow, turned into software',
    accent: '#34d399',
    intro: `Off-the-shelf tools force you to adapt. We do the opposite — we build software around how you already work. Dashboards, CRMs, booking engines, internal tools and SaaS products that are secure, scalable and actually enjoyable to use.`,
    typesLabel: 'OUR PRODUCTS — LIVE APPS',
    products: [
      {
        name: 'Future Path',
        purpose: 'EDUCATIONAL PURPOSE',
        tag: 'EDU · LEARNING TRACKER',
        desc: `Future Path helps students plan, track and achieve their education journey. From course roadmaps and daily study plans to progress analytics and mentor feedback — it turns vague goals into clear, measurable steps toward a career.`,
        features: [
          'Personalized learning roadmap by goal (e.g., engineering, design, government exams)',
          'Daily tasks, streaks & progress analytics',
          'Resource library with curated courses & notes',
          'Mentor / parent view for guidance',
          'Reminders & milestone celebrations'
        ],
        tech: ['MERN Stack', 'Progress Analytics', 'Push Notifications'],
        audience: 'Students, parents, coaching centres, self-learners.',
        status: 'Live — expanding to schools'
      },
      {
        name: 'UrDay',
        purpose: 'DISCIPLINE PURPOSE',
        tag: 'HABIT · FOCUS · CONSISTENCY',
        desc: `UrDay is a discipline companion — built to turn intentions into habits. Log habits, block distractions, review weekly reports and stay accountable with streaks and gentle nudges. Less guilt, more consistency.`,
        features: [
          'Habit builder with daily check-ins & streaks',
          'Focus timer & distraction blocker',
          'Weekly discipline score & insights',
          'Accountability partner / group challenges',
          'Journal & reflection prompts'
        ],
        tech: ['React Native', 'Habit Engine', 'Local + Cloud Sync'],
        audience: 'Students, professionals, creators, anyone building consistency.',
        status: 'Live — mobile + web'
      }
    ],
    customNote: {
      title: 'Need something else? We build any software.',
      desc: `Beyond Future Path and UrDay, we architect custom apps: CRMs, ERPs, booking systems, inventory, analytics dashboards and SaaS MVPs. Bring your workflow on paper — we return a working product with admin, auth, payments and deployment handled.`,
      examples: ['Business dashboard', 'Booking / scheduling app', 'Inventory & billing', 'Custom CRM / ERP', 'SaaS MVP']
    },
    cta: 'Have a workflow that eats hours? Show it to us — we’ll map it into software in one call.'
  },

  custom: {
    id: 'custom',
    title: 'Your Unique Idea — We Build It',
    subtitle: 'If you can describe it, we can build it',
    accent: '#f59e0b',
    intro: `The most exciting projects start with “what if we could…?” We specialize in turning raw, first-of-its-kind ideas into working products — even when there’s no template. You bring the vision, we bring research, design, engineering and launch, end-to-end.`,
    process: [
      { step: '01', title: 'Share Your Idea', desc: 'Tell us in your own words — a voice note, sketch or doc is enough. We listen without judgment and ask the right questions.' },
      { step: '02', title: 'We Shape It', desc: 'We research feasibility, sketch flows, and propose the simplest build that proves your idea fastest — with clear scope and direction.' },
      { step: '03', title: 'Prototype & Test', desc: 'You get a clickable prototype quickly, then a working build for testing. Validate with real users early and adjust with confidence.' },
      { step: '04', title: 'Build, Launch & Scale', desc: 'We engineer for scale, handle deployment, analytics and support — staying with you after launch.' },
    ],
    whatWeLove: ['AI-powered tools', 'Marketplaces & communities', 'Spatial / 3D concepts', 'Social & creator platforms', 'Hardware + software hybrids', 'Experimental art & education'],
    promise: `No idea is too early. We’ve turned napkin sketches into live apps — respecting your confidentiality and vision. If it’s not buildable, we’ll tell you honestly and suggest a better path.`,
    examplesPrompt: 'Examples we’ve explored: habit trackers, learning pathfinders, campus networks, creator monetization tools — your idea could be next.',
    ctaTitle: 'Create Your Own Content Here',
    ctaDesc: 'Use the space below to describe your idea in detail. What problem does it solve? Who is it for? Any reference you love? The more you share, the better we can shape the first prototype — and everything you share stays private.',
    formPlaceholder: 'Describe your unique idea here... e.g., An app that helps college students find internships by matching skills to local startups, with swipe-style discovery and mentor chat.'
  }
}

export default SERVICE_DETAILS
