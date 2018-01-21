import { devConfiguration } from './config.dev'
import { prodConfiguration } from './config.prod'

export const api = window['IonicDevServer'] ? devConfiguration : prodConfiguration;