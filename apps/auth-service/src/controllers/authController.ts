import { Request, Response, NextFunction} from 'express';
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData } from '../utils/authHelper';
import prisma from "../../../../packages/libs/prisma/index"
import { ValidationError } from '../../../../packages/error-handler';

// Register a new user

export const userRegistration = async (req : Request, res : Response, next : NextFunction) => {
    try{
        validateRegistrationData(req.body,"user");
        const {name,email} = req.body;

        const existingUser = await prisma.users.findUnique({where : email});

        if(existingUser){
            return next(new ValidationError("User already exists with the given email"))
        };

        await checkOtpRestrictions(email,next);
        await trackOtpRequests(email,next);
        await sendOtp(name,email,"user-activation-mail");

        return res.status(200).send({message : "OTP sent to your email. Please verify to complete registration"})
    }catch(err){
        return next(err);
    }
}