import is from 'electron-is'
import logger from 'electron-log'

logger.transports.file.level = is.production() ? 'warn' : 'silly'
logger.transports.file.maxSize = 50 * 1024 * 1024;
logger.info('[Motrix] Logger init')
logger.warn('[Motrix] Logger init')

export default logger
