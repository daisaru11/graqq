import * as fs from "fs";
import { buildSchema, type GraphQLSchema } from "graphql";
import * as path from "path";
import yargs from "yargs/yargs";
import { ConfigSchema, type Config } from "./config";

import { cosmiconfig } from "cosmiconfig";
import { generate } from "./generate";
import { logger } from "./logger";

type CommandError = { error: string };

export const run = async (): Promise<CommandError | null> => {
  const argv = await yargs(process.argv.slice(2))
    .options({
      s: { type: "string", alias: "schema" },
      o: { type: "string", alias: "out" },
      c: { type: "string", alias: "config" },
      d: { type: "boolean", alias: "debug" },
    })
    .parse();

  const {
    s: schemaPathArg,
    o: outputPathArg,
    c: configPathArg,
    d: debug,
  } = argv;

  if (debug === true) {
    logger.level = "debug";
  }

  const fileConfig = await loadConfig(configPathArg);

  let config: Config = {};
  if (fileConfig != null) {
    const fileConfigParsed = await ConfigSchema.safeParseAsync(
      fileConfig.config,
    );
    if (!fileConfigParsed.success) {
      return {
        error: `Invalid config file: ${fileConfigParsed.error.message}`,
      };
    }
    config = fileConfigParsed.data;
  }

  if (schemaPathArg != null) {
    config = {
      ...config,
      schema: schemaPathArg,
    };
  }

  if (outputPathArg != null) {
    config = {
      ...config,
      out: outputPathArg,
    };
  }

  if (config.out == null) {
    return {
      error: '"out" is required in config',
    };
  }
  if (config.schema == null) {
    return {
      error: '"schema" is required in config',
    };
  }

  const schemaResolvedPath = path.resolve(config.schema);
  const outputResolvedPath = path.resolve(config.out);

  const schema = await loadSchema(schemaResolvedPath);

  const output = await generate({ schema, scalars: config.scalars ?? {} });

  await writeOutput({ outputPath: outputResolvedPath, output });

  return null;
};

const loadConfig = async (configPath: string | undefined) => {
  const explorer = cosmiconfig("graqq");
  if (typeof configPath === "string") {
    return await explorer.load(configPath);
  } else {
    return await explorer.search();
  }
};

const loadSchema = async (schemaPath: string): Promise<GraphQLSchema> => {
  const schemaBody = (await fs.promises.readFile(schemaPath)).toString();
  return buildSchema(schemaBody);
};

const writeOutput = async ({
  outputPath,
  output,
}: {
  outputPath: string;
  output: string;
}) => {
  await fs.promises.writeFile(outputPath, output);
};
