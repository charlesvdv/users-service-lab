import * as KoaRouter from "koa-router";
import * as jwt from "jsonwebtoken";
import { GetJwtKey } from "./utils"

export type RouterContext = KoaRouter.IRouterContext;
export type RouterNext = () => Promise<any>;

export async function NewUserHandler(ctx: RouterContext, next: RouterNext): Promise<any> {
    const body = ctx.request.body;
    const user = await ctx.User.create({
        email: body.email,
        password: body.password,
        username: body.username,
    });

    ctx.body = {
        id: user.id
    };
}

export async function GetUserHandler(ctx: RouterContext, next: RouterNext): Promise<any> {
    const user = await ctx.User.findById(ctx.state.user.id);

    ctx.body = {
        id: user.id,
        email: user.email,
        username: user.username,
    }
}

export async function DeleteUserHandler(ctx: RouterContext, next: RouterNext): Promise<any> {
    const user = await ctx.User.findById(ctx.state.user.id);
    await user.destroy();
    ctx.body = "";
}

export async function GetTokenHandler(ctx: RouterContext, next: RouterNext): Promise<any> {
    const body = ctx.request.body;

    const user = await ctx.User.findOne({
        where: {
            username: body.username,
            password: body.password,
        }
    });

    let token = jwt.sign({id: user.id}, GetJwtKey(), {
        expiresIn: "1h",
    });

    ctx.body = {
        token: token,
    };
}
