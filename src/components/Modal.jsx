import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        
        //fadeOut - анимация скрытия модалки
        this.state = {
            fadeOut: false,
            error: undefined
        };
        
        this.closeModal = this.closeModal.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
    }
    
    //Сохранение выбранного дня, закрытие модалки
    handleDayClick(selectedDay) {
        selectedDay = selectedDay.toLocaleDateString();
    
        let data = selectedDay.split('.');
        let day = parseInt(data[0], 10);
        let month = parseInt(data[1], 10);
    
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
        
        if(isDayExist()) {
            this.setState({ error: 'Выбраная дата уже существует' })
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
                            {this.state.error ?
                                <div className="modal__error">
                                    {this.state.error}
                                </div>
                                :
                                ''
                            }
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