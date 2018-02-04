import React, { Component } from 'react';

class TableCell extends Component {
    constructor(props) {
        super(props);

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


    addValue() {
        this.setState({
            value: this.state.value,
            disabled: false,
            isAdded: true
        });

        this.setState({
            oldValue: this.state.value,
            value: 0
        });

        setTimeout(()=> {
            this.valueInput.focus();
        }, 1);
    }
    editValue() {
        this.setState({
            disabled: false
        });

        setTimeout(()=> {
            this.valueInput.focus();
        }, 1);
    }
    endEdit() {
        let summValue = 0;

        if(this.state.isAdded) {
            summValue = parseInt(this.state.value, 10) + parseInt(this.state.oldValue, 10);

            this.setState({
                oldValue: summValue,
                value: summValue,
                isAdded: false
            });

            this.props.onChange(this.valueInput.id, summValue);
        } else {
            this.props.onChange(this.valueInput.id, this.state.value);
        }

        this.setState({
            disabled: true
        });
    }

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
                               // onChange={this.handleChange}
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