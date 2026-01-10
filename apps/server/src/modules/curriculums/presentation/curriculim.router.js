import { Router } from "express"
import { db } from "../../../shared/lowDb.js";
import { PostulanteRepository } from "../infrastructure/postulante.repository.js";
import { RegistrarPostulanteUseCase } from "../applicacion/RegistrarPostulanteUseCase.js";
import { CurriculumController } from "./curriculum.controller.js";
import validadorSchema from "../../../code/middlewares/validarSchema.middleware.js";
import { registrarPostulanteSchema } from "../../../code/schemas/registrarPostulante.schema.js";



const curriculumsRouter = Router();

// Repositorios.
const postulanteRepository = new PostulanteRepository(db);


// Casos de uso.
const registrarPostulante = new RegistrarPostulanteUseCase(postulanteRepository);
const modificarPostulante = new ModificarPostulanteUseCase(postulanteRepository);
const listarPostulantes = new ListarPostulantesUseCase(postulanteRepository);
const eliminarPostulante = new EliminarPostulanteUseCase(postulanteRepository);

// Controller
const curriculumController = new CurriculumController(
    registrarPostulante,
    modificarPostulante,
    listarPostulantes,
    eliminarPostulante
);

// Rutas
curriculumsRouter.post('/postulantes', validadorSchema(registrarPostulanteSchema), (req, res, next) => curriculumController.registrarPostulante(req, res, next));
curriculumsRouter.put('/postulantes/:id', (req, res, next) => curriculumController.modificarPostulante(req, res, next));
curriculumsRouter.delete('/postulantes/:id', (req, res, next) => curriculumController.eliminarPostulante(req, res, next));
curriculumsRouter.get('/postulantes', (req, res, next) => curriculumController.listarPostulantes(req, res, next));
export default curriculumsRouter;
