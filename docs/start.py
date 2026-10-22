#!/usr/bin/env python3
"""Starts the course "Rekursion & Listen" on this computer.

It runs a small web server that only this computer can reach and opens the course
in your browser. Keep the window open while you work; Ctrl+C stops the server.
Needs Python 3.7 or newer (only for this server; the exercises run in the browser).
"""
import functools
import http.server
import os
import sys
import threading
import urllib.request
import webbrowser

HOST = "127.0.0.1"
PORTS = range(8765, 8776)  # 8765 first, so the address (and your saved progress) stays the same
HERE = os.path.dirname(os.path.abspath(__file__))
MARK = "Rekursion &amp; Listen"


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map)
    extensions_map.update({
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json",
        ".txt": "text/plain; charset=utf-8",
        ".wasm": "application/wasm",
        "": "application/octet-stream",
    })

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, *args):
        pass


class Server(http.server.ThreadingHTTPServer):
    # On Windows, address reuse would let two servers share one port.
    allow_reuse_address = os.name != "nt"
    daemon_threads = True


def already_running(port):
    """True if this course is already being served on the port (e.g. started twice)."""
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open("http://%s:%d/index.html" % (HOST, port), timeout=1) as r:
            return MARK in r.read(4000).decode("utf-8", "ignore")
    except Exception:
        return False


def open_browser(url):
    try:
        webbrowser.open(url)
    except Exception:
        pass


def main():
    if sys.version_info < (3, 7):
        print("This needs Python 3.7 or newer. You have " + sys.version.split()[0] + ".")
        return 1
    if not (os.path.isfile(os.path.join(HERE, "index.html")) and os.path.isfile(os.path.join(HERE, "pyodide", "pyodide.asm.wasm"))):
        print("Course files not found next to start.py.")
        print("Unzip the whole ZIP file first, then start from the unzipped folder.")
        return 1

    server = None
    for port in PORTS:
        if already_running(port):
            url = "http://%s:%d/" % (HOST, port)
            print("The course is already running: " + url)
            print("Opening it in your browser. You can close this window.")
            open_browser(url)
            return 0
        try:
            server = Server((HOST, port), functools.partial(Handler, directory=HERE))
            break
        except OSError:
            continue
    if server is None:
        print("Ports %d-%d are all in use. Close other local servers and try again." % (PORTS[0], PORTS[-1]))
        return 1

    url = "http://%s:%d/" % (HOST, port)
    print("")
    print("  Rekursion & Listen is running at  " + url)
    print("")
    print("  Keep this window open while you work.")
    print("  To stop: press Ctrl+C here or close the window.")
    if port != PORTS[0]:
        print("")
        print("  Note: port %d was busy, so this time the course uses port %d." % (PORTS[0], port))
        print("  Progress is saved per address, so progress from %d will not show here." % PORTS[0])
    print("")
    threading.Timer(0.7, open_browser, args=(url,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
