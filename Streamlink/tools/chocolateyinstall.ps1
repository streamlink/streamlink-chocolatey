
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

  checksum      = '660d33229d6ed15bfa63f0862455aaf98cd88721caf06192ec8ec06409fa2688'
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs
