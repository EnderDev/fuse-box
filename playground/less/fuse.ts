import * as path from 'path';
import { fusebox, sparky, pluginLess } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      entry: 'src/index.tsx',
      webIndex: {
        template: 'src/index.html',
      },
      tsConfig: 'src/tsconfig.json',

      stylesheet: {
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: false,

      watch: true,
      hmr: true,
      plugins: [
        pluginLess('*.less', {
          asModule: { scopeBehaviour: 'local' },
        }),
      ],
      devServer: true,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
