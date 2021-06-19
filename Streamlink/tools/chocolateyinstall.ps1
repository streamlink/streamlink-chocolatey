
$ErrorActionPreference = 'Stop';

$packageName= 'Streamlink'
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = "https://github.com/streamlink/streamlink/releases/download/$env:chocolateyPackageVersion/streamlink-$env:chocolateyPackageVersion.exe"

$packageArgs = @{
  packageName   = $packageName
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url           = $url

  softwareName  = 'Streamlink*'

  checksum      = 'ca6b9664ae56892ae6a003bac8778a1458978e6457411ca4d17e2da26c2a0b53'
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

# v2.2.0: Changed default config file path (old path deprecated)
Get-ChildItem -Path "$env:APPDATA\streamlink" streamlinkrc.* | Rename-Item -NewName { $_.Name -replace 'streamlinkrc','config' } -ErrorAction SilentlyContinue


Install-ChocolateyPackage @packageArgs
