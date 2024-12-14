# Use an official Node.js image as the base
FROM node:18

# Install dependencies
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libwebp-dev \
    libffi-dev \
    libnss3 \
    libx11-6 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libdbus-1-3 \
    libgbm1 \
    libnss3 \
    libnspr4 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libxss1 \
    libcurl4 \
    libvulkan1 \
    && apt-get clean


# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) into the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install Playwright and its dependencies (optional, if using Playwright)
RUN npx playwright install --with-deps

# Copy the rest of your Next.js project files into the container
COPY . .

# Expose the default Next.js port
EXPOSE 3000

# Build the Next.js project
RUN npm run build

# Start the Next.js application
CMD ["npm", "run", "start"]
