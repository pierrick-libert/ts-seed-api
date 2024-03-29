import {Connection, ConnectionManager, createConnection,
  getConnectionManager, getConnectionOptions} from 'typeorm';

export class Database {
  private static instance: Database;
  private name: string;
  private connection: Connection;
  private connectionManager: ConnectionManager;

  private constructor(name: string = 'default') {
    this.name = name;
    this.connectionManager = getConnectionManager();
  }

  // Singleton implementation
  public static getInstance(name: string = 'default'): Database {
    if (!Database.instance) {
      Database.instance = new Database(name);
    }
    return Database.instance;
  }

  public async getConnection(name: string | null = null): Promise<Connection> {
    // We check if the connection manager has the config loaded
    const hasConnection = this.connectionManager.has(name || this.name);
    if (hasConnection) {
      // If it is, we check if it's connected
      this.connection = this.connectionManager.get(name || this.name);
      if (!this.connection.isConnected) {
        this.connection = await this.connection.connect();
      }
    } else {
      // Otherwise we connect with the default config in the root project
      this.connection = await createConnection(await getConnectionOptions(name || this.name));
    }
    return this.connection;
  }
}
