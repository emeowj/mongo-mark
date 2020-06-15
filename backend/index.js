const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello from Koa!';
});

const port = 3000;
console.log(`Koa app running at http://localhost:${port}`);
app.listen(3000);
