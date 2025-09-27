import type { NextFunction, Request, Response } from "express";
import prisma from "../db/DB.ts";

// Controller to Check Basic Health
export async function basicHealth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const uptimeSeconds = Math.floor(process.uptime());

        const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

        const healthResponse = {
            status: 'UP',
            service: 'TBK Services Backend',
            timestamp: new Date().toISOString(),
            uptime: `${uptimeSeconds} seconds`,
            memory: {
                used: `${memoryUsed} MB`,
                total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
            },
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        };

        return res.status(200).json(healthResponse);
    } 
    catch (error) {
        next(error);
    }
}

// Controller to Check Database Health
export async function databaseHealth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const startTime = Date.now();

        await prisma.$queryRaw`SELECT 1 as connection_test`;

        const responseTime = Date.now() - startTime;

        const databaseResponse = {
            status: 'UP',
            service: 'MYSQL Database',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime} ms`,
            connection: {
                status: 'CONNECTED',
                host: process.env.DATABASE_URL ? 'configured' : 'not-configured',
                type: 'MYSQL'
            }
        };

        return res.status(200).json(databaseResponse);
    } 
    catch (error) {
        const errorResponse = {
            status: 'DOWN',
            service: 'MYSQL Database',
            timestamp: new Date().toISOString(),
            error: {
                message: 'Database connection failed',
                code: 'DB_CONNECTION_ERROR'
            }
        };

        return res.status(503).json(errorResponse);
    }
}

// Controller to Check Comprehensive Health
export async function comprehensiveHealth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const healthReport = {
            status: 'UP',
            timestamp: new Date().toISOString(),
            service: 'TBK Services Backend',
            version: '1.0.0',
            checks: {} as any,
            summary: ''
        };

        let failedChecks = 0;
        const totalChecks = 2;

        try {
            const uptimeSeconds = Math.floor(process.uptime());
            const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

            healthReport.checks.application = {
                status: 'UP',
                uptime: `${uptimeSeconds} seconds`,
                memory: `${memoryUsed} MB`,
                responseTime: 'N/A'
            };
        }
        catch (error) {
            healthReport.checks.application = {
                status: 'DOWN',
                error: 'Application metris unavailable'
            };

            failedChecks++;
        }

        try {
            const dbStartTime = Date.now();

            await prisma.$queryRaw`SELECT 1 as connection_test`;

            const dbResponseTime = Date.now() - dbStartTime;

            healthReport.checks.database = {
                status: 'UP',
                responseTime: `${dbResponseTime} ms`,
                connection: 'CONNECTED',
                type: 'MYSQL'
            };
        }
        catch (error) {
            healthReport.checks.database = {
                status: 'DOWN',
                error: 'Database connection failed',
                connection: 'FAILED'
            };

            failedChecks++;
        }

        if(failedChecks === 0){
            healthReport.status = 'UP';
            healthReport.summary = `${totalChecks}/${totalChecks} services healthy`;
        }
        else if(healthReport.checks.database?.status === 'DOWN'){
            healthReport.status = 'DOWN',
            healthReport.summary = `Critical service failure - Database unavailable`;
        }
        else{
            healthReport.status = 'DEGRADED';
            healthReport.summary = `${totalChecks - failedChecks}/${totalChecks} services healthy`;
        }

        let httpStatusCode;
        switch (healthReport.status) {
            case 'UP':
                httpStatusCode = 200;
                break;
            case 'DEGRADED':
                httpStatusCode = 202;
                break;
            case 'DOWN':
                httpStatusCode = 503;
                break;
            default:
                httpStatusCode = 503;
        };

        return res.status(httpStatusCode).json(healthReport);
    } 
    catch (error) {
        next(error);
    }
}