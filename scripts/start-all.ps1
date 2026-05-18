param(
  [switch]$SkipBrowser
)

$ErrorActionPreference = "Stop"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
$env:LANG = "zh_CN.UTF-8"
try {
  chcp.com 65001 | Out-Null
} catch {
  # Some terminals do not expose chcp; PowerShell encodings above still apply.
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$rootPath = $root.Path
Set-Location $rootPath

$pnpmCommand = Get-Command pnpm.cmd -ErrorAction SilentlyContinue
if (-not $pnpmCommand) {
  $pnpmCommand = Get-Command pnpm -ErrorAction Stop
}
$pnpmPath = $pnpmCommand.Source

$services = @(
  @{ Name = "flax-backend";      Url = "http://localhost:8101"; Dir = $rootPath; Args = @("--filter", "flaxdb", "run", "backend") },
  @{ Name = "perilla-backend";   Url = "http://localhost:8102"; Dir = $rootPath; Args = @("--filter", "perilladb", "run", "backend") },
  @{ Name = "safflower-backend"; Url = "http://localhost:8103"; Dir = $rootPath; Args = @("--filter", "safflowerdb", "run", "backend") },
  @{ Name = "sesame-backend";    Url = "http://localhost:8104"; Dir = $rootPath; Args = @("--filter", "sesamedb", "run", "backend") },
  @{ Name = "sunflower-backend"; Url = "http://localhost:8105"; Dir = $rootPath; Args = @("--filter", "sunnfcdb", "run", "backend") },
  @{ Name = "sunflower-frontend"; Url = "http://localhost:3000"; Dir = $rootPath; Args = @("--filter", "sunnfcdb", "run", "dev") },
  @{ Name = "sesame-frontend";    Url = "http://localhost:3001"; Dir = $rootPath; Args = @("--filter", "sesamedb", "run", "dev") },
  @{ Name = "flax-frontend";      Url = "http://localhost:3002"; Dir = $rootPath; Args = @("--filter", "flaxdb", "run", "dev") },
  @{ Name = "safflower-frontend"; Url = "http://localhost:3003"; Dir = $rootPath; Args = @("--filter", "safflowerdb", "run", "dev") },
  @{ Name = "perilla-frontend";   Url = "http://localhost:3004"; Dir = $rootPath; Args = @("--filter", "perilladb", "run", "dev") }
)

Write-Host "Starting NCFdb services..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URLs:"
Write-Host "  Sunflower : http://localhost:3000  -> backend http://localhost:8105"
Write-Host "  Sesame    : http://localhost:3001  -> backend http://localhost:8104"
Write-Host "  Flax      : http://localhost:3002  -> backend http://localhost:8101"
Write-Host "  Safflower : http://localhost:3003  -> backend http://localhost:8103"
Write-Host "  Perilla   : http://localhost:3004  -> backend http://localhost:8102"
Write-Host ""
Write-Host "Press Ctrl+C in this window to stop all started services." -ForegroundColor Yellow
Write-Host ""

$jobs = @()

try {
  foreach ($service in $services) {
    $jobs += Start-Job -Name $service.Name -ScriptBlock {
      param($serviceName, $workingDir, $pnpmExe, $pnpmArgs)

      $utf8NoBom = New-Object System.Text.UTF8Encoding $false
      [Console]::InputEncoding = $utf8NoBom
      [Console]::OutputEncoding = $utf8NoBom
      $OutputEncoding = $utf8NoBom
      $env:PYTHONUTF8 = "1"
      $env:PYTHONIOENCODING = "utf-8"
      $env:LANG = "zh_CN.UTF-8"
      try {
        chcp.com 65001 | Out-Null
      } catch {
      }

      Set-Location $workingDir
      & $pnpmExe @pnpmArgs 2>&1 | ForEach-Object {
        "[$serviceName] $_"
      }
    } -ArgumentList $service.Name, $service.Dir, $pnpmPath, $service.Args
  }

  Start-Sleep -Seconds 4

  if (-not $SkipBrowser) {
    Start-Process "http://localhost:3000" | Out-Null
  }

  while ($true) {
    foreach ($job in $jobs) {
      Receive-Job -Job $job
      if ($job.State -in @("Failed", "Stopped", "Completed")) {
        Receive-Job -Job $job
        throw "Service job '$($job.Name)' exited with state $($job.State)."
      }
    }
    Start-Sleep -Milliseconds 500
  }
}
finally {
  Write-Host ""
  Write-Host "Stopping NCFdb services..." -ForegroundColor Yellow
  foreach ($job in $jobs) {
    Stop-Job -Job $job -ErrorAction SilentlyContinue
    Remove-Job -Job $job -Force -ErrorAction SilentlyContinue
  }
}
