import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        
        //fadeOut - анимация модалки
        //showFormBtn - скрываем btn при пустом инпуте
        this.state = {
            fadeOut: false,
            inputText: '',
            error: undefined
        };
        
        this.closeModal = this.closeModal.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.dayModal = this.dayModal.bind(this);
        this.columnModal = this.columnModal.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidUpdate() {
        if(this.props.showNewColumnModal) {
            this.input.focus();
        }
    }
    
    formSubmit(event) {
        event.preventDefault();
        let newColumnTitle = this.state.inputText;
            
        this.props.onFormSubmit(newColumnTitle);
        this.props.onClose();
        this.setState({ inputText: '' });
    }
    
    handleChange(event) {
        let inputText = event.target.value;
    
        this.setState({ inputText });
    }
    
    //Сохранение выбранного дня, закрытие модалки
    handleDayClick(selectedDay) {
        selectedDay = selectedDay.toLocaleDateString();
    
        let data = selectedDay.split('.');
        let day = parseInt(data[0], 10);
        let month = parseInt(data[1], 10);
        let year = parseInt(data[2], 10);
    
        // Этот день уже существует?
        // Ну просто должен быть нормальный return а не эта дичь. Переделать
        let isDayExist = () => {
            let b = false;
            
            this.props.table.map(_month => {
                _month.days.map(_day => {
                    _day.id === `${month}-${day}` ?  b = true : "" ;
                })
            });
            
            return b;
        };
        
        //Валидация
        if(isDayExist()) {
            this.setState({ error: 'Выбраная дата уже существует' })
        } else if(year != 2018) {
            this.setState({ error: 'Пока работает только для 2018. Для остальных годов, скорее всего, будет архив' })
        } else {
            this.closeModal();
            
            this.setState({ error: undefined });
                        
            // Сохраняем выбранный день в App
            this.props.onDaySelect(day, month);
        }
    }
    
    //"Плавное" закрытие модалки
    closeModal() {
        this.setState({ fadeOut: true });
        
        setTimeout(()=> {
            this.setState({ fadeOut: false});
            this.props.onClose();
        }, 200)
    }
    
    
    
    //render
    dayModal() {
        return(
            <div className="modal__content">
                <div className="modal__header">
                    <div className="modal__title">
                        Выберите дату
                    </div>
                    <i className="modal__cross material-icons" onClick={this.closeModal}>clear</i>
                </div>
                <div className="modal__day-picker">
                    <DayPicker onDayClick={this.handleDayClick} />
                </div>
                {this.state.error ?
                    <div className="modal__error">
                        {this.state.error}
                    </div>
                    :
                    ''
                }
            </div>
        )
    }
    columnModal() {
        return(
            <div className="modal__content">
                <div className="modal__header">
                    <div className="modal__title">
                        Введите заголовок
                    </div>
                    <i className="modal__cross material-icons" onClick={this.closeModal}>clear</i>
                </div>
                <form className="modal__form" onSubmit={value => this.formSubmit(value)}>
                    <input className="modal__input"
                           type="text"
                           defaultValue={this.state.inputText}
                           onChange={event => this.handleChange(event)}
                           ref={(input) => {this.input = input}}
                           placeholder="Заголовок новой строки расходов" />
                    <button className={`modal__btn ${this.state.inputText ? 'modal__btn--show' : ''}`}>
                        <i className="material-icons">done</i>
                    </button>
                </form>
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.props.showModal ?
                    <div className={`modal ${this.state.fadeOut ? 'modal--fade-out' : 'modal--fade-in'}`}>
                        {this.props.showDayModal ? this.dayModal() : this.columnModal()}
                        <div className="modal__mask" onClick={this.closeModal}></div>
                    </div>
                    :
                    ''
                }
            </div>
        )
    }
}

export default Modal;