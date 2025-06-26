import React from 'react';
import { User } from 'lucide-react';
import './ProfilePicture.css';

interface ProfilePictureProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  src, 
  name, 
  size = 'md',
  className = '',
  onClick 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClass = `profile-picture-${size}`;
  const clickableClass = onClick ? 'clickable' : '';

  if (src) {
    return (
      <img 
        src={src} 
        alt={`${name}'s profile`}
        className={`profile-picture ${sizeClass} ${clickableClass} ${className}`}
        onClick={onClick}
      />
    );
  }

  return (
    <div 
      className={`profile-picture-placeholder ${sizeClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      <User className="placeholder-icon" />
      <span className="initials">{getInitials(name)}</span>
    </div>
  );
};

export default ProfilePicture; 