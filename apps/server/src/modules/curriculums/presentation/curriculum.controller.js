export class CurriculumController {
    constructor(registrarPostulanteUseCase, modificarPostulanteUseCase, eliminarPostulanteUseCase,listarPostulantesUseCase ) {
        this.registrarPostulanteUseCase = registrarPostulanteUseCase;
        this.modificarPostulanteUseCase = modificarPostulanteUseCase;
        this.eliminarPostulanteUseCase = eliminarPostulanteUseCase;
        this.listarPostulantesUseCase = listarPostulantesUseCase;
    }

    async listarPostulantes(req, res, next) {
        try {
            const result = await this.listarPostulantesUseCase.execute();
            
            return res.status(200).json({
                success: true,
                data: result,
                message: 'Postulantes listados correctamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async registrarPostulante( req, res, next ){
        try {
            const { nombreCompleto, email, telefono, georeferencia, fechaNacimiento } = req.body;
            
            const result = await this.registrarPostulanteUseCase.execute({
                nombreCompleto,
                email,
                telefono,
                georeferencia,
                fechaNacimiento
            });
            
            return res.status(201).json({
                success: true,
                data: result,
                message: 'Postulante registrado correctamente'
            });
        } catch (error) {
            next(error)
        }
    }

    async modificarPostulante(req, res, next) {
        try {
            const { id } = req.params;
            const { nombreCompleto, email, telefono, georeferencia, fechaNacimiento } = req.body;
            
            const result = await this.modificarPostulanteUseCase.execute({
                id,
                nombreCompleto,
                email,
                telefono,
                georeferencia,
                fechaNacimiento
            });
            
            return res.status(200).json({
                success: true,
                data: result,
                message: 'Postulante modificado correctamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async eliminarPostulante(req, res, next) {
        try {
            const { id } = req.params;
            
            await this.eliminarPostulanteUseCase.execute({ id });
            
            return res.status(200).json({
                success: true,
                message: 'Postulante eliminado correctamente'
            });
        } catch (error) {
            next(error);
        }
    }
}