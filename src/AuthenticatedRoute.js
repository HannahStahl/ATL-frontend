import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAppContext } from "./libs/contextLib";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated, loadingData, profile } = useAppContext();
  const { pathname } = useLocation();

  if (loadingData) {
    return <></>;
  }

  const renderChildrenOrRedirect = () => {
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (pathname !== "/portal" && !(profile?.userId)) {
      return <Redirect to="/portal" />;
    }
    return children;
  };

  return (
    <Route {...rest}>
      {renderChildrenOrRedirect()}
    </Route>
  );
}
