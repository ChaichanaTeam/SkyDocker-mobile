import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const python = path.join(root, '.graphify-venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const [command = 'query', ...args] = process.argv.slice(2);
const commands = new Set(['build', 'update', 'query', 'explain', 'path', 'affected', 'god-nodes', 'diagnose']);
if (!commands.has(command)) {
  console.error(`Unknown graph command: ${command}. Choose: ${[...commands].join(', ')}.`);
  process.exit(1);
}
if (!existsSync(python)) {
  console.error('Graphify environment is missing. Run:\n  uv venv --python 3.12 .graphify-venv\n  uv pip install --python .graphify-venv -r requirements-graphify.txt');
  process.exit(1);
}

// Keep every command on the same graph and explicitly disable all LLM backends.
const env = {...process.env, GRAPHIFY_OUT: 'graphify-out', GRAPHIFY_BACKEND: 'none', PYTHONUTF8: '1'};
function run(cliArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(python, ['-m', 'graphify', ...cliArgs], {cwd: root, env, stdio: 'inherit', windowsHide: true});
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`Graphify exited with ${signal ?? code}.`)));
  });
}

try {
  if (command === 'build' || command === 'update') {
    // extract is incremental when a graph exists; it also handles the first build.
    await run(['extract', '.', '--code-only', '--max-workers', '1', ...args]);
    await run(['cluster-only', '.']);
  } else if (command === 'path') {
    // extract produces an undirected graph; request connectivity consistently.
    await run(['path', ...args, '--undirected']);
  } else {
    await run([command, ...args]);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
