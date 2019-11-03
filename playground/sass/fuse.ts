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
        embedIndexedBundles: true,
      },
      tsConfig: 'src/tsconfig.json',

      stylesheet: {
        autoImport: [{ file: 'src/resources/resources.scss' }],
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: true,

      watch: true,
      hmr: true,

      devServer: true,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
