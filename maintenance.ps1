# House31 Website - Backup and Maintenance Script

param(
    [string]$Action = "backup",
    [string]$BackupPath = ".\backups",
    [switch]$Compress = $false
)

Write-Host "🔧 House31 Website - Backup and Maintenance" -ForegroundColor Green

# Create backup directory if it doesn't exist
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force
    Write-Host "📁 Created backup directory: $BackupPath" -ForegroundColor Yellow
}

switch ($Action.ToLower()) {
    "backup" {
        Write-Host "💾 Starting backup process..." -ForegroundColor Yellow
        
        # Create timestamp for backup
        $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
        $backupFolder = Join-Path $BackupPath "backup_$timestamp"
        
        # Create backup folder
        New-Item -ItemType Directory -Path $backupFolder -Force
        
        # Backup database
        Write-Host "🗄️ Backing up MongoDB database..." -ForegroundColor Yellow
        docker-compose exec -T mongodb mongodump --username house31admin --password house31password --authenticationDatabase admin --db house31-website --out /data/backup
        
        # Copy database backup from container
        docker cp "house31-mongodb:/data/backup" "$backupFolder/mongodb"
        
        # Backup uploaded files (if any)
        if (Test-Path ".\uploads") {
            Write-Host "📸 Backing up uploaded files..." -ForegroundColor Yellow
            Copy-Item -Path ".\uploads" -Destination "$backupFolder\uploads" -Recurse
        }
        
        # Backup configuration files
        Write-Host "⚙️ Backing up configuration files..." -ForegroundColor Yellow
        $configFolder = Join-Path $backupFolder "config"
        New-Item -ItemType Directory -Path $configFolder -Force
        
        Copy-Item -Path ".\docker-compose.yml" -Destination $configFolder
        Copy-Item -Path ".\docker-compose.prod.yml" -Destination $configFolder
        Copy-Item -Path ".\.env.prod" -Destination $configFolder
        Copy-Item -Path ".\backend\.env.prod" -Destination $configFolder -ErrorAction SilentlyContinue
        Copy-Item -Path ".\frontend\.env.prod" -Destination $configFolder -ErrorAction SilentlyContinue
        
        # Compress if requested
        if ($Compress) {
            Write-Host "🗜️ Compressing backup..." -ForegroundColor Yellow
            $zipPath = "$backupFolder.zip"
            Compress-Archive -Path $backupFolder -DestinationPath $zipPath
            Remove-Item -Path $backupFolder -Recurse -Force
            Write-Host "✅ Backup completed and compressed: $zipPath" -ForegroundColor Green
        } else {
            Write-Host "✅ Backup completed: $backupFolder" -ForegroundColor Green
        }
    }
    
    "restore" {
        Write-Host "♻️ Starting restore process..." -ForegroundColor Yellow
        
        # List available backups
        $backups = Get-ChildItem -Path $BackupPath -Directory -Name "backup_*" | Sort-Object -Descending
        if ($backups.Count -eq 0) {
            Write-Host "❌ No backups found in $BackupPath" -ForegroundColor Red
            return
        }
        
        Write-Host "📋 Available backups:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $backups.Count; $i++) {
            Write-Host "  [$i] $($backups[$i])" -ForegroundColor White
        }
        
        $selection = Read-Host "Select backup to restore (enter number)"
        if ($selection -ge 0 -and $selection -lt $backups.Count) {
            $selectedBackup = $backups[$selection]
            $backupPath = Join-Path $BackupPath $selectedBackup
            
            Write-Host "🔄 Restoring from: $selectedBackup" -ForegroundColor Yellow
            
            # Restore database
            if (Test-Path "$backupPath/mongodb") {
                Write-Host "🗄️ Restoring MongoDB database..." -ForegroundColor Yellow
                docker cp "$backupPath/mongodb" "house31-mongodb:/data/restore"
                docker-compose exec -T mongodb mongorestore --username house31admin --password house31password --authenticationDatabase admin --db house31-website --drop /data/restore/house31-website
            }
            
            # Restore uploaded files
            if (Test-Path "$backupPath/uploads") {
                Write-Host "📸 Restoring uploaded files..." -ForegroundColor Yellow
                if (Test-Path ".\uploads") {
                    Remove-Item -Path ".\uploads" -Recurse -Force
                }
                Copy-Item -Path "$backupPath/uploads" -Destination ".\uploads" -Recurse
            }
            
            Write-Host "✅ Restore completed" -ForegroundColor Green
        } else {
            Write-Host "❌ Invalid selection" -ForegroundColor Red
        }
    }
    
    "cleanup" {
        Write-Host "🧹 Starting cleanup process..." -ForegroundColor Yellow
        
        # Clean up Docker
        Write-Host "🐳 Cleaning up Docker..." -ForegroundColor Yellow
        docker system prune -f
        docker volume prune -f
        
        # Remove old backups (keep last 5)
        Write-Host "🗑️ Cleaning up old backups..." -ForegroundColor Yellow
        $backups = Get-ChildItem -Path $BackupPath -Directory -Name "backup_*" | Sort-Object -Descending
        if ($backups.Count -gt 5) {
            $toDelete = $backups | Select-Object -Skip 5
            foreach ($backup in $toDelete) {
                $backupPath = Join-Path $BackupPath $backup
                Remove-Item -Path $backupPath -Recurse -Force
                Write-Host "🗑️ Removed old backup: $backup" -ForegroundColor Yellow
            }
        }
        
        Write-Host "✅ Cleanup completed" -ForegroundColor Green
    }
    
    "monitor" {
        Write-Host "📊 System monitoring..." -ForegroundColor Yellow
        
        # Check Docker stats
        Write-Host "🐳 Docker container stats:" -ForegroundColor Cyan
        docker stats --no-stream
        
        # Check disk space
        Write-Host "`n💾 Disk space:" -ForegroundColor Cyan
        Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}, @{Name="PercentFree";Expression={[math]::Round(($_.FreeSpace/$_.Size)*100,2)}}
        
        # Check service health
        Write-Host "`n🏥 Service health:" -ForegroundColor Cyan
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 10
            Write-Host "✅ Backend: Healthy" -ForegroundColor Green
        } catch {
            Write-Host "❌ Backend: Unhealthy" -ForegroundColor Red
        }
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 10
            Write-Host "✅ Frontend: Healthy" -ForegroundColor Green
        } catch {
            Write-Host "❌ Frontend: Unhealthy" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "❌ Invalid action. Available actions: backup, restore, cleanup, monitor" -ForegroundColor Red
        Write-Host "Usage examples:" -ForegroundColor Yellow
        Write-Host "  .\maintenance.ps1 -Action backup" -ForegroundColor White
        Write-Host "  .\maintenance.ps1 -Action backup -Compress" -ForegroundColor White
        Write-Host "  .\maintenance.ps1 -Action restore" -ForegroundColor White
        Write-Host "  .\maintenance.ps1 -Action cleanup" -ForegroundColor White
        Write-Host "  .\maintenance.ps1 -Action monitor" -ForegroundColor White
    }
}
