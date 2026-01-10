export class EliminarPostulanteUseCase {
    constructor(postulanteRepository) {
        this.postulanteRepository = postulanteRepository;
    }

    async execute(postulanteId) {
        if (!postulanteId) {
            throw new Error('El ID del postulante es requerido');
        }

        const postulante = await this.postulanteRepository.findById(postulanteId);
        
        if (!postulante) {
            throw new Error('Postulante no encontrado');
        }

        await this.postulanteRepository.delete(postulanteId);
        
        return true;
    }
}

