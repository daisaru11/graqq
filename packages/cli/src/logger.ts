import pino from "pino";

/**
 * The logger instance used in the package.
 */
export const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});
