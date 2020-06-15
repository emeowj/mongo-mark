const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser());

const router = new Router();

router.get('/notes', (ctx, next) => {
  ctx.body = {};
});

const noteRouter = new Router({
  prefix: '/note',
});
noteRouter
  .get('/:note_id', (ctx, next) => {
    ctx.body = { id: ctx.params.note_id };
    next();
  })
  .put('/', (ctx, next) => {
    const request = ctx.request.body;
    console.log(`Creating note ${request}`);
    ctx.body = { status: 'ok' };
    next();
  })
  .delete('/:note_id', (ctx, next) => {
    console.log(`deleting note ${ctx.params.note_id}`);
    ctx.body = { status: 'ok' };
    next();
  })
  .patch('/:note_id', (ctx, next) => {
    console.log(`updating note ${ctx.params.note_id}`);
    ctx.body = { status: 'ok' };
    next();
  });

router.use(noteRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000;
console.log(`Koa app running at http://localhost:${port}`);
app.listen(3000);
