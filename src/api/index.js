'use strict';

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

app.put('/api/data/table/:id', (req, res) => {
    let item;

    table.map(month => {
        month.days.map(day => {
            item = day.value.find(input => input.id === req.params.id);
            if(item) {
                done();
            }
        });
    });
    
    function done(){
        item.val = req.body.val || item.val;
    
        res.json(item);
    }
});

// app.post('/api/data/table', (req, res) => {
//     // console.log(req);
//     // table = req.body.table;
//     // console.log(table);
//     res.send(table);
// });



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