const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const { Note } = require('./model.js');

const app = new Koa();
app.use(bodyParser());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to: ' + db.name);
});

if (process.env.NODE_ENV === 'development') {
  app.use(async (context, next) => {
    await next();
    context.set({
      'Access-Control-Allow-Origin': '*',
    });
  });
}

const router = new Router();

router.get('/notes', async (ctx) => {
  await Note.find({}, 'title content created updated')
    .exec()
    .then((notes) => {
      ctx.status = 200;
      ctx.body = notes;
    });
});

const noteRouter = new Router({
  prefix: '/note',
});
noteRouter
  .get('/:note_id', async (ctx) => {
    const id = ctx.params.note_id;
    await Note.findById(id)
      .exec()
      .then((note) => {
        if (!note) ctx.throw(404, `no note with id ${id}`);
        ctx.status = 200;
        ctx.body = note;
      });
  })
  .put('/', async (ctx) => {
    const request = ctx.request.body;
    const note = new Note({
      title: request.title || 'No title',
      content: request.content || '',
    });
    await note
      .save()
      .exec()
      .then((note) => {
        if (!note) ctx.throw(404, `no note with id ${id}`);
        console.log(`Created note ${note._id}`);
        ctx.status = 201;
        ctx.body = note;
      });
  })
  .delete('/:note_id', async (ctx) => {
    const id = ctx.params.note_id;
    await Note.findByIdAndDelete(id)
      .exec()
      .then((note) => {
        if (!note) ctx.throw(404, `no note with id ${id}`);
        ctx.status = 204;
        ctx.body = {};
      });
  })
  .patch('/:note_id', async (ctx) => {
    const id = ctx.params.note_id;
    const now = new Date().getTime();
    const request = await ctx.request.body;
    const updates = {
      updated: now,
    };
    if (request.title) {
      updates.title = request.title;
    }
    if (request.content) {
      updates.content = request.content;
    }
    await Note.findByIdAndUpdate(id, updates)
      .exec()
      .then((note) => {
        if (!note) ctx.throw(404, `no note with id ${id}`);
        ctx.status = 202;
        ctx.body = note;
      });
  });

router.use(noteRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000;
console.log(`Koa app running at http://localhost:${port}`);
app.listen(3000);
