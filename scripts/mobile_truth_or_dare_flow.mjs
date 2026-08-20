import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const port = 9223;
const baseUrl = 'http://127.0.0.1:3000/';
const outDir = '/home/ubuntu/slovak-imposter-games/mobile-flow-evidence';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const json = async (url, init) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
};

async function waitForDebugging() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return await json(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await sleep(150);
    }
  }
  throw new Error('Chromium DevTools did not start');
}

function createClient(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  return {
    ready,
    call(method, params = {}) {
      const requestId = ++id;
      socket.send(JSON.stringify({ id: requestId, method, params }));
      return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
    },
    close() { socket.close(); },
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const chromium = spawn('/usr/bin/chromium', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=/tmp/podvodnik-mobile-flow',
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    await waitForDebugging();
    const target = await json(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' });
    const client = createClient(target.webSocketDebuggerUrl);
    await client.ready;
    await client.call('Page.enable');
    await client.call('Runtime.enable');
    await client.call('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });

    const evaluate = async (expression) => {
      const result = await client.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    const waitForText = async (text) => {
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const found = await evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`);
        if (found) return;
        await sleep(100);
      }
      throw new Error(`Timed out waiting for ${text}`);
    };
    const clickText = async (text) => evaluate(`(() => {
      const element = [...document.querySelectorAll('button')].find((node) => (node.innerText || '').includes(${JSON.stringify(text)}) || (node.getAttribute('aria-label') || '').includes(${JSON.stringify(text)}));
      if (!element) throw new Error('Missing button: ${text}');
      element.click();
      return true;
    })()`);
    const clickExactText = async (text) => evaluate(`(() => {
      const element = [...document.querySelectorAll('button')].find((node) => (node.innerText || '').trim() === ${JSON.stringify(text)});
      if (!element) throw new Error('Missing exact button: ${text}');
      element.click();
      return true;
    })()`);
    const capture = async (name) => {
      const image = await client.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(`${outDir}/${name}.png`, Buffer.from(image.data, 'base64'));
    };

    await waitForText('Minihry');
    await clickText('Minihry');
    await waitForText('Pravda alebo výzva');
    await clickText('Pravda alebo výzva');
    await waitForText('Pripraviť hru');
    await clickText('Pripraviť hru');
    await waitForText('PRAVDA');
    await clickText('PRAVDA');
    await waitForText('Iná otázka');
    const firstPrompt = await evaluate(`document.querySelector('[data-no-translate]')?.innerText || ''`);
    await capture('truth-prompt-before-next');
    await clickText('Iná otázka');
    await sleep(120);
    const nextPrompt = await evaluate(`document.querySelector('[data-no-translate]')?.innerText || ''`);
    await capture('truth-prompt-after-next');
    await clickExactText('Späť');
    await waitForText('PRAVDA');
    const choiceVisible = await evaluate(`document.body.innerText.includes('PRAVDA') && document.body.innerText.includes('VÝZVA')`);
    await writeFile(`${outDir}/truth-mobile-flow.json`, JSON.stringify({
      viewport: '390x844',
      firstPrompt,
      nextPrompt,
      promptChanged: firstPrompt !== nextPrompt,
      choiceVisibleAfterBack: choiceVisible,
    }, null, 2));
    client.close();
  } finally {
    chromium.kill('SIGKILL');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
