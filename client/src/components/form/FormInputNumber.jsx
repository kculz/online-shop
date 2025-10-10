import React from 'react';
import { useFormContext } from './Form';

export const FormInputNumber = ({ 
  name, 
  placeholder, 
  className = '', 
  min,
  max,
  step,
  disabled = false,
  ...props 
}) => {
  const { values, handleChange, handleBlur } = useFormContext();

  return (
    <input
      type="number"
      name={name}
      id={name}
      value={values[name] || ''}
      onChange={(e) => handleChange(name, e.target.value)}
      onBlur={() => handleBlur(name)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={`form-input form-input--number ${className}`}
      {...props}
    />
  );
};