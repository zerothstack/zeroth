let {gulp, UbiquitsProject} = require('./tasks');
const path = require('path');

new UbiquitsProject(path.resolve('.')).registerDefaultTasks(gulp);
