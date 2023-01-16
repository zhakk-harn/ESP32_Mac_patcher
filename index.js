const { exec } = require("child_process");
const { homedir } = require("os");
const glob = require("glob");
const { join } = require("path");
const fs = require("fs").promises;

let pyPath = null;

exec("which python", async (err, stdout, stderr) => {
  pyPath = stdout;

  console.log(`found python version: ${pyPath}`);

  const matches = await glob(
    join(
      homedir(),
      "/Library/Arduino15/package/esp32/hardware/esp32/*/platform.txt"
    )
  );

  console.log(`found platform.txt at: ${matches[0]}`);

  const content = await fs.readFile(matches[0]);

  const fixedContent = content.replace(
    "tools.gen_esp32part.cmd=python",
    `tools.gen_esp32part.cmd=${pyPath}`
  );

  console.log("here is the output of the dry run: ");
  console.log(fixedContent);
  //await fs.writeFile(matches[0], fixedContent);

  console.log(
    "This is the end of the script, you can press any key to close..."
  );
  await keypress();
  process.exit;
});

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};
