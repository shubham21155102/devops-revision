# Docker Interview Questions and Answers Guide

## Basic Docker Concepts

### 1. What is Docker, and how does it differ from a virtual machine?
Docker is a platform for developing, shipping, and running applications in containers. Key differences from VMs:

- **Docker containers** share the host OS kernel and isolate the application processes
- **Virtual machines** run a complete OS with its own kernel
- Docker has lower overhead and faster startup times
- VMs provide stronger isolation but consume more resources
- Docker containers are more portable and lightweight

### 2. What is a Docker container?
A Docker container is a lightweight, standalone, and executable package that includes everything needed to run an application:
- Code
- Runtime
- System tools
- System libraries
- Settings
- Dependencies

Containers are isolated from each other and share the host OS kernel.

### 3. What is the role of a Docker image? How is it different from a container?
**Docker Image:**
- Read-only template
- Contains instructions for creating containers
- Layered file system
- Can be shared and reused
- Immutable

**Container:**
- Running instance of an image
- Adds a writable layer on top of the image
- Can be started, stopped, moved, and deleted
- Multiple containers can run from the same image

### 4. Explain the process of creating a Docker image
1. Create a Dockerfile with instructions:
```dockerfile
FROM base_image
WORKDIR /app
COPY . .
RUN commands_to_install_dependencies
EXPOSE port
CMD ["command", "to", "run"]
```

2. Build the image:
```bash
docker build -t image_name:tag .
```

3. The build process:
- Executes each instruction in order
- Creates a new layer for each instruction
- Caches layers for faster subsequent builds

### 5. What is Docker Hub?
Docker Hub is:
- Official registry for Docker images
- Public and private repositories
- Automated builds
- Team collaboration features
- Official images from software vendors
- Version control and tagging
- Webhook integration

### 6. Can you explain the Docker architecture?
Docker uses a client-server architecture:

**Docker Daemon (dockerd):**
- Manages Docker objects
- Builds and runs containers
- Handles container lifecycle
- Manages networks and storage

**Docker Client:**
- Command-line interface
- Communicates with daemon via REST API
- Can connect to remote daemons

**Docker Registry:**
- Stores Docker images
- Can be public (Docker Hub) or private
- Used for image distribution

### 7. What is the difference between CMD and ENTRYPOINT?
**CMD:**
```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```
- Specifies default command
- Can be overridden at runtime
- Only last CMD takes effect
- Used for default behavior

**ENTRYPOINT:**
```dockerfile
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
```
- Configures container as executable
- CMD becomes default parameters
- Harder to override
- Used for required behavior

## Docker Commands & Usage

### 8. What command do you use to run a container in Docker?
```bash
# Basic run
docker run image_name

# Common options
docker run -d --name my_container -p 8080:80 -v /host/path:/container/path image_name

# Options explained:
-d          # Run in background (detached)
--name      # Assign container name
-p          # Port mapping
-v          # Volume mounting
-e          # Environment variables
--rm        # Remove container when stopped
```

### 9. How would you list all running containers?
```bash
# List running containers
docker ps

# Common options
docker ps -a    # Show all containers (including stopped)
docker ps -q    # Only display container IDs
docker ps --format "{{.Names}}: {{.Status}}"  # Custom format
```

### 10. What is the command to build a Docker image?
```bash
# Basic build
docker build -t image_name:tag .

# Common options
docker build --no-cache                    # Force rebuild all layers
docker build --build-arg VAR=value         # Pass build arguments
docker build -f custom.dockerfile          # Specify dockerfile
docker build --target build-stage          # Multi-stage builds
```

### 11. How do you stop a running Docker container?
```bash
# Stop gracefully (SIGTERM)
docker stop container_name

# Force stop (SIGKILL)
docker kill container_name

# Stop all containers
docker stop $(docker ps -q)
```

### 12. What is the command to remove a Docker container?
```bash
# Remove stopped container
docker rm container_name

# Force remove running container
docker rm -f container_name

# Remove all stopped containers
docker container prune

# Remove container when it stops
docker run --rm image_name
```

### 13. How would you view logs of a running Docker container?
```bash
# View logs
docker logs container_name

# Common options
docker logs -f             # Follow log output
docker logs --tail 100     # Show last 100 lines
docker logs --since 1h     # Show logs from last hour
docker logs --timestamps   # Show timestamps
```

### 14. What is the command to see the status of all Docker containers?
```bash
# Show all containers
docker ps -a

# Show container details
docker inspect container_name

# Show container stats
docker stats

# Show only specific container
docker ps -a --filter "name=container_name"
```

## Networking and Volumes in Docker

### 15. What are Docker volumes, and why are they used?
Docker volumes are used for:
- Persistent data storage
- Sharing data between containers
- Backing up data
- Development environments

Example:
```bash
# Create volume
docker volume create my_volume

# Use volume
docker run -v my_volume:/app/data image_name

# List volumes
docker volume ls
```

### 16. Difference between Docker volume and bind mount
**Docker Volume:**
```bash
# Docker managed
docker run -v my_volume:/app/data image_name
```
- Managed by Docker
- Better portability
- Easier backup
- Volume drivers for remote storage

