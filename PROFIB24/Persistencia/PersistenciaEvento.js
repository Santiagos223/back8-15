const config = require('./Config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);

class PersistenciaEvento {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'evento';

    constructor() {
        if (!PersistenciaEvento.instance) {
            PersistenciaEvento.instance = this;
        }
        return PersistenciaEvento.instance;
    }
    async buscar(idEvento) {
        var params = {
            Key: {
                idEvento: idEvento,
            },
            TableName: this.tableName,
        };
        const result = await this.ddb.get(params).promise();
        const evento = result.Item;
        return evento;
    }

    async buscarCoordenadas(latitud, longitud) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'latitud = :latitud AND longitud = :longitud',
            ExpressionAttributeValues: { ':latitud': latitud, ':longitud': longitud }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items[0]
        });

        return objectPromise;
    }

    async buscarIdPersona(idPersona) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'idPersona = :idPersona',
            ExpressionAttributeValues: { ':idPersona': idPersona }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });

        return objectPromise;
    }

    async nuevo(evento) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idEvento: evento.idEvento,
                idPersona: evento.idPersona,
                idCategoriaEvento: evento.idCategoriaEvento,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                calificacion: evento.calificacion,
                latitud: evento.latitud,
                longitud: evento.longitud,
                icono: evento.icono,
                estado: evento.estado,
                imagen: evento.imagen,
                sonido: evento.sonido,
                visual: evento.visual,
                duracion: evento.duracion,
                fechaRecordatorio: evento.fechaRecordatorio,
                fechaCreacion: evento.fechaCreacion,
            },
        }).promise();
    }

    async listar() {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'estado = :estado',
            ExpressionAttributeValues: { ':estado': true }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });

        return objectPromise;
    }

    async modificar(evento) {
        await this.ddb.update({
            TableName: this.tableName,
            Key: {
                idEvento: evento.idEvento,
            },
            UpdateExpression:
                'SET nombre = :nombre'
                + ',descripcion = :descripcion'
                + ',idCategoriaEvento = :idCategoriaEvento'
                + ',icono = :icono'
                + ',estado = :estado'
                + ',imagen = :imagen'
                + ',visual = :visual '
                + ',duracion = :duracion'
                + ',sonido = :sonido'
                + ',fechaRecordatorio = :fechaRecordatorio'
                + ',calificacion = :calificacion'
                + ',latitud = :latitud'
                + ',longitud = :longitud'
                + ',fechaCreacion = :fechaCreacion'
                + ',idPersona = :idPersona',
            ExpressionAttributeValues: {
                ':nombre': evento.nombre,
                ':descripcion': evento.descripcion,
                ':idCategoriaEvento': evento.idCategoriaEvento,
                ':icono': evento.icono,
                ':estado': evento.estado,
                ':imagen': evento.imagen,
                ':sonido': evento.sonido,
                ':visual': evento.visual,
                ':duracion': evento.duracion,
                ':fechaRecordatorio': evento.fechaRecordatorio,
                ':calificacion': evento.calificacion,
                ':latitud': evento.latitud,
                ':longitud': evento.longitud,
                ':fechaCreacion': evento.fechaCreacion,
                ':idPersona': evento.idPersona
            },
        }).promise();
    }

    async listarRecordatorios(usuario) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'idPersona = :idPersona AND estado = :estado',
            ExpressionAttributeValues: { ':idPersona': usuario.idPersona, ':estado': true }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });

        return objectPromise;
    }

    async buscarPorCategoria(idCategoriaEvento) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'idCategoriaEvento = :idCategoriaEvento',
            ExpressionAttributeValues: { ':idCategoriaEvento': idCategoriaEvento }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });
        return objectPromise;
    }
}

module.exports = PersistenciaEvento;

