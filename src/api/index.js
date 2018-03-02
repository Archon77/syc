'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

let table = require('./data/table');
let header = require('./data/header');

//empty
let eTable = require('./data/e_table');
let eHeader = require('./data/e_header');

let headerId = 4;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Таблица
app.get('/api/data/table', (req, res) => {
    res.send(table);
});

//Очистка таблицы
app.put('/api/data/table/clear', (req, res)=>{
    table = eTable;
    header = eHeader;
    
    tableUpdate();
    headerUpdate();
    
    res.end();
});

//onChange всех value ячеек
app.put('/api/data/table/:id', (req, res) => {
    let item;

    table.map(month => {
        month.days.map(day => {
            
            //Найденный value с id соответствующим id запроса..
            item = day.value.find(input => input.id === req.params.id);
            
            //Если таковой существует
            if(item) {
                //Заменить его значение на значение из запроса
                item.val = parseInt(req.body.val, 10);
    
                tableUpdate();
    
                //Отправляем измененную "ячейку"
                res.json(item);
            }
        });
    });
});

//Изменение профита
app.put('/api/data/table/', (req, res) => {
    table.map(month => {
        //Если id месяца соответствует id запроса
        if(month.id === req.body.monthId) {
    
            //Заменить его значение профита на значение из запроса
            month.profit = parseInt(req.body.val, 10);
    
            tableUpdate();
    
            //Да, а обратно возвращаем таблицу, новое значение изменится в компоненте
            res.json(table);
        }
    });
});

//Изменение расходов дня
app.put('/table/day/costs', (req, res) => {
    table.map(month => {
        let mCosts = 0;

        month.days.map(day => {
            //Если id дня соответствует id запроса
            if(day.id === req.body.dayId){

                //Заменить его значение расходов на значение из запроса
                day.costs = parseInt(req.body.costs, 10);
            }
            
            //Итог расходов дня добавить в итог расходов месяца
            mCosts += day.costs;
        });

        month.costs = mCosts;
    });
    
    tableUpdate();
    
    //Ничего не возвращать, вся операция только для чтения страницой статистики
    res.end();
});

// Добавление нового дня
app.post('/api/data/table/', (req, res) => {
    //month - req id месяца
    //day - req id дня
    
    //Количество value ячеек за вычетом даты и итога
    let valueLength = header.length - 2;
    //Создание массива value ячеек
    let values = [];
    
    for(let i = 0; i < valueLength; i++) {
        let newValue = {
            id: `${req.body.month}-${req.body.day}-${i + 1}`,
            val: 0
        };
    
        values.push(newValue);
    }
    
    const newDay = {
        id: `${req.body.month}-${req.body.day}`,
        title: parseInt(req.body.day, 10),
        costs: 0,
        value: values
    };
    
    const newMonth = {
        id: req.body.month,
        title: req.body.monthTitle,
        profit: 0,
        costs: 0,
        days: [
            newDay
        ]
    };
    
    let b = false;
    
    table.map((_month, i, array) => {
    
        //Если в таблице есть месяц с id из req
        if(_month.id == req.body.month) {
            _month.days.push(newDay);
    
            //Сортировка таблицы
            _month.days.sort((a,b) => {
                if (a.title < b.title) return 1;
                if (a.title > b.title) return -1;
            });
    
            b = true;
        }
        //Если в таблице такого месяца не нашлось - создать месяц с выбранным(req) днём
        else if(i === array.length - 1 && !b) {
            table.push(newMonth);
    
            //Сортировка таблицы
            table.sort((a,b) => {
                if (a.id < b.id) return 1;
                if (a.id > b.id) return -1;
            });
        }
    });
    
    // tableUpdate();
    
    res.send(table);
});

//Запись текущей table в json
function tableUpdate() {
    fs.writeFile(__dirname + '/data/table.json', JSON.stringify(table), error => {
        if(error) console.log(error);
    });
}


// Header
app.get('/api/data/header', (req, res) => {
    res.send(header);
});

// Добавление нового столбца
app.post('/api/data/header/', (req, res) => {
    const headerId = header[header.length - 2].id + 1;
    
    const newColumn = {
        id: headerId,
        title: req.body.title
    };

    header.push(newColumn);

    header.sort((a,b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
    });
    
    table.map(month =>{
        month.days.map(day => {
            
            const newValue = {
                "id": `${day.id}-${headerId}`,
                "val": 0
            };
    
            day.value.push(newValue);
        })
    });

    tableUpdate();
    headerUpdate();

    res.send(header);
});

//Запись текущего header в json
function headerUpdate() {
    fs.writeFile(__dirname + '/data/header.json', JSON.stringify(header), error => {
        if(error) console.log(error);
    });
}

app.listen(5000,() => console.log('Сервер создан'));