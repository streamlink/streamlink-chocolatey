import path from "path";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { Octokit } from "@octokit/rest";
import { SemVer } from "semver";

const owner = "streamlink";
const repo = "windows-builds";
const nuspecPath = path.join(
    __dirname,
    "..",
    "Streamlink",
    "streamlink.nuspec"
);

async function main(): Promise<void> {
    const current = getCurrentVersion();
    const latest = await getLatestVersion();
    if (current < latest) {
        console.log(`New version available!`);
    }
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
    return new SemVer(latestVersion);
}

main();
