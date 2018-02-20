import React, { Component } from 'react';
import axios from 'axios';

import TableCell from './TableCell'
import TableItem from './TableItem'

class TableInner extends Component {
    constructor(props){
        super(props);
        
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
    headerBlock() {
        return (
            <div className="table__inner">
                <TableItem head={true}
                           table={this.props.table}/>
            </div>
        )
    }
    
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
    
    calcFinalSum(val) {
        // console.log(this.state.sum);
        
        let sum = 0;
        
        this.state.table.map(month => {
            sum += month.profit;
        });
    
        this.setState({ sum: val });
        
        val += sum;
        
        this.props.calcFinalSum(val);
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
        }
        
        if(i <= 0 || i > 31) {
            alert('Дата должна быть больше 0 и меньше 31');
        } else if (!i) {
            alert('Введите цифру >_<');
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
    
    
            axios.get('http://localhost:3000/api/data/table')
                .then(response => response.data)
                .then(table => this.setState({ table }))
                .catch(error => console.error(error));
        }
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