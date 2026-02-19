import { useGetLogo } from '../hooks/useQueries';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const { data: logo } = useGetLogo();
  
  // Use backend-managed logo if available, otherwise fallback to static asset
  const logoSrc = logo?.image.getDirectURL() || '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';
  const altText = logo?.altText || 'Fitting Point';

  return (
    <img
      src={logoSrc}
      alt={altText}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  );
}
