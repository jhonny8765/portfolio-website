export const portfolioData = {
  identity: {
    name: 'Jhon Rey Consolacion',
    title: 'AI Developer & Automation Builder',
    tagline: 'I build with AI — websites, applications, and automations.',
    shortBio:
      'I build websites, applications, and automations with AI. Currently growing into an advanced AI developer through hands-on projects.',
    github: 'https://github.com/jhonny8765',
  },
  skills: {
    active: [
      'AI-Assisted Development',
      'n8n Automation',
      'Next.js & React',
      'Tailwind CSS',
      'Supabase',
      'Firebase',
      'Git & GitHub',
      'API Integrations',
    ],
    exploring: ['Advanced RAG Architectures', 'Custom AI Agents', 'Python Data Pipelines'],
  },
  projects: [
    {
      id: 'sukisuite',
      title: 'SukiSuite',
      tagline: 'Salon Management SaaS',
      description:
        'A web application designed to help salon owners manage their appointments and services.',
      features: [
        'User authentication and dashboard',
        'Appointment scheduling concepts',
        'Service management interface',
      ],
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'Firebase'],
      liveUrl: 'https://sukisuite.vercel.app/',
      githubUrl: '',
      imagePlaceholder: '/projects/sukisuite.png',
      shippedDate: 'Jun 2026',
      buildTime: '~2 weeks',
      quote: { text: 'Manda siya, less hassle.', author: 'Kiscia' },
      metric: { value: '2', label: 'salon owners using SukiSuite in early access' },
      walkthroughUrl: undefined as string | undefined,
    },
    {
      id: 'barangay-arena',
      title: 'Barangay Arena',
      tagline: 'Community Tournament Platform',
      description: 'A community platform for organizing and visualizing local sports tournaments.',
      features: [
        'Tournament bracket visualization',
        'Team and participant management',
        'Responsive community interface',
      ],
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'Supabase'],
      liveUrl: 'preview-on-request',
      githubUrl: '',
      imagePlaceholder: '/projects/barangay-arena.png',
      shippedDate: 'Jun 2026',
      buildTime: '~2 weeks',
      quote: undefined as { text: string; author: string } | undefined,
      metric: { value: '1', label: 'SK chapter (Liliongan) using it to run local tournaments' },
      walkthroughUrl: undefined as string | undefined,
    },
    {
      id: 'betteryield',
      title: 'BetterYield',
      tagline: 'Agri Trading & Services',
      description:
        'An agricultural product catalog and local-commerce experience serving farmers across Regions 11 and 12.',
      features: [
        'Product search and category filtering',
        'Branch-aware product availability',
        'Phone, Facebook, and Maps integration',
      ],
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'Supabase'],
      liveUrl: 'https://betteryield.vercel.app/',
      githubUrl: '',
      imagePlaceholder: '/projects/betteryield.png',
      shippedDate: 'Jul 2026',
      buildTime: '~2 weeks',
      quote: { text: 'Client na lang kulang.', author: 'Jhoven' },
      metric: { value: '7', label: 'products live in the public catalog' },
      walkthroughUrl: undefined as string | undefined,
    },
  ],
  services: [
    {
      title: 'Web Application Development',
      description: 'Building responsive, modern web applications and MVPs using Next.js and React.',
    },
    {
      title: 'Workflow Automation',
      description: 'Connecting APIs and automating business processes using tools like n8n.',
    },
    {
      title: 'AI Integrations',
      description:
        'Implementing practical AI features like grounded chatbots and automated content generation into existing systems.',
    },
  ],
};
