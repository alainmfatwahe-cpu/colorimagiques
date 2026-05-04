Set-Location 'C:\temp\frontend\build.ps1'
$npm = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
$node = Join-Path $env:ProgramFiles 'nodejs\node.exe'
Write-Host 'Node:' (& $node --version)
Write-Host 'npm:' (& $npm --version)
Write-Host '=== BUILD ==='
& $npm run build 2>&1
Write-Host 'EXIT:' $LASTEXITCODE