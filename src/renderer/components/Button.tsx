import React from 'react';

type Props = {
  full?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: VoidFunction;
  disabled?: boolean;
};

const Button = ({ full, className, children, onClick, disabled }: Props) => {
  return (
    <button
      type="button"
      className={[
        'border border-slate-600 rounded px-5 py-3 bg-white hover:bg-slate-200 transition-colors',
        full ? 'w-full' : '',
        disabled ? 'bg-gray-200' : '',
        className,
      ].join(' ')}
      onClick={!disabled ? onClick : undefined}
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
  disabled: false,
};

export default Button;
