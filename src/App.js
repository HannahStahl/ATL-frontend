import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import "./App.css";

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">ATL</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <NavDropdown title={<i className="fas fa-user-circle" />} id="basic-nav-dropdown">
                  <MenuItem href="/captain-profile">My Profile</MenuItem>
                  <MenuItem href="/team-details">Team Details</MenuItem>
                  <MenuItem href="/team-roster">Team Roster</MenuItem>
                  <MenuItem href="/match-schedule">Match Schedule</MenuItem>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Sign up</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Log in</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
            <div className="container"><Routes /></div>
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
