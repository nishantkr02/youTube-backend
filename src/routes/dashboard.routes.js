import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router()

dashboardRouter.use(verifyJWT)


dashboardRouter.route("/channel-stats/:channelId").get(getChannelStats)


dashboardRouter.route("/all-videos/:channelId").get(getChannelVideos)

export default dashboardRouter