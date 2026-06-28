# Build host artifacts and package runtime container images.
# Skips unchanged steps; runs backend and frontend in parallel when both need work.
# Usage:
#   .\scripts\build.ps1
#   .\scripts\build.ps1 -ArtifactsOnly
#   .\scripts\build.ps1 -Force

param(
    [switch]$ArtifactsOnly,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

function Refresh-Path {
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
        [Environment]::GetEnvironmentVariable("Path", "User")
}

function Get-NewestWriteTime {
    param([System.IO.FileInfo[]]$Files)
    if (-not $Files -or $Files.Count -eq 0) {
        return [datetime]::MinValue
    }
    return ($Files | Measure-Object -Property LastWriteTime -Maximum).Maximum
}

function Test-BackendStale {
    $backendRoot = Join-Path $Root "backend"
    $jars = Get-ChildItem -Path (Join-Path $backendRoot "target\backend-*.jar") -ErrorAction SilentlyContinue
    if (-not $jars) {
        return $true
    }
    $jarTime = ($jars | Sort-Object LastWriteTime -Descending | Select-Object -First 1).LastWriteTime
    $inputs = @()
    $inputs += Get-ChildItem -Path (Join-Path $backendRoot "src") -Recurse -File -ErrorAction SilentlyContinue
    foreach ($path in @("pom.xml", ".mvn\maven.config")) {
        $file = Join-Path $backendRoot $path
        if (Test-Path $file) {
            $inputs += Get-Item $file
        }
    }
    return (Get-NewestWriteTime $inputs) -gt $jarTime
}

function Test-FrontendDepsStale {
    $frontendRoot = Join-Path $Root "frontend"
    $nodeModules = Join-Path $frontendRoot "node_modules"
    if (-not (Test-Path $nodeModules)) {
        return $true
    }
    $modulesTime = (Get-Item $nodeModules).LastWriteTime
    foreach ($name in @("package.json", "package-lock.json")) {
        $file = Join-Path $frontendRoot $name
        if ((Get-Item $file).LastWriteTime -gt $modulesTime) {
            return $true
        }
    }
    return $false
}

function Test-FrontendDistStale {
    $frontendRoot = Join-Path $Root "frontend"
    $distIndex = Join-Path $frontendRoot "dist\index.html"
    if (-not (Test-Path $distIndex)) {
        return $true
    }
    $distTime = (Get-Item $distIndex).LastWriteTime
    $inputs = @()
    $inputs += Get-ChildItem -Path (Join-Path $frontendRoot "src") -Recurse -File -ErrorAction SilentlyContinue
    foreach ($name in @("package.json", "package-lock.json", "vite.config.ts", "tsconfig.json", "index.html")) {
        $file = Join-Path $frontendRoot $name
        if (Test-Path $file) {
            $inputs += Get-Item $file
        }
    }
    return (Get-NewestWriteTime $inputs) -gt $distTime
}

function Invoke-BackendBuild {
    Write-Host "==> [backend] Building JAR (local Maven)"
    Push-Location (Join-Path $Root "backend")
    try {
        mvn -B package -DskipTests
        $jar = Get-ChildItem -Path "target\backend-*.jar" -ErrorAction SilentlyContinue | Select-Object -First 1
        if (-not $jar) {
            throw "backend JAR not found under backend\target\"
        }
    }
    finally {
        Pop-Location
    }
}

function Invoke-FrontendBuild {
    param(
        [bool]$InstallDeps,
        [bool]$BuildDist
    )

    Push-Location (Join-Path $Root "frontend")
    try {
        if ($InstallDeps) {
            Write-Host "==> [frontend] Installing dependencies"
            npm ci
        }
        elseif ($BuildDist) {
            Write-Host "==> [frontend] Dependencies are up to date (skipped npm ci)"
        }

        if ($BuildDist) {
            Write-Host "==> [frontend] Building dist"
            npm run build
        }

        if (-not (Test-Path "dist\index.html")) {
            throw "frontend dist not found - npm run build failed"
        }
    }
    finally {
        Pop-Location
    }
}

function Wait-BuildProcesses {
    param([System.Diagnostics.Process[]]$Processes)

    $Processes | Wait-Process
    foreach ($proc in $Processes) {
        if ($proc.ExitCode -ne 0) {
            throw "Parallel build failed (exit $($proc.ExitCode))"
        }
    }
}

Refresh-Path

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm not found. Install Node.js (winget install OpenJS.NodeJS.LTS) and open a new terminal."
}

