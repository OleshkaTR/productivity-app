module.exports = {
  'verbose': true,
  'transform': {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.hbs$': 'jest-handlebars',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
  },
  'setupFiles': [
    './__mocks__/client.js',
  ],
  'setupFilesAfterEnv': ['./encoder/encoder.js'],
};
