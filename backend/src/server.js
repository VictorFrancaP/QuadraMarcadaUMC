import { app } from "./app.js";
import "dotenv/config.js";
import loaders from "./loaders/index.js";

const port = process.env.PORT || 5000;

loaders.start();

app.listen(port, () => {
  console.log(`Server is running in port: ${port}`);
});
