const config = require('./Config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);
class PersistenciaPersona {
    ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    tableName = 'persona';
    constructor() {
        if (!PersistenciaPersona.instance) {
            PersistenciaPersona.instance = this;
        }
        return PersistenciaPersona.instance;
    }
    async login(email, pass) {
            var params = {
                TableName: this.tableName,
                FilterExpression: 'email = :email AND pass = :pass AND estado = :estado',
                ExpressionAttributeValues: { ':email': email, ':pass': pass, ':estado': true }
            };
            var objectPromise = await this.ddb.scan(params).promise().then((data) => {
                return data.Items[0]
            });
            return objectPromise;
    }

    async buscar(email) {
        var params = {
            TableName: this.tableName,
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email }
        };

        var objectPromise = await this.ddb.scan(params).promise().then((data) => {
            return data.Items
        });

        return objectPromise;
    }

    async buscarIdPersona(idPersona) {
        var params = {
            Key: {
                idPersona: idPersona,
            },
            TableName: this.tableName,
        };
        const result = await this.ddb.get(params).promise();
        const persona = result.Item;
        return persona;
    }

    async alta(persona) {
        await this.ddb.put({
            TableName: this.tableName,
            Item: {
                idPersona: persona.idPersona,
                nombre: persona.nombre,
                email: persona.email,
                pass: persona.pass,
                tipoUsuario: persona.tipoUsuario,
                idioma: persona.idioma,
                modo: persona.modo,
                sonidoNotificacion: persona.sonidoNotificacion,
                notificacion: persona.notificacion,
                fechaAlta: persona.fechaAlta,
                verificado: persona.verificado,
                estado: persona.estado
            },
        }).promise();
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

    async modificar(persona) {
        await this.ddb.update({
            TableName: this.tableName,
            Key: {
                idPersona: persona.idPersona,
            },
            UpdateExpression:
                'SET nombre = :nombre '
                + ',email = :email '
                + ',pass = :pass '
                + ',tipoUsuario = :tipoUsuario '
                + ',idioma = :idioma '
                + ',modo = :modo '
                + ',sonidoNotificacion = :sonidoNotificacion '
                + ',notificacion = :notificacion'
                + ',estado = :estado'
                + ',verificado = :verificado',
            ExpressionAttributeValues: {
                ':nombre': persona.nombre,
                ':email': persona.email,
                ':pass': persona.pass,
                ':tipoUsuario': persona.tipoUsuario,
                ':idioma': persona.idioma,
                ':modo': persona.modo,
                ':sonidoNotificacion': persona.sonidoNotificacion,
                ':notificacion': persona.notificacion,
                ':estado': persona.estado,
                ':verificado': persona.verificado
            },
        }).promise();
    }

    async eliminar(idPersona) {
        await this.ddb.delete({
            "TableName": this.tableName,
            "Key": {
                "idPersona": idPersona
            }
        }).promise();
    }
}

module.exports = PersistenciaPersona;