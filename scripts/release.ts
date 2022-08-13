import path from "path";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { Octokit } from "@octokit/rest";
import { SemVer } from "semver";
import { assert } from "ts-essentials";
import crypto from "crypto";
import fetch from "node-fetch";
import _ from "lodash";

const owner = "streamlink";
const repo = "windows-builds";
const nuspecPath = path.join(
    __dirname,
    "..",
    "Streamlink",
    "streamlink.nuspec"
);
const installPwshPath = path.join(
    __dirname,
    "..",
    "Streamlink",
    "tools",
    "chocolateyinstall.ps1"
);

async function main(): Promise<void> {
    const current = getCurrentVersion();
    const latest = await getLatestVersion();
    if (current < latest.version) {
        console.log(`New version available!`);

        const downloadUrl = latest.installer.browser_download_url;
        const hash = await getSha256(latest.installer.browser_download_url);
        console.log(`Hash: ${hash}`);

        await updateStreamlinkPackage({
            version: latest.version,
            hash,
            downloadUrl,
        });
    } else {
        console.log(`No new version available`);
    }
}

async function updateStreamlinkPackage({
    version,
    hash,
    downloadUrl,
}: {
    version: SemVer;
    hash: string;
    downloadUrl: string;
}) {
    const nuspec = fs.readFileSync(nuspecPath, "utf8");
    const newNuspec = _.replace(
        nuspec,
        /<version>(.*)<\/version>/,
        `<version>${version}</version>`
    );
    fs.writeFileSync(nuspecPath, newNuspec);

    let installPwsh = fs.readFileSync(installPwshPath, "utf8");
    installPwsh = _.replace(
        installPwsh,
        /\$url \= .*/,
        `$url = "${downloadUrl}"`
    );
    installPwsh = _.replace(installPwsh, /\$hash \= .*/, `$hash = "${hash}"`);
    fs.writeFileSync(installPwshPath, installPwsh);
}

async function getSha256(download_url: string): Promise<string> {
    console.log("Downloading installer...");
    const response = await fetch(download_url, {});
    const buffer = await response.arrayBuffer();
    const input = Buffer.from(buffer);
    return crypto.createHash("sha256").update(input).digest("hex");
}

function getCurrentVersion(): SemVer {
    const parser = new XMLParser();

    // synchronously read the file contents
    const nuspecString = fs.readFileSync(nuspecPath, "utf8");
    const nuspec = parser.parse(nuspecString);
    const currentVersion = nuspec.package.metadata.version;
    console.log(`Current version: ${currentVersion}`);

    return new SemVer(currentVersion);
}

async function getLatestVersion() {
    const octokit = new Octokit({});
    const release = await octokit.repos.getLatestRelease({
        owner,
        repo,
    });

    const latestVersion = release.data.tag_name;
    console.log(`Latest version: ${latestVersion}`);

    const installer = release.data.assets.find((asset) => {
        // There are two scenarios where this isn't the correct installer:
        // 1. The machine is Windows 7. In this case, the "py38" installer is needed
        // 2. The machine is x86. In this case, the "x86.exe" installer is needed
        // For now, I'm ignoring these scenarios to make the scripts simpler.
        return asset.name.endsWith("py310-x86_64.exe");
    });

    assert(installer);

    return { version: new SemVer(latestVersion), installer };
}

main();
