import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUBLIC_DIR = path.resolve(__dirname, '../public');

app.use(express.static(PUBLIC_DIR));
app.get('*', (_req: Request, res: Response) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`SkateHubba server running on port ${port}`);
});