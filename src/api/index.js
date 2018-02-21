'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const table = require('./data/table');
const header = require('./data/header');

let headerId = 4;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Таблица
app.get('/api/data/table', (req, res) => {
    res.send(table);
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

// Добавление нового дня
app.post('/api/data/table/', (req, res) => {
    //month - req id месяца
    //day - req id дня
    
    const newDay = {
        id: `${req.body.month}-${req.body.day}`,
        title: parseInt(req.body.day, 10),
        value: [
            {
                id: `${req.body.month}-${req.body.day}-1`,
                val: 0
            },
            {
                id: `${req.body.month}-${req.body.day}-2`,
                val: 0
            },
            {
                id: `${req.body.month}-${req.body.day}-3`,
                val: 0
            },
            {
                id: `${req.body.month}-${req.body.day}-4`,
                val: 0
            }
        ]
    };
    
    const newMonth = {
        id: req.body.month,
        title: req.body.monthTitle,
        profit: 0,
        days: [
            newDay
        ]
    };
    
    table.map((_month, i, array) => {
    
        //Если в таблице есть месяц с id из req
        if(_month.id == req.body.month) {
            _month.days.push(newDay);
    
            //Сортировка таблицы
            _month.days.sort((a,b) => {
                if (a.title < b.title) return 1;
                if (a.title > b.title) return -1;
            });
        }
        //Если в таблице такого месяца не нашлось - создать месяц с выбранным(req) днём
        else if(i === array.length - 1) {
            table.push(newMonth);
    
            //Сортировка таблицы
            table.sort((a,b) => {
                if (a.id < b.id) return 1;
                if (a.id > b.id) return -1;
            });
        }
    });
    
    tableUpdate();
    
    res.send(table);
});

function tableUpdate() {
    
    //Запись текущей const table в json
    fs.writeFile(__dirname + '/data/table.json', JSON.stringify(table), error => {
        if(error) console.log(error);
    });
}


// Header
app.get('/api/data/header', (req, res) => {
    res.send(header);
});

// Добавление нового столбца
// app.post('/api/data/header/', (req, res) => {
//     const newColumn = {
//         id: headerId + 1,
//         title: req.body.title
//     };
//
//     header.push(newColumn);
//
//     header.sort((a,b) => {
//         if (a.title < b.title) return 1;
//         if (a.title > b.title) return -1;
//     });
//
//     tableUpdate();
//
//     res.send(header);
// });


app.listen(5000,() => console.log('Сервер создан'));