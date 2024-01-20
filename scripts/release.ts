import path from "path";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { Octokit } from "@octokit/rest";
import { assert } from "ts-essentials";
import crypto from "crypto";
import fetch from "node-fetch";
import _ from "lodash";
import { program } from "commander";
import { execSync } from "child_process";

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
    program.option("--upload", "Upload the new chocolatey package");
    program.parse(process.argv);
    const options = program.opts();

    const current = getCurrentVersion();
    const latest = await getLatestVersion();
    if (current !== latest.version) {
        console.log(`New version available!`);
        console.log(`New installer file: ${latest.installer.name}`);

        const downloadUrl = latest.installer.browser_download_url;
        const hash = await getSha256(latest.installer.browser_download_url);
        console.log(`Hash: ${hash}`);

        await updateStreamlinkPackage({
            version: latest.version,
            hash,
            downloadUrl,
        });

        await createNupkgAndUpload(options.upload);
    } else {
        console.log(`No new version available`);
    }
}

async function createNupkgAndUpload(shouldUpload: boolean) {
    console.log("Creating nupkg...");
    execSync("choco pack", { cwd: path.join(__dirname, "..", "Streamlink") });
    if (shouldUpload) {
        console.log("Uploading nupkg...");
        assert(process.env.CHOCOLATEY_API_KEY, "Need an API key to upload");
        execSync(
            `choco push --source=https://push.chocolatey.org/ --api-key ${process.env.CHOCOLATEY_API_KEY}`,
            {
                cwd: path.join(__dirname, "..", "Streamlink"),
            }
        );
    }
}

async function updateStreamlinkPackage({
    version,
    hash,
    downloadUrl,
}: {
    version: string;
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

function getCurrentVersion(): string {
    const parser = new XMLParser();

    // synchronously read the file contents
    const nuspecString = fs.readFileSync(nuspecPath, "utf8");
    const nuspec = parser.parse(nuspecString);
    const currentVersion = nuspec.package.metadata.version;
    console.log(`Current version: ${currentVersion}`);

    return currentVersion;
}

async function getLatestVersion() {
    const octokit = new Octokit({
        // Authenticated requests have a higher rate limit.
        auth: process.env.GITHUB_TOKEN ?? undefined,
    });
    const release = await octokit.repos.getLatestRelease({
        owner,
        repo,
    });

    const latestVersion = release.data.tag_name;
    console.log(`Latest version: ${latestVersion}`);

    // group 1 is the application version, group 2 is the python version
    const reAssetName = /^streamlink-(.+)-py(\d+)-x86_64\.exe$/;

    const installerFiles = release.data.assets.filter(
        (asset) => asset.name.search(reAssetName) !== -1
    );

    // pick the installer with the highest python version
    const sortedInstallerFiles = installerFiles.sort((a, b) => {
        const aVersion = a.name.match(reAssetName)?.[2];
        const bVersion = b.name.match(reAssetName)?.[2];
        assert(
            aVersion && bVersion,
            "could not find python version, unable to compare files"
        );
        return parseInt(bVersion) - parseInt(aVersion);
    });

    const installer = sortedInstallerFiles[0];
    assert(installer, "could not find an installer for this release");

    // HACK: The streamlink repo will use versioning like "4.2.0-2". This is valid semver, but
    // chocolatey/nuget/nuspec doesn't agree! So we need to replace the "-2" with a ".2".
    return { version: _.replace(latestVersion, "-", "."), installer };
}

main();
