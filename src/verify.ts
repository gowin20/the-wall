import jwt from 'jsonwebtoken';

export const verifyJWT = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) return res.status(401).json({message:'Invalid token.', isLoggedIn:false});
    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenContents) => {
        if (err) return res.status(401).json({
            isLoggedIn:false,
            message:'Authentication error'
        });

        const { checkAdmin } = await import('./db/crud-users.js');
        const isAdmin = await checkAdmin(tokenContents.id);
        req.userInfo = {
            id:tokenContents.id,
            username:tokenContents.username,
            isAdmin
        };
        next();
    })
}