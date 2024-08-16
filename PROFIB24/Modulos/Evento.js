class Evento {
    constructor(idEvento, nombre, descripcion, latitud,
        longitud, idCategoriaEvento, icono, idPersona, imagen, sonido, visual, duracion, fechaRecordatorio, estado, calificacion, fechaCreacion) {
        this.idEvento = idEvento;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.latitud = Number(latitud);
        this.longitud = Number(longitud);
        this.idCategoriaEvento = idCategoriaEvento;
        this.icono = icono;
        this.idPersona = idPersona;
        this.imagen = imagen;
        this.sonido = Boolean(sonido);
        this.visual = Boolean(visual);
        this.duracion = Number(duracion);
        this.fechaRecordatorio = fechaRecordatorio;
        this.estado = Boolean(estado);
        this.calificacion = calificacion;
        this.fechaCreacion = fechaCreacion;
    }
}

module.exports = Evento;