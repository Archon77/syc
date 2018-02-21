import React, { Component } from 'react';
import axios from 'axios';

import TableCell from './TableCell'
import TableItem from './TableItem'

class TableInner extends Component {
    constructor(props){
        super(props);
        
        //table - вся таблица целиком
        //days - дни этого месяца
        //profit - сабж
        //sum - сумма текущих расходов, обновляется при изменениях расходов, используется для пересчета FinalSum при изменении профита
        this.state = {
            table: this.props.table,
            days: this.props.days,
            profit: this.props.profit,
            sum: 0
        };
        
        this.addDay = this.addDay.bind(this);
        this.onChange = this.onChange.bind(this);
        this.calcFinalSum = this.calcFinalSum.bind(this);
    }
    
    //onChange профита
    onChange(val) {
        const monthId = this.props.monthId;
        
        axios.put('http://localhost:3000/api/data/table/', { monthId, val })
            .then(response => response.data)
            .then(table => {
                this.setState({ table,
                                profit: val  });
                this.calcFinalSum(this.state.sum);
            })
            .catch(error => console.error(error));
    }
    
    //Подсчет итоговой суммы с учетом профита
    calcFinalSum(val) {
        let sum = 0;
        
        this.state.table.map(month => {
            sum += month.profit;
        });
    
        this.setState({ sum: val });
        
        val += sum;
        
        this.props.calcFinalSum(val);
    }
    
    //Добавление нового дня
    addDay() {
        let days = this.state.days;
        const monthId = this.props.monthId;
        //Запрос даты при добавлении нового дня
        let i = parseInt(prompt('Укажите день'), 10);
        
        console.log(i);
    
        //Существует ли уже этот день?
        //Ну просто должен быть нормальный return а не эта дичь. Переделать
        function isDayInTable() {
            let b = false;
            days.forEach(item => {
                item.id == `${monthId}-${i}` ?  b = true : "" ;
            });
            return b;
        }
    
        //Проверки введенного значения
        if(i <= 0 || i > 31) {
            alert('Дата должна быть больше 0 и меньше 31');
        } else if (!i) {
            alert('Нужно ввести цифру');
        } else if (isDayInTable()) {
            alert('Введенная дата уже существует');
        } else {
            axios.post(`http://localhost:3000/api/data/table/`, { monthId, i })
                .then(response => response.data)
                .then(day => {
                    //Добавление дня в массив
                    const days = [...this.state.days, day];
    
                    //Сортировка на убывание
                    days.sort((a,b) => {
                        if (a.title < b.title) return 1;
                        if (a.title > b.title) return -1;
                    });
            
                    this.setState({ days });
                })
                .catch(error => console.error(error));
    
            //Обновление табилцы, лучше обновлять без запроса, исходя из массива дней, но пока не соображу как
            axios.get('http://localhost:3000/api/data/table')
                .then(response => response.data)
                .then(table => this.setState({ table }))
                .catch(error => console.error(error));
        }
    }
    
    
    //render
    headerBlock() {
        return (
            <div className="table__inner">
                <TableItem head={true}
                           table={this.props.table}/>
            </div>
        )
    }
    bodyBlock() {
        return (
            <div className="table__inner">
                <div className="table-item table-item--month">
                    <span>{this.props.month}</span>
                    <TableCell content={true}
                               onChange={(id, value) => this.onChange(value)}>{this.state.profit}</TableCell>
                    <i className="material-icons"
                       title="Добавить день"
                       onClick={this.addDay}>add</i>
                </div>
                {this.state.days.map(day =>
                    <TableItem key={day.id}
                               title={day.title}
                               table={this.state.table}
                               calcStart={(load) => this.props.calcStart(load)}
                               calcFinalSum={(val) => this.calcFinalSum(val)}
                               value={day.value}/>
                )}
            </div>
        )
    }
    render() {
        return(
            this.props.head ? this.headerBlock() : this.bodyBlock()
        )
    }
}

export default TableInner;