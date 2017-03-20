import * as express from 'express';
import G from '../globals/G'

import sadmin from './services/SAdmin';
import suser from './services/SUser';
import sauth from './services/SAuth';
import sapp from "./services/SApp";
import slog from "./services/SLog";


var router = express.Router();

// API ROUTES
router.use('/api/sauth', sauth);
router.use('/api/sadmin', sadmin);
router.use('/api/suser', suser);
router.use('/api/sapp', sapp);
router.use('/api/slog', slog);

export default router;
