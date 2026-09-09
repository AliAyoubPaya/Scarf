param(
  [Parameter(Mandatory = $true)]
  [string]$Deployment
)

$catalogSyncSecret = $env:CATALOG_SYNC_SECRET
if ([string]::IsNullOrWhiteSpace($catalogSyncSecret) -or $catalogSyncSecret.Length -lt 32) {
  Write-Error "CATALOG_SYNC_SECRET is not configured."
  exit 1
}

$catalogHeader = "x-catalog-sync-secret: $catalogSyncSecret"
& npx --yes vercel@latest curl /api/catalog/sync --deployment $Deployment --yes -- --silent --show-error --header $catalogHeader --header "content-type: application/json" --request POST --data '{"page":1}'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
