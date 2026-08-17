import type en from './src/messages/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof en
  }
}
