const cors = require('cors');
const app = require("express")();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const exec = require('child_process').exec;

app.use(cors());
app.options('*', cors());

app.get("/", function(req, res) {
  res.send("sam");
});

http.listen(4000, function() {
  console.log("listening on *:4000");
});

const arduinoLocation = '/dev/ttyACM0'

const port = new SerialPort(arduinoLocation, {
  baudRate: 115200
})

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', (data) => {
  io.emit('arduino', data);
});

const updateSpeed = (speedL, speedR) => {
  port.write(`<S1, ${speedL}, ${speedR}>`, (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written', speedL, speedR);
  });
}

io.on("connection", function(socket) {
  socket.on("setSpeed", function(speedL, speedR) {
    updateSpeed(speedL, speedR);
  });
});

function shutdown(){
  exec('sudo shutdown now', function(error, stdout, stderr) { 
    if (error) {
      console.log(error);
    }
  });
}

app.get("/shutdown", function(req, res) {
  shutdown();
});
