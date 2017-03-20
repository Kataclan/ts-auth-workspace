import { ObjectID } from "mongodb";
import * as express from 'express';
import { DB } from '../../db/DB';
import {
    FrameLog,
    EventLog,
    SLog
} from "../../../lib/core-lib/src";
import { Response } from '../Response';

var router = express.Router();

router.use("/setFrameLog", async (req, res) => {
    try {
        var request = req.body as SLog.SetFrameLogRequest;
        var log = Object.assign({} as FrameLog, request.log);
        log.date = new Date();
        await DB.FrameLog.insertOneAsync(log);

        Response.send(res, {
            log: log
        } as SLog.SetFrameLogResponse);
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});
router.use("/setEventLog", async (req, res) => {
    try {
        var request = req.body as SLog.SetEventLogRequest;
        var log = Object.assign({} as EventLog, request.log);
        log.date = new Date();
        await DB.EventLog.insertOneAsync(log);

        Response.send(res, {
            log: log
        } as SLog.SetEventLogResponse);
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

export default router;