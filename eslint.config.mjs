import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { plugins: [] },
});

// Get the Next.js config but explicitly disable any problematic parsers
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    // Avoid function serialization issues
    languageOptions: {
      parser: null, // This ensures we don't have parser serialization issues
    },
  },
];

export default eslintConfig;
