const config = require('./Config');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.update(config.aws_remote_config);

class PersistenciaMensaje {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'mensajePrivado';

    constructor() {
        if (!PersistenciaMensaje.instance) {
            PersistenciaMensaje.instance = this;
        }
        return PersistenciaMensaje.instance;
    }
    async listar(usuario) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'receptor = :usuario',
            ExpressionAttributeValues: { ':usuario': usuario }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });

        return objectPromise;
    }

    async enviar(mensaje) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idMensajePrivado: mensaje.idMensajePrivado,
                receptor: mensaje.receptor,
                asunto: mensaje.asunto,
                cuerpo: mensaje.cuerpo,
                leido: mensaje.leido,
                emisor: mensaje.emisor,
                fechaRecepcion: mensaje.fechaRecepcion
            },
        }).promise();
    }

    async respuestaAutomatica(receptor, emisor) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idMensajePrivado: uuidv4(),
                receptor: emisor,
                asunto: "No-Reply",
                cuerpo: "No existe el destinatario " + receptor,
                leido: false,
                emisor: "No-Reply",
                fechaRecepcion: new Date().toLocaleString(undefined, {
                    year: 'numeric', month: '2-digit',
                    day: '2-digit', weekday: "long", hour: '2-digit',
                    hour12: false, minute: '2-digit', second: '2-digit'
                })
            },
        }).promise();
    }

    async modificar(mensaje) {
        const params = {
            TableName: this.tableName,
            Key: {
                idMensajePrivado: mensaje.idMensajePrivado,
            },
            UpdateExpression: 'SET leido = :leido'
                + ',cuerpo = :cuerpo'
                + ',receptor = :receptor'
                + ',asunto = :asunto'
                + ',emisor = :emisor'
                + ',fechaRecepcion = :fechaRecepcion',
            ExpressionAttributeValues: {
                ':leido': mensaje.leido,
                ':cuerpo': mensaje.cuerpo,
                ':receptor': mensaje.receptor,
                ':asunto': mensaje.asunto,
                ':emisor': mensaje.emisor,
                ':fechaRecepcion': mensaje.fechaRecepcion,
            },
        };
        await this.ddb.update(params).promise();
    }

    async eliminar(idMensajePrivado) {
        await this.ddb.delete({
            "TableName": this.tableName,
            "Key": {
                "idMensajePrivado": idMensajePrivado
            }
        }).promise();
    }
}
module.exports = PersistenciaMensaje;

