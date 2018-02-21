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
    
    
    
    render() {
        return(
            <div className="table__inner">
                <div className="table-item table-item--month">
                    <span>{this.props.month}</span>
                    <TableCell content={true}
                               onChange={(id, value) => this.onChange(value)}>{this.state.profit}</TableCell>
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
}

export default TableInner;