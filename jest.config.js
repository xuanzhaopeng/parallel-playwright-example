module.exports = {
    verbose: true,
    preset: 'jest-playwright-preset',
    testTimeout: 120000,
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
}