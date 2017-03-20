import * as express from 'express';
import { DB } from '../../db/DB'
import { DBException } from '../../db/DBException'
import { Response } from '../Response';
import {
    App,
    User,
    SAuth
} from "../../../lib/core-lib/src"

var router = express.Router();

router.use("/register", async (req, res) => {
    var request = req.body as SAuth.RegisterRequest;
    try {
        var user = await DB.User.findOneAsync(request.mail.toLowerCase());
        if (user != null) {
            Response.sendError(res, `username "${request.mail}" is already used`);
        }
        else {
            var newUser = {} as User;
            newUser.firstname = request.firstname;
            newUser.lastname = request.lastname;
            newUser.username = request.mail;
            newUser.password = "1234";
            newUser.mail = request.mail;
            newUser.appNames = [];
            await DB.User.insertOneAsync(newUser);
            let apps = await DB.App.findByIdsAsync(newUser.appNames);
            Response.send(res, {
                user: newUser,
                apps: apps
            } as SAuth.RegisterResponse);
        }
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

router.use("/login", async (req, res) => {
    try {
        var request = req.body as SAuth.LoginRequest;
        let user = await DB.User.findOneAsync(request.mail.toLowerCase());
        if (user == null) {
            Response.sendError(res, `username "${request.mail}" not found`);
        }
        else {
            let apps = await DB.App.findByIdsAsync(user.appNames);
            Response.send(res, {
                user: user,
                apps: apps
            } as SAuth.LoginResponse)
        }
    }
    catch (ex) {
        Response.sendError(res, ex);
    }
});

router.use("/logout", (req, res) => {
    var request = req.body as SAuth.LogoutRequest;
    Response.sendMessage(res, `logout "${request.mail}"`);
});

export default router;