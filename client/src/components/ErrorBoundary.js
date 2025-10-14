import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

/**
 * Enterprise Error Boundary Component
 * Graceful error handling with recovery options
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service (e.g., Sentry, CloudWatch)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full animate-scale-in">
            <div className="card shadow-orange-lg">
              <div className="card-body p-8 text-center">
                {/* Error Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                {/* Error Message */}
                <h1 className="heading-2 mb-3 text-red-900">
                  Oops! Something went wrong
                </h1>
                <p className="body-lg mb-6 text-gray-600">
                  We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <button
                    onClick={this.handleReset}
                    className="btn-primary btn-md hover-lift"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn-secondary btn-md hover-lift"
                  >
                    <Home className="w-4 h-4" />
                    <span>Go Home</span>
                  </button>
                </div>

                {/* Error Details (Development Mode) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-3 hover:text-orange-600 transition-colors">
                      Technical Details (Development Mode)
                    </summary>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                      <div className="mb-4">
                        <div className="text-red-400 font-bold mb-2">Error:</div>
                        <div>{this.state.error.toString()}</div>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <div className="text-yellow-400 font-bold mb-2">Stack Trace:</div>
                          <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Help Text */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="caption text-gray-500">
                    If this problem persists, please contact support at{' '}
                    <a href="mailto:rajshah9305@example.com" className="text-orange-600 hover:text-orange-700 font-semibold">
                      rajshah9305@example.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error Message Component for inline errors
 */
export const ErrorMessage = ({ 
  title = 'Error', 
  message, 
  onRetry, 
  onDismiss,
  variant = 'error' 
}) => {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const iconColors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`card ${variants[variant]} animate-slide-up`}>
      <div className="card-body py-4 px-4">
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${iconColors[variant]}`} />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-1">{title}</h4>
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
          {(onRetry || onDismiss) && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm font-semibold hover:underline"
                >
                  Retry
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm font-semibold hover:underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Empty State Component
 */
export const EmptyState = ({ 
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  actionLabel = 'Get Started'
}) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="heading-3 mb-2">{title}</h3>
      {description && (
        <p className="body text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      )}
      {action && (
        <button onClick={action} className="btn-primary btn-md">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorBoundary;

