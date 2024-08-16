const ConfiguracionAplicacion = require('../ConfiguracionAplicacion');
const AWS = require('aws-sdk');

class DB { 
    AWS;
    dynamodb;

    constructor() {
        this.AWS.config.update({
            region: ConfiguracionAplicacion.AWSRegion,
            credentials: new AWS.Credentials
                (ConfiguracionAplicacion.AWSKey,
                 ConfiguracionAplicacion.AWSSecretKey) // Solo necesario si no esta configurado via environment
        });
        this.dynamodb = new AWS.DynamoDB();
    }
}

module.exports = DB;