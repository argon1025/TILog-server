import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './sentry.interceptor';
export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';

@Module({})
export class SentryModule {
  static forRoot(options: Sentry.NodeOptions) {
    Sentry.init(options);

    return {
      module: SentryModule,
      providers: [
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: SentryInterceptor,
        },
      ],
    };
  }
}
