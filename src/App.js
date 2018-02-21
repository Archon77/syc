import React, { Component } from 'react';
import axios from 'axios';

import TableHeader from './components/TableHeader';
import TableInner from './components/TableInner';
import Header from './components/Header';
import Modal from './components/Modal';


class App extends Component {
    constructor(props) {
        super(props);

        //load - обновляется ли итоговая сумма, отображение лоадера
        //dayAdd - последний добавленный день
        this.state = {
            table: [],
            finalSum: 0,
            showDayModal: false,
            dayAdd: undefined,
            load: false
        };
        
        this.onDaySelect = this.onDaySelect.bind(this);
        this.addDay = this.addDay.bind(this);
    }
    
    onDaySelect(day, month) {
        this.setState({ dayAdd: day,
                        showDayModal: false });
        
        this.addDay(day, month);
    }
    
    //Добавление нового дня
    addDay(day, month) {
        axios.post(`http://localhost:3000/api/data/table/`, { day, month })
            .then(response => response.data)
            .then(table => this.setState({table}))
            // .then(day => {
                // //Добавление дня в массив
                // const days = [...this.state.days, day];
                //
                // //Сортировка на убывание
                // days.sort((a,b) => {
                //     if (a.title < b.title) return 1;
                //     if (a.title > b.title) return -1;
                // });
    
                // this.setState({ days });
            // })
            .catch(error => console.error(error));
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
                            
                            <TableHeader addNewDay={() => this.setState({ showDayModal: true })} />
                            
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
                    
                    <Modal showDayModal={this.state.showDayModal}
                           table={this.state.table}
                           onClose={() => this.setState({ showDayModal: false })}
                           onDaySelect={(day, month) => this.onDaySelect(day, month)} />
                </main>
            </div>
        );
    }
}

export default App;
