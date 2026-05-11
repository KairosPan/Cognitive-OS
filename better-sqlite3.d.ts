declare module 'better-sqlite3' {
  interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  interface Database {
    exec(sql: string): this;
    prepare(sql: string): Statement;
    pragma(pragma: string, options?: any): any;
    transaction<T>(fn: (...args: any[]) => T): (...args: any[]) => T;
    close(): void;
  }

  interface DatabaseConstructor {
    new (filename: string, options?: any): Database;
    (filename: string, options?: any): Database;
  }

  const Database: DatabaseConstructor;
  export = Database;
}
