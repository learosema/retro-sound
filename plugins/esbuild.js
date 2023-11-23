// kudos to https://github.com/madrilene/eleventy-excellent
// CSS and JavaScript as first-class citizens in Eleventy: https://pepelsbey.dev/articles/eleventy-css-js/

const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const SCRIPTS = ['retro-sound.ts', 'demo.ts'];


module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('ts');

  eleventyConfig.addExtension('ts', {
    outputFileExtension: 'js',
    compile: async (content, fullPath) => {
      const parsedPath = path.parse(fullPath);

      if (! SCRIPTS.includes(path.basename(fullPath))) {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [fullPath],
		  format: 'esm',
          minify: isProduction,
          bundle: true,
          write: false,
          sourcemap: !isProduction,
        });

        return output.outputFiles[0].text;
      };
    },
  });
};
