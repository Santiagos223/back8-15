const config = require('./Config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);

class PersistenciaCategoria {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'categoriaEvento';

    constructor() {
        if (!PersistenciaCategoria.instance) {
            PersistenciaCategoria.instance = this;
        }
        return PersistenciaCategoria.instance;
    }
    async buscar(nombre) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'nombre = :nombre',
            ExpressionAttributeValues: { ':nombre': nombre }
        };
        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });
        return objectPromise;
    }

    async buscarId(idCategoriaEvento) {
        var params = {
            Key: {
                idCategoriaEvento: idCategoriaEvento,
            },
            TableName: this.tableName,
        };
        const result = await this.ddb.get(params).promise();
        const categoria = result.Item;
        return categoria;
    }

    async alta(categoria) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idCategoriaEvento: categoria.idCategoriaEvento,
                nombre: categoria.nombre,
                estado: categoria.estado
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

    async modificar(categoria) {
        await this.ddb.update({
            TableName: this.tableName,
            Key: {
                idCategoriaEvento: categoria.idCategoriaEvento,
            },
            UpdateExpression:
                'SET nombre = :nombre'
                + ',estado = :estado ',
            ExpressionAttributeValues: {
                ':nombre': categoria.nombre,
                ':estado': categoria.estado
            },
        }).promise();
    }

    async eliminar(idCategoriaEvento) {
        await this.ddb.delete({
            "TableName": this.tableName,
            "Key": {
                "idCategoriaEvento": idCategoriaEvento
            }
        }).promise();
    }
}

module.exports = PersistenciaCategoria;