import React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import CreateRequest from "./createRequest";
import Dashboard from "./dashboard";
import EditRequest from "./editRequest";
import ErrorBoundaryComponent from "./error.component";
import Login from "./login";
import NotFound from "./notfound";

export function RouterComponent() {
    const location = useLocation();
    
    return (
        <ErrorBoundaryComponent key={location.pathname}>
            <Switch>
                <Route exact path="/" render= { () => <Redirect to="/login" />} />
                <Route path="/login" component={Login} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/createrequest" component={CreateRequest} />
                <Route path="/editrequest" component={EditRequest} />
                <Route component={NotFound} />
            </Switch>
        </ErrorBoundaryComponent>
    );
}