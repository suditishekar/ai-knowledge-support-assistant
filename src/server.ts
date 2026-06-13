import { app } from './app';
import { connectDatabase } from './config/database';
import { config } from './config/env';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

void startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Failed to start server';
  console.error(message);
  process.exit(1);
});
