// dockerize.js
import fs from "fs";
import { execSync } from "child_process";

try {
  console.log("🧱 Step 1: Creating Dockerfile...");

  const dockerfile = `
  # ===== Stage 1: Build the React app =====
  FROM node:18-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  # ===== Stage 2: Serve with Nginx =====
  FROM nginx:alpine
  COPY --from=build /app/build /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  `;

  fs.writeFileSync("Dockerfile", dockerfile.trim());
  console.log("✅ Dockerfile created.");

  console.log("📦 Step 2: Building React app locally...");
  execSync("npm install && npm run build", { stdio: "inherit" });

  console.log("🐳 Step 3: Building Docker image...");
  execSync("docker build -t my-react-app .", { stdio: "inherit" });

  console.log("🚀 Step 4: Running container on http://localhost:3000 ...");
  execSync("docker run -d -p 3000:80 --name react-container my-react-app", { stdio: "inherit" });

  console.log("✅ Deployment complete! Visit → http://localhost:3000");
} catch (err) {
  console.error("❌ Error:", err.message);
}

