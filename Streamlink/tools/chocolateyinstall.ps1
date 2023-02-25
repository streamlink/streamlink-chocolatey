$ErrorActionPreference = 'Stop';

If ([Environment]::OSVersion.version.major -lt '10') {
    Throw "Minimum required OS version is Windows 10"
}

$packageName = 'Streamlink'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = "https://github.com/streamlink/windows-builds/releases/download/5.3.1-1/streamlink-5.3.1-1-py311-x86_64.exe"
$hash = "4bcd4d8e04d78f62f65e609a65d880a7db5c0c949727e36af269a4cfb685e71f"

$packageArgs = @{
    packageName    = $packageName
    unzipLocation  = $toolsDir
    fileType       = 'exe'
    url            = $url

    softwareName   = 'Streamlink*'

    checksum       = $hash
    checksumType   = 'sha256'

    silentArgs     = '/S'
    validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
