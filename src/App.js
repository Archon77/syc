import React, { Component } from 'react';
import axios from 'axios';

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
    
    onDaySelect(dayAdd) {
        this.setState({ dayAdd,
                        showDayModal: false });
        
        this.addDay(dayAdd);
    }
    
    //Добавление нового дня
    addDay(dayAdd) {
        
        let data = dayAdd.split('.');
        
        const day = data[0];
        const month = data[1];
        
        console.log(day);
        console.log(month);
        
        
        // let days = this.state.days;
        // const monthId = this.props.monthId;
        //Запрос даты при добавлении нового дня
        // let i = parseInt(prompt('Укажите день'), 10);
        // let i;
        
        //Существует ли уже этот день?
        //Ну просто должен быть нормальный return а не эта дичь. Переделать
        // function isDayInTable() {
        //     let b = false;
        //     days.forEach(item => {
        //         item.id == `${monthId}-${i}` ?  b = true : "" ;
        //     });
        //     return b;
        // }
        
        //Проверки введенного значения
        {/*if(i <= 0 || i > 31) {*/}
        {/*alert('Дата должна быть больше 0 и меньше 31');*/}
        // } else if (!i) {
        //     alert('Нужно ввести цифру');
        // } else if (isDayInTable()) {
        //     alert('Введенная дата уже существует');
        // } else {
        //     axios.post(`http://localhost:3000/api/data/table/`, { monthId, i })
        //         .then(response => response.data)
        //         .then(day => {
        //             //Добавление дня в массив
        //             const days = [...this.state.days, day];
        //
        //             //Сортировка на убывание
        //             days.sort((a,b) => {
        //                 if (a.title < b.title) return 1;
        //                 if (a.title > b.title) return -1;
        //             });
        //
        //             this.setState({ days });
        //         })
        //         .catch(error => console.error(error));
        //
        //     //Обновление табилцы, лучше обновлять без запроса, исходя из массива дней, но пока не соображу как
        //     axios.get('http://localhost:3000/api/data/table')
        //         .then(response => response.data)
        //         .then(table => this.setState({ table }))
        //         .catch(error => console.error(error));
        // }
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
                                            addNewDay={() => this.setState({ showDayModal: true })}
                                            calcStart={(load) => this.setState({ load })}
                                            calcFinalSum={(finalSum) => this.setState({ finalSum, load: false })}
                                            days={month.days} />
                            )}
                        </div>
                    </div>
                    
                    <Modal showDayModal={this.state.showDayModal}
                           onClose={() => this.setState({ showDayModal: false })}
                           onDaySelect={(dayAdd) => this.onDaySelect(dayAdd)} />
                </main>
            </div>
        );
    }
}

export default App;
