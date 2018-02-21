import React, { Component } from 'react';
import axios from 'axios';

import TableInner from './components/TableInner';
import Header from './components/Header';


class App extends Component {
    constructor(props) {
        super(props);

        //load - обновляется ли итоговая сумма, отображение лоадера
        this.state = {
            table: [],
            finalSum: 0,
            load: false
        };
    }
    
    componentDidMount() {
        //Первичная загрузка таблицы
        axios.get('http://localhost:3000/api/data/table')
            .then(response => response.data)
            .then(table => this.setState({ table }))
            .catch(error => console.error(error.message));
    }
    
    
    
    render() {
        return (
            <div className="App">
                <Header finalSum={this.state.finalSum}
                        load={this.state.load} />

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
                                            calcStart={(load) => this.setState({ load })}
                                            calcFinalSum={(finalSum) => this.setState({ finalSum, load: false })}
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
