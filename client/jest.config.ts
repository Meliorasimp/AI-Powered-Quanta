import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.spec.json" },
    ],
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(svg|png|jpg|jpeg|gif|webp|avif)$":
      "<rootDir>/src/tests/__mocks__/fileMock.ts",
    "^react-markdown$": "<rootDir>/src/tests/__mocks__/reactMarkdownMock.tsx",
    "^react-chartjs-2$": "<rootDir>/src/tests/__mocks__/reactChartJSMock.tsx",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/tests/**/*.test.(ts|tsx)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
