import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || "2191610",
  key: process.env.PUSHER_KEY || "5b2f6bed1958ab26a224",
  secret: process.env.PUSHER_SECRET || "d96f1502bbdf2ce3161b",
  cluster: process.env.PUSHER_CLUSTER || "ap2",
  useTLS: true,
});

