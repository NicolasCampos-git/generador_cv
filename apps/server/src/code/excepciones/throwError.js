

export function throwError( nombre, mensaje){
    const error = new Error(mensaje);
    
    error.name = nombre;

    throw error;
}
