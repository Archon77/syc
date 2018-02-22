import React, { Component } from 'react';
import axios from 'axios';

import TableHeader from './components/TableHeader';
import TableInner from './components/TableInner';
import Header from './components/Header';
import Modal from './components/Modal';


class App extends Component {
    constructor(props) {
        super(props);

        //dayAdd - последний добавленный день
        //showModal - отображение модалки
        //showDayModal, showNewColumnModal - влияют на контент модалки
        //load - обновляется ли итоговая сумма, отображение лоадера
        this.state = {
            table: [],
            header: [],
            finalSum: 0,
            showModal: false,
            showDayModal: false,
            showNewColumnModal: false,
            dayAdd: undefined,
            load: false
        };
        
        this.onDaySelect = this.onDaySelect.bind(this);
        this.addDay = this.addDay.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.tableUpdate = this.tableUpdate.bind(this);
    }
    
    addColumn() {
        this.setState({ showModal: true,
                        showNewColumnModal: true });
    }
    
    onFormSubmit(title) {
        axios.post('http://localhost:3000/api/data/header/', { title } )
            .then(response => response.data)
            .then(header => this.setState ({ header }))
            .catch(error => console.error(error));
    
        this.tableUpdate();
    }
    
    onDaySelect(day, month) {
        this.setState({ dayAdd: day,
                        showDayModal: false });
        
        this.addDay(day, month);
    }
    
    //Добавление нового дня
    addDay(day, month) {
    
        //Пул месяцев для определения monthTitle и передачи на создание нового месяца
        const monthList = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];
        let monthTitle = monthList[month - 1];
        
        axios.post(`http://localhost:3000/api/data/table/`, { day, month, monthTitle })
            .then(response => response.data)
            .then(table => this.setState({table}))
            .catch(error => console.error(error));
    }
    
    componentDidMount() {
        //Первичная загрузка хедера
        axios.get('http://localhost:3000/api/data/header')
            .then(response => response.data)
            .then(header => this.setState({ header }))
            .catch(error => console.error(error.message));
        
        //Первичная загрузка таблицы
        this.tableUpdate();
    }
    
    tableUpdate() {
        axios.get('http://localhost:3000/api/data/table')
            .then(response => response.data)
            .then(table => this.setState({ table }))
            .catch(error => console.error(error.message));
    }
    
    
    
    render() {
        return (
            <div className="App">
                {/*Хедер сайта*/}
                <Header finalSum={this.state.finalSum}
                        load={this.state.load} />

                <main>
                    <div className="container">
                        <div className="table">
    
                            {/*Хедер таблицы*/}
                            <TableHeader addNewDay={() => this.setState({ showModal: true, showDayModal: true })}
                                         addNewColumn={() => this.addColumn()}
                                         header={this.state.header} />
                            
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
                           showNewColumnModal={this.state.showNewColumnModal}
                           showModal={this.state.showModal}
                           table={this.state.table}
                           onClose={() => this.setState({ showModal: false, showNewColumnModal: false, showDayModal: false})}
                           onFormSubmit={(title) => this.onFormSubmit(title)}
                           onDaySelect={(day, month) => this.onDaySelect(day, month)} />
                </main>
            </div>
        );
    }
}

export default App;
