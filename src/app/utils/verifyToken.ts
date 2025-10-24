
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.TOKEN_SECRET_KEY!) as JwtPayload;
};

export default verifyToken;
