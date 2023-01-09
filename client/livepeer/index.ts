import { createReactClient, studioProvider } from "@livepeer/react";

const client = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
  }),
});

export default client;
