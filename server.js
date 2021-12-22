var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');

// Configure
app.configure(function() {

    app.use(express.bodyParser());

    app.use(express.cookieParser('5349ghakg@#$%#$'));

    // Config static
    app.use('/js', express.static(__dirname + '/public/js'));
    app.use('/css', express.static(__dirname + '/public/css'));
    app.use('/images', express.static(__dirname + '/public/images'));
    app.set('layouts', __dirname + '/layouts');
});

// Connect mongo
mongoose.connect('mongodb://localhost/todos');

// Schema Mongoose
var Schema = mongoose.Schema;
var todoSchema = new Schema({
    name: String
});

var todoCollection = mongoose.model('todos', todoSchema);

app.get('/', function(req, res) {
    res.sendfile(app.get('layouts') + '/index.html');
});

app.get('/api/listJob', function(req, res) {

    todoCollection.find({}, function(err, data) {
        res.json(data);
    });
});

app.post('/api/job', function(req, res) {
    var dataReturn = {
        code: 0,
        message: null
    };

    var todo = new todoCollection({ name: req.body.name, });
    todo.save(function(err) {
        if (!err) {
            dataReturn.code = 1;
            dataReturn.message = 'Add Success';
            dataReturn.data = todo;
        }

        res.json(dataReturn);
    });

});

app.delete('/api/job/:id', function(req, res) {
    var dataReturn = {
        code: 0,
        message: 'Remove Success'
    };

    todoCollection.remove({ _id: req.params.id }, function(err) {
        if (!err) {
            dataReturn.code = 1;
            res.json(dataReturn);
        }
    });
});

server.listen(8899);