$runBackend = $Force -or (Test-BackendStale)
$runFrontendDeps = $Force -or (Test-FrontendDepsStale)
$runFrontendBuild = $Force -or (Test-FrontendDistStale)
$runFrontend = $runFrontendDeps -or $runFrontendBuild

$backendRebuilt = $false
$frontendRebuilt = $false

if ($runBackend -and $runFrontend) {
    Write-Host "==> Building backend and frontend in parallel"
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $pathValue = "$machinePath;$userPath"

    $backendCommand = @"
`$ErrorActionPreference = 'Stop'
`$env:Path = '$pathValue'
Set-Location '$Root\backend'
Write-Host '==> [backend] Building JAR (local Maven)'
mvn -B package -DskipTests
if (-not (Get-ChildItem 'target\backend-*.jar' -ErrorAction SilentlyContinue)) {
  throw 'backend JAR not found under backend\target\'
}
"@

    $frontendLines = @(
        "`$ErrorActionPreference = 'Stop'",
        "`$env:Path = '$pathValue'",
        "Set-Location '$Root\frontend'"
    )
    if ($runFrontendDeps) {
        $frontendLines += "Write-Host '==> [frontend] Installing dependencies'"
        $frontendLines += "npm ci"
    }
    elseif ($runFrontendBuild) {
        $frontendLines += "Write-Host '==> [frontend] Dependencies are up to date (skipped npm ci)'"
    }
    if ($runFrontendBuild) {
        $frontendLines += "Write-Host '==> [frontend] Building dist'"
        $frontendLines += "npm run build"
    }
    $frontendLines += @(
        "if (-not (Test-Path 'dist\index.html')) { throw 'frontend dist not found' }"
    )
    $frontendCommand = $frontendLines -join "`n"

    $backendProc = Start-Process -FilePath "powershell.exe" `
        -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $backendCommand) `
        -PassThru -NoNewWindow
    $frontendProc = Start-Process -FilePath "powershell.exe" `
        -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $frontendCommand) `
        -PassThru -NoNewWindow

    Wait-BuildProcesses -Processes @($backendProc, $frontendProc)
    $backendRebuilt = $true
    if ($runFrontendBuild) {
        $frontendRebuilt = $true
    }
}
else {
    if ($runBackend) {
        Invoke-BackendBuild
        $backendRebuilt = $true
    }
    else {
        Write-Host "==> Backend JAR is up to date (skipped Maven)"
    }

    if ($runFrontend) {
        Invoke-FrontendBuild -InstallDeps $runFrontendDeps -BuildDist $runFrontendBuild
        if ($runFrontendBuild) {
            $frontendRebuilt = $true
        }
    }
    else {
        Write-Host "==> Frontend dependencies are up to date (skipped npm ci)"
        Write-Host "==> Frontend dist is up to date (skipped npm run build)"
    }
}

if ($ArtifactsOnly) {
    Write-Host "==> Artifacts ready (skipped docker compose build)"
    exit 0
}

if ($Force -or $backendRebuilt -or $frontendRebuilt) {
    Write-Host "==> Building runtime container images (parallel)"
    Push-Location $Root
    try {
        docker compose build --parallel
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "==> Container images are up to date (skipped docker compose build)"
}

Write-Host "==> Done. Start the stack with: docker compose up -d"
