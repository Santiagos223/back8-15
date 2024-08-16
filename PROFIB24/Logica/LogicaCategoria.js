const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
const Categoria = require('../Modulos/Categoria');
const { v4: uuidv4 } = require('uuid');
class LogicaCategoria {
    PersistenciaCategoria = fabricaPersistencia.createPersistencia('persistenciaCategoria');
    PersistenciaEvento = fabricaPersistencia.createPersistencia('persistenciaEvento');
    PersistenciaPersona = fabricaPersistencia.createPersistencia('persistenciaPersona');
    constructor() {
        if (!LogicaCategoria.instance) {
            LogicaCategoria.instance = this;
        }
        return LogicaCategoria.instance;
    }

    async buscarId(idCategoriaEvento) {
        return await this.PersistenciaCategoria.buscarId(idCategoriaEvento);
    }

    async alta(req, res) {
        //Verificar si el usuario es administrador
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && usuario.tipoUsuario == true) {

            //Verificar si la categoria existe
            var existe = await this.PersistenciaCategoria.buscar(req.body.categoria.nombre);

            if (existe.length != 0) {
                if (existe[0].estado == true) {
                    return res.status(403).send({ message: 'La categoria ya existe' });
                } else {
                    existe[0].estado = true;
                    await this.PersistenciaCategoria.modificar(existe[0]);
                    return res.status(200).send({ message: 'Categoria creada' });
                }
            } else {
                var categoria = new Categoria(uuidv4(), req.body.categoria.nombre, req.body.categoria.estado);
                await this.PersistenciaCategoria.alta(categoria);
                return res.status(200).send({ message: 'Categoria creada' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }

    async listar() {
        return await this.PersistenciaCategoria.listar()
    }

    async modificar(req, res) {
        //Verificar si el usuario es administrador
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && usuario.tipoUsuario == true) {

            //Verificar si la categoria existe
            var existe = await this.PersistenciaCategoria.buscarId(req.body.categoria.idCategoriaEvento);

            if (existe.length != 0) {
                var categoria = new Categoria(req.body.categoria.idCategoriaEvento, req.body.categoria.nombre, req.body.categoria.estado);
                await this.PersistenciaCategoria.modificar(categoria);
                return res.status(200).send({ message: 'Categoria modificada' });
            } else {
                return res.status(403).send({ message: 'Error en la categoria' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }

    async eliminar(req, res) {
        //Verificar si el usuario es administrador
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && usuario.tipoUsuario == true) {

            //Verificar si la categoria tiene eventos asociados
            var eventos = await this.PersistenciaEvento.buscarPorCategoria(req.body.idCategoriaEvento)

            if (eventos.length == 0) {
                await this.PersistenciaCategoria.eliminar(req.body.idCategoriaEvento);
                return res.status(200).send({ message: 'Categoria eliminada' });
            } else {
                var categoria = await this.PersistenciaCategoria.buscarId(req.body.idCategoriaEvento);
                if (categoria != null) {
                    categoria.estado = false;
                    await this.PersistenciaCategoria.modificar(categoria);
                    return res.status(200).send({ message: 'Categoria eliminada' });
                } else {
                    return res.status(403).send({ message: 'Error en la categoria' });
                }
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
}

module.exports = LogicaCategoria;