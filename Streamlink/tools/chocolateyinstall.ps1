$ErrorActionPreference = 'Stop';

If ([Environment]::OSVersion.version.major -lt '10') {
    Throw "Minimum required OS version is Windows 10"
}

$packageName= 'Streamlink'
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = "https://github.com/streamlink/streamlink/releases/download/$env:chocolateyPackageVersion/streamlink-$env:chocolateyPackageVersion.exe"

$packageArgs = @{
  packageName   = $packageName
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url           = $url

  softwareName  = 'Streamlink*'

  checksum = 'c2a2f87abf57c33cc66e3077128240a2ffae17d99a550236a2255e41fb84a29b'
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs


