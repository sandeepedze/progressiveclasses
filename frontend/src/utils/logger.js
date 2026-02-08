const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

const formatLog = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;

    if (data) {
        if (data instanceof Error) {
            logMessage += `\nSTACK: ${data.stack}`;
        } else {
            try {
                logMessage += `\nDATA: ${JSON.stringify(data, null, 2)}`;
            } catch (e) {
                logMessage += `\nDATA: [Circular or Non-Serializable]`;
            }
        }
    }
    return logMessage;
};

export const logger = {
    info: (message, data) => {
        if (__DEV__) console.log(formatLog(LOG_LEVELS.INFO, message, data));
    },
    warn: (message, data) => {
        if (__DEV__) console.warn(formatLog(LOG_LEVELS.WARN, message, data));
    },
    error: (message, error) => {
        console.error(formatLog(LOG_LEVELS.ERROR, message, error));
        // TODO: Send to Sentry or Crashlytics here
    },
    debug: (message, data) => {
        if (__DEV__) console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
};
