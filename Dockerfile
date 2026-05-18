FROM node:18-alpine

WORKDIR /app

# Install dependencies required for better-sqlite3 native build if needed
RUN apk add --no-cache python3 make g++ 

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start"]
