import { useState, useCallback } from 'react';

/**
 * Hook for form state management
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  }, [setValue]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setError = useCallback((name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  const validate = useCallback((validationSchema) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((key) => {
      const value = values[key];
      const rules = validationSchema[key];

      if (rules.required && !value) {
        newErrors[key] = rules.required;
        isValid = false;
      } else if (rules.minLength && value.length < rules.minLength.value) {
        newErrors[key] = rules.minLength.message;
        isValid = false;
      } else if (rules.pattern && !rules.pattern.value.test(value)) {
        newErrors[key] = rules.pattern.message;
        isValid = false;
      } else if (rules.validate) {
        const error = rules.validate(value, values);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setValue,
    handleChange,
    handleBlur,
    reset,
    setError,
    validate,
    setValues,
  };
}

/**
 * Hook for toggle state
 * @param {boolean} [initialValue=false] - Initial toggle state
 * @returns {Object} Toggle state and handlers
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}

/**
 * Hook for local storage
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

/**
 * Hook for window size
 * @returns {Object} Window dimensions
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useState(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
