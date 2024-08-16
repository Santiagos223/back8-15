const config = require('./Config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);
class PersistenciaCalificacion {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'calificacion';

    constructor() {
        if (!PersistenciaCalificacion.instance) {
            PersistenciaCalificacion.instance = this;
        }
        return PersistenciaCalificacion.instance;
    }
    async buscar(idEvento, idPersona) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'idEvento = :idEvento AND idPersona = :idPersona',
            ExpressionAttributeValues: { ':idEvento': idEvento, ':idPersona': idPersona }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });
        return objectPromise;
    }
    async calificar(calificacionEvento) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idCalificacion: calificacionEvento.idCalificacion,
                idEvento: calificacionEvento.idEvento,
                idPersona: calificacionEvento.idPersona,
                calificacion: calificacionEvento.calificacion,
                fechaCalificacion: calificacionEvento.fechaCalificacion
            },
        }).promise();
    }

    async listar(idEvento) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'idEvento = :idEvento',
            ExpressionAttributeValues: { ':idEvento': idEvento }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });

        return objectPromise;
    }
}

module.exports = PersistenciaCalificacion;