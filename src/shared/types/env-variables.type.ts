export interface AppConfigType {
  environment: string;
  port: number;
  postgresUrl: string;
  redisHost: string;
  redisPort: number;
  jwtSecret: string;
}
