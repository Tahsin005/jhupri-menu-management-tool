import PusherClient from "pusher-js";

let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = (): PusherClient => {
  if (!pusherClientInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "5b2f6bed1958ab26a224";
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2";

    pusherClientInstance = new PusherClient(key, {
      cluster,
    });
  }
  return pusherClientInstance;
};

