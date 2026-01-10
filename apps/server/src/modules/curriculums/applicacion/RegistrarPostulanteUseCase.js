

import { throwError } from '../../../code/excepciones/throwError.js';

export class RegistrarPostulanteUseCase {
    constructor(postulanteRepository) {
        this.postulanteRepository = postulanteRepository;
    }
    async execute({ nombreCompleto, email, telefono, georeferencia, fechaNacimiento }) {

        if (!nombreCompleto || !email || !telefono || !georeferencia || !fechaNacimiento) {
            throwError('RegistroError', 'Todos los campos son obligatorios.');
        }

        const postulanteExistentePorEmail = await this.postulanteRepository.buscarPorEmail(email);
        if (postulanteExistentePorEmail) {
            throwError('RegistroError', 'El email ya está registrado.');
        }

        const postulanteExistentePorTelefono = await this.postulanteRepository.buscarPorTelefono(telefono);
        if (postulanteExistentePorTelefono) {
            throwError('RegistroError', 'El teléfono ya está registrado.');
        }

        const postulante = await this.postulanteRepository.registrarPostulante(
            nombreCompleto,
            email,
            telefono,
            georeferencia,
            fechaNacimiento
        );

        if (!postulante){
            throwError('RegistroError', 'Ocurrio un error al registrar al postulante.');
        }

        return postulante;
    }
}