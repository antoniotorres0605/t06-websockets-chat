let express = require("express");
let path = require("path");
let { engine } = require("express-handlebars");
let fs = require("fs");
const { type } = require("os");
let {Router} = express;

let router = new Router();
let id = new Router();
let app = express();
const PORT = 3000;

app.engine("handlebars",engine());

app.set("views","./views/hbs");
app.set("view engine","handlebars");



let Contenedor = require("./contenedor");
let c1 = new Contenedor('./productos.txt');

//pruebas

router.get("/",(req,res,next)=>{
  c1.getAll().then(data=>{
    res.render("index",{data});
  }).catch(error=>{
    res.send(error);
  });
});

id.get("/:id",(req,res,next)=>{
  let id = (req.params.id);
  c1.getById(id).then(data=>{
    res.render("index1",data);
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
  });
});

// MIDDLEWARE
app.use("/api/productos",router);
app.use("/api/productos",id);
app.use("/api",express.static(path.join(__dirname,"public","html")));

app.get("/", (req,res,next) => {
  res.send("<h1>Pagina de Inicio<br></h1>");
});

app.listen(PORT,()=>{
  console.log(`Server on http://localhost:${PORT}`)
});