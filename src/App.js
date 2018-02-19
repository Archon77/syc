import React, { Component } from 'react';
import axios from 'axios';

import TableInner from './components/TableInner';
import Header from './components/Header';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: []
        };
        
        
        // this.tableUpdate = this.tableUpdate.bind(this);
    }
    
    componentDidMount() {
        axios.get('http://localhost:3000/api/data/table')
            .then(response => response.data)
            .then(table => {
                this.setState({ table }) ;
                window.table = this.state.table;
            })
            .catch(error => console.error(error.message));
    }
    
    // tableUpdate(table) {
    //     axios.post('http://localhost:3000/api/data/table', { table })
    //         .catch(error => console.error(error));
    // }
    
    render() {
        return (
            <div className="App">
                <Header />

                <main>
                    <div className="container">
                        <div className="table">

                            <TableInner head={true}
                                        table={this.state.table}/>

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
