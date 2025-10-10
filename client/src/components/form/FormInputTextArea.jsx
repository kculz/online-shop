import React from 'react';
import { useFormContext } from './Form';

export const FormInputTextArea = ({ 
  name, 
  placeholder, 
  className = '', 
  rows = 4,
  disabled = false,
  ...props 
}) => {
  const { values, handleChange, handleBlur } = useFormContext();

  return (
    <textarea
      name={name}
      id={name}
      value={values[name] || ''}
      onChange={(e) => handleChange(name, e.target.value)}
      onBlur={() => handleBlur(name)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`form-textarea ${className}`}
      {...props}
    />
  );
};