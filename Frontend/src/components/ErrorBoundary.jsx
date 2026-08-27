import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In production you'd send this to an error-tracking service (Sentry, etc.)
    // instead of just console.error — flagging as a future improvement, not urgent now.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-paper p-6">
          <div className="text-center max-w-sm">
            <p className="font-display text-2xl text-ink mb-2">Something went wrong</p>
            <p className="text-ink-soft text-sm mb-6">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-ledger text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-ledger-deep"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;