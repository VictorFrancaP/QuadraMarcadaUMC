import { connectionDB } from "./db.js";

class Loaders {
  start() {
    connectionDB();
  }
}

export default new Loaders();
