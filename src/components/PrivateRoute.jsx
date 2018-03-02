import React from 'react';
import  { Route, Redirect } from 'react-router-dom';


function PrivateRoute({ isAuth, component: Component, calcStart, calcFinalSum, ...rest }) {
    return (
        <Route {...rest} render={
            routeProps => (
                isAuth ?
                    <Component calcStart={calcStart} calcFinalSum={calcFinalSum} {...routeProps}/>
                    :
                    <Redirect to="/auth" />
            )
        } />
    )
}



export default PrivateRoute;