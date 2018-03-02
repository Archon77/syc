// import React, { Component } from 'react';
import React from 'react';
import { NavLink } from 'react-router-dom';

import loader from '../img/loader.svg';

function Header(props) {
    return(
        <header>
            <div className="header">
                <div className="container">
                    <div className="header__inner">
                        <div className="header__sum">
                            {props.load ? <img src={loader} /> : `${props.finalSum} р.`}
                        </div>
                        <div className="header-nav">
                            <NavLink to="/" exact className="header-nav__item">Таблица расходов</NavLink>
                            {/*<NavLink to="/archive" className="header-nav__item">Архив</NavLink>*/}
                            <NavLink to="/statistics" className="header-nav__item">Статистика</NavLink>
                            {!props.isAuth ?
                                <NavLink to="/auth" className="header-nav__item">
                                    Авторизация
                                </NavLink>
                                :
                                <div className="header-nav__item" onClick={() => props.onLogout()}>Выход</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;