# Comprehensive Nginx Interview Questions and Answers Guide

## Basic Questions

### 1. What is Nginx, and how does it work?
Nginx is a high-performance, open-source web server that can also function as a reverse proxy, load balancer, mail proxy, and HTTP cache. It works using an event-driven, asynchronous architecture that handles multiple connections simultaneously using a small number of lightweight worker processes.

### 2. How is Nginx different from Apache?
Key differences include:
- Architecture: Nginx uses an event-driven, asynchronous approach, while Apache uses a process/thread per connection model
- Resource Usage: Nginx typically uses less memory and can handle more concurrent connections
- Performance: Nginx generally performs better under high loads
- Configuration: Nginx has a simpler, more centralized configuration
- Dynamic Content: Apache handles dynamic content natively, while Nginx requires external processors

### 3. Explain the architecture of Nginx
Nginx uses a master-worker architecture:
- Master Process: Handles configuration, starting worker processes, and managing signals
- Worker Processes: Handle actual request processing
- Event-driven: Uses asynchronous, non-blocking operations
- Single-threaded but can handle multiple connections
- Uses kernel event notifications (epoll, kqueue, etc.)

### 4. What are the common use cases for Nginx?
Common use cases include:
- Web Server
- Reverse Proxy
- Load Balancer
- SSL/TLS Termination
- Static Content Server
- API Gateway
- Caching Server
- Media Streaming
- HTTP/2 Gateway

### 5. How do you configure Nginx to serve static files?
```nginx
server {
    listen 80;
    server_name example.com;
    
    location /static/ {
        root /var/www;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 6. What is a reverse proxy, and how is it implemented in Nginx?
A reverse proxy receives client requests and forwards them to backend servers, then returns the server's response to the client. Implementation:

```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://backend_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 7. What is a load balancer in Nginx, and how does it work?
A load balancer distributes incoming traffic across multiple backend servers. Configuration:

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

### 8. What is the purpose of the worker_processes directive in Nginx?
The worker_processes directive defines how many worker processes Nginx should spawn. It determines how many simultaneous connections can be handled. Usually set to the number of CPU cores:
```nginx
worker_processes auto;  # or specific number like 4
```

### 9. What is the difference between HTTP and HTTPS in Nginx?
- HTTP: Unencrypted protocol using port 80
- HTTPS: Encrypted protocol using SSL/TLS on port 443
- HTTPS requires SSL certificate configuration
- HTTPS provides data encryption, authentication, and integrity

### 10. How do you enable SSL in Nginx?
```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

## Configuration Questions

### 1. How would you configure Nginx to forward traffic to multiple backend servers?
```nginx
upstream backend_servers {
    server backend1.example.com weight=3;
    server backend2.example.com weight=2;
    server backup1.example.com backup;
    
    least_conn;  # Load balancing algorithm
}

server {
    location / {
        proxy_pass http://backend_servers;
    }
}
```

### 2. What is a location block in Nginx, and how do you use it?
Location blocks define how Nginx handles requests for specific URLs:
```nginx
server {
    # Exact match
    location = /exact {
        # ...
    }
    
    # Prefix match
    location /images/ {
        # ...
    }
    
    # Regular expression match
    location ~ \.php$ {
        # ...
    }
}
```

### 3. Explain the use of server_name directive in Nginx configuration
server_name defines which domains the server block handles:
```nginx
server {
    server_name example.com www.example.com *.example.com;
    # ...
}
```

### 4. How do you configure Nginx for caching?
```nginx
http {
    proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m;
    
    server {
        location / {
            proxy_cache my_cache;
            proxy_cache_use_stale error timeout http_500;
            proxy_cache_valid 200 60m;
        }
    }
}
```

### 5. How can you enable gzip compression in Nginx?
```nginx
http {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_vary on;
}
```

### 6. What is a server block in Nginx, and how do you use it for virtual hosts?
Server blocks define separate virtual servers:
```nginx
server {
    listen 80;
    server_name site1.example.com;
    root /var/www/site1;
}

server {
    listen 80;
    server_name site2.example.com;
    root /var/www/site2;
}
```

### 7. How do you configure Nginx to redirect HTTP traffic to HTTPS?
```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 8. What is the try_files directive in Nginx, and when would you use it?
try_files attempts to serve files in order until one exists:
```nginx
location / {
    try_files $uri $uri/ /index.html =404;
}
```

### 9. How do you configure Nginx to limit the number of requests per second?
```nginx
http {
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
    
    server {
        location / {
            limit_req zone=mylimit burst=20 nodelay;
        }
    }
}
```

### 10. How can you configure Nginx to handle custom error pages?
```nginx
server {
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /404.html {
        root /usr/share/nginx/html;
        internal;
    }
}
```

## Advanced Questions

### 1. How does Nginx handle connection handling and request processing?
Nginx uses:
- Event-driven, asynchronous processing
- Non-blocking I/O operations
- Worker processes handle multiple connections
- Kernel event notifications (epoll/kqueue)
- Connection pooling
- Keep-alive connections

### 2. What is Nginx's event-driven model, and why is it important for performance?
Nginx's event-driven model:
- Single thread handles multiple connections
- Non-blocking I/O operations
- Efficient memory usage
- Better scalability under high load
- Lower resource consumption
- Faster response times

