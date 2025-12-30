import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if( !authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    if(decoded.role !== 'user') {
      return res.status(403).json({ success: false, message: "Something went wrong" });
    }

    req.user = { id: decoded.id, role: decoded.role, phone: decoded.phone };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
}