module.exports = {
  roots: ["<rootDir>/bin/transforms/update-imports", "<rootDir>/bin/transforms/update-deprecated-properties"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
