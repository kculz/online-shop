import React from 'react';
import { useForm } from '../../hooks/useForm';

const FormContext = React.createContext();

export const Form = ({ 
  children, 
  onSubmit, 
  className = '', 
  initialValues = {}, 
  validationSchema,
  ...props 
}) => {
  const formMethods = useForm({ initialValues, validationSchema, onSubmit });

  return (
    <FormContext.Provider value={formMethods}>
      <form 
        className={`form ${className}`} 
        onSubmit={formMethods.handleSubmit}
        {...props}
      >
        {typeof children === 'function' ? children(formMethods) : children}
      </form>
    </FormContext.Provider>
  );
};

// Custom hook to use form context
export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
};