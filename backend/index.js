const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser());

if (process.env.NODE_ENV === 'development') {
  app.use(async (context, next) => {
    await next();
    context.set({
      'Access-Control-Allow-Origin': '*',
    });
  });
}

const router = new Router();

// Used to store all notes in meomry
const notes = new Map();

// Add some test notes so we don't get an empty list when nodemon restarts
// the application.
if (process.env.NODE_ENV === 'development') {
  const now = new Date().getTime();
  for (i in [1, 2, 3]) {
    notes.set(`test-note-${i}`, {
      title: 'Test note',
      content: 'hello',
      created: now,
      updated: now,
    });
  }
}

router.get('/notes', (ctx, next) => {
  ctx.body = Array.from(notes.values());
});

const noteRouter = new Router({
  prefix: '/note',
});
noteRouter
  .get('/:note_id', (ctx, next) => {
    const id = ctx.params.note_id;
    if (notes.has(id)) {
      ctx.body = notes.get(id);
    } else {
      ctx.status = 404;
      ctx.body = {
        error: `Note with id ${id} does not exits`,
      };
    }
  })
  .put('/', (ctx, next) => {
    const request = ctx.request.body;
    const now = new Date().getTime();
    const note = {
      id: `${notes.size}`,
      title: request.title || 'No title',
      content: request.content || '',
      created: now,
      updated: now,
    };
    notes.set(note.id, note);
    console.log(`Created note ${note.id}`);
    ctx.status = 201;
    ctx.body = note;
  })
  .delete('/:note_id', (ctx, next) => {
    const id = ctx.params.note_id;
    if (notes.has(id)) {
      notes.delete(id);
      console.log(`Deleted note ${id}`);
      ctx.status = 204;
      ctx.body = {};
    } else {
      ctx.status = 404;
      ctx.body = {
        error: `Note with id ${id} does not exits`,
      };
    }
  })
  .patch('/:note_id', (ctx, next) => {
    const id = ctx.params.note_id;
    if (notes.has(id)) {
      const now = new Date().getTime();
      const request = ctx.request.body;
      const note = notes.get(id);
      const updates = {
        updated: now,
        title: request.title || note.title,
        content: request.content || note.content,
      };
      const updated = Object.assign(note, updates);
      notes.set(id, updated);
      console.log(`Updated note ${id}`);
      ctx.status = 202;
      ctx.body = updated;
    } else {
      ctx.status = 404;
      ctx.body = {
        error: `Note with id ${id} does not exits`,
      };
    }
  });

router.use(noteRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000;
console.log(`Koa app running at http://localhost:${port}`);
app.listen(3000);
