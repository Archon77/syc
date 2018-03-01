import React, { Component } from 'react';
import coin from '../img/coin.png';

class NotFound extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <main>
                <div className="container">
                    <div className="notFound">4 <img src={coin}/> 4</div>
                </div>
            </main>
        )
    }
}


export default NotFound;