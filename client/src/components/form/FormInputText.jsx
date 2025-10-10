import React from 'react';
import { useFormContext } from './Form';

export const FormInputText = ({ 
  name, 
  type = 'text', 
  placeholder, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { values, handleChange, handleBlur } = useFormContext();

  return (
    <input
      type={type}
      name={name}
      id={name}
      value={values[name] || ''}
      onChange={(e) => handleChange(name, e.target.value)}
      onBlur={() => handleBlur(name)}
      placeholder={placeholder}
      disabled={disabled}
      className={`form-input ${className}`}
      {...props}
    />
  );
};