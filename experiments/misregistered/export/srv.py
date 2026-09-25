# opus-5-5/index.html を 1920x1080 / 60fps / 20秒（1200コマ）の MP4 に書き出す。
# 使い方: python3 export/srv.py [出力先.mp4]  →  ブラウザで http://127.0.0.1:8919/ を開く
# 1200コマ送り終えると MP4 を閉じてサーバーも終了する。要 swiftc（Xcode Command Line Tools）。
# エンコーダは Vermilion Well と共通（experiments/vermilion-well/export/enc.swift）。
# --dry を付けるとエンコードせずにコマ数だけ数える（ブラウザ側の確認用）。
import http.server, subprocess, sys, os

D = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(D, '..', 'opus-5-5', 'index.html')
args = [a for a in sys.argv[1:] if not a.startswith('--')]
DRY = '--dry' in sys.argv
OUT = os.path.abspath(args[0] if args else os.path.join(D, '..', 'misregistered.mp4'))
ENC = os.path.join(D, 'enc')
if not DRY and not os.path.exists(ENC):
    subprocess.run(['swiftc', '-O', os.path.join(D, '..', '..', 'vermilion-well', 'export', 'enc.swift'), '-o', ENC], check=True)

# 本体の再生ループの直前に差し込む。4Kで刷って1080pに縮め、生のRGBAを1コマずつPOSTする
ANCHOR = 'requestAnimationFrame(loop);\n})();'
BLOCK = '''{
  const OW = 1920, OH = 1080, SS = 2, FPS = 60, N = LOOP * FPS;
  FORCE = [OW * SS, OH * SS];
  const c2 = document.createElement('canvas'); c2.width = OW; c2.height = OH;
  const x2 = c2.getContext('2d', {willReadFrequently: true}); x2.imageSmoothingQuality = 'high';
  (async () => {
    for (let i = 0; i < N; i++) {
      const t = i / FPS;
      IMP = 417 + (t >= 14.2 ? 1 : 0); FRAME = i;
      render(t);
      x2.drawImage(cv, 0, 0, OW, OH);
      await fetch('/f', {method: 'POST', body: x2.getImageData(0, 0, OW, OH).data});
      document.title = `${i + 1} / ${N}`;
    }
    await fetch('/end', {method: 'POST'}); document.title = 'done';
  })();
  return;
}
'''

enc = None if DRY else subprocess.Popen([ENC, OUT, '1920', '1080', '60'], stdin=subprocess.PIPE)
count = 0

class H(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    def log_message(self, *a): pass
    def reply(self, body=b'', ctype='text/plain'):
        self.send_response(200); self.send_header('Content-Type', ctype); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        if self.path != '/': return self.send_error(404)
        html = open(SRC, encoding='utf-8').read()
        assert html.count(ANCHOR) == 1, 'opus-5-5/index.html の再生ループが見つからない'
        self.reply(html.replace(ANCHOR, BLOCK + ANCHOR).encode(), 'text/html; charset=utf-8')
    def do_POST(self):
        global count
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        if self.path == '/f':
            assert len(body) == 1920 * 1080 * 4, len(body)
            if enc: enc.stdin.write(body)
            count += 1
            if count % 60 == 0: print(f'{count} / 1200', flush=True)
        self.reply()
        if self.path == '/end':
            if enc: enc.stdin.close(); enc.wait()
            print('done:', 'dry run,' if DRY else OUT, count, 'frames', flush=True); os._exit(enc.returncode if enc else 0)

print('open http://127.0.0.1:8919/', flush=True)
http.server.HTTPServer(('127.0.0.1', 8919), H).serve_forever()
