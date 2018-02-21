// import React, { Component } from 'react';
import React from 'react';

import TableCell from './TableCell'

function TableInner(props) {
    return(
        <div className="table__inner">
            <div className={'table-item table-item--head'}>
                <div className="table-item__inner">
                    {props.header.map(headerItem =>
                        <TableCell key={`h-${headerItem.id}`}>
                            {headerItem.title}
                        </TableCell>
                    )}
                </div>
                <div className="table-item__links">
                    <div className="table-item__link" onClick={() => props.addNewColumn()}>Добавить строку расходов</div>
                    <div className="table-item__link" onClick={() => props.addNewDay()}>Добавить день</div>
                </div>
            </div>
        </div>
    )
}

export default TableInner;