$ErrorActionPreference = 'Stop';

If ([Environment]::OSVersion.version.major -lt '10') {
    Throw "Minimum required OS version is Windows 10"
}

$packageName = 'Streamlink'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = "https://github.com/streamlink/windows-builds/releases/download/8.6.2-1/streamlink-8.6.2-1-py314-x86_64.exe"
$hash = "f7614d463c21ef45831debfe464dd54ca2f7604fe849fa3e306b15945c9342b1"

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
