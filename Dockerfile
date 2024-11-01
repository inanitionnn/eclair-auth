# Start from a Node.js image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire project to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development

# Command to run the NestJS development server with hot-reloading
CMD ["yarn", "start:dev"]