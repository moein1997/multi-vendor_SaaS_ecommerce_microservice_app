import crypto from 'crypto';

import {ValidationError} from "../../../../packages/error-handler/index";
 
import redis from "../../../../packages/libs/redis/index";

import { sendEmail } from './sendMail';
import { NextFunction } from 'express';

const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data : any, userType : "user" | "seller")=>{
    const {name, email, password, phoneNumber, country} = data;
    if(!name || !email || !password || (userType === "seller" && (!phoneNumber || !country))){
        throw new ValidationError("Missing Required Fields")
    }

    if(!emailRegx.test(email)){
        throw new ValidationError("Invalid email format!")
    }
}

export const checkOtpRestrictions = async (email:string,next:NextFunction)=>{
    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account locked due to multiple failed OTP attempts. Please try again later"));
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests. Please try again later"));
    }
    if(await redis.get(`otp_cooldown : ${email}`)){
        return next(new ValidationError("OTP already sent. Please wait before requesting a new one"));
    }
}

export const sendOtp = async(name:string,email:string,template:string)=>{
    const otp = crypto.randomInt(1000,9999).toString();
    await sendEmail(email,"Verify your email", template , {name,otp});
    await redis.set(`otp : ${email}`,otp,"EX",300);
    await redis.set(`otp_coold own : ${email}`,"true","EX",60)

}

export const trackOtpRequests = async(email:string,next:NextFunction)=>{
    const otpRequestsKey = `otp_requests_count : ${email}`;
    let otpRequests = parseInt(await redis.get(otpRequestsKey) || "0");
    if(otpRequests >=2){
        redis.set(`otp_spam_lock : ${email}`,"true","EX",3600);
        return next(new ValidationError("Too many OTP requests. Please try again later"));
    }
    await redis.set(otpRequestsKey,(otpRequests + 1).toString(),"EX",3600);
}

export const trackFailedOtpAttempts = async(email:string,next:NextFunction)=>{
    const attempts = await redis.incr(`otp_failed_attempts : ${email}`);
    if(attempts === 1){
        await redis.expire(`otp_failed_attempts : ${email}`,900);
    }
    if(attempts > 5){
        await redis.set(`otp_lock : ${email}`,"true","EX",3600);
        return next(new ValidationError("Account locked due to multiple failed OTP attempts. Please try again later"));
    }
}
export const clearOtpData = async(email:string)=>{
    await Promise.all([
        redis.del(`otp : ${email}`),
        redis.del(`otp_cooldown : ${email}`),
        redis.del(`otp_failed_attempts : ${email}`),
        redis.del(`otp_requests : ${email}`)
    ])
}