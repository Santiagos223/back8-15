class Categoria {
    constructor(idCategoriaEvento, nombre, estado) {
        this.idCategoriaEvento = idCategoriaEvento;
        this.nombre = nombre;
        this.estado = Boolean(estado);
    }
}

module.exports = Categoria;