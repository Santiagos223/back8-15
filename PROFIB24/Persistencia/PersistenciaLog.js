const config = require('./Config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);
class PersistenciaLog {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'log';

    constructor() {
        if (!PersistenciaLog.instance) {
            PersistenciaLog.instance = this;
        }
        return PersistenciaLog.instance;
    }

    async nuevo(log) {
        try {
            return await this.ddb.put({
                TableName: this.tableName,
                Item: {
                    idLog: log.idLog,
                    tipo: log.tipo,
                    mensaje: log.mensaje,
                    proceso: log.proceso,
                    fechaCreacion: log.fechaCreacion,
                },
            }).promise();
        } catch (ex) {
            console.log('Error al conectar a la base de datos');
        }
    }

    async listar() {
        var params = {
            TableName: this.tableName,
        };
        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });
        return objectPromise;
    }
}
module.exports = PersistenciaLog;