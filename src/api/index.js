'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const table = require('./data/table');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

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
    const _day = {
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
    
    //Сортировка таблицы
    table.map(_month => {
        if(_month.id == req.body.month) {
            _month.days.push(_day);
            _month.days.sort((a,b) => {
                if (a.title < b.title) return 1;
                if (a.title > b.title) return -1;
            });
            
            tableUpdate();
            
            res.send(table);
            // res.send(_day);
        }
    });
});

function tableUpdate() {
    
    //Запись текущей const table в json
    fs.writeFile(__dirname + '/data/table.json', JSON.stringify(table), error => {
        if(error) console.log(error);
    });
}


// app.post('/api/todos', (req, res) => {
//     let todo = {
//         id: nextId++,
//         title: req.body.title,
//         completed: false
//     };
//
//     todos.push(todo);
//
//     res.send(todo);
// });
//
// app.put('/api/todos/:id', (req, res) => {
//     let todo = todos.find(todo => todo.id == req.params.id);
//
//     if (!todo) return res.sendStatus(404);
//
//     todo.title = req.body.title || todo.title;
//
//     res.json(todo);
// });
//
// app.patch('/api/todos/:id', (req, res) => {
//     let todo = todos.find(todo => todo.id == req.params.id);
//
//     if (!todo) return res.sendStatus(404);
//
//     todo.completed = !todo.completed;
//
//     res.json(todo);
// });
//
// app.delete('/api/todos/:id', (req, res) => {
//     let index = todos.findIndex(todo => todo.id == req.params.id);
//
//     if (index === -1) return res.sendStatus(404);
//
//     todos.splice(index, 1);
//
//     res.sendStatus(204);
// });

app.listen(5000,() => console.log('Сервер создан'));