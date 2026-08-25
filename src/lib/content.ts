/**
 * Single source of truth for site content.
 * Used by sections, the Ask-My-AI assistant, and the command palette —
 * so the chat can never drift from what the page actually says.
 */

export const SITE = {
  name: "Jhon Rey Consolacion",
  handle: "jhonny8765",
  role: "AI Developer & Automation Builder",
  url: "https://jhonreyconsolacion.vercel.app",
  github: "https://github.com/jhonny8765",
  location: "Philippines",
  timezone: "Asia/Manila",
} as const;

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  liveUrl: string;
  stack: string[];
  features: string[];
  file: string;
  preview: "dashboard" | "bracket";
}

export const PROJECTS: Project[] = [
  {
    id: "sukisuite",
    name: "SukiSuite",
    tagline: "Salon Management SaaS",
    description:
      "A web application that helps salon owners run their business — manage appointments, services, and clients from one dashboard.",
    liveUrl: "https://sukisuite.vercel.app/",
    stack: ["Next.js", "React", "Tailwind CSS", "Firebase"],
    features: [
      "User authentication & owner dashboard",
      "Appointment scheduling & calendar",
      "Service and client management",
    ],
    file: "sukisuite.app",
    preview: "dashboard",
  },
  {
    id: "barangay-arena",
    name: "Barangay Arena",
    tagline: "Community Tournament Platform",
    description:
      "A community platform for organizing local sports tournaments — teams, schedules, and live bracket visualization.",
    liveUrl: "https://barangay-arena-git-main-jhnry.vercel.app/",
    stack: ["Next.js", "React", "Tailwind CSS", "Supabase"],
    features: [
      "Tournament bracket visualization",
      "Team & participant management",
      "Responsive community interface",
    ],
    file: "barangay-arena.app",
    preview: "bracket",
  },
];

export interface Service {
  id: string;
  title: string;
  description: string;
  file: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    id: "web",
    title: "Web Application Development",
    description:
      "Responsive, modern web applications and MVPs — from first sketch to deployed product.",
    file: "svc/web-app.ts",
    bullets: ["Next.js & React", "Tailwind CSS", "Auth + dashboards", "Deployed on Vercel"],
  },
  {
    id: "automation",
    title: "Workflow Automation",
    description:
      "Connect your tools and take repetitive work off your plate with API integrations and n8n pipelines.",
    file: "svc/automation.ts",
    bullets: ["n8n workflows", "API integrations", "Data sync & notifications", "Runs 24/7"],
  },
  {
    id: "ai",
    title: "AI Integrations",
    description:
      "Practical AI features added to systems you already use — grounded chatbots, content generation, document processing.",
    file: "svc/ai-integration.ts",
    bullets: ["Grounded chatbots", "Content generation", "RAG pipelines", "AI-assisted tooling"],
  },
];

export const STACK_ACTIVE = [
  "AI-Assisted Development",
  "n8n Automation",
  "Next.js & React",
  "Tailwind CSS",
  "Supabase",
  "Firebase",
  "Git & GitHub",
  "API Integrations",
] as const;

export const STACK_EXPLORING = [
  "Advanced RAG Architectures",
  "Custom AI Agents",
  "Python Data Pipelines",
] as const;

/** Honest stats — count-up targets used in the hero. */
export const STATS = [
  { value: 2, suffix: "", label: "live products shipped" },
  { value: 8, suffix: "+", label: "tools in the working stack" },
  { value: 3, suffix: "", label: "services clients can hire" },
] as const;

/** Facts the Ask-My-AI assistant is allowed to answer from. */
export const AI_FACTS = {
  greeting: `Hi! I'm Jhon Rey's portfolio assistant — I run entirely in your browser and only answer from what's on this page. Ask me about his projects, services, or how to start a project.`,
  about: `Jhon Rey Consolacion is an AI developer and automation builder from the Philippines. He turns ideas into working digital products — websites, applications, and business automations — using AI to move fast and ship reliably. Two of his products are live right now: SukiSuite and Barangay Arena.`,
  process: `His loop is the one in the hero: trigger → data → AI → shipped. He starts from your idea, wires the data and integrations, applies AI where it actually earns its keep, and deploys a working product — not a slide deck. You can see the results in the Proof of Work section.`,
  pricing: `Pricing is scoped per requirement — project size, integrations, and timeline. The fastest way to a number is the contact form below: describe the idea, and you'll get a scoped proposal rather than a generic rate card.`,
  contact: `The contact form at the bottom of this page goes straight to him — pick a project type (web app, automation, or AI integration) and describe the idea. You can also find him on GitHub at github.com/${SITE.handle}.`,
  snake: `You found the easter egg. Press ⌘K (or Ctrl+K) and run "Play Snake" — a little something that lives in the repo's history. Arrow keys or WASD to steer.`,
} as const;
