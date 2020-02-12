'use strict';

export class Config {

  // PostgreSQL config
  public static readonly pgDB = process.env.PG_DB || 'Your DB Name';
  public static readonly pgUser = process.env.PG_USER || '';
  public static readonly pgPass = process.env.PG_PASS || '';
  public static readonly pgHost = process.env.PG_HOST || '';
  public static readonly pgPort = parseInt(process.env.PG_PORT || '5111', 10) || 5111;

  // Generic config
  public static readonly nodeEnv = process.env.NODE_ENV || '';
  public static readonly secretKey = process.env.SECRET_KEY || 'navwei';

  // Sentry config
  public static readonly sentryDsn = process.env.SENTRY_DSN || '';
}
