import React from 'react';
import ReactDOM from 'react-dom';
import './dist/style.css';
import App from './App';
import table from './api/data/table'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App table={table} />, document.getElementById('root'));
registerServiceWorker();
