import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
declare global {
  namespace Express {
    export interface Request {
      currentUser: any | null;
    }
  }

}
export function ensureCurrentUser(request : Request, response: Response, next : NextFunction) {
	if(!request.session?.jwt) {
		return next();
	}
	try {
		const payload = jwt.verify(request.session.jwt, process.env.JWT_KEY as string) ;
		request.currentUser = payload;
	} catch(err) {
	}
	return next();
} 