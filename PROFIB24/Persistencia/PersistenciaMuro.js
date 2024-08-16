const config = require('./Config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);

class PersistenciaMuro {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'mensajePublico';

    constructor() {
        if (!PersistenciaMuro.instance) {
            PersistenciaMuro.instance = this;
        }
        return PersistenciaMuro.instance;
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

    async nuevo(mensaje) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idMensajePublico: mensaje.idMensajePublico,
                idPersona: mensaje.idPersona,
                cuerpo: mensaje.cuerpo,
                fechaEnvio: mensaje.fechaEnvio
            },
        }).promise();
    }

    async eliminar(idMensajePublico) {
        await this.ddb.delete({
            "TableName": this.tableName,
            "Key": {
                "idMensajePublico": idMensajePublico
            }
        }).promise();
    }
}
module.exports = PersistenciaMuro;