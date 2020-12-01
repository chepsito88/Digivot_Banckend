const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const cors = require("cors");
var Buffer = require('buffer/').Buffer ;

const app = express();

const PORT = process.env.PORT || 3001;

// MySql
const connection = mysql.createConnection({
  /*host: 'localhost',
  user: 'root',
  password: 'chepsito',
  database: 'bd_elecciones'
  */
  host: 'aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'ag5bbrs8dpem7vep',
  password: 'xgtg8pdlxwvgifjd',
  database: 'k0hn4zsuai4odinv'
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

//:@/?reconnect=true

// Bienvenida de la API
app.get('/', (req, res) => {
  res.send('Bienvenido GeneSoft S.A. de C.V.!');
});

// Peticion que se ocupa para no dormir al servidor
app.get('/customers', (req, res) => {
  const sql = 'SELECT * FROM customers';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});


//peticion para el login
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  connection.query(
    "call sp_login(?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result[0].length > 0) {
        res.send(result[0]);
      } else {
        res.send({ message: "Usuario y Contrasena erroneos" });
      }
    }
  );
});


//Llena Combo Mesa
app.get('/Casillas', (req, res) => {
  const sql = 'CALL sp_Listar_Casillas';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
      console.log(results)
    } else {
      res.send('Sin Resultados');
    }
  });
});

//Llena Combo Elecciones
app.get('/tipoElecciones', (req, res) => {
  const sql = 'CALL sp_Listar_TipoElecciones';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
      console.log(results)
    } else {
      res.send('Sin Resultados');
    }
  });
});

//llena reportes
app.post('/Reportes', (req, res) => {
  const Mesa = req.body.Mesa;
  const Tipo= req.body.Tipo;
  console.log(Mesa);
  console.log(Tipo);
  connection.query(
    "call sp_Reportes(?,?)",
    [Mesa,Tipo],
    (err, result) => {
      if (err) 
      {
        res.send({ err: err });        
      }else{
        res.send(result[0]);
        console.log(result);
      } 
    }
  );
});

//peticion que muestra candidatos

app.get('/Candidatos', (req, res) => {
  const sql = 'CALL sp_Listar_Candidatos';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
      console.log(results)
    } else {
      res.send('Sin Resultados');
    }
  });
});

//Inserta  Casilla
app.post('/insertCasilla', (req, res) => {
  const Mesa = req.body.Mesa;
  const Ip = req.body.Ip;
  const Nombre = req.body.Nombre;
  connection.query(
    "call sp_insertCasilla(?,?,?)",
    [Mesa, Ip, Nombre],
    (err, result) => {
      if (err) 
      {
        res.send({ err: err });
      }else{
        res.send({ message: "Registrado correctamente" });
      }
    }
  );
});

//Inserta  Voto
app.post('/insertVoto', (req, res) => {
  const Mesa = req.body.Mesa;
  const Id = req.body.Id;
  const Ip=req.body.Ip;
  connection.query(
    "call sp_Ingresa_Votos(?,?,?)",
    [Mesa, Id,Ip],
    (err, result) => {
      if (err) 
      {
        res.send({ err: err });
      }else{
        res.send({ message: "Registrado correctamente" });
      }
    }
  );
});

app.post('/sesionCasilla', (req, res) => {
  const Ip = req.body.Ip;
  const Mesa= req.body.Mesa;
  connection.query(
    "call sp_sesionCasillas(?,?)",
    [Ip,Mesa],
    (err, result) => {
      if (err) 
      {
        res.send({ err: err });        
      }else{
        res.send(result[0]);
        console.log(result);
      } 
    }
  );
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
