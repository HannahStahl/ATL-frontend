import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? (
      <React.Fragment>
        <style>
          {`
            .ErrorBoundary {
              padding-top: 100px;
              text-align: center;
            }
          `}
        </style>
        <div className="ErrorBoundary">
          <h3>Sorry, there was a problem loading this page.</h3>
        </div>
      </React.Fragment>
    ) : (
      this.props.children
    );
  }
}
