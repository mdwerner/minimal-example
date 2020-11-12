module.exports = {
  roots: [''],
  testTimeout: 15000,
  preset: 'jest-preset-angular',
  testMatch: [
    '**/+(*.)+(pact).(spec).(ts)',
  ],
  testURL: 'http://localhost:8080',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/../tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts']
};
