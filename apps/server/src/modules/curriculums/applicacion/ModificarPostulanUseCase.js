import { throwError } from '../../../code/excepciones/throwError.js';


export class ModificarPostulanteUseCase {
    constructor(postulanteRepository) {
        this.postulanteRepository = postulanteRepository;
    }

    async execute({ id, nombreCompleto, email, telefono, georeferencia, fechaNacimiento }) {
        if (!id) {
            throwError('ModificacionError', 'El ID del postulante es obligatorio.');
        }

        const postulanteExistente = await this.postulanteRepository.buscarPorId(id);
        if (!postulanteExistente) {
            throwError('ModificacionError', 'El postulante no existe.');
        }

        if (email && email !== postulanteExistente.email) {
            const postulanteConEmail = await this.postulanteRepository.buscarPorEmail(email);
            if (postulanteConEmail) {
                throwError('ModificacionError', 'El email ya está registrado por otro postulante.');
            }
        }

        if (telefono && telefono !== postulanteExistente.telefono) {
            const postulanteConTelefono = await this.postulanteRepository.buscarPorTelefono(telefono);
            if (postulanteConTelefono) {
                throwError('ModificacionError', 'El teléfono ya está registrado por otro postulante.');
            }
        }

        const datosActualizados = {
            nombreCompleto: nombreCompleto || postulanteExistente.nombreCompleto,
            email: email || postulanteExistente.email,
            telefono: telefono || postulanteExistente.telefono,
            georeferencia: georeferencia || postulanteExistente.georeferencia,
            fechaNacimiento: fechaNacimiento || postulanteExistente.fechaNacimiento
        };

        const postulanteActualizado = await this.postulanteRepository.modificarPostulante(
            id,
            datosActualizados
        );

        if (!postulanteActualizado) {
            throwError('ModificacionError', 'Ocurrió un error al modificar el postulante.');
        }

        return postulanteActualizado;
    }
}