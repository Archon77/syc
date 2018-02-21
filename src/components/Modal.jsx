import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        
        //fadeOut - анимация скрытия модалки
        this.state = {
            fadeOut: false
        };
        
        this.closeModal = this.closeModal.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
    }
    
    //Сохранение выбранного дня, закрытие модалки
    handleDayClick(day) {
        
        //Сохраняем выбранный день в App
        this.props.onDaySelect(day.toLocaleDateString());
        
        this.closeModal();
    }
    
    //"Плавное" закрытие модалки
    closeModal() {
        this.setState({ fadeOut: true });
        
        setTimeout(()=> {
            this.setState({ fadeOut: false});
            this.props.onClose();
        }, 200)
    }
    
    
    
    render() {
        return (
            <div>
                {this.props.showDayModal ?
                    <div className={`modal ${this.state.fadeOut ? 'modal--fade-out' : 'modal--fade-in'}`}>
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
                        </div>
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