import 'dotenv/config';
import app from '@/app';

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server is running at http://${baseUrl}:${PORT}`);
});
