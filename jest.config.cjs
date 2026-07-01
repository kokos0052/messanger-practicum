/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/blocks/**/*.test.ts?(x)',
    '<rootDir>/src/layouts/**/*.test.ts?(x)',
    '<rootDir>/src/shared/routing/**/*.test.ts?(x)',
    '<rootDir>/src/shared/api/**/*.test.ts?(x)',
    '<rootDir>/src/shared/socket/**/*.test.ts?(x)',
    '<rootDir>/src/shared/utils/**/*.test.ts?(x)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleNameMapper: {
    '^@shared/static/.+\\.(svg|png|jpg|jpeg|gif|webp)$':
      '<rootDir>/src/tests/__mocks__/fileMock.ts',
    '\\.(scss|css)$': '<rootDir>/src/tests/__mocks__/styleMock.ts',
    '\\.(svg|png|jpg|jpeg|gif|webp)$':
      '<rootDir>/src/tests/__mocks__/fileMock.ts',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@blocks/(.*)$': '<rootDir>/src/blocks/$1',
    '^@layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  collectCoverageFrom: [
    'src/blocks/**/*.{ts,tsx}',
    'src/layouts/**/*.{ts,tsx}',
    'src/shared/routing/**/*.{ts,tsx}',
    'src/shared/api/**/*.{ts,tsx}',
    'src/shared/socket/**/*.{ts,tsx}',
    'src/shared/utils/resources.ts',
    '!src/**/index.ts',
    '!src/**/types.ts',
    '!src/**/type.ts',
    '!src/**/constants.ts',
    '!src/**/constaints.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
}
