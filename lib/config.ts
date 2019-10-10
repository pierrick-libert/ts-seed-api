'use strict';

export default class Config {
  // PostgreSQL config
  public static readonly pgDB = process.env.PG_DB || '';
  public static readonly pgUser = process.env.PG_USER || '';
  public static readonly pgPass = process.env.PG_PASS || '';
  public static readonly pgHost = process.env.PG_HOST || '';
}
