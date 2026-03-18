import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// This registers your loader into the Node.js ESM pipeline
register('./scripts/loader.js', pathToFileURL('./'));