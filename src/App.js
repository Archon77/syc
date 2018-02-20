import React, { Component } from 'react';
import axios from 'axios';

import TableInner from './components/TableInner';
import Header from './components/Header';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: [],
            finalSum: 0
        };
    
        this.calcFinalSum = this.calcFinalSum.bind(this);
    }
    
    calcFinalSum(finalSum) {
        this.setState({ finalSum })
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
                <Header finalSum={this.state.finalSum} />

                <main>
                    <div className="container">
                        <div className="table">

                            <TableInner head={true}
                                        table={this.state.table}/>

                            {this.state.table.map(month =>
                                <TableInner month={month.title}
                                            monthId={month.id}
                                            key={month.id}
                                            table={this.state.table}
                                            profit={month.profit}
                                            calcFinalSum={(val) => this.calcFinalSum(val)}
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
