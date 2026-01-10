import { z } from 'zod';


export const registrarPostulanteSchema = z.object({
    nombreCompleto: z
        .string()
        .min(1, 'El nombre no puede estar vacío')
        .max(256, 'El nombre no puede exceder los 256 caracteres')
        .regex(/^[^0-9]*$/, 'El nombre no debe contener números'),
    
    email: z
        .email('Formato de email inválido')
        .min(1, 'El email no puede estar vacío')
        .max(256, 'El email no puede exceder los 256 caracteres'),
        
    
    telefono: z
        .string()
        .regex(/^[\d\s\-\+]+$/, 'El teléfono solo debe contener números, espacios, guiones y el símbolo +')
        .min(6, 'El teléfono debe tener al menos 6 caracteres')
        .max(24, 'El teléfono no puede exceder los 24 caracteres'),
    
    georeferencia: z
        .string()
        .min(2, 'La georeferencia debe tener al menos 2 caracteres')
        .max(128, 'La georeferencia no puede exceder los 128 caracteres'),
    
    fechaNacimiento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
});
