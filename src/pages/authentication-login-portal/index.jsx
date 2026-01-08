import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandingHeader from './components/BrandingHeader';
import LoginForm from './components/LoginForm';
import TwoFactorPanel from './components/TwoFactorPanel';
import SystemHealthPanel from './components/SystemHealthPanel';
import SessionWarning from './components/SessionWarning';
import AuditTrailInfo from './components/AuditTrailInfo';
import Icon from '../../components/AppIcon';

const AuthenticationLoginPortal = ({ onRoleChange }) => {
  const navigate = useNavigate();
  const [authStep, setAuthStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const mockCredentials = {
    admin: {
      username: 'admin',
      password: 'Admin@123',
      otp: '123456',
      role: 'admin'
    },
    member: {
      username: 'member',
      password: 'Member@123',
      otp: '654321',
      role: 'member'
    }
  };

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let device = 'Unknown Device';
    
    if (/Mobile|Android|iPhone/i?.test(userAgent)) {
      device = 'Mobile Device';
    } else if (/Tablet|iPad/i?.test(userAgent)) {
      device = 'Tablet Device';
    } else {
      device = 'Desktop Computer';
    }
    
    setDeviceInfo(device);
    setIpAddress('192.168.1.100');
  }, []);

  const handleLoginSubmit = (formData) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      const isAdminValid = 
        formData?.username === mockCredentials?.admin?.username && 
        formData?.password === mockCredentials?.admin?.password;
      
      const isMemberValid = 
        formData?.username === mockCredentials?.member?.username && 
        formData?.password === mockCredentials?.member?.password;

      if (isAdminValid) {
        setUserRole('admin');
        setAuthStep('2fa');
        setAttemptsRemaining(3);
        setLoginAttempts(0);
      } else if (isMemberValid) {
        setUserRole('member');
        setAuthStep('2fa');
        setAttemptsRemaining(3);
        setLoginAttempts(0);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setError('Account locked due to multiple failed attempts. Please contact administrator.');
        } else {
          setError(`Invalid username or password. ${5 - newAttempts} attempt${5 - newAttempts !== 1 ? 's' : ''} remaining.\n\nValid credentials:\nAdmin - Username: admin, Password: Admin@123\nMember - Username: member, Password: Member@123`);
        }
      }
      
      setLoading(false);
    }, 1500);
  };

  const handle2FAVerify = (otpValue) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      const validOtp = userRole === 'admin' 
        ? mockCredentials?.admin?.otp 
        : mockCredentials?.member?.otp;

      if (otpValue === validOtp) {
        onRoleChange(userRole);
        const targetRoute = userRole === 'admin' ?'/executive-dashboard' :'/member-focused-view';
        
        navigate(targetRoute);
      } else {
        const newAttemptsRemaining = attemptsRemaining - 1;
        setAttemptsRemaining(newAttemptsRemaining);
        
        if (newAttemptsRemaining <= 0) {
          setError('Account locked due to multiple failed 2FA attempts. Please contact administrator.');
          setTimeout(() => {
            setAuthStep('login');
            setAttemptsRemaining(null);
            setUserRole(null);
          }, 3000);
        } else {
          setError(`Invalid verification code. Valid code: ${validOtp}`);
        }
      }
      
      setLoading(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    setError('');
    setTimeout(() => {
      const validOtp = userRole === 'admin' 
        ? mockCredentials?.admin?.otp 
        : mockCredentials?.member?.otp;
      setError(`New code sent! Valid code: ${validOtp}`);
    }, 1000);
  };

  const handleForgotPassword = () => {
    setError('Password reset functionality will be available soon. Please contact administrator.');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        <div className="bg-card rounded-2xl shadow-elevation-3 p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
          <BrandingHeader />

          <div className="space-y-4 md:space-y-5 lg:space-y-6">
            {authStep === 'login' ? (
              <LoginForm
                onSubmit={handleLoginSubmit}
                loading={loading}
                error={error}
                onForgotPassword={handleForgotPassword}
              />
            ) : (
              <TwoFactorPanel
                onVerify={handle2FAVerify}
                onResend={handleResendOTP}
                loading={loading}
                error={error}
                attemptsRemaining={attemptsRemaining}
              />
            )}
          </div>

          <SessionWarning timeoutMinutes={30} />
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-card rounded-2xl shadow-elevation-2 p-6 md:p-8">
            <SystemHealthPanel />
          </div>

          <div className="bg-card rounded-2xl shadow-elevation-2 p-6 md:p-8 space-y-4 md:space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                  Enterprise Security
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Multi-layer protection
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    TLS 1.3 Encryption
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All data transmitted securely
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Role-Based Access Control
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Granular permission management
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Activity Audit Trail
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complete login history tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Account Lockout Protection
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Automatic security after failed attempts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-elevation-2 p-6 md:p-8">
            <AuditTrailInfo 
              ipAddress={ipAddress}
              deviceInfo={deviceInfo}
            />
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-primary)" />
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
                  Need Help?
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Contact your system administrator for account assistance or password reset requests.
                </p>
                <p className="text-xs text-muted-foreground">
                  Support: support@teamsync.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground font-caption">
        © {new Date()?.getFullYear()} TeamSync. All rights reserved.
      </div>
    </div>
  );
};

export default AuthenticationLoginPortal;