import { useState, useCallback } from 'react';

export const useForm = ({ initialValues = {}, validationSchema, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(async (name, value) => {
    if (!validationSchema) return null;

    try {
      await validationSchema.validateAt(name, { [name]: value });
      return null;
    } catch (error) {
      return error.message;
    }
  }, [validationSchema]);

  const validateForm = useCallback(async () => {
    if (!validationSchema) return {};

    try {
      await validationSchema.validate(values, { abortEarly: false });
      return {};
    } catch (errors) {
      const newErrors = {};
      errors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      return newErrors;
    }
  }, [validationSchema, values]);

  const handleChange = useCallback(async (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      const error = await validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback(async (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = await validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate entire form
    const formErrors = await validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, onSubmit, validateForm]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue: handleChange,
    setFieldTouched: (name) => setTouched(prev => ({ ...prev, [name]: true }))
  };
};