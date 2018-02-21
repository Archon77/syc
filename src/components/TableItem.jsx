import React, { Component } from 'react';
import axios from 'axios';

import TableCell from './TableCell'

class TableItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: this.props.table,
            value: this.props.value
        };

        this.onChange = this.onChange.bind(this);
        this.calcSum = this.calcSum.bind(this);
        this.finalSum = this.finalSum.bind(this);
    }
    
    componentDidMount() {
        //Отвечает за то будет обновлена страница или нет, т.к. при инициализации на каждой итерации таблица не изменяется - её не подргужаем
        //Иначе "this.onChange" в 3м параметре передается false
        let init = true;
        
        this.calcSum(this.props.value, init);
    }

    //onChange ячеек расходов
    onChange(id, val) {
        //Т.к. произошли изменения значений - выставляем лоадер на finalSum
        if(this.props.calcStart) {
            this.props.calcStart(true);
        }
        
        //Отправляем id измененной ячейки и новое значение
        axios.put(`http://localhost:3000/api/data/table/${id}`, { val })
            .then(response => {
                let value = this.state.value.map(input => {
                    
                    //Обновление значения ячейки на значение из res
                    if(input.id === id) {
                        input.val = parseInt(response.data.val, 10);
                    }

                    return input
                });

                this.calcSum(value);
                this.setState({ value });
            })
            .catch(error => console.error(error));
    }

    //Сумма расходов дня
    calcSum(values, init) {
        this.sum = 0;
        
        if(values !== undefined) {
            values.map(value => {
                this.sum += parseInt(value.val, 10);
            })
        }
        
        this.finalSum(init);
    }
    
    //Пересчет итоговой суммы
    finalSum(init) {
        let sum = 0;
    
        let calculation = () => {
            this.state.table.map(month => {
                month.days.map(day => {
                    day.value.map(val => {
                        sum -= val.val;
                    })
                })
            });
            if(this.props.calcFinalSum) {
                this.props.calcFinalSum(sum);
            }
        };
        
        //Коммент выше в componentDidMount
        if(init) {
            calculation();
        } else {
            //Обновление таблицы на случай добавления нового дня
            axios.get('http://localhost:3000/api/data/table')
                .then(response => response.data)
                .then(table => {
                    this.setState({ table });
                    calculation();
                })
                .catch(error => console.error(error));
        }
    }
    
    
    
    render() {
        return(
            <div className={'table-item'}>
                <div className="table-item__inner">
                    <TableCell>{this.props.title}</TableCell>
                    {this.props.value.map(cell =>
                        <TableCell key={cell.id}
                                   id={cell.id}
                                   onChange={(id, value) =>  this.onChange(id, value, false)}
                                   val={cell.val}
                                   content={true} />
                    )}
                    <TableCell sum={true}>{this.sum}</TableCell>
                </div>
            </div>
        );
    }
}

export default TableItem;