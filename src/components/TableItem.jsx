import React, { Component } from 'react';
import axios from 'axios';

import TableCell from './TableCell'
import header from '../api/data/header'

class TableItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: this.props.table,
            header: [],
            value: this.props.value
        };

        this.addCell = this.addCell.bind(this);
        this.onChange = this.onChange.bind(this);
        this.calcSum = this.calcSum.bind(this);
        this.finalSum = this.finalSum.bind(this);
    }
    
    componentDidMount() {
        //Отвечает за необходимость обновления таблицы, т.к. при инициализации на каждой итерации таблица не изменяется - её не подргужаем
        //Иначе "this.onChange" в 3м параметре передается false
        let init = true;
        
        this.calcSum(this.props.value, init);
    }

    onChange(id, val) {
        axios.put(`http://localhost:3000/api/data/table/${id}`, { val })
            .then(response => {
                let value = this.state.value.map(input => {

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

    calcSum(value, init) {
        if(this.props.calcStart) {
            console.log('calcStart');
            this.props.calcStart(true);
        }
        
        this.sum = 0;

        let values = value;

        if(values !== undefined) {
            values.map(value => {
                this.sum += parseInt(value.val, 10);
            })
        }
        
        this.finalSum(init);
    }
    
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

    addCell() {
        console.log('добавление столбца')
    }
    
    
    //render
    headerBlock() {
        return (
            <div className={'table-item table-item--head'}>
                <div className="table-item__inner">
                    {header.map(headerItem =>
                        <TableCell key={headerItem.id}>
                            {headerItem.title}
                        </TableCell>
                    )}
                    <i className="material-icons"
                       title="Добавить строку расходов"
                       onClick={this.addCell}>add</i>
                </div>
            </div>
        )
    }
    bodyBlock() {
        return (
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
        )
    }
    render() {
        return(
            this.props.head ? this.headerBlock() : this.bodyBlock()
        );
    }
}

export default TableItem;