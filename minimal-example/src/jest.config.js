module.exports = {
  roots: [''],
  preset: 'jest-preset-angular',
  testRegex: ['^(?!.*pact).*spec\\.ts.*$'],
  testMatch: null,
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setupJestForSpec.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/app/$1',
    '@assets/(.*)': '<rootDir>/assets/$1',
    '@core/(.*)': '<rootDir>/app/core/$1',
    '@env': '<rootDir>/environments/environment',
    '@src/(.*)': '<rootDir>/src/$1',
    '@state/(.*)': '<rootDir>/app/state/$1',
    '^lodash-es$': "lodash"
  },
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@auth0|jwt/).+\\.js$'
  ],
  "testPathIgnorePatterns" : [
    "<rootDir>/environments/environment.test.ts"
  ],
  "testResultsProcessor": "jest-bamboo-reporter"
};
