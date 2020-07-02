import React from "react";
import { Button, Glyphicon } from "react-bootstrap";

export default function LoaderButton({
  isLoading, className = "", disabled = false, ...props
}) {
  return (
    <React.Fragment>
      <style>
        {`
          .LoaderButton .spinning.glyphicon {
            margin-right: 7px;
            top: 2px;
            animation: spin 1s infinite linear;
          }
          @keyframes spin {
            from { transform: scale(1) rotate(0deg); }
            to { transform: scale(1) rotate(360deg); }
          }
        `}
      </style>
      <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
        {props.children}
      </Button>
    </React.Fragment>
  );
}
