const fs = require("fs-extra");

async function build() {
  // delete dist directory
  await fs.remove("dist");

  // tailwind build
  exec(
    "npx tailwindcss build src/*.css -o dist/main.css",
    (error, _, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    }
  );

  // copy other files
  try {
    await fs.copy("src", "dist", {
      filter: (src, dest) => !src.endsWith(".css"), // Exclude CSS files
      errorOnExist: false,
      overwrite: true,
    });
  } catch (err) {
    console.error("Error copying other files:", err);
  }

  console.log("Build complete!");
}
