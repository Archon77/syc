import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home'
// import Archive from './pages/Archive'
import Statistics from './pages/Statistics'
import Authorization from './pages/Authorization'
import NotFound from './pages/404'

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            auth: false,
            finalSum: initFinalSum(),
            load: false
        };
        
        this.login = this.login.bind(this);
        
        function initFinalSum() {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + 'finalSum'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? matches[1] : 0;
        }
    }
    
    login() {
        this.setState({ auth: true }, ()=> this.props.history.push('/'));
    }

    render() {
        return (
            <div className="App">
                {/*Хедер сайта*/}
                <Header finalSum={this.state.finalSum}
                        isAuth={this.state.auth}
                        onLogout={() => this.setState({ auth: false })}
                        load={this.state.load} />

                <Switch>
                    <PrivateRoute exact
                                  path="/"
                                  isAuth={this.state.auth}
                                  calcStart={(load) => this.setState({ load })}
                                  calcFinalSum={(finalSum, load) => this.setState({ finalSum, load })}
                                  component={Home}/>}
                    
                    {/*<PrivateRoute path="/archive"*/}
                                  {/*isAuth={this.state.auth}*/}
                                  {/*component={Archive} />*/}
                    
                    <PrivateRoute path="/statistics"
                                  isAuth={this.state.auth}
                                  component={Statistics} />
                    
                    <Route path="/auth"
                           render={routeProps => <Authorization onAuth={() => this.login()} isAuth={this.state.auth}/>}/>
                    
                    <Route component={NotFound} />
                    
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
