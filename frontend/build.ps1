$npm = 'C:\rogram Files\nodejs\npm.cmd'
$node = 'C:\rogram Files\nodejs\node.exe'
Write-Host 'Node:' (& $node --version)
Write-Host 'npm:' (& $npm --version)
Write-Host '=== BUILD ==='
& $npm run build 2>&1
Write-Host 'EXIT:' $LASTEXITCODE