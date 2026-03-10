# Устанавливаем строгий режим
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# 1. Настройка путей (без использования ~ и any)
[string]$CurrentDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($CurrentDir)) { $CurrentDir = Get-Location }

[string]$FrontendPath = Join-Path $CurrentDir "frontend"
[string]$BackendPath = Join-Path $CurrentDir "backend\src"
[string]$PidFile = Join-Path $CurrentDir "servers.pid"

# Проверка путей
if (-not (Test-Path $FrontendPath) -or -not (Test-Path $BackendPath)) {
    Write-Host "Error: Directory not found. Check your paths." -ForegroundColor Red
    return
}

# Очистка старого PID файла
if (Test-Path $PidFile) { Remove-Item $PidFile -Force }

# 2. Функция запуска без лишних типов
function Start-App {
    param (
        [string]$Path,
        [string]$Cmd
    )
    # Запуск через cmd /c позволяет корректно пробросить node-команды в фон
    $Process = Start-Process "cmd.exe" -ArgumentList "/c $Cmd" -WorkingDirectory $Path -WindowStyle Hidden -PassThru
    [string]$Process.Id | Add-Content -Path $PidFile
}

Write-Host "Starting services in background..." -ForegroundColor Cyan

# 3. Запуск процессов
try {
    Start-App -Path $FrontendPath -Cmd "npm run dev"
    Start-App -Path $FrontendPath -Cmd "npx serve -s ."
    Start-App -Path $BackendPath -Cmd "npx ts-node-dev test-auth-server.ts"
    Start-App -Path $BackendPath -Cmd "npx ts-node-dev test-server.ts"

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  STATUS: ALL OK" -ForegroundColor Green
    Write-Host "  URL:    http://localhost:3000" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "Failed to start processes: $($_.Exception.Message)" -ForegroundColor Red
}