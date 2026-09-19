import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Posts-creator-react-app/",
  plugins: [react()],
});
