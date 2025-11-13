import React from 'react';
import { AppIcon, GhoIcon, BarChartIcon, BrandIcon, FaqIcon, HelpIcon, GovernanceIcon, BuildIcon, DocsIcon, SecurityIcon, BugBountyIcon } from './components/icons/Icons';

export const NAV_LINKS = {
  products: {
    title: 'Features',
    items: [
      {
        icon: <AppIcon />,
        title: 'Real-Time Monitoring',
        description: 'Live feedback on your posture.',
        color: 'bg-indigo-100',
        graphicClass: 'bg-indigo-300',
      },
      {
        icon: <GhoIcon />,
        title: 'AI-Powered Analysis',
        description: 'Intelligent posture assessment.',
        color: 'bg-green-100',
        graphicClass: 'bg-green-300',
      },
    ],
  },
  resources: {
    title: 'Resources',
    items: [
      {
        icon: <BarChartIcon />,
        title: 'Blog',
        description: 'The latest news and updates.',
        graphicClass: 'bg-blue-300',
      },
      {
        icon: <BrandIcon />,
        title: 'Posture Guides',
        description: 'Assets, examples and guides.',
        graphicClass: 'bg-purple-300',
      },
      {
        icon: <FaqIcon />,
        title: 'FAQ',
        description: 'Answers to common questions.',
        graphicClass: 'bg-teal-300',
      },
      {
        icon: <HelpIcon />,
        title: 'Help & Support',
        description: 'Guides, articles and more.',
        graphicClass: 'bg-orange-300',
      },
      {
        icon: <GovernanceIcon />,
        title: 'Community',
        description: 'Join the discussion forum.',
        graphicClass: 'bg-sky-300',
      },
    ],
  },
  developers: {
    title: 'Developers',
    items: [
       {
        icon: <BuildIcon />,
        title: 'Build',
        description: 'Integrate Poisé.',
        graphicClass: 'bg-indigo-400',
      },
       {
        icon: <DocsIcon />,
        title: 'Documentation',
        description: 'Technical guides for developers.',
        graphicClass: 'bg-cyan-400',
      },
       {
        icon: <SecurityIcon />,
        title: 'Security',
        description: 'Audit reports and information.',
        graphicClass: 'bg-yellow-400',
      },
       {
        icon: <BugBountyIcon />,
        title: 'Bug Bounty',
        description: 'Report responsibly and get rewarded.',
        graphicClass: 'bg-amber-400',
      },
    ],
  },
};
