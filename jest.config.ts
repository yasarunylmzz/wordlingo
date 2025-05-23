import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "jest-expo",
  testMatch: ["**/*.e2e.ts"], // Test dosyalarınızın doğru dizinde ve uzantıya sahip olduğundan emin olun
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["./init.ts"], // Setup dosyası varsa ekleyin
};

export default config;
