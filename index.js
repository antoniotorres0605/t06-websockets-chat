let express = require("express");
let path = require("path");
//let { engine } = require("express-handlebars");
let fs = require("fs");
//const { type } = require("os");
let {Router} = express;
let {Server: HttpServer} = require("http");
let {Server: SocketIO} = require("socket.io");

let router = new Router();
let id = new Router();
let app = express();
const PORT = 8081;


let mensajes = [];

let httpServer = new HttpServer(app);
let socketIOServer = new SocketIO(httpServer);

//app.engine("handlebars",engine());

//app.set("views","./views/hbs");
//app.set("view engine","handlebars");

app.set("views",path.join(__dirname,"views","ejs"));
app.set("view engine", "ejs");


let Contenedor = require("./contenedor");
let c1 = new Contenedor('./productos.txt');

//pruebas

router.get("/",(req,res,next)=>{
  c1.getAll().then(data=>{
    res.render("index",{data});
  }).catch(error=>{
    res.send(error);
  });
  //res.send("Hola")
});

id.get("/:id",(req,res,next)=>{
  let id = (req.params.id);
  c1.getById(id).then(datos=>{
    let data = []
    data.push(datos)
    res.render("index",{data});
  }).catch(error=>{
    res.send(error);
  });
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

router.post("/",(req,res,next)=>{
  console.log(req.body.producto);
  c1.save(req.body.producto).then(data=>{
    console.log(data);
    res.json(data);
  }).catch(error=>{
    res.send(error);
  })
});

// MIDDLEWARE
app.use("/api",router);
app.use("/api",id);
//app.use("/api",express.static(path.join(__dirname,"public","html")));

app.get("/", (req,res,next) => {
  res.send("<h1>Pagina de Inicio<br></h1>");
});

/*socketIOServer.on("connection",socket=>{
  socket.emit("misala","Hola");
  console.log(`Nuevo usuario conectado ${socket.id }`);
});*/

socketIOServer.on("connection",socket=>{
  socket.on("fillP",data =>{
    let res = {
      id : socket.id,
      mensaje : data
    };
    mensajes.push(res);
    //backupInfo = data;
    socketIOServer.sockets.emit('listenserver',mensajes); 
  });
  socket.emit("init",mensajes);
  console.log(`Nuevo usuario conectado ${socket.id}`);
});

httpServer.listen(PORT,()=>{
  console.log(`Server on http://localhost:${PORT}`)
});