import React, { Component } from 'react';
import axios from 'axios';
import { PieChart, Legend, BarChart } from 'react-easy-chart';

/* pie's style's */
const customStyle = {
    '.legend': {
        backgroundColor: '#f9f9f9',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        fontSize: '0.8em',
        maxWidth: '300px',
        padding: '12px'
    }
};

class Statistics extends Component {
    constructor(props) {
        super(props);
        
        //cytYear - currentTableYear
        //cytMonthDay - диаграмма день/расход в течении выбранного месяца
        //cytMonthIoE - пирожок месяца по статьям расходов в течении выбранного месяца
        //сtDataDisplay - выбранный месяц
        //cytDataDisplayTitle - заголовок выбранного месяца
        this.state = {
            currentYearTitle: '2018',
            currentYearTable: '',
            cytYear: '',
            cytMonthDay: '',
            cytMonthIoE: '',
            cytMonthIoETitle: '',
            cytDataDisplay: '',
            cytDataDisplayTitle: ''
        };
    
    
        this.cytMonthSelect = this.cytMonthSelect.bind(this);
    }
        
    //item of expenditure  - пирожок по статьям расходов
    
    componentDidMount() {
        let cytYear = [];
        let cytMonthIoE = [];
    
        axios.get('http://localhost:3000/api/data/header')
            .then(response => response.data)
            .then(header => {
                let cytHeader = header.slice(1, header.length - 1);
    
                cytHeader.forEach(item => {
                    let cytMonthIoEItem = {
                        id: item.id,
                        title: item.title,
                        key: item.title,
                        value: 0
                    };
    
                    cytMonthIoE.push(cytMonthIoEItem);
                });
                
                this.setState({ cytMonthIoE });
            })
            .catch(error => console.error(error.message));
        
        axios.get('http://localhost:3000/api/data/table')
            .then(response => response.data)
            .then(table => {
    
                //Формирование массива для вывода годового пирожка
                for(let i = 0; i < table.length; i++) {
                    let cytYearItem = {
                        key: table[i].title,
                        value: table[i].costs
                    };
                    
                    if(cytYearItem.value > 0) {
                        cytYear.push(cytYearItem);
                    }
                }
    
                this.setState({ currentYearTable: table, cytYear });
    
                //Формирование массива для годового пирожка расходов
                
                let cytMonthIoE = this.state.cytMonthIoE;
                
                table.map(month => {
                    month.days.map(day => {
                        day.value.map((value,i) => {
                            cytMonthIoE[i].value += value.val;
                        })
                    })
                });
    
                cytMonthIoE.forEach(item => {
                    item.key += `: ${item.value}`
                });
                
                this.setState({ cytMonthIoE, cytMonthIoETitle: this.state.currentYearTitle });
            })
            .catch(error => console.error(error.message));
    }
    
    cytMonthSelect(event) {
        let cyTable = this.state.currentYearTable;
        
        this.setState({ cytDataDisplayTitle: event.data.key });
    
        cyTable.map(month => {
            if(month.title === event.data.key) {
                let cytMonthDay = [];
    
                let cytMonthIoE = this.state.cytMonthIoE;
                cytMonthIoE.forEach(item => {
                    item.value = 0;
                });
                
                month.days.map(day => {
                    
                    let cytMonthDayItem = {
                        x: day.title,
                        y: day.costs
                    };
                    cytMonthDay.push(cytMonthDayItem);
                    
                    day.value.map((value, i) => {
                        cytMonthIoE[i].value += value.val;
                    });
    
                    cytMonthIoE.forEach(item => {
                        item.key = `${item.title}: ${item.value}`
                    });
                    
                    this.setState({ cytMonthIoE, cytMonthIoETitle: this.state.cytDataDisplayTitle });
                });
                
                this.setState({ cytMonthDay });
            }
        });
    }


    
    
    render() {
        return(
            <main>
                <div className="container">
                    
                    <div className="statistics">
                        
                        <div className="statistics-year">
                            <div className="statistics-year__title">
                                {this.state.currentYearTitle}
                            </div>
                            <div className="statistics-year__inner">
                                <div className="statistics-year__pie">
                                    <div className="">Выберите месяц для детальной информации</div>
                                    {this.state.cytYear ?
                                        <div>
                                            <PieChart
                                                data={this.state.cytYear}
                                                size={300}
                                                innerHoleSize={100}
                                                clickHandler={e => this.cytMonthSelect(e)}
                                            />
                                            <Legend data={this.state.cytYear}
                                                    styles={customStyle}
                                                    dataId={'key'} />
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
    
                                <div className="statistics-year__bar-chart">
                                    {this.state.cytMonthDay ?
                                        <div>
                                            <div className="">Список трат сумма/день за {this.state.cytDataDisplayTitle}</div>
                                            <BarChart
                                                colorBars
                                                axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
                                                axes
                                                width={700}
                                                height={300}
                                                data={this.state.cytMonthDay}
                                            />
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
    
                                <div className="statistics-year__pie statistics-year__pie--ioe">
                                    <div className="">Расходы за {this.state.cytMonthIoETitle}:</div>
                                    {this.state.cytMonthIoE ?
                                        <div>
                                            <PieChart
                                                data={this.state.cytMonthIoE}
                                                size={300}
                                                innerHoleSize={100}
                                            />
                                            <Legend data={this.state.cytMonthIoE}
                                                    styles={customStyle}
                                                    dataId={'key'} />
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </main>
        )
    }
}


export default Statistics;