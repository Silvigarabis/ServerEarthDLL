import { Logger, log } from "./yoni/util/Logger.js";
import { load } from "./yoni/loader.js";

let logger = new Logger("MAIN");

const loadList = [
    "./earthdll.js"
];

Promise.allSettled(
    loadList
        .map(path => import(path))
        .map(pro => pro.catch(logger.error))
)
.finally(() => logger.info("scripts MAIN end"));