**Bind Mount:**
```bash
# Direct host path
docker run -v /host/path:/container/path image_name
```
- Direct host filesystem access
- Host-dependent
- Good for development
- Limited functionality

### 17. Purpose of Docker networking
Docker networking enables:
- Container communication
- Network isolation
- Service discovery
- Load balancing
- Network security
- Multi-host networking

### 18. Different types of Docker networks
```bash
# Bridge Network (default)
docker network create --driver bridge my_network

# Host Network
docker run --network host image_name

# None Network
docker run --network none image_name

# Overlay Network (Swarm)
docker network create --driver overlay my_overlay
```

### 19. Exposing container ports
```bash
# In Dockerfile
EXPOSE 80

# At runtime
docker run -p 8080:80 image_name

# Multiple ports
docker run -p 8080:80 -p 443:443 image_name

# All ports
docker run -P image_name
```

### 20. The --link flag in Docker
```bash
# Old way (deprecated)
docker run --link db:database app_image

# Modern approach (use networks)
docker network create my_network
docker run --network my_network --name db database_image
docker run --network my_network app_image
```

## Docker Compose

### 21. What is Docker Compose?
Docker Compose is a tool for defining and running multi-container applications. Example:

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "8080:80"
  db:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=secret
```

### 22. Main components of docker-compose.yml
```yaml
version: '3'               # Compose file version
services:                  # Container definitions
  web:
    build: .              # Build context
    image: my-app         # Image name
    ports:                # Port mapping
      - "8080:80"
    volumes:              # Volume mounts
      - .:/app
    environment:          # Environment variables
      - NODE_ENV=production
    networks:             # Network configuration
      - backend
    depends_on:           # Dependencies
      - db
volumes:                  # Volume definitions
  data:
networks:                 # Network definitions
  backend:
```

### 23. Starting and stopping with Docker Compose
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Build and start
docker-compose up --build

# Scale services
docker-compose up -d --scale web=3
```

### 24. The depends_on option
```yaml
services:
  web:
    build: .
    depends_on:
      - db       # Starts db before web
      - redis    # Starts redis before web
  db:
    image: postgres
  redis:
    image: redis
```

## Docker Security

### 25. Security best practices
1. Image Security:
   - Use official base images
   - Scan for vulnerabilities
   - Keep images updated
   - Use minimal base images

2. Runtime Security:
```bash
# Run as non-root
USER non-root

# Read-only filesystem
docker run --read-only image_name

# Drop capabilities
docker run --cap-drop ALL image_name
```

3. Network Security:
   - Use user-defined networks
   - Limit exposed ports
   - Use TLS for daemon communication

### 26. Protecting sensitive data
1. Use secrets management:
```bash
# Docker Swarm secrets
docker secret create my_secret file.txt
docker service create --secret my_secret image_name
```

2. Use build arguments:
```dockerfile
ARG BUILD_SECRET
RUN echo $BUILD_SECRET > /dev/null
```

3. Use environment variables:
```bash
docker run -e SENSITIVE_DATA=value image_name
```

### 27. Docker Content Trust (DCT)
```bash
# Enable DCT
export DOCKER_CONTENT_TRUST=1

# Sign images
docker trust sign image_name:tag

# View signature information
docker trust inspect image_name:tag
```

### 28. Docker namespaces
Docker uses Linux namespaces for isolation:
- PID Namespace: Process isolation
- Network Namespace: Network isolation
- Mount Namespace: Filesystem isolation
- UTS Namespace: Hostname isolation
- IPC Namespace: Inter-process communication
- User Namespace: User isolation

### 29. Limiting container resources
```bash
# Memory limits
docker run --memory 512m image_name

# CPU limits
docker run --cpus 0.5 image_name

# Using compose
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Docker Advanced Topics

### 30. Docker Swarm vs Kubernetes
**Docker Swarm:**
- Simpler setup
- Native Docker integration
- Good for smaller deployments
- Limited features

**Kubernetes:**
- More complex
- Industry standard
- Better scaling
- More features
- Larger community

### 31. Docker Registry
```bash
# Run private registry
docker run -d -p 5000:5000 registry

# Push to private registry
docker tag image localhost:5000/image
docker push localhost:5000/image

# Pull from private registry
docker pull localhost:5000/image
```

### 32. docker run vs docker exec
```bash
# docker run: Start new container
docker run -it ubuntu bash

# docker exec: Run command in running container
docker exec -it container_name bash
```

### 33. Multi-stage builds
```dockerfile
# Build stage
FROM node:14 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 34. Ensuring stateless containers
1. Use volumes for persistent data:
```bash
docker run -v data:/app/data image_name
```

2. Store configuration in environment:
```bash
docker run -e CONFIG_VAR=value image_name
```

3. Use external services for state:
- Database
- Cache
- Message queues

### 35. Common troubleshooting steps
1. Check container status:
```bash
docker ps -a
docker inspect container_name
```

2. View logs:
```bash
docker logs container_name
```

3. Check resource usage:
```bash
docker stats
```

4. Interactive debugging:
```bash
docker exec -it container_name sh
```

5. Network debugging:
```bash
docker network inspect network_name
```
