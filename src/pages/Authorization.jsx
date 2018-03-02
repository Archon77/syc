import React, { Component } from 'react';

class Authorization extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isAuth: this.props.isAuth,
            login: '',
            loginError: false,
            password: '',
            passwordError: false,
            errorText: ''
        };
        
        this.formSubmit = this.formSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    formSubmit(event) {
        event.preventDefault();
        
        //Сброс error'ов
        this.setState({ errorText: '', loginError: false, passwordError: false });
        
        //Валидация
        if(!this.state.login && !this.state.password) {
            let errorText  = 'Заполните логин и пароль';
            
            this.setState({ errorText, loginError: true, passwordError: true })
        } else if (!this.state.login) {
            let errorText  = 'Заполните логин';
    
            this.setState({ errorText, loginError: true})
        } else if (!this.state.password) {
            let errorText  = 'Заполните пароль';
    
            this.setState({ errorText, passwordError: true})
        } else {
            this.setState({ login: '', password: '' });
            this.props.onAuth()
        }
    }
    
    handleChange(event) {
        let value = event.target.value;
        
        this.setState({ [event.target.id]: value });
    }
    
    
    
    render() {
        return(
            <main>
                <div className="container">
                    <div className="auth">
                        <form action="auth__form" onSubmit={value => this.formSubmit(value)}>
                            <div className="auth__inner">
                                <input type="text"
                                       id="login"
                                       className={`auth__input ${this.state.loginError ? 'error' : ''}`}
                                       placeholder="Логин"
                                       defaultValue={this.state.login}
                                       onChange={event => this.handleChange(event)}/>
                                <input type="password"
                                       id="password"
                                       className={`auth__input ${this.state.passwordError ? 'error' : ''}`}
                                       placeholder="Пароль"
                                       defaultValue={this.state.password}
                                       onChange={event => this.handleChange(event)}/>
                                <button className="auth__btn">Войти</button>
                                {this.state.errorText ?
                                    <p id="error" className="auth__error">{this.state.errorText}</p>
                                    :
                                    ''
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        )
    }
}


export default Authorization;