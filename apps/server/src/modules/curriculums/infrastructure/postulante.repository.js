import crypto from "node:crypto";
import Postulante from "../domain/postulante.model.js"
export class PostulanteRepository {
    constructor(lowdb) {

        this.db = lowdb;
        
    }

    async listarPostulantes() {
        const postulantes = this.db.data.postulantes.filter(p => !p.fechaHoraEliminacion);
        return postulantes.map(p => new Postulante(p));
    }



    async buscarPorId(id) {
        const postulante = this.db.data.postulantes.find(p => p.id === id && !p.fechaHoraEliminacion);
        return postulante ? new Postulante(postulante) : null;
    }

    async buscarPorEmail(email) {
        const postulante = this.db.data.postulantes.find(p => p.email === email && !p.fechaHoraEliminacion);
        return postulante ? new Postulante(postulante) : null;
    }

    async buscarPorTelefono(telefono) {
        const postulante = this.db.data.postulantes.find(p => p.telefono === telefono && !p.fechaHoraEliminacion);
        return postulante ? new Postulante(postulante) : null;
    }

    async registrarPostulante( nombreCompleto, email, telefono, georeferencia, fechaNacimiento){


        const nuevoPostulante = {
            id: crypto.randomUUID(),
            nombreCompleto: nombreCompleto,
            email: email,
            telefono: telefono,
            georeferencia: georeferencia,
            fechaNacimiento: fechaNacimiento,
            fechaHoraCreacion: new Date(),
            fechaHoraModificacion: null,
            fechaHoraEliminacion: null
        }

        this.db.data.postulantes.push(nuevoPostulante);
        await this.db.write();

        return new Postulante(nuevoPostulante)

    }

    async editarPostulante(id, { nombreCompleto, email, telefono, georeferencia }) {
        
        const idStr = String(id);

        const index = this.db.data.postulantes.findIndex(
            p => String(p.id) === idStr && !p.fechaHoraEliminacion
        );

        if (index === -1) return null;

        const postulante = this.db.data.postulantes[index];

        if (nombreCompleto !== undefined) postulante.nombreCompleto = nombreCompleto;
        if (email !== undefined) postulante.email = email;
        if (telefono !== undefined) postulante.telefono = telefono;
        if (georeferencia !== undefined) postulante.georeferencia = georeferencia;

        postulante.fechaHoraModificacion = new Date();

        this.db.data.postulantes[index] = postulante;
        await this.db.write();

        return new Postulante(postulante);
    }

    async eliminarPostulante(id) {
        const idStr = String(id);
        
        const index = this.db.data.postulantes.findIndex(
            p => String(p.id) === idStr && !p.fechaHoraEliminacion
        );
        
        if (index === -1) return null;
        
        this.db.data.postulantes[index].fechaHoraEliminacion = new Date();
        await this.db.write();
        
        return new Postulante(this.db.data.postulantes[index]);
    }



    


}