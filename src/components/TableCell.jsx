import React, { Component } from 'react';

class TableCell extends Component {
    constructor(props) {
        super(props);

        //isAdded - если значение добавляется, а не редактируется
        this.state = {
            value: this.props.val,
            oldValue: 0,
            disabled: true,
            isAdded: false
        };

        this.addValue = this.addValue.bind(this);
        this.editValue = this.editValue.bind(this);
        this.endEdit = this.endEdit.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let value = event.target.value;

        this.setState({ value });
    }

    //Добавление затрат
    addValue() {
    
        //Записываем текущее значение в oldValue, после чего обнуляем
        this.setState({
            oldValue: this.state.value,
            value: 0,
            disabled: false,
            isAdded: true
        });

        setTimeout(()=> {
            this.valueInput.focus();
        }, 1);
    }
    
    //Редактирование затрат
    editValue() {
        this.setState({
            disabled: false
        });

        setTimeout(()=> {
            this.valueInput.focus();
        }, 1);
    }
    
    endEdit() {

        if(this.state.isAdded) {
            
            //Суммируем введеное и старое значения
            let sumValue = parseInt(this.state.value, 10) + parseInt(this.state.oldValue, 10);
    
            //Все значения выставляем по последней сумме, отключаем "суммирование"
            this.setState({
                oldValue: sumValue,
                value: sumValue,
                isAdded: false
            });
            
            //Отправляем id измененной ячейки и последнюю сумму
            this.props.onChange(this.valueInput.id, sumValue);
        } else {
            
            //Отправляем id измененной ячейки и отредактированное значение
            this.props.onChange(this.valueInput.id, this.state.value);
        }
    
        //Отключаем редактирование
        this.setState({
            disabled: true
        });
    }
    
    //Закончить ввод по Enter'у
    handleKeyPressed(e) {
        if(e.key === 'Enter') {
            this.endEdit();
        }
    }

    render() {
        return(
            <div className={`table-item-cell${!this.state.disabled ? ' table-item-cell--unlocked' : ''}${this.props.sum ? ' table-item-cell--sum' : ''}`}>
                {this.props.content ?
                    <div className={'table-item-cell__inner table-item-cell__inner--content'}>
                        <i className="material-icons"
                           title="Добавить $"
                           onClick={this.addValue}>add</i>
                        <input defaultValue={this.props.children}
                               type="number"
                               disabled={this.state.disabled}
                               value={this.state.value}
                               onChange={this.handleChange}
                               id={this.props.id}
                               ref={(input) => {this.valueInput = input}}
                               onBlur={this.endEdit}
                               onKeyPress={this.handleKeyPressed}
                        />
                        <i className="material-icons"
                           title="Отредактировать $"
                           onClick={this.editValue}>create</i>
                    </div>
                    :
                    <div className="table-item-cell__inner">
                        <span>{this.props.children}</span>
                    </div>
                }
            </div>
        );
    }
}

export default TableCell;