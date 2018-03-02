import React, { Component } from 'react';
import axios from 'axios';

import TableHeader from '../components/TableHeader';
import TableInner from '../components/TableInner';
import Modal from '../components/Modal';


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

class Home extends Component {
    constructor(props) {
        super(props);
        
        console.log('Home', props);
        
        //dayAdd - последний добавленный день
        //showModal - отображение модалки
        //showDayModal, showNewColumnModal - влияют на контент модалки
        //load - обновляется ли итоговая сумма, отображение лоадера
        this.state = {
            table: [],
            header: [],
            showModal: false,
            showDayModal: false,
            showNewColumnModal: false,
            dayAdd: undefined
        };
        
        this.onDaySelect = this.onDaySelect.bind(this);
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
            <main>
                <div className="container">
                    <div className="table">
                    
                        {/*Хедер таблицы*/}
                        <TableHeader addNewDay={() => this.setState({ showModal: true, showDayModal: true })}
                                     addNewColumn={() => this.addColumn()}
                                     clearTable={() => this.clearTable()}
                                     header={this.state.header} />
                    
                        {this.state.table.map(month =>
                            <TableInner month={month.title}
                                        monthId={month.id}
                                        key={month.id}
                                        table={this.state.table}
                                        profit={month.profit}
                                        calcFinalSum={(finalSum) => this.props.calcFinalSum(finalSum, false)}
                                        calcStart={(load) => this.props.calcStart(load)}
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
        )
    }
}

export default Home;