import * as express from 'express';
import { App, AppEx, SApp, AppSettings } from "../../../lib/core-lib/src";
import { Response } from '../Response';
import { Version, AppTypes } from '../../../lib/core-lib/src/';
import { DBException } from "../../db/DBException";
import { DB } from "../../db/DB";

var router = express.Router();

router.use("/findAll", async (req, res) => {
    try {
        var apps = await DB.App.findAllAsync();
        Response.send(res, {
            apps: apps
        } as SApp.FindAllResponse);
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

router.use("/updateVersion", async (req, res) => {
    try {
        var request = req.body as SApp.UpdateVersionRequest;
        var app = await DB.App.findOneAsync(request.appName);
        var hasToUpdate = false;
        if (request.appType == AppTypes.Mobile) {
            app.versionMob = request.version;
            hasToUpdate = true;
        }
        else if (request.appType == AppTypes.Node) {
            app.versionNod = request.version;
            hasToUpdate = true;
        }
        if (hasToUpdate) {
            await DB.App.updateOneAsync(app);
            Response.send(res, {
                responseStatus: {
                    message: "version updated"
                }
            } as SApp.UpdateVersionResponse);
        }
        else {
            Response.send(res, {
                responseStatus: {
                    message: "nothing to updated"
                }
            } as SApp.UpdateVersionResponse);
        }
    }
    catch (ex) {
        Response.sendError(res, "error updating version");
    }
});

router.use("/findByName", async (req, res) => {
    try {
        var request = req.body as SApp.FindByNameRequest;
        let app = await DB.App.findOneAsync(request.appName);
        if (app == null) {
            Response.sendError(res, `app "${request.appName}" not found`);
        }
        else {
            Response.send(res, {
                app: app
            } as SApp.FindByNameResponse);
        }
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

router.use("/findByNames", async (req, res) => {
    try {
        var request = req.body as SApp.FindByNamesRequest;
        let apps = await DB.App.findByIdsAsync(request.appNames);
        var notFound = new Array<String>();
        request.appNames.forEach((appName) => {
            let isFound = false;
            apps.forEach((app) => {
                if (app.name === appName) {
                    isFound = true;
                }
            });
            if (!isFound) {
                notFound.push(appName);
            }
        });
        Response.send(res, {
            apps: apps,
            notFound: notFound
        } as SApp.FindByNamesResponse);
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

router.use("/insertOne", async (req, res) => {
    try {
        var request = req.body as SApp.InsertOneRequest;
        let apps = await DB.App.findOneAsync(request.app.name);
        if (apps != null) {
            Response.sendError(res, `app with name "${request.app.name}" already exists`);
        }
        else {
            var newApp = Object.assign({} as App, request.app);
            await DB.App.insertOneAsync(newApp);

            Response.send(res, {
                app: newApp
            } as SApp.InsertOneResponse);
        }
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

export default router;