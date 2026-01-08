import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, loading, error, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberDevice: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value?.trim()) return 'Username is required';
        if (value?.length < 3) return 'Username must be at least 3 characters';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value?.length < 8) return 'Password must be at least 8 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    if (name !== 'rememberDevice') {
      const error = validateField(name, fieldValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const errors = {
      username: validateField('username', formData?.username),
      password: validateField('password', formData?.password)
    };

    setFieldErrors(errors);

    if (!errors?.username && !errors?.password) {
      onSubmit(formData);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
      <div>
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData?.username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={fieldErrors?.username}
          required
          className="w-full"
        />
      </div>
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={fieldErrors?.password}
          required
          className="w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon 
            name={showPassword ? 'EyeOff' : 'Eye'} 
            size={18} 
            color="currentColor"
          />
        </button>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Checkbox
          label="Remember this device"
          name="rememberDevice"
          checked={formData?.rememberDevice}
          onChange={handleChange}
          size="sm"
        />
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium"
        >
          Forgot password?
        </button>
      </div>
      {error && (
        <div className="flex items-start space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertCircle" size={18} color="var(--color-error)" />
          <p className="text-sm text-error flex-1">{error}</p>
        </div>
      )}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        className="mt-6"
      >
        Sign In
      </Button>
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center mb-2">
          Password Requirements:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li className="flex items-center space-x-2">
            <Icon 
              name={formData?.password?.length >= 8 ? 'CheckCircle' : 'Circle'} 
              size={12} 
              color={formData?.password?.length >= 8 ? 'var(--color-success)' : 'var(--color-muted-foreground)'}
            />
            <span>At least 8 characters</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon 
              name={/[A-Z]/?.test(formData?.password) ? 'CheckCircle' : 'Circle'} 
              size={12} 
              color={/[A-Z]/?.test(formData?.password) ? 'var(--color-success)' : 'var(--color-muted-foreground)'}
            />
            <span>One uppercase letter</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon 
              name={/[0-9]/?.test(formData?.password) ? 'CheckCircle' : 'Circle'} 
              size={12} 
              color={/[0-9]/?.test(formData?.password) ? 'var(--color-success)' : 'var(--color-muted-foreground)'}
            />
            <span>One number</span>
          </li>
        </ul>
      </div>
    </form>
  );
};

export default LoginForm;