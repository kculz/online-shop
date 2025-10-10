import React from 'react';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-lg border';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border-gray-200 shadow-sm',
    elevated: 'bg-white border-gray-200 shadow-md',
    outline: 'bg-transparent border-gray-300',
    filled: 'bg-gray-50 border-gray-200',
    dark: 'bg-gray-800 border-gray-700 text-white'
  };

  // Hover effect
  const hoverClass = hover ? 'transition-shadow duration-200 hover:shadow-lg' : '';

  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${hoverClass}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Body Component
const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
};

// Card Description Component
const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-gray-600 text-sm ${className}`} {...props}>
      {children}
    </p>
  );
};

// Export all card components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;