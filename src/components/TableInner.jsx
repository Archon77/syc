import React, { Component } from 'react';

import TableCell from './TableCell'
import TableItem from './TableItem'

class TableInner extends Component {
    constructor(props){
        super(props);
    }
    headerBlock() {
        return (
            <div className="table__inner">
                <TableItem head={true} />
            </div>
        )
    }
    bodyBlock() {
        return (
            <div className="table__inner">
                <div className="table-item table-item--month">
                    <span>{this.props.month}</span>
                    <TableCell content={true}>124</TableCell>
                </div>
                {this.props.days.map(day =>
                    <TableItem key={day.id}
                               title={day.title}
                               table={this.props.table}
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