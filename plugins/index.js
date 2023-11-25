const esbuild = require('./esbuild');
const htmlTransform = require('./html-transform');
const lightningCss = require('./lightning-css');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const typedoc = require('./typedoc');
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(esbuild);
  eleventyConfig.addPlugin(htmlTransform);
  eleventyConfig.addPlugin(lightningCss);
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(typedoc);
};
