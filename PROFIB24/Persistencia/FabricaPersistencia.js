const PersistenciaCalificacion = require('../Persistencia/PersistenciaCalificacion');
const PersistenciaCategoria = require('../Persistencia/PersistenciaCategoria');
const PersistenciaEvento = require('../Persistencia/PersistenciaEvento');
const PersistenciaLog = require('../Persistencia/PersistenciaLog');
const PersistenciaMensaje = require('../Persistencia/PersistenciaMensaje');
const PersistenciaMuro = require('../Persistencia/PersistenciaMuro');
const PersistenciaPersona = require('../Persistencia/PersistenciaPersona');

class FabricaPersistencia {
    constructor() {
        if (!FabricaPersistencia.instance) {
            FabricaPersistencia.instance = this;
        }
        return FabricaPersistencia.instance;
    }
    createPersistencia(type) {
        switch (type) {
            case 'persistenciaCalificacion':
                return new PersistenciaCalificacion();
            case 'persistenciaCategoria':
                return new PersistenciaCategoria();
            case 'persistenciaEvento':
                return new PersistenciaEvento();
            case 'persistenciaLog':
                return new PersistenciaLog();
            case 'persistenciaMensaje':
                return new PersistenciaMensaje();
            case 'persistenciaMuro':
                return new PersistenciaMuro();
            case 'persistenciaPersona':
                return new PersistenciaPersona();
            default:
                console.log("Error fabrica persistencia " + type)
        }
    }
}

module.exports = FabricaPersistencia;