import React from 'react';
import { useFormContext } from './Form';

export const FormField = ({ 
  children, 
  label, 
  name, 
  required = false, 
  className = '', 
  helpText,
  ...props 
}) => {
  const { errors, touched } = useFormContext();
  const error = errors[name];
  const isTouched = touched[name];

  return (
    <div className={`form-field ${className} ${error && isTouched ? 'form-field--error' : ''}`}>
      {label && (
        <label htmlFor={name} className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      
      <div className="form-field__input">
        {React.cloneElement(children, {
          name,
          id: name,
          ...props
        })}
      </div>

      {helpText && !error && (
        <div className="form-field__help">{helpText}</div>
      )}

      {error && isTouched && (
        <div className="form-field__error">{error}</div>
      )}
    </div>
  );
};