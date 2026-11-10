import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'light' | 'outline' | 'outline-light' | 'ghost';
type Size = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white shadow-card hover:bg-primary-700',
  light: 'bg-white text-primary-700 shadow-card hover:bg-neutral-100',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
  'outline-light': 'border border-white/70 text-white hover:border-white hover:bg-white/10',
  ghost: 'text-accent-700 hover:text-primary-700 hover:underline underline-offset-4 hover:translate-y-0',
};

const SIZES: Record<Size, string> = {
  md: 'min-h-12 px-6 text-[15px]',
  lg: 'min-h-14 px-8 text-base',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return [BASE, VARIANTS[variant], SIZES[size], className].join(' ');
}

interface ButtonLinkProps {
  to: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ to, variant, size, className, children }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}
