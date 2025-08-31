import * as client from "openid-client";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-openidconnect";
import crypto from "crypto";

type VerifyFunction = (
  issuer: string,
  profile: any,
  context: any,
  idToken: string,
  accessToken: string,
  refreshToken: string,
  verified: passport.AuthenticateCallback,
) => void;
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.Issuer.discover(
      process.env.ISSUER_URL ?? "https://replit.com/oidc",
    ).then(
      (issuer) =>
        new issuer.Client({
          client_id: process.env.REPL_ID!,
          client_secret: process.env.CLIENT_SECRET!,
        }),
    );
  },
  { maxAge: 3600 * 1000 },
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "skatehubba.sid",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: "strict",
    },
    rolling: true, // Reset expiry on activity
    genid: () => crypto.randomBytes(32).toString("hex"),
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    issuer: string,
    profile: any,
    context: any,
    idToken: string,
    accessToken: string,
    refreshToken: string,
    verified: passport.AuthenticateCallback,
  ) => {
    const user = {
      access_token: accessToken,
      refresh_token: refreshToken,
      claims: profile,
      expires_at: profile.exp,
    };
    await upsertUser(profile);
    verified(null, user);
  };

  const replitDomains = process.env.REPLIT_DOMAINS?.split(",") || [];
  const allowedDomains = [
    "localhost:5000",
    "0.0.0.0:5000",
    `${process.env.REPL_SLUG || "skatehubba"}.${process.env.REPL_OWNER || "replituser"}.repl.co`,
    ...replitDomains,
  ];

  for (const domain of allowedDomains) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        issuer: config.issuer.metadata.issuer,
        authorizationURL: config.issuer.metadata.authorization_endpoint,
        tokenURL: config.issuer.metadata.token_endpoint,
        userInfoURL: config.issuer.metadata.userinfo_endpoint,
        clientID: process.env.REPL_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      // Simple logout redirect without end session URL for now
      res.redirect(`${req.protocol}://${req.hostname}`);
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenSet = await config.refresh(refreshToken);
    user.access_token = tokenSet.access_token;
    user.refresh_token = tokenSet.refresh_token;
    user.expires_at = tokenSet.expires_at;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
