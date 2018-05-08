import * as Koa from "koa";
// Little hack to make the compiler happy.
import { Sequelize as SequelizeType, Options as SequelizeOptions } from "sequelize";
import * as Sequelize from "sequelize";
import { env } from "process";
import * as BodyParser from "koa-bodyparser";
import * as KoaRouter from "koa-router";
import * as Handler from "./handler";
import * as KoaJwt from "koa-jwt";
import * as KoaCors from "@koa/cors";
import { GetJwtKey } from "./utils";

const API_PREFIX = "/api/v1";

(async () => {
    const port = env.PORT || 8000;
    const dbConnInfo = {
        database: env.DB_NAME || "db",
        dialect: env.DB_DIALECT || "sqlite",
        storage: env.DB_STORAGE || "./user.db"
    };
    const app = new Koa();
    app.use(KoaCors({origin: '*'}));

    const db = new Sequelize(dbConnInfo);
    app.context.db = db;
    app.context.User = await getUserDB(db);

    app.use(BodyParser());
    app.use(getRouter().routes());

    console.log("Listening on localhost:" + port);
    app.listen(port);
})();

function getRouter(): KoaRouter {
    const publicRouter = new KoaRouter();
    publicRouter.post("/", Handler.NewUserHandler);

    const protectedRouter = new KoaRouter();
    protectedRouter.use(KoaJwt({ secret: GetJwtKey() }))
    protectedRouter.get("/", Handler.GetUserHandler);
    protectedRouter.delete("/", Handler.DeleteUserHandler);

    const router = new KoaRouter();
    router.use(API_PREFIX + "/user", publicRouter.routes(), publicRouter.allowedMethods());
    router.use(API_PREFIX + "/user", protectedRouter.routes(), protectedRouter.allowedMethods());

    // Should be last to avoid unnecessary secret token leak to other routes.
    // router.context.jwtSecret = routerConf.jwtSecret;
    router.post(API_PREFIX + "/token", Handler.GetTokenHandler);
    return router
}

async function getUserDB(db: SequelizeType): Promise<any> {
    const user = db.define('user', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        email: {
            type: Sequelize.TEXT,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: { type: Sequelize.TEXT, unique: true, allowNull: false },
        username: {
            type: Sequelize.TEXT,
            unique: true,
            allowNull: false,
        },
    });
    await user.sync({force: true});
    return Promise.resolve(user);
}
