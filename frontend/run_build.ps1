$npm = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
$node = Join-Path $env:ProgramFiles 'nodejs\node.exe'
Write-Host 'Node version:' 
& $node --version
Write-Host 'npm version:'
& $npm --version
Write-Host '=== STARTING BUILD ==='
& $npm run build 2>&1
Write-Host '=== EXIT CODE:' $LASTEXITCODE '==='