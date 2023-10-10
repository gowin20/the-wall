import jwt from 'jsonwebtoken';

export const verifyJWT = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) return res.json({msg:'Invalid token provided', isLoggedIn:true});
    
    jwt.verify(token, process.env.JWT_SECRET, (err, tokenContents) => {
        if (err) return res.json({
            isLoggedIn:false,
            message:'Authentication error'
        });
        req.user = {};
        req.user.id = tokenContents.id;
        req.user.username = tokenContents.username;
        next();
    })
  }