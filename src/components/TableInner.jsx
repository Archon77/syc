import React, { Component } from 'react';
import axios from 'axios';

import TableCell from './TableCell'
import TableItem from './TableItem'

class TableInner extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            days: this.props.days
        };
        
        this.addDay = this.addDay.bind(this);
    }
    headerBlock() {
        return (
            <div className="table__inner">
                <TableItem head={true}
                           table={this.props.table}/>
            </div>
        )
    }
    addDay() {
        let days = this.state.days;
        const monthId = this.props.monthId;
        let i = parseInt(prompt('Укажите день'), 10);
        
        function isDayInTable() {
            let b = false;
            days.forEach(item => {
                item.id == `${monthId}-${i}` ?  b = true : "" ;
            });
            return b;
        };
        
        if(i <= 0) {
            alert('Дата должна быть больше 0 =/');
        } else if (!i) {
            alert('Введите цифрой >_<');
        } else if (isDayInTable()) {
            alert('Введенная дата уже существует');
        } else {
            axios.post(`http://localhost:3000/api/data/table/`, { monthId, i })
                .then(response => response.data)
                .then(day => {
                    const days = [...this.state.days, day];
    
                    days.sort((a,b) => {
                        if (a.title > b.title) return 1;
                        if (a.title < b.title) return -1;
                    });
            
                    this.setState({ days });
                })
                .catch(error => console.error(error));
        }
    }
    bodyBlock() {
        return (
            <div className="table__inner">
                <div className="table-item table-item--month">
                    <span>{this.props.month}</span>
                    <TableCell content={true}>{this.props.profit}</TableCell>
                    <i className="material-icons"
                       title="Добавить день"
                       onClick={this.addDay}>add</i>
                </div>
                {this.state.days.map(day =>
                    <TableItem key={day.id}
                               title={day.title}
                               table={this.props.table}
                               calcFinalSum={(val) => this.props.calcFinalSum(val)}
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