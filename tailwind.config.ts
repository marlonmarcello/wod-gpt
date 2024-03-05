import type { Config } from "tailwindcss";
import daisyUI from "daisyui";
import tailwindTypography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [tailwindTypography, daisyUI],
  daisyui: {
    themes: false,
  },
};
export default config;
