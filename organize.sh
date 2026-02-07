#!/bin/bash

echo "🏥 Organizing Smart Hospital Project..."

# 1. Create Main Directories
mkdir -p backend
mkdir -p frontend

# 2. Move Backend Files
if [ -f "server.js" ]; then
    mv server.js backend/
    echo "✅ Moved server.js to backend/"
fi

# 3. Move Frontend Files
# Move main assets
mv index.html frontend/ 2>/dev/null
mv styles.css frontend/ 2>/dev/null

# Rename and move folders
if [ -d "staff-page" ]; then
    mv staff-page frontend/staff
    echo "✅ Renamed staff-page -> frontend/staff"
fi

if [ -d "patient-page" ]; then
    mv patient-page frontend/patient
    echo "✅ Renamed patient-page -> frontend/patient"
fi

echo "🎉 Organization Complete! You can now upload to GitHub."
echo "To start the server, run: npm install && npm start"