import React, { Component } from 'react';

import TableCell from './TableCell'
import header from '../../api/data/header'

class TableItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: this.props.table,
            header: []
        };

        this.addCell = this.addCell.bind(this);
        this.onChange = this.onChange.bind(this);
        this.calcSumm = this.calcSumm.bind(this);

        this.calcSumm();
    }

    onChange(id, val) {
        let table = this.state.table.map(month => {
            month.days.map(day => {
                day.value.map(input => {

                    if(input.id === id) {
                        input.val = val;
                    }

                    return input
                });
                return day
            });
            return month
        });

        this.setState({ table });
        this.calcSumm();
    }

    calcSumm() {
        this.sum = 0;

        let values = this.props.value;

        if(values !== undefined) {
            values.map(value => {
                this.sum += parseInt(value.val, 10);
            })
        }
    }

    addCell() {
        console.log('добавление ячейки')
    }

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
                                   onChange={(id, value) =>  this.onChange(id, value)}
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