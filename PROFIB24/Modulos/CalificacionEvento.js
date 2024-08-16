class CalificacionEvento {
    constructor(idCalificacion, idEvento, idPersona, calificacion, fechaCalificacion) {
        this.idCalificacion = idCalificacion; 
        this.idEvento = idEvento;
        this.idPersona = idPersona;
        this.calificacion = Number(calificacion);
        this.fechaCalificacion = fechaCalificacion;
    }
}

module.exports = CalificacionEvento;