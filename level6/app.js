// 6.5 Broadcasting Questions 240 pts

// When a question is submitted to our server, we want to broadcast it out 
// to all the connected clients so they can have a chance to answer it.

// First, In the server, listen for 'question' events from clients.
// Then, emit the 'question' event on all the other clients connected, 
// passing them the question data.

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
  console.log("Client connected...");
  client.on('question', function(data) {
    io.emit('question', data);
    });
  
});


// 6.6 Saving Client Data 240 pts

// In our real-time Q&A app, we want to allow each client only one question at a time, 
//but how do we enforce this rule? We can use socket.io's ability to save data on the client, 
// so whenever a question is asked, we first want to check the question_asked value on the client.

// First, when a client emits a 'question' event, we want to set the value of question_asked to true.
// Second, when a client emits a 'question' event, we want to broadcast that question to the other clients.
// Finally, when a client emits a 'question' event, check to make sure qu estion_asked is not already set to true. 
// We only want to allow one question per user, so make sure that we only set the value of question_asked and 
// broadcast the question to other clients when the value of question_asked is not already true.

io.on('connection', function(client) {
  console.log("Client connected...");

  client.on('question', function(question) {
    if(!client.question_asked){
      client.broadcast.emit('question', question);
      client.question_asked = true;
    }

  });
});


// 6.7 Answering Questions 240 pts

// Clients can also answer each other's questions, so let's build that feature by 
// first listening for the 'answer' event on the client, which will send us both 
// the question and answer, which we want to broadcast out to the rest of the connected clients.

// Task 1/2 With the client, listen for the 'answer' event from clients. 
// This listener will have both a question and answer to broadcast so make sure to 
// include both as function parameters. 
// Task 2/2 Now, emit the 'answer' event on all the other clients connected, 
// passing them the question and answer data.

io.sockets.on('connection', function(client) {
  console.log("Client connected...");

  // listen for answers here
  client.on('answer', function(question, answer){
    client.broadcast.emit('answer', question, answer);
  });

  client.on('question', function(question) {
    if(!client.question_asked) {
      client.question_asked = true;
      client.broadcast.emit('question', question);
    }
  });
});

server.listen(8080);
