
class Postulante {
    /**
     * @param {Object} props
     * @param {string} props.id
     * @param {string} props.nombreCompleto
     * @param {string} props.email
     * @param {string} props.telefono
     * @param {string} props.georeferencia
     * @param {Date} props.fechaNacimiento
     */
    constructor({ id = null, nombreCompleto = '', email = '', telefono = '', georeferencia = '', fechaNacimiento = null } = {}) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.georeferencia = georeferencia;
        this.fechaNacimiento = fechaNacimiento ? (fechaNacimiento instanceof Date ? fechaNacimiento : new Date(fechaNacimiento)) : null;
    }


}

export default Postulante;