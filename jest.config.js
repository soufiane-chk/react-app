module.exports = {
    reporters: [
      'default',
      ['jest-sonar-reporter', {
        outputDirectory: './reports',
        outputName: 'test-report.xml',
      }],
    ],
  };
  