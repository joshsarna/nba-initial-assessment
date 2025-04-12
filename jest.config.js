module.exports = {
  rootDir: 'dist',
  testTimeout: 30000,
  testMatch: ['**/*.(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./localConfig.js'],
  verbose: true,
  maxWorkers: '75%',
  testEnvironment: 'node',
}
