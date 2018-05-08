import * as KoaRouter from "koa-router";
import * as jwt from "jsonwebtoken";
import { GetJwtKey } from "./utils"
import * as bcrypt from "bcrypt";

export type RouterContext = KoaRouter.IRouterContext;
export type RouterNext = () => Promise<any>;

export async function NewUserHandler(ctx: RouterContext, next: RouterNext): Promise<any> {
    const body = ctx.request.body;
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await ctx.User.create({
        email: body.email,
        password: hashedPassword,
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
        }
    });

    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect) {
        ctx.throw(401);
        return;
    }

    let token = jwt.sign({id: user.id}, GetJwtKey(), {
        expiresIn: "1h",
    });

    ctx.body = {
        token: token,
    };
}
