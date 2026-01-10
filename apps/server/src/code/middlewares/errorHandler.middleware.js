

export default function errorHandler(error, req, res, next ){
    const nombre = error.name || "ERROR_INTERNO"
    const mensaje = error.message || 'Error interno del servidor.'


    if (nombre === 'AuthError') {
        return res.status(400).json({
            message: mensaje,
            success: false
        });
    }

    if (nombre === 'RegistroError') {
        return res.status(400).json({
            message: mensaje,
            success: false
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
            message: message,
            success: false
        });
    }

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'El token de confirmación es inválido.',
            success: false
        });
    }

    if (error.name === 'NotBeforeError') {
        return res.status(401).json({
            message: 'El token de confirmación aún no es válido.',
            success: false
        });
    }

    

    return res.status(500).json({
        message: mensaje,
        success: false
    });
}