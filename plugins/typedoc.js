const TypeDoc = require("typedoc");

async function generateDocs() {
    // Application.bootstrap also exists, which will not load plugins
    // Also accepts an array of option readers if you want to disable
    // TypeDoc's tsconfig.json/package.json/typedoc.json option readers
    const app = await TypeDoc.Application.bootstrapWithPlugins({
        entryPoints: ["src/retro-sound.ts"],
    });

    const project = await app.convert();

    if (project) {
        // Project may not have converted correctly
        const outputDir = "dist/reference";

        // Rendered docs
        await app.generateDocs(project, outputDir);
    }
}

module.exports = (eleventyConfig) => {
	eleventyConfig.on('afterBuild', generateDocs);
}
