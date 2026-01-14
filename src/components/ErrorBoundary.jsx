import React from "react";
import Icon from "./AppIcon";
import Button from "./ui/Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    // Store error info for display
    this.setState({ errorInfo });

    // In production, you would log to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state?.hasError) {
      const { error, errorInfo, retryCount } = this.state;
      const showDetails = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl w-full bg-card rounded-2xl shadow-elevation-3 p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={40} className="text-error" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground text-lg">
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </p>
            </div>

            {showDetails && error && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Info" size={16} />
                  Error Details (Development Only)
                </h3>
                <div className="text-xs text-muted-foreground space-y-2">
                  <div>
                    <span className="font-medium">Error:</span>{' '}
                    {error.toString()}
                  </div>
                  {errorInfo && errorInfo.componentStack && (
                    <div>
                      <span className="font-medium">Component Stack:</span>
                      <pre className="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  {retryCount > 0 && (
                    <div className="text-warning">
                      Retry attempts: {retryCount}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <Icon name="RefreshCw" size={18} />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                <Icon name="RotateCw" size={18} />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Icon name="Home" size={18} />
                Go Home
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                If this error continues, please contact support at{' '}
                <a href="mailto:support@teamsync.com" className="text-primary hover:underline">
                  support@teamsync.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props?.children;
  }
}

export default ErrorBoundary;