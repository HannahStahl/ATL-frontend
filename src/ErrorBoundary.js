import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? (
      <div className="ErrorBoundary container">
        <h3>Sorry, there was a problem loading this page.</h3>
      </div>
    ) : (
      this.props.children
    );
  }
}