### 3. How would you configure Nginx to handle WebSocket connections?
```nginx
server {
    location /wsapp/ {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
}
```

### 4. How would you configure Nginx for A/B testing or canary deployments?
```nginx
split_clients "${remote_addr}" $variant {
    20%     "B";
    *       "A";
}

server {
    location / {
        proxy_pass http://backend_${variant};
    }
}
```

### 5. Explain the concept of "upstream" in Nginx and how it is used in load balancing
Upstream defines a group of servers for load balancing:
```nginx
upstream backend {
    server backend1.example.com weight=3;
    server backend2.example.com weight=2;
    server backup1.example.com backup;
    
    least_conn;  # Load balancing method
    keepalive 32;  # Keep-alive connections
}
```

### 6. How does Nginx handle session persistence in a load balancing setup?
Using ip_hash or sticky cookie:
```nginx
upstream backend {
    ip_hash;  # or sticky cookie
    server backend1.example.com;
    server backend2.example.com;
}
```

### 7. What is the purpose of the proxy_set_header directive in Nginx?
proxy_set_header passes custom headers to backend servers:
```nginx
location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://backend;
}
```

### 8. How do you configure Nginx to block certain IP addresses?
```nginx
http {
    deny 192.168.1.100;
    deny 10.0.0.0/24;
    allow 192.168.1.0/24;
    deny all;
}
```

### 9. How can you set up Nginx to handle automatic failover?
```nginx
upstream backend {
    server backend1.example.com max_fails=3 fail_timeout=30s;
    server backend2.example.com backup;
}
```

### 10. How do you monitor the performance and health of your Nginx server?
- Enable stub_status module
- Use monitoring tools (Prometheus, Grafana)
- Check access and error logs
- Monitor system resources
- Use health checks

## Troubleshooting Questions

### 1. How do you troubleshoot Nginx if it's not serving content properly?
Steps include:
1. Check Nginx status
2. Review error logs
3. Verify configuration syntax
4. Check file permissions
5. Test connectivity
6. Verify backend services
7. Check resource usage

### 2. What logs would you check to diagnose issues in Nginx?
- access.log: Records all requests
- error.log: Records errors and debugging info
- Location: Usually in /var/log/nginx/
- Custom log locations defined in configuration

### 3. If Nginx is returning a 502 Bad Gateway error, what could be the possible causes?
Common causes:
- Backend server down
- Backend server overloaded
- Network connectivity issues
- Firewall blocking
- Backend timeout
- Configuration errors
- Resource exhaustion

### 4. What are some common causes of a "Connection Refused" error in Nginx?
- Nginx not running
- Wrong port configuration
- Firewall rules
- SELinux blocking
- Backend service down
- Network issues
- Permission problems

### 5. How can you handle an Nginx 504 Gateway Timeout error?
Solutions include:
- Increase proxy timeouts
- Check backend performance
- Optimize backend
- Add more backend servers
- Enable caching
- Monitor resource usage

### 6. How would you troubleshoot performance issues in Nginx?
Steps include:
1. Enable access logging with timing
2. Check error logs
3. Monitor system resources
4. Use tools like top, htop
5. Enable stub_status
6. Review configuration
7. Check backend performance

### 7. What steps would you take to identify memory leaks in Nginx?
1. Monitor memory usage
2. Check worker process size
3. Review error logs
4. Use tools like valgrind
5. Monitor system metrics
6. Review configuration
7. Check for module issues

### 8. If Nginx is not starting, what are the first steps you would take to debug the issue?
1. Check error logs
2. Verify configuration syntax
3. Check permissions
4. Test port availability
5. Check system resources
6. Verify dependencies
7. Run with debug logging

### 9. How can you debug SSL handshake errors in Nginx?
1. Enable SSL debugging
2. Check certificate validity
3. Verify private key permissions
4. Review SSL configuration
5. Check supported protocols
6. Verify cipher compatibility
7. Monitor handshake process

### 10. What are the steps to take if Nginx is returning a 403 Forbidden error?
1. Check file permissions
2. Verify user/group settings
3. Review SELinux context
4. Check directory permissions
5. Verify configuration
6. Review access rules
7. Check backend permissions

## Security Questions

### 1. How can you secure Nginx from DDoS attacks?
```nginx
http {
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
    limit_conn_zone $binary_remote_addr zone=addr:10m;
    
    server {
        location / {
            limit_req zone=one burst=5;
            limit_conn addr 10;
        }
    }
}
```

### 2. How can you configure Nginx to prevent HTTP request smuggling?
```nginx
server {
    client_body_buffer_size 1k;
    client_header_buffer_size 1k;
    client_max_body_size 1k;
    large_client_header_buffers 2 1k;
}
```

### 3. Explain how to set up HTTP Basic Authentication in Nginx
```nginx
location /secure/ {
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### 4. How would you set up SSL/TLS in Nginx with a valid certificate?
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
}
```

### 5. What security headers would you configure in Nginx?
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Content-Security-Policy "default-src 'self'";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 6. How do you protect against Clickjacking and XSS in Nginx?
```nginx
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'; script-src 'self'";
```

### 7. How would you limit access to certain IP addresses or networks in Nginx?
```nginx
location /admin/ {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}
```

### 8. How can you enable HTTP Strict Transport Security (HSTS) in Nginx?
```nginx
add_