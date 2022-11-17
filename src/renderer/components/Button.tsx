import React from 'react';

type Props = {
  full?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: VoidFunction;
};

const Button = ({ full, className, children, onClick }: Props) => {
  return (
    <button
      type="button"
      className={[
        'border border-slate-600 rounded px-5 py-3 bg-white hover:bg-slate-200 transition-colors',
        full ? 'w-full' : '',
        className,
      ].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  full: false,
  className: null,
  children: null,
  onClick: null,
};

export default Button;
