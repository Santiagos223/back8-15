const LogicaPersona = require('../Logica/LogicaPersona');
const LogicaLog = require('../Logica/LogicaLog');
const LogicaMuro = require('../Logica/LogicaMuro');
const LogicaMensaje = require('../Logica/LogicaMensaje');
const LogicaCalificacion = require('../Logica/LogicaCalificacion');
const LogicaEvento = require('../Logica/LogicaEvento');
const LogicaCategoria = require('../Logica/LogicaCategoria');
class FabricaLogica {
    constructor() {
        if (!FabricaLogica.instance) {
            FabricaLogica.instance = this;
        }
        return FabricaLogica.instance;
    }
    createLogica(type) {
        switch(type) {
            case 'logicaCalificacion':
                return new LogicaCalificacion();
            case 'logicaCategoria':
                return new LogicaCategoria();
            case 'logicaEvento':
                return new LogicaEvento();
            case 'logicaLog':
                return new LogicaLog();
            case 'logicaMensaje':
                return new LogicaMensaje();
            case 'logicaMuro':
                return new LogicaMuro();
            case 'logicaPersona':
                return new LogicaPersona();
            default:
                console.log("Error fabrica logica " + type)
        }
    }
}

module.exports = FabricaLogica;