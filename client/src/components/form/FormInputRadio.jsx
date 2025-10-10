import React from 'react';
import { useFormContext } from './Form';

export const FormInputRadio = ({ 
  name, 
  value, 
  label, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { values, handleChange, handleBlur } = useFormContext();

  return (
    <label className={`form-radio ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={values[name] === value}
        onChange={(e) => handleChange(name, e.target.value)}
        onBlur={() => handleBlur(name)}
        disabled={disabled}
        className="form-radio__input"
        {...props}
      />
      <span className="form-radio__checkmark"></span>
      {label && <span className="form-radio__label">{label}</span>}
    </label>
  );
};