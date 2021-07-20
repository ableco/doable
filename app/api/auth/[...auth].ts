import { passportAuth } from "blitz";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import db from "db";

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  strategies: [
    {
      authenticateOptions: { scope: "email profile" },
      strategy: new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          const email = profile.emails ? profile.emails[0]?.value : null;

          if (!email) {
            return done(new Error("Google OAuth response doesn't have email."));
          }

          const picture = profile._json.picture as string;
          const name = profile.displayName;

          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              picture,
              name,
            },
            update: { email, name, picture },
          });

          const publicData = {
            userId: user.id,
            roles: [user.role],
            source: "google",
          };

          done(null, { publicData });
        },
      ),
    },
  ],
});
