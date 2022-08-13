import path from 'path';
import fs from 'fs';
import {XMLParser} from 'fast-xml-parser'

const parser = new XMLParser();

const nuspec_path = path.join(__dirname, '..', 'Streamlink', 'streamlink.nuspec');

// synchronously read the file contents
const nuspec_string = fs.readFileSync(nuspec_path, 'utf8');
const nuspec = parser.parse(nuspec_string);
const current_version = nuspec.package.metadata.version;
console.log(`Current version: ${current_version}`);


const release_repo = 'streamlink/windows-builds';
