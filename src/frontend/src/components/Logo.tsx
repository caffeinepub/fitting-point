/**
 * Shared Logo component that renders the Fitting Point logo as a circle
 * Used consistently across Header, Footer, and other locations
 */

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
  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';

  return (
    <img
      src={logoSrc}
      alt="Fitting Point"
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  );
}
