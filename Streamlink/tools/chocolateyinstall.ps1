$ErrorActionPreference = 'Stop';

If ([Environment]::OSVersion.version.major -lt '10') {
    Throw "Minimum required OS version is Windows 10"
}

$packageName = 'Streamlink'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = "https://github.com/streamlink/windows-builds/releases/download/6.0.0-1/streamlink-6.0.0-1-py311-x86_64.exe"
$hash = "3207d9b75a02f0e9af5280fd2d09afb092023251ca24f2767602bc97dccfb974"

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
