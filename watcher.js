const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs-extra');
const browserSync = require('browser-sync').create();

const srcDir = 'src';
const distDir = 'dist';

function processCSS() {
    exec('npx tailwindcss build src/*.css -o dist/main.css', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
    });
}

async function copyOtherFiles() {
    try {
        await fs.copy(srcDir, distDir, {
            filter: (src, dest) => !src.endsWith('.css'), // Exclude CSS files
            errorOnExist: false,
            overwrite: true,
        });
    } catch (err) {
        console.error('Error copying other files:', err);
    }
}

chokidar.watch(srcDir).on('all', (event, path) => {
    // console.log(`File ${path} has been ${event}`);
    if (path.endsWith('.css')) {
        processCSS();
    } else {
        copyOtherFiles();
    }
});

browserSync.init({
    server: distDir
});

chokidar.watch(distDir).on('all', (event, path) => {
    console.log(`Reloading browser...`);
    browserSync.reload();
});
