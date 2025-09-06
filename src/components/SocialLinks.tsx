import React from 'react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '📸';
      case 'twitter':
        return '🐦';
      case 'spotify':
        return '🎵';
      case 'youtube':
        return '📺';
      case 'soundcloud':
        return '☁️';
      default:
        return '🔗';
    }
  };

  return (
    <div className="text-center mt-16">
      <h3 className="text-xl font-bold text-white mb-6">Follow B0NEZ B0I</h3>
      <div className="flex justify-center space-x-6">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={`Follow on ${link.platform}`}
          >
            <span className="text-white text-lg font-bold group-hover:text-yellow-400 transition-colors">
              {getIcon(link.platform)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export { SocialLinks };
export default SocialLinks;