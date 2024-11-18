### 8. How can you enable HTTP Strict Transport Security (HSTS) in Nginx?
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 9. Explain how to configure Nginx to prevent clickjacking and other attacks using security headers
```nginx
server {
    # Anti-clickjacking
    add_header X-Frame-Options "SAMEORIGIN";
    
    # XSS Protection
    add_header X-XSS-Protection "1; mode=block";
    
    # Content sniffing
    add_header X-Content-Type-Options "nosniff";
    
    # Comprehensive CSP
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
}
```

### 10. How would you configure Nginx to reject weak SSL ciphers?
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers on;
ssl_dhparam /etc/nginx/dhparam.pem;
```

## Performance Optimization Questions

### 1. How would you optimize the performance of Nginx for high traffic?
Key optimizations:
```nginx
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
keepalive_requests 100;
sendfile on;
tcp_nopush on;
tcp_nodelay on;
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
client_body_buffer_size 10K;
client_header_buffer_size 1k;
client_max_body_size 8m;
large_client_header_buffers 2 1k;
```

### 2. What is connection pooling in Nginx, and how does it improve performance?
Connection pooling maintains a set of reusable connections:
```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    keepalive 32;  # Connection pool size
}

location / {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_pass http://backend;
}
```

### 3. How would you configure Nginx to serve static content faster?
```nginx
location /static/ {
    root /var/www;
    expires 30d;
    add_header Cache-Control "public, no-transform";
    access_log off;
    sendfile on;
    tcp_nopush on;
    gzip_static on;
}
```

### 4. How can you configure Nginx to handle thousands of simultaneous connections?
```nginx
worker_processes auto;
worker_rlimit_nofile 65535;
events {
    use epoll;
    worker_connections 65535;
    multi_accept on;
}
http {
    keepalive_timeout 65;
    keepalive_requests 100;
}
```

### 5. What are some common Nginx optimizations for reducing latency?
```nginx
# TCP optimizations
tcp_nodelay on;
tcp_nopush on;

# Buffering settings
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 4 32k;

# Caching
proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

# Compression
gzip on;
gzip_min_length 1000;
gzip_types text/plain text/css application/json;
```

### 6. How can you use caching to optimize Nginx performance?
```nginx
http {
    proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m;
    
    server {
        location / {
            proxy_cache my_cache;
            proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
            proxy_cache_valid 200 60m;
            proxy_cache_valid 404 1m;
            proxy_cache_key $scheme$request_method$host$request_uri;
        }
    }
}
```

### 7. Explain how to use micro-caching in Nginx to reduce database load
```nginx
http {
    proxy_cache_path /path/to/cache levels=1:2 keys_zone=microcache:10m max_size=1g inactive=1h;
    
    server {
        location / {
            proxy_cache microcache;
            proxy_cache_valid 200 1s;
            proxy_cache_use_stale updating;
            proxy_cache_background_update on;
        }
    }
}
```

### 8. How can you handle slow client connections in Nginx?
```nginx
client_body_timeout 12;
client_header_timeout 12;
send_timeout 10;
keepalive_timeout 65;
reset_timedout_connection on;
```

### 9. What is the keepalive_timeout directive in Nginx, and how does it affect performance?
```nginx
http {
    keepalive_timeout 65;  # Keep connection alive for 65 seconds
    keepalive_requests 100;  # Number of requests per connection
    
    upstream backend {
        server backend1.example.com;
        keepalive 32;  # Number of idle keepalive connections
    }
}
```

### 10. How do you handle large file uploads in Nginx?
```nginx
client_max_body_size 100m;
client_body_buffer_size 128k;
client_body_timeout 60s;

location /upload {
    proxy_request_buffering off;
    proxy_http_version 1.1;
    proxy_pass http://backend;
}
```

## Miscellaneous Questions

### 1. What is Nginx Unit, and how is it different from traditional Nginx?
Nginx Unit is an application server that can:
- Run multiple programming language applications
- Dynamic configuration via API
- No service restart needed
- Built-in load balancing
- Language-specific modules

### 2. How do you configure Nginx for HTTP/2 support?
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        http2_push /style.css;
        http2_push /script.js;
    }
}
```

### 3. What is the limit_conn directive, and how do you use it in Nginx?
```nginx
http {
    limit_conn_zone $binary_remote_addr zone=addr:10m;
    
    server {
        location /download/ {
            limit_conn addr 1;
            limit_conn_status 429;
        }
    }
}
```

### 4. What are the key differences between Nginx and HAProxy?
- Nginx: Web server, reverse proxy, load balancer
- HAProxy: Dedicated load balancer
- Nginx: Better for static content
- HAProxy: More load balancing features
- Nginx: More versatile
- HAProxy: More detailed statistics

### 5. How can you set up Nginx to load balance traffic based on content type?
```nginx
map $request_uri $backend {
    ~*\.(jpg|jpeg|png|gif)$ image_backend;
    ~*\.(js|css)$ static_backend;
    default app_backend;
}

upstream image_backend {
    server img1.example.com;
    server img2.example.com;
}

upstream static_backend {
    server static1.example.com;
    server static2.example.com;
}

upstream app_backend {
    server app1.example.com;
    server app2.example.com;
}

server {
    location / {
        proxy_pass http://$backend;
    }
}
```

### 6. What are the benefits of using Nginx as a content delivery network (CDN)?
- Caching capabilities
- Load balancing
- SSL termination
- Compression
- Geographic distribution
- Edge computing potential

### 7. What are the differences between Nginx and Nginx Plus?
Nginx Plus adds:
- Commercial support
- Advanced monitoring
- Session persistence
- Active health checks
- Configuration API
- Dynamic reconfiguration
- Advanced load balancing

### 8. Explain the role of Nginx in a Kubernetes environment
- Ingress controller
- Load balancing
- SSL termination
- Path-based routing
- Service mesh integration
- Rate limiting
- Authentication

### 9. How do you set up Nginx to serve both HTTP and HTTPS traffic on different ports?
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

### 10. What are the common causes of slow performance in Nginx, and how do you mitigate them?
Common causes and solutions:
1. Configuration issues:
   - Optimize worker processes
   - Enable caching
   - Use compression

2. Resource constraints:
   - Monitor system resources
   - Scale hardware
   - Implement rate limiting

3. Network issues:
   - Enable keepalive
   - Use HTTP/2
   - Configure proper timeouts

4. Backend issues:
   - Implement load balancing
   - Enable caching
   - Monitor backend health
