
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

  checksum      = 'F647CCBFAA712A13D5D41743A7FD69B9B93BD9451655BA943B57B4B768A1BC95'
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs
