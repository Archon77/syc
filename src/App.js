import React, { Component } from 'react';
import axios from 'axios';

import TableInner from './components/TableInner';
import Header from './components/Header';


class App extends Component {
    constructor(props) {
        super(props);
        
        // console.log();
    
        // this.props.table.forEach(function (item) {
        //     console.log(item);
        // });

        this.state = {
            table: []
        };
    }
    
    componentDidMount() {
        axios.get('http://localhost:3000/api/data/table')
            .then(response => response.data)
            .then(table => this.setState({ table }))
            .catch(error => console.error(error.message));
    }
    
    render() {
        return (
            <div className="App">
                <Header />

                <main>
                    <div className="container">
                        <div className="table">

                            <TableInner head={true} />

                            {this.state.table.map(month =>
                                <TableInner month={month.title}
                                            key={month.id}
                                            table={this.state.table}
                                            days={month.days} />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
