const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
class LogicaLog {
    PersistenciaLog = fabricaPersistencia.createPersistencia('persistenciaLog');
    constructor() {
        if (!LogicaLog.instance) {
            LogicaLog.instance = this;
        }
        return LogicaLog.instance;
    }

    async nuevo(log) {
        await this.PersistenciaLog.nuevo(log)
    }

    async listar() {
        return await this.PersistenciaLog.listar()
    }
}
module.exports = LogicaLog;