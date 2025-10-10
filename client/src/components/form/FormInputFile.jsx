import React from 'react';
import { useFormContext } from './Form';

export const FormInputFile = ({ 
  name, 
  accept, 
  multiple = false, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { handleChange, handleBlur } = useFormContext();

  return (
    <input
      type="file"
      name={name}
      id={name}
      onChange={(e) => handleChange(name, multiple ? e.target.files : e.target.files[0])}
      onBlur={() => handleBlur(name)}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      className={`form-input form-input--file ${className}`}
      {...props}
    />
  );
};