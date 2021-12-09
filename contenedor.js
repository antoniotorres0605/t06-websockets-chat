//@Autor: Antonio Torres
//@Fecha: 10/11/2021

let fs = require("fs");
let path = require("path");

class Contenedor{
  constructor(archivo){
    this.archivo = archivo;
  }
  // Método que guarda nuevo producto
  async save(product){
    try{
      let arregloGlobal = await this.getAll();
      let currentId =  arregloGlobal.length + 1;
      product.id = currentId;
      arregloGlobal.push(product);
      let producto = JSON.stringify(arregloGlobal,null,2);
      await fs.promises.writeFile(`${this.archivo}`,`${producto}`);
      this.contadorId+=1;
      return currentId;
    }
    catch(error){
     // console.log(error)
    }
    
  }


  // Función que permite guardar nuevos objetos

  async getAll() {
    try {
        let all = await fs.promises.readFile(this.archivo, `utf-8`);
        let arr = JSON.parse(all);
        this.arreglo = arr;
        return (arr);
    }
    catch (error) {
        console.log('No se pudo leer el archivo',error);
    }
  }

  async getById(id) {
    try {
        let all = await fs.promises.readFile(this.archivo, `utf-8`);
        let arr = JSON.parse(all);
        this.arreglo = arr;
        for(let i = 0; i < this.arreglo.length; i++){
          if(this.arreglo[i].id == id){
            return this.arreglo[i];
          }
        }
        return null
    }
    catch (error) {
        console.log('No se pudo leer el archivo',error);
    }
  }
}

module.exports = Contenedor