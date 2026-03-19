# Sno-King 18U Team Chen Website Starter

This is a beginner-friendly Next.js starter for your live team stats website.

## What this project already has

- A homepage based on your prototype
- Overview, Leaders, Roster, and Games sections
- Sortable roster table
- Sortable and filterable games table
- CSV download buttons
- Season calendar on the Games tab
- Placeholder for a real team photo

## Before you begin

You need:

1. A free GitHub account
2. A free Vercel account
3. Node.js installed on your computer

## The easiest beginner path

### Step 1: Install Node.js

Download and install the LTS version of Node.js.

### Step 2: Put this folder somewhere easy

Unzip the project and place it somewhere simple, like your Desktop.

### Step 3: Open Terminal in this folder

On Windows:
- Open the folder in File Explorer
- Click the address bar
- Type `cmd`
- Press Enter

### Step 4: Install the project packages

Run:

```bash
npm install
```

### Step 5: Start the website locally

Run:

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## Add your real team photo later

Put your real photo in:

```txt
/public/team-photo.jpg
```

Then update the placeholder area in `components/Dashboard.tsx` to use a real image.

## Make it live on Vercel

### Step 1
Create a GitHub repository and upload this project.

### Step 2
Log into Vercel and import that GitHub repository.

### Step 3
Click Deploy.

Vercel should automatically detect Next.js and publish the site.

## Important first edits you can make later

- Add the real team photo
- Add a Sno-King logo if appropriate
- Change copy and colors
- Add player profile pages
- Add chart downloads as PNG

## If something breaks

The safest reset is:

```bash
npm install
npm run dev
```

If that does not fix it, the next place to look is the file you edited most recently.
