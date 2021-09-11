const jwt = require('jsonwebtoken')

const auth = async(req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500;
        let decodedData ;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token,'secret')
            req.userId = decodedData?.id
        }else{
            decodedData = jwt.decode(token)
            req.userId = decodedData?.sub
        }
        next()
    }catch(e){
        if(e?.message === 'jwt expired'){
            return res.status(401).json({message : 'jwt expired'})
        }
        return res.json({message : 'Unauthenticated'})
    }
}

module.exports = auth