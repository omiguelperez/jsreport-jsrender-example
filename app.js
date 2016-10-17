'use strict';

const port = process.env.PORT || 8080;

// dependencias
const express = require('express');
const jsrender = require('jsrender');
const jsreport = require('jsreport');
const fs = require('fs');

const app = express();

// home route
app.get('/', function (req, res) {
  let template = jsrender.templates('Name: {{:name}}<br/>');

  let html = template.render({ name: 'Oscar' });
  res.send(html);
});

// report route
app.get('/report', function (req, res) {
  fs.readFile('templates/people.html', 'utf-8', function (err, content) {
    if (err) throw err;

    let template = jsrender.templates(content);
    let data = require('./people.json').people;

    let html = template.render(data);

    jsreport.render(html)
      .then(function (output) {
        output.stream.pipe(res);
      })
      .catch(function (err) {
        res.end(err.message);
      })
  });
});

// server listening on PORT
app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
});
