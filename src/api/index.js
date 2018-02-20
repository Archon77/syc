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

app.put('/api/data/table/:id', (req, res) => {
    let item;

    table.map(month => {
        month.days.map(day => {
            item = day.value.find(input => input.id === req.params.id);
            if(item) {
                done(item);
            }
        });
    });
    
    function done(item){
        item.val = parseInt(req.body.val, 10);
    
        tableUpdate();

        res.json(item);
    }
});

app.put('/api/data/table/:id', (req, res) => {
    let item;
    
    table.map(month => {
        month.days.map(day => {
            item = day.value.find(input => input.id === req.params.id);
            if(item) {
                done(item);
            }
        });
    });
    
    function done(item){
        item.val = parseInt(req.body.val, 10);
        
        tableUpdate();
        
        res.json(item);
    }
});


// Добавление
app.post('/api/data/table/', (req, res) => {
    const day = {
        id: `${req.body.monthId}-${req.body.i}`,
        title: parseInt(req.body.i, 10),
        value: [
            {
                id: `${req.body.monthId}-${req.body.i}-1`,
                val: 0
            },
            {
                id: `${req.body.monthId}-${req.body.i}-2`,
                val: 0
            },
            {
                id: `${req.body.monthId}-${req.body.i}-3`,
                val: 0
            },
            {
                id: `${req.body.monthId}-${req.body.i}-4`,
                val: 0
            }
        ]
    };

    table.map(month => {
        if(month.id == req.body.monthId) {
            month.days.push(day);
            month.days.sort((a,b) => {
                if (a.title > b.title) return 1;
                if (a.title < b.title) return -1;
            });
            tableUpdate();
            res.send(day);
        }
    });
});

function tableUpdate() {
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