import { createReactClient, studioProvider } from "@livepeer/react";

const client = createReactClient({
  provider: studioProvider({ apiKey: "56d2c06e-1128-4121-80ee-9f8bb72b78d7" }),
});

export default client;
