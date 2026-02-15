# Deployment Guide for rmvoss.com

Your new portfolio site is ready! Follow these steps to publish it to the web using GitHub Pages.

## Prerequisite: GitHub Account
Ensure you are logged into your [GitHub account](https://github.com/).

## Step 1: Create a New Repository
1. Go to **[github.com/new](https://github.com/new)**.
2. Repository name: `rmvoss.com` (or `portfolio`).
3. specific: **Public**.
4. **Do not** initialize with README, .gitignore, or license (we have these locally).
5. Click **Create repository**.

## Step 2: Push Your Code
Open your terminal (PowerShell or Command Prompt) and navigate to the project folder:

```powershell
cd C:\Users\danex\Desktop\rmvoss-portfolio
```

Run the following commands one by one:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Full Stack Portfolio"

# Link to your new GitHub repository (Replace USERNAME with your actual GitHub username)
git remote add origin https://github.com/USERNAME/rmvoss.com.git

# Push to GitHub
git push -u origin master
```

> **Note**: If `master` doesn't exist, try `git push -u origin main`.

## Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** (top right tab).
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
5. Under **Branch**, select `master` (or `main`) and `/ (root)`.
6. Click **Save**.

## Step 4: Custom Domain (Optional)
If you want to use `www.rmvoss.com`:
1. In the **Pages** settings, scroll to **Custom domain**.
2. Enter `www.rmvoss.com`.
3. Click **Save**.
4. You will need to update your DNS settings (at your domain registrar like GoDaddy or Namecheap) to point to GitHub Pages.
   - **CNAME Record**: Host `www` points to `USERNAME.github.io`.
   - **A Records**: Point `@` to GitHub's IPs (check GitHub docs for current IPs).

## Verification
After a few minutes, your site will be live at `https://USERNAME.github.io/rmvoss.com` (or your custom domain)!
