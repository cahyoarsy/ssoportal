import React from 'react';
import Icon from './Icon.jsx';

const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-blue-400',
  secondary: 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 focus:ring-blue-300',
  ghost: 'bg-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-100 focus:ring-slate-300',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  iconSize = 18,
  loading = false,
  full = false,
  as,
  href,
  ...props
}) {
  const classes = [
    base,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    full ? 'w-full' : '',
    className,
  ].join(' ');

  const content = (
    <>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white/70 border-b-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {leftIcon ? <Icon name={leftIcon} size={iconSize} /> : null}
          <span>{children}</span>
          {rightIcon ? <Icon name={rightIcon} size={iconSize} /> : null}
        </>
      )}
    </>
  );

  if ((as === 'a') || href) {
    const { disabled, ...rest } = props;
    return (
      <a
        className={[classes, disabled ? 'pointer-events-none opacity-60' : ''].join(' ')}
        href={href}
        aria-disabled={disabled ? 'true' : undefined}
        role="button"
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
