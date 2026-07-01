import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Prisma } from '../../generated/prisma/client';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = HttpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing fields"
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        switch (err.code) {

            // Unique constraint failed
            case "P2002":
                statusCode = HttpStatus.BAD_REQUEST;
                errorMessage = "Duplicate data. Unique field already exists.";
                break;

            // Record not found
            case "P2025":
                statusCode = HttpStatus.NOT_FOUND;
                errorMessage = "Record not found.";
                break;

            // Foreign key constraint failed
            case "P2003":
                statusCode = HttpStatus.BAD_REQUEST;
                errorMessage = "Foreign key constraint failed.";
                break;

            // Required field missing
            case "P2011":
                statusCode = HttpStatus.BAD_REQUEST;
                errorMessage = "Required field is missing.";
                break;

            // Invalid field value
            case "P2006":
                statusCode = HttpStatus.BAD_REQUEST;
                errorMessage = "Invalid value provided for a field.";
                break;

            // Invalid argument type
            case "P2005":
                statusCode = HttpStatus.BAD_REQUEST;
                errorMessage = "Invalid field value type.";
                break;

            // Database connection error
            case "P1001":
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                errorMessage = "Cannot connect to database server.";
                break;

            // Database timeout
            case "P1008":
                statusCode = HttpStatus.REQUEST_TIMEOUT;
                errorMessage = "Database operation timed out.";
                break;

            default:
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                errorMessage = "Prisma database error.";
        }
    }

    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = HttpStatus.UNAUTHORIZED;
            errorMessage = "Authentication failed check your credentials"
        }
        else if (err.errorCode === "P1001") {
            statusCode = HttpStatus.BAD_REQUEST;
            errorMessage = "Can not reach the database server"
        }

    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occured during query execution"
    }


    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        name: errorName,
        statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
        error: err.stack
    });
}

export default globalErrorHandler;