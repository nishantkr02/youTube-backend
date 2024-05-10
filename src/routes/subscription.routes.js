import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const subscriptionRouter = Router();
 // Apply verifyJWT middleware to all routes in this file
 subscriptionRouter.use(verifyJWT);

//Toggle Susbcription ::
subscriptionRouter
    .route("/toggle-subscription/:channelId").post(toggleSubscription);

// All Subscriber of a channel
    subscriptionRouter.route("/total-subscribers/:channelId")
    .get(getUserChannelSubscribers);

// All channels subsscribedTo\
subscriptionRouter.route("/total-subscribed/:channelId")
.get(getSubscribedChannels);


export default subscriptionRouter