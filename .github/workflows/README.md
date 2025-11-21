# GitHub Actions Deployment

This workflow automatically deploys your Next.js application to your server when code is pushed to the `main` branch.

## Setup Instructions

### 1. Generate SSH Key Pair

On your local machine, generate an SSH key pair if you don't have one:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

### 2. Add Public Key to Server

Copy the public key to your server's authorized_keys:

```bash
# On your local machine
cat ~/.ssh/github_actions_deploy.pub

# On your server (replace with your actual user and server)
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-server.com
# OR manually add to ~/.ssh/authorized_keys
```

### 3. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

- **`SERVER_HOST`**: Your server IP address or domain (e.g., `192.168.1.100` or `example.com`)
- **`SERVER_USER`**: SSH username (e.g., `deploy` or `root`)
- **`SERVER_PORT`**: SSH port (optional, defaults to `22`)
- **`SSH_PRIVATE_KEY`**: The private key content (from `~/.ssh/github_actions_deploy`)
  ```bash
  cat ~/.ssh/github_actions_deploy
  ```
- **`DEPLOY_PATH`**: Path where your app is deployed (e.g., `/var/www/portfolio` or `/home/user/portfolio`)
- **`PM2_APP_NAME`**: Name of your PM2 process (e.g., `portfolio` or `sandesh-portfolio`)

### 4. Optional: Environment Variables

If you need to set build-time environment variables, uncomment and add them in the workflow file:

```yaml
env:
  NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
```

Then add `NEXT_PUBLIC_SITE_URL` to your GitHub Secrets.

### 5. PM2 Setup on Server

Make sure PM2 is installed and your app is configured:

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file (optional but recommended)
# Create ecosystem.config.js in your project root
```

Example `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/portfolio',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 6. Initial Server Setup

On your server, make sure:

1. Node.js and npm are installed
2. Git is installed
3. PM2 is installed globally
4. Your deployment directory exists and has proper permissions
5. `.env` file exists with production environment variables

```bash
# Example initial setup
mkdir -p /var/www/portfolio
cd /var/www/portfolio
git clone https://github.com/yourusername/your-repo.git .
npm install
npm run build
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup  # Follow instructions to enable PM2 on system startup
```

## How It Works

1. **Trigger**: Workflow runs on push to `main` branch or manual trigger
2. **Build**: Installs dependencies and builds the Next.js app
3. **Deploy**: Uses SCP to copy files to server (excluding unnecessary files)
4. **Install & Build**: On server, installs dependencies and rebuilds
5. **Restart**: Restarts PM2 process with the app name

## Troubleshooting

### Permission Issues
```bash
# Make sure deployment user has proper permissions
sudo chown -R $USER:$USER /var/www/portfolio
```

### PM2 Not Found
```bash
# Install PM2 globally
npm install -g pm2
```

### Build Failures
- Check server has enough disk space
- Verify Node.js version matches (Node 20)
- Check environment variables are set correctly

### SSH Connection Issues
- Verify SSH key is added correctly
- Check server firewall allows SSH connections
- Test SSH connection manually: `ssh -i ~/.ssh/github_actions_deploy user@server`

