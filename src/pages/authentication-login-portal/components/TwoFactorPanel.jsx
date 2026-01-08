import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TwoFactorPanel = ({ onVerify, onResend, loading, error, attemptsRemaining }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs?.current?.[0]) {
      inputRefs?.current?.[0]?.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/?.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value?.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs?.current?.[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !otp?.[index] && index > 0) {
      inputRefs?.current?.[index - 1]?.focus();
    }
    if (e?.key === 'Enter' && otp?.every(digit => digit !== '')) {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e?.preventDefault();
    const pastedData = e?.clipboardData?.getData('text')?.slice(0, 6);
    if (!/^\d+$/?.test(pastedData)) return;

    const newOtp = pastedData?.split('')?.concat(Array(6)?.fill(''))?.slice(0, 6);
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp?.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs?.current?.[nextEmptyIndex]?.focus();
    } else {
      inputRefs?.current?.[5]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp?.join('');
    if (otpValue?.length === 6) {
      onVerify(otpValue);
    }
  };

  return (
    <div className="space-y-4 md:space-y-5 lg:space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="ShieldCheck" size={24} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Two-Factor Authentication
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Enter the 6-digit code sent to your registered device
        </p>
      </div>
      <div className="flex justify-center space-x-2 md:space-x-3">
        {otp?.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e?.target?.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-10 h-12 md:w-12 md:h-14 lg:w-14 lg:h-16 text-center text-lg md:text-xl lg:text-2xl font-bold font-data bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <div className="flex items-start space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertCircle" size={18} color="var(--color-error)" />
          <p className="text-sm text-error flex-1">{error}</p>
        </div>
      )}
      {attemptsRemaining !== null && attemptsRemaining < 3 && (
        <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={18} color="var(--color-warning)" />
          <p className="text-sm text-warning flex-1">
            {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before account lockout
          </p>
        </div>
      )}
      <Button
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleVerify}
        disabled={otp?.some(digit => digit === '')}
      >
        Verify Code
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium disabled:opacity-50"
        >
          Didn't receive code? Resend
        </button>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Code expires in 5 minutes. Check your authenticator app or SMS.
        </p>
      </div>
    </div>
  );
};

export default TwoFactorPanel;