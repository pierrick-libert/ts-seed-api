export class Config {

  // Generic config
  public static readonly nodeEnv = process.env.NODE_ENV || 'dev';
  public static readonly secretKey = process.env.SECRET_KEY || 'ts-s33d-3p1';
  public static readonly isProd = process.env.NODE_ENV === 'production';

  // Sentry config
  public static readonly sentryDsn = process.env.SENTRY_DSN;
}
