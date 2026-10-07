import { Database, LineChart, BookOpen, Briefcase, Cloud, Code, PenTool, ShoppingCart, Megaphone, Star, TrendingUp, Target, Gamepad2, Rocket, Film, Library, Move, Plus, Search, LayoutDashboard, Settings, ShoppingBag, FolderKanban, Mail, ScanLine, FileVideo, type LucideIcon, CaseUpper, Package, FileText, Users, Trophy } from "lucide-react";
import placeholderData from '@/lib/placeholder-images.json';
import servicesData from '@/content/services.json';
import clientsData from '@/content/clients.json';
import techData from '@/content/technology.json';
import successStoriesData from '@/content/success-stories.json';
import projectDetailsData from '@/content/project-details.json';
import warehouseData from '@/content/warehouse.json';


export const navLinks = [
  { href: "/about", label: "About", authOnly: false },
  { href: "/#services", label: "Services", authOnly: false },
  { href: "/warehouse", label: "Warehouse", authOnly: false },
  { href: "/#clients", label: "Clients", authOnly: false },
  { href: "/dashboard", label: "Dashboard", authOnly: true },
];

export const adminNavLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, description: "View the main dashboard." },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail, description: "View all client messages from your contact and booking forms in one place." },
  { href: '/admin/ai-writer', label: 'Content Analysis', icon: ScanLine, description: "Analyze text to detect if it was written by a machine." },
  { href: '/admin/services', label: 'Services', icon: Briefcase, description: "Manage the services your business offers." },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Trophy, description: "Manage success stories and case studies." },
  { href: '/admin/clients', label: 'Partners', icon: Users, description: "Manage client logos displayed on the landing page." },
  { href: '/admin/warehouse', label: 'Client: AWH Vault', icon: Package, description: "Manage the Alien Warehouse inventory and eBay synchronization." },
];

export const serviceIcons: { [key: string]: LucideIcon } = {
  Database,
  LineChart,
  BookOpen,
  Briefcase,
  Cloud,
  Code,
  PenTool,
  ShoppingCart,
  Megaphone,
};

export const services = servicesData.map(service => ({
  ...service,
  icon: serviceIcons[service.icon as keyof typeof serviceIcons],
}));

export const clientLogos = clientsData;

export const techLogos = techData;

const getImageData = (id: string) => {
  const data = placeholderData.placeholderImages.find(p => p.id === id);
  if (!data) {
    return {
      id: "not-found",
      description: "Placeholder image not found",
      imageUrl: "https://placehold.co/600x400/222/fff?text=Not+Found",
      imageHint: "placeholder"
    };
  }
  return data;
}

const resultIcons: { [key: string]: React.ElementType } = {
  TrendingUp,
  Target,
  Star,
  Gamepad2,
  Code,
};

export const successStories = successStoriesData.map(story => ({
  ...story,
  href: story.id === 'story-2' ? '#' : `/portfolio/${story.id}`,
  imageData: story.imageId ? getImageData(story.imageId) : null,
  results: story.results.map(result => ({
    ...result,
    icon: resultIcons[result.icon],
  })),
}));

export const auctionItems = warehouseData.map(item => ({
    ...item,
    imageData: getImageData(item.imageId),
}));


const dashboardKnowledgeBase = [
    {
        id: 'kb-2',
        name: 'React',
        description: 'A JavaScript library for building user interfaces.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
        href: 'https://react.dev/',
        invertOnDark: false,
        features: ["Component-Based Architecture", "Virtual DOM for high performance", "Rich ecosystem with libraries like Next.js", "Backed by Meta"],
        useCase: "Building modern, interactive, and high-performance single-page applications and user interfaces.",
        pricing: "Completely free and open-source (MIT License)."
    },
     {
        id: 'kb-4',
        name: 'Shopify',
        description: 'The global commerce platform for e-commerce.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
        href: 'https://shopify.com',
        invertOnDark: true,
        features: ["Online Store Builder", "Integrated Payment Processing", "Inventory Management", "Marketing and SEO Tools"],
        useCase: "Entrepreneurs and businesses wanting to sell products online, from small shops to large enterprises.",
        pricing: "Starts at $29/month after a free trial period."
    },
    {
        id: 'kb-5',
        name: 'Google Analytics',
        description: 'Web analytics service for tracking traffic.',
        logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
        href: 'https://analytics.google.com/',
        invertOnDark: false,
        features: ["Real-time user tracking", "Audience and acquisition reports", "Conversion tracking", "Behavior flow analysis"],
        useCase: "Understanding website traffic, user engagement, and marketing effectiveness.",
        pricing: "Free for most users, with an enterprise version (Analytics 360) available."
    },
    {
        id: 'kb-6',
        name: 'Google Cloud',
        description: 'Suite of cloud computing services.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png',
        href: 'https://cloud.google.com/',
        invertOnDark: false,
        features: ["Virtual Machines (Compute Engine)", "Scalable Databases (Firestore, Spanner)", "AI & Machine Learning APIs", "Serverless computing (Cloud Functions)"],
        useCase: "Building, deploying, and scaling applications and services on Google's infrastructure.",
        pricing: "Pay-as-you-go model with a generous free tier for many services."
    },
    {
        id: 'kb-7',
        name: 'Matrix',
        description: 'Open standard for decentralized communication.',
        logo: 'https://matrix.org/images/matrix-logo-white.svg',
        href: 'https://matrix.org/',
        invertOnDark: false,
        features: ["End-to-end encryption", "Federated and decentralized", "Bridging to other networks (Slack, IRC)", "VoIP, video calls, and messaging"],
        useCase: "Secure, sovereign, and interoperable real-time communication for individuals and organizations.",
        pricing: "The protocol is free; hosting a server has associated costs."
    },
];

const projectHubData = {
    keyDocuments: [
        { title: 'Project Proposal', href: '#', type: 'pdf' },
        { title: 'Scope of Work', href: '#', type: 'doc' },
        { title: 'Brand Guidelines', href: '#', type: 'pdf' },
        { title: 'Design Mockups (Figma)', href: '#', type: 'figma' },
    ],
    featuredVideo: {
        id: 'vid-2',
        title: 'Mastering Data-Driven Decisions',
        description: 'A deep dive into building a culture of data-centric decision-making in your organization.',
        thumbnailUrl: 'https://picsum.photos/seed/102/600/400',
        duration: '24:10',
    }
};


export const dashboardData = {
  knowledgeBase: dashboardKnowledgeBase,
  projectHub: projectHubData,
};

export { projectDetailsData };