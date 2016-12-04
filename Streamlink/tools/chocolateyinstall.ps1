
$ErrorActionPreference = 'Stop';

$packageName= 'Streamlink'
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = 'https://github.com/streamlink/streamlink/releases/download/0.1.0/streamlink-0.1.0.exe'

$packageArgs = @{
  packageName   = $packageName
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url           = $url

  softwareName  = 'Streamlink*'

  checksum      = '18CEC2BF2D8C4DFB158F0E5AB5B4658829A0099C2E2AA558FA5EDF236471420B'
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs


















