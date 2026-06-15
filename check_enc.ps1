$bytes = [System.IO.File]::ReadAllBytes('c:\Users\user\Desktop\sys-kodify\electron\mobileServer.ts')
$b0 = $bytes[0].ToString('X2')
$b1 = $bytes[1].ToString('X2')
$b2 = $bytes[2].ToString('X2')
Write-Host "BOM: $b0 $b1 $b2"
