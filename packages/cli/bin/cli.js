#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const command = require("../dist/command.js");

void command.run().then((result) => {
  if (result != null) {
    console.error(result.error);
    process.exit(1);
    return;
  }

  process.exit(0);
});
