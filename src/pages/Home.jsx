import React from 'react';

function Home() {
    return (
        <main>
            <div className="container">
                <div className="table">
                
                    {/*Хедер таблицы*/}
                    <TableHeader addNewDay={() => this.setState({ showModal: true, showDayModal: true })}
                                 addNewColumn={() => this.addColumn()}
                                 clearTable={() => this.clearTable()}
                                 header={this.state.header} />
                
                    {this.state.table.map(month =>
                        <TableInner month={month.title}
                                    monthId={month.id}
                                    key={month.id}
                                    table={this.state.table}
                                    profit={month.profit}
                                    calcStart={(load) => this.setState({ load })}
                                    calcFinalSum={(finalSum) => this.setState({ finalSum, load: false })}
                                    days={month.days} />
                    )}
                </div>
            </div>
        
            <Modal showDayModal={this.state.showDayModal}
                   showNewColumnModal={this.state.showNewColumnModal}
                   showModal={this.state.showModal}
                   table={this.state.table}
                   onClose={() => this.setState({ showModal: false, showNewColumnModal: false, showDayModal: false})}
                   onFormSubmit={(title) => this.onFormSubmit(title)}
                   onDaySelect={(day, month) => this.onDaySelect(day, month)} />
        </main>
    )
}

export default Home;