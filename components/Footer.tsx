import React from 'react';
import { AppLogo, DiscordIcon, XIcon, LensIcon, InstagramIcon, GithubIcon, MediumIcon } from './icons/Icons';

const Footer: React.FC = () => {
    const resources = ['Blog', 'Brand', 'FAQ', 'Case Studies', 'Help & Support', 'Governance'];
    const developers = ['Build', 'Documentation', 'Technical Paper', 'Security', 'Bug Bounty'];
    const company = ['Privacy Policy', 'Terms of Use', 'Contact', 'Manage Analytics'];
    const socials = [<XIcon />, <DiscordIcon />, <LensIcon />, <InstagramIcon />, <GithubIcon />, <MediumIcon />];

    const gradientStyle = {
        background: 'linear-gradient(to right, #22d3ee, #facc15, #fb923c, #f472b6, #c084fc)'
    };

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center mb-4">
                             <span className="text-2xl font-logo tracking-tight">poisé</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Your personal AI wellness coach for building healthier posture habits.
                        </p>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {resources.map(link => <li key={link}><a href="#" className="text-gray-500 hover:text-gray-900">{link}</a></li>)}
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Developers</h3>
                        <ul className="space-y-2">
                            {developers.map(link => <li key={link}><a href="#" className="text-gray-500 hover:text-gray-900">{link}</a></li>)}
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-2">
                            {company.map(link => <li key={link}><a href="#" className="text-gray-500 hover:text-gray-900">{link}</a></li>)}
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex space-x-4">
                        {socials.map((Icon, index) => (
                            <a key={index} href="#" className="text-gray-400 hover:text-gray-900">
                                {Icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-4 sm:mt-0">&copy; {new Date().getFullYear()} Poisé. All rights reserved.</p>
                </div>
                <div className="mt-8 space-y-2 flex flex-col items-center">
                    <div className="h-1 w-full rounded animated-gradient shadow-sm" style={gradientStyle}></div>
                    <div className="h-1 w-11/12 rounded animated-gradient shadow-sm opacity-75" style={gradientStyle}></div>
                    <div className="h-1 w-10/12 rounded animated-gradient shadow-sm opacity-50" style={gradientStyle}></div>
                    <div className="h-1 w-9/12 rounded animated-gradient shadow-sm opacity-25" style={gradientStyle}></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
