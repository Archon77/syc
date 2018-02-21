import React, { Component } from 'react';

import header from '../api/data/header'
import TableCell from './TableCell'

class TableInner extends Component {
    constructor(props) {
        super(props);
        
        this.addCell = this.addCell.bind(this);
    }
    
    addCell() {
        console.log('добавление столбца')
    }
    
    render() {
        return(
            <div className="table__inner">
                <div className={'table-item table-item--head'}>
                    <div className="table-item__inner">
                        {header.map(headerItem =>
                            <TableCell key={`h-${headerItem.id}`}>
                                {headerItem.title}
                            </TableCell>
                        )}
                    </div>
                    <div className="table-item__links">
                        <div className="table-item__link" onClick={this.addCell}>Добавить строку расходов</div>
                        <div className="table-item__link" onClick={() => this.props.addNewDay()}>Добавить день</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TableInner;