
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

  checksum      = '999E3CB4C4CB1015D845A21C1429740F8E78B1CF3E65CA1C1696D5F803C748E1'
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs
