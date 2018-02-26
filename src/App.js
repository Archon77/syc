import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import TableHeader from './components/TableHeader';
import TableInner from './components/TableInner';
import Header from './components/Header';
import Modal from './components/Modal';

import Home from './pages/Home'


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
        this.clearTable = this.clearTable.bind(this);
    }
    
    //Временно
    clearTable() {
        axios.put('http://localhost:3000/api/data/table/clear');
    
        this.jsonUpdate();
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
        //Первичная загрузка хедера, таблицы
        this.jsonUpdate();
    }
    
    jsonUpdate() {
        this.headerUpdate();
        this.tableUpdate();
    }
    
    headerUpdate() {
        axios.get('http://localhost:3000/api/data/header')
            .then(response => response.data)
            .then(header => this.setState({ header }))
            .catch(error => console.error(error.message));
    }
    
    tableUpdate() {
        axios.get('http://localhost:3000/api/data/table')
            .then(response => response.data)
            .then(table => this.setState({ table }))
            .catch(error => console.error(error.message));
    }
    
    
    
    render() {
        return (
            <Router>
                <div className="App">
                    {/*Хедер сайта*/}
                    <Header finalSum={this.state.finalSum}
                            load={this.state.load} />
        
                    <Content>
                        <Route path="/" component={Home} />
                    </Content>
                </div>
            </Router>
        );
    }
}

export default App;
