

const validadorSchema = (schema) => (req, res, next) => {
    try{
        req.body = schema.parse(req.body); 
        next();
    }catch(error){

            if ( error.constructor.name === 'ZodError'){
                const errorMessages = error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            return res.status(400).json({
                status: false,
                errors: errorMessages
            });
        }

        next(error)
    }

}

export default validadorSchema;