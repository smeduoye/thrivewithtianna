# Start stack and verify API health (M0 — no E2E yet).

param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Push-Location $Root
try {
    if (-not $SkipBuild) {
        & (Join-Path $PSScriptRoot "build.ps1")
    }

    Write-Host "==> Starting stack"
    docker compose up -d

    Write-Host "==> Waiting for API health"
    $healthy = $false
    for ($i = 1; $i -le 60; $i++) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -TimeoutSec 5
            if ($response.status -eq "UP") {
                Write-Host "API is up after $($i * 2)s"
                $healthy = $true
                break
            }
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    if (-not $healthy) {
        docker compose logs api
        throw "API did not become healthy in time"
    }

    Write-Host "==> Portal UI: http://localhost:8081"
}
finally {
    Pop-Location
}

Write-Host "==> Stack healthy"
