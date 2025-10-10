import React from 'react';
import { useFormContext } from './Form';

export const FormInputCheckbox = ({ 
  name, 
  label, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { values, handleChange, handleBlur } = useFormContext();

  return (
    <label className={`form-checkbox ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={!!values[name]}
        onChange={(e) => handleChange(name, e.target.checked)}
        onBlur={() => handleBlur(name)}
        disabled={disabled}
        className="form-checkbox__input"
        {...props}
      />
      <span className="form-checkbox__checkmark"></span>
      {label && <span className="form-checkbox__label">{label}</span>}
    </label>
  );
};