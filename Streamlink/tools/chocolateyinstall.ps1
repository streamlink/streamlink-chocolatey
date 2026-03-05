$ErrorActionPreference = 'Stop';

If ([Environment]::OSVersion.version.major -lt '10') {
    Throw "Minimum required OS version is Windows 10"
}

$packageName = 'Streamlink'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = "https://github.com/streamlink/windows-builds/releases/download/8.2.1-1/streamlink-8.2.1-1-py314-x86_64.exe"
$hash = "499293b61cf90af662267b167cbe016c211670588b12a652d6c54668c97bd177"

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
