# Deployment Guide

## Deployment Options

### Option 1: Manual Deployment (Recommended)

#### Prerequisites
- Java 17+ installed
- Maven 3.8+ installed
- Node.js 18+ installed
- MySQL 8.0+ installed

#### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd MediTrack
```

2. **Configure database**
```bash
# Update application.properties with your database credentials
# File: backend/src/main/resources/application.properties
```

3. **Start backend**
```bash
cd backend
mvn spring-boot:run
```

4. **Start frontend** (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

### Option 2: Production Deployment

#### Backend Deployment

1. **Build the application**
```bash
cd backend
mvn clean package -DskipTests
```

2. **Run the application**
```bash
java -jar target/meditrack-backend-1.0.0.jar --spring.profiles.active=prod
```

3. **Use systemd service** (Linux)
```bash
sudo nano /etc/systemd/system/meditrack-backend.service
```

```ini
[Unit]
Description=MediTrack Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/meditrack/backend
ExecStart=/usr/bin/java -jar /opt/meditrack/backend/target/meditrack-backend-1.0.0.jar --spring.profiles.active=prod
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable meditrack-backend
sudo systemctl start meditrack-backend
```

#### Frontend Deployment

1. **Build the application**
```bash
cd frontend
npm install
npm run build
```

2. **Serve with Nginx**
```bash
sudo cp -r dist/* /var/www/meditrack/
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/meditrack;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### AI Module Deployment

1. **Set up Python environment**
```bash
cd ai-module
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Run with Gunicorn**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

3. **Use systemd service**
```bash
sudo nano /etc/systemd/system/meditrack-ai.service
```

```ini
[Unit]
Description=MediTrack AI Module
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/meditrack/ai-module
Environment="PATH=/opt/meditrack/ai-module/venv/bin"
ExecStart=/opt/meditrack/ai-module/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### Option 3: Cloud Deployment

#### AWS Deployment

1. **Backend on EC2**
   - Launch EC2 instance
   - Install Java 17 and Maven
   - Deploy application
   - Use RDS for MySQL database
   - Configure Security Groups

2. **Frontend on S3 + CloudFront**
   - Build frontend
   - Upload to S3 bucket
   - Configure CloudFront distribution
   - Set up custom domain

3. **AI Module on ECS/Lambda**
   - Containerize AI module
   - Deploy to ECS or Lambda
   - Configure API Gateway

#### Heroku Deployment

1. **Backend**
```bash
cd backend
heroku create meditrack-backend
heroku addons:create cleardb:ignite
git push heroku main
```

2. **Frontend**
```bash
cd frontend
heroku create meditrack-frontend
git push heroku main
```

## Environment Variables

### Backend (.env or application.properties)
```properties
SPRING_PROFILES_ACTIVE=prod
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your-strong-secret-key
CORS_ORIGINS=https://yourdomain.com
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_AI_MODULE_URL=https://ai.yourdomain.com
```

## Database Setup

1. **Create database**
```sql
CREATE DATABASE meditrack;
```

2. **Run migrations** (if using Flyway/Liquibase)
```bash
mvn flyway:migrate
```

3. **Initialize data**
```bash
mysql -u root -p meditrack < database/init.sql
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable database SSL
- [ ] Use environment variables for secrets
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup strategy

## Monitoring

### Application Monitoring
- Set up logging (Logback/Log4j2)
- Use monitoring tools (Prometheus, Grafana)
- Set up alerts for errors

### Database Monitoring
- Monitor database performance
- Set up backups
- Monitor disk space

### Infrastructure Monitoring
- Monitor server resources
- Set up uptime monitoring
- Monitor API response times

## Backup Strategy

### Database Backup
```bash
# Daily backup
mysqldump -u root -p meditrack > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p meditrack < backup_20240101.sql
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * mysqldump -u root -p meditrack > /backups/meditrack_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check database credentials
   - Verify database is running
   - Check network connectivity

2. **JWT token invalid**
   - Verify JWT secret matches
   - Check token expiration
   - Verify token format

3. **CORS errors**
   - Check CORS configuration
   - Verify allowed origins
   - Check preflight requests

4. **Frontend not loading**
   - Check API base URL
   - Verify backend is running
   - Check browser console for errors

## Scaling

### Horizontal Scaling
- Use load balancer
- Deploy multiple backend instances
- Use database replication
- Use CDN for frontend

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use caching (Redis)
- Optimize application code

## Maintenance

### Regular Tasks
- Update dependencies
- Security patches
- Database optimization
- Log rotation
- Backup verification
- Performance monitoring

### Updates
1. Test in staging environment
2. Backup production database
3. Deploy updates
4. Monitor for issues
5. Rollback if needed

