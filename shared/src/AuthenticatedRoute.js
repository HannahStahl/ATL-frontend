import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";

export default function AuthenticatedRoute({ isAuthenticated, children, ...rest }) {
  const { pathname, search } = useLocation();
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={
          `/login?redirect=${pathname}${search}`
        } />
      )}
    </Route>
  );
}
