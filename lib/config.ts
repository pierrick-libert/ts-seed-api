export class Config {

  // Generic config
  public static readonly nodeEnv = process.env.NODE_ENV || '';
  public static readonly secretKey = process.env.SECRET_KEY || 'ts-s33d-3p1';

  // Sentry config
  public static readonly sentryDsn = process.env.SENTRY_DSN || '';
}
