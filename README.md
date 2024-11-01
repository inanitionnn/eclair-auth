# Eclair (auth template)

## Introduction

Eclair-auth is a starting template for a user REST API authentication, designed with scalability and maintainability in mind.

## Technologies Used

- **TypeScript**
- **Nest.js**
- **Drizzle ORM**
- **PostgreSQL**
- **Redis**
- **Jest and Supertest**
- **Swagger**
- **Class-validator**
- **Winston**
- **PassportJS**

## Part 2 - What If (scaling)

Scaling can be approached from both the backend and DevOps perspectives. From a DevOps standpoint, one option is to create a database cluster to enhance the speed of record writing and retrieval. Additionally, deploying multiple backend instances can help manage traffic effectively, either by routing requests through a load balancer or through containerization. Vertical scaling is also an option by increasing the capacity of each individual server.

On the backend side, we can focus on minimizing load through rate limiting, caching, and implementing message queues. Offloading long-running tasks to workers or microservices can further improve performance. It's also essential to optimize the database using indexing and normalization techniques to ensure efficient data management.

## Part 3 - Social Login

I would implement social login using PassportJS. However, I can't provide a detailed sequence diagram without knowing specific project details, such as whether users can be logged in to the same account on multiple devices, which social integrations are required, and how the frontend handles authentication.

Generally, the flow would involve redirecting the user to the appropriate social service for login, receiving an access token upon successful authentication, storing user information in the database, and then returning the necessary data to the frontend.
