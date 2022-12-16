$ErrorActionPreference = 'Stop';

If ([Environment]::OSVersion.version.major -lt '10') {
    Throw "Minimum required OS version is Windows 10"
}

$packageName = 'Streamlink'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = "https://github.com/streamlink/windows-builds/releases/download/5.1.2-2/streamlink-5.1.2-2-py311-x86_64.exe"
$hash = "70674ad30e48d179b62aa74d739a9fe62d486be914e0441375e6a1ccc62f4eb2"

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
