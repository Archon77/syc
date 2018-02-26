import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home'
import Archive from './pages/Archive'
import Statistics from './pages/Statistics'
import Authorization from './pages/Authorization'
import NotFound from './pages/404'

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            finalSum: 0,
            load: false
        }
    }
    
    
    
    render() {
        return (
            <Router>
                <div className="App">
                    {/*Хедер сайта*/}
                    <Header finalSum={this.state.finalSum}
                            load={this.state.load} />
    
                    <Route exact
                           path="/"
                           render={routeProps => <Home {...routeProps}
                                                       calcStart={(load) => this.setState({ load })}
                                                       calcFinalSum={(finalSum, load) => this.setState({ finalSum, load })} />} />
                    <Route path="/archive"
                           component={Archive} />
                    <Route path="/statistics"
                           component={Statistics} />
                    <Route path="/auth"
                           component={Authorization} />
                    {/*<Route component={NotFound} />*/}
                </div>
            </Router>
        );
    }
}

export default App;
