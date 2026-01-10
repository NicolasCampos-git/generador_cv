
export class ListarPostulantesUseCase {
    constructor(postulantesRepository) {
        this.postulantesRepository = postulantesRepository;
    }

    async execute(filters = {}) {
        return await this.postulantesRepository.findAll(filters);
    }
}

