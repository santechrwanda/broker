import pino from "pino"

const isDev = process.env.NODE_ENV !== "production"

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
})

// Add request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    logger.info(
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      },
      "HTTP Request",
    )
  })

  next()
}

export default logger
