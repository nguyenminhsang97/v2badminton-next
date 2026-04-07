param(
  [string]$BaseUrl = "http://localhost:3000",
  [switch]$SkipDb
)

$ErrorActionPreference = "Stop"

function Write-Section {
  param([string]$Title)
  Write-Host ""
  Write-Host "=== $Title ===" -ForegroundColor Cyan
}

function Get-DotEnvValue {
  param([string]$Name)

  $envFile = Join-Path $PSScriptRoot "..\.env.local"
  if (-not (Test-Path $envFile)) {
    return $null
  }

  foreach ($line in Get-Content -Path $envFile) {
    if ($line -match "^\s*$Name\s*=\s*(.+?)\s*$") {
      $raw = $Matches[1].Trim()
      return $raw.Trim("'`"")
    }
  }

  return $null
}

function Get-ConfigValue {
  param([string]$Name)

  $value = [Environment]::GetEnvironmentVariable($Name)
  if ([string]::IsNullOrWhiteSpace($value)) {
    $value = Get-DotEnvValue -Name $Name
  }

  return $value
}

function Test-EnvGroup {
  param(
    [string]$Label,
    [string[]]$Names
  )

  $missing = @()

  foreach ($name in $Names) {
    $value = Get-ConfigValue -Name $name
    if ([string]::IsNullOrWhiteSpace($value)) {
      $missing += $name
    }
  }

  if ($missing.Count -eq 0) {
    Write-Host "[OK] $Label" -ForegroundColor Green
  } else {
    Write-Host "[WARN] $Label missing: $($missing -join ', ')" -ForegroundColor Yellow
  }
}

function Invoke-JsonEndpoint {
  param([string]$Url)

  try {
    return Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing
  } catch {
    Write-Host "[FAIL] $Url -> $($_.Exception.Message)" -ForegroundColor Red
    return $null
  }
}

Write-Section "Env Groups"
Test-EnvGroup -Label "Core pipeline" -Names @("POSTGRES_URL", "POSTGRES_URL_NON_POOLING", "FORM_TOKEN_SECRET")
Test-EnvGroup -Label "Telegram notify" -Names @("TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID")
Test-EnvGroup -Label "Email notify" -Names @("RESEND_API_KEY", "NOTIFY_EMAIL_TO")
Test-EnvGroup -Label "Turnstile" -Names @("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY")
Test-EnvGroup -Label "Rate limit" -Names @("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN")

Write-Section "Endpoint Preflight"
$health = Invoke-JsonEndpoint -Url "$BaseUrl/api/health"
if ($health) {
  Write-Host "GET /api/health -> $($health.StatusCode)" -ForegroundColor Green
  Write-Host $health.Content
}

$tokenResponse = Invoke-JsonEndpoint -Url "$BaseUrl/api/form-token"
$tokenValue = $null
if ($tokenResponse) {
  Write-Host "GET /api/form-token -> $($tokenResponse.StatusCode)" -ForegroundColor Green
  $cacheControl = $tokenResponse.Headers["Cache-Control"]
  Write-Host "Cache-Control: $cacheControl"
  if ($cacheControl -match "public|s-maxage") {
    Write-Host "[FAIL] /api/form-token looks cacheable. Expected no-store." -ForegroundColor Red
  } else {
    Write-Host "[OK] /api/form-token is not publicly cacheable" -ForegroundColor Green
  }

  try {
    $tokenJson = $tokenResponse.Content | ConvertFrom-Json
    $tokenValue = $tokenJson.token
    if ($tokenValue) {
      Write-Host "[OK] Received form token (${($tokenValue.Length)} chars)" -ForegroundColor Green
    } else {
      Write-Host "[WARN] /api/form-token returned no token" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "[WARN] Could not parse /api/form-token JSON" -ForegroundColor Yellow
  }
}

$homepage = Invoke-JsonEndpoint -Url "$BaseUrl/"
if ($homepage) {
  Write-Host "GET / -> $($homepage.StatusCode)" -ForegroundColor Green
  if ($tokenValue -and $homepage.Content -like "*$tokenValue*") {
    Write-Host "[FAIL] Signed form token leaked into HTML source" -ForegroundColor Red
  } else {
    Write-Host "[OK] Homepage source does not leak signed form token" -ForegroundColor Green
  }
}

if (-not $SkipDb) {
  Write-Section "DB Snapshot"
  $postgresUrl = Get-ConfigValue -Name "POSTGRES_URL"
  if ([string]::IsNullOrWhiteSpace($postgresUrl)) {
    Write-Host "[WARN] Skipping DB snapshot because POSTGRES_URL is missing" -ForegroundColor Yellow
  } else {
    $nodeScript = @'
import { sql } from "@vercel/postgres";

try {
  const count = await sql`SELECT COUNT(*)::int AS count FROM leads`;
  const recent = await sql`
    SELECT id, phone, submission_method, telegram_status, email_status, created_at
    FROM leads
    ORDER BY created_at DESC
    LIMIT 5
  `;

  console.log("Lead count:", count.rows[0]?.count ?? 0);
  console.log("Recent leads:");
  for (const row of recent.rows) {
    console.log(
      `- ${row.id} | ${row.phone} | ${row.submission_method} | tg=${row.telegram_status} | email=${row.email_status} | ${row.created_at}`
    );
  }
} catch (error) {
  console.error("DB snapshot failed");
  console.error(error);
  process.exitCode = 1;
}
'@

    $nodeScript | node --input-type=module -
  }
}

Write-Section "Manual Browser QA"
Write-Host "1. Submit valid data on JS path from homepage."
Write-Host "   Expect: success UI, one new lead row, submission_method = js."
Write-Host "2. Submit same payload again within 15 minutes."
Write-Host "   Expect: success UI, no second row, dedupe behavior."
Write-Host "3. In DevTools, set hidden _gotcha field to a non-empty value and submit."
Write-Host "   Expect: success-like response, no DB insert."
Write-Host "4. Disable JS and submit again."
Write-Host "   Expect: lead saved with submission_method = no_js."
Write-Host "5. Temporarily break TELEGRAM_BOT_TOKEN and submit."
Write-Host "   Expect: lead saved, telegram_status = failed."
Write-Host "6. Submit rapidly to hit rate limits."
Write-Host "   Expect: JS path blocks on 6th request/hour, no-JS blocks on 3rd request/hour."

Write-Section "Done"
Write-Host "Preflight finished. If all green above, move to the browser checks now." -ForegroundColor Cyan
