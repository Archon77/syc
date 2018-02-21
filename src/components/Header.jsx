// import React, { Component } from 'react';
import React from 'react';

import loader from '../icons/loader.svg';


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
                            <a href="javascript.void(0)" className="header-nav__item">
                                Таблица
                            </a>
                            <a href="javascript.void(0)" className="header-nav__item">
                                Архив
                            </a>
                            <a href="javascript.void(0)" className="header-nav__item">
                                Статистика
                            </a>
                            <a href="javascript.void(0)" className="header-nav__item">
                                Логин
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;