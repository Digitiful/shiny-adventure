
import { Database, LineChart, BookOpen, Briefcase, Cloud, Code, PenTool, ShoppingCart, Megaphone, Star, TrendingUp, Target, Gamepad2, Rocket, Film, Library, Move, Plus, Search, LayoutDashboard, Settings, ShoppingBag, FolderKanban, Mail, ScanLine, FileVideo, type LucideIcon, CaseUpper, Package, FileText, Users, Trophy, Cpu } from "lucide-react";
import placeholderData from '@/lib/placeholder-images.json';
import servicesData from '@/content/services.json';
import clientsData from '@/content/clients.json';
import techData from '@/content/technology.json';
import successStoriesData from '@/content/success-stories.json';
import projectDetailsData from '@/content/project-details.json';

export const navLinks = [
  { href: "/#terminal", label: "Intake", authOnly: false },
  { href: "/#services", label: "Services", authOnly: false },
  { href: "/#about-section", label: "About", authOnly: false },
  { href: "/#portfolio", label: "Portfolio", authOnly: false },
  { href: "/dashboard", label: "Project Hub", authOnly: true },
];

export const adminNavLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, description: "View the main dashboard." },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail, description: "View client messages." },
  { href: '/admin/technology', label: 'Tech Stack', icon: Cpu, description: "Manage Neural Tree nodes." },
  { href: '/admin/services', label: 'Services', icon: Briefcase, description: "Manage offerings." },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Trophy, description: "Manage success stories." },
  { href: '/admin/clients', label: 'Partners', icon: Users, description: "Manage partner logos." },
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
  if (id.startsWith('http')) {
    return {
      id: "external",
      description: "External asset signal",
      imageUrl: id,
      imageHint: "technology"
    };
  }
  
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
  href: `/#portfolio`, // Anchored to main page
  imageData: story.imageId ? getImageData(story.imageId) : null,
  results: story.results.map(result => ({
    ...result,
    icon: resultIcons[result.icon],
  })),
}));

export const dashboardData = {
  knowledgeBase: [
    {
        id: 'kb-2',
        name: 'React',
        description: 'A JavaScript library for building user interfaces.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
        href: 'https://react.dev/',
        features: ["Component-Based Architecture", "Virtual DOM"],
        useCase: "Modern UIs",
        pricing: "Free"
    }
  ],
  projectHub: {
    keyDocuments: [
        { title: 'Project Proposal', href: '#', type: 'pdf' },
        { title: 'Scope of Work', href: '#', type: 'doc' },
    ],
    featuredVideo: {
        id: 'vid-2',
        title: 'Mastering Digital Systems',
        description: 'High-discipline engineering culture.',
        thumbnailUrl: 'https://picsum.photos/seed/102/600/400',
        duration: '24:10',
    }
  },
};

export { projectDetailsData };
