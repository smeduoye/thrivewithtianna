"""Download recent Instagram post images for @thrive_with_tianna (owner's business account)."""
import json
import re
import time
import urllib.request
from pathlib import Path

USERNAME = "thrive_with_tianna"
OUT_DIR = Path(__file__).resolve().parent / "images" / "instagram"
OUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    ),
    "X-IG-App-ID": "936619743392459",
    "Accept": "*/*",
    "Referer": f"https://www.instagram.com/{USERNAME}/",
}


def fetch_json(url: str, retries: int = 5) -> dict:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except Exception as exc:
            wait = 2 ** attempt
            print(f"Attempt {attempt + 1} failed: {exc}. Waiting {wait}s...")
            time.sleep(wait)
    raise RuntimeError(f"Failed to fetch {url}")


def download_file(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={**HEADERS, "Accept": "image/*"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())
    print(f"Saved {dest.name}")


def get_posts_from_api() -> list[dict]:
    url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={USERNAME}"
    data = fetch_json(url)
    user = data["data"]["user"]
    print(f"Profile: {user.get('full_name')} ({user.get('edge_owner_to_timeline_media', {}).get('count', '?')} posts)")
    edges = user["edge_owner_to_timeline_media"]["edges"]
    posts = []
    for edge in edges:
        node = edge["node"]
        url = node.get("display_url") or node.get("thumbnail_src")
        if not url:
            resources = node.get("thumbnail_resources") or []
            if resources:
                url = resources[-1]["src"]
        if url:
            posts.append({
                "shortcode": node.get("shortcode", "unknown"),
                "url": url,
                "is_video": node.get("is_video", False),
            })
    return posts


def get_posts_from_html() -> list[dict]:
    url = f"https://www.instagram.com/{USERNAME}/"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8", errors="ignore")

    posts = []
    # og:image profile fallback
    m = re.search(r'property="og:image" content="([^"]+)"', html)
    if m:
        posts.append({"shortcode": "profile", "url": m.group(1).replace("&amp;", "&"), "is_video": False})

    # Try embedded JSON image URLs
    for match in re.finditer(r'"display_url":"(https:[^"]+)"', html):
        url = match.group(1).encode().decode("unicode_escape").replace("\\/", "/")
        posts.append({"shortcode": f"post-{len(posts)}", "url": url, "is_video": False})

    # Deduplicate by URL
    seen = set()
    unique = []
    for p in posts:
        if p["url"] not in seen:
            seen.add(p["url"])
            unique.append(p)
    return unique


def main() -> None:
    posts = []
    try:
        posts = get_posts_from_api()
    except Exception as exc:
        print(f"API unavailable: {exc}")
        print("Trying HTML fallback...")
        posts = get_posts_from_html()

    if not posts:
        raise SystemExit("No images found. Instagram may require login for this account.")

    saved = 0
    for i, post in enumerate(posts[:12], 1):
        if post.get("is_video"):
            continue
        ext = "jpg"
        if ".webp" in post["url"]:
            ext = "webp"
        dest = OUT_DIR / f"post-{i:02d}-{post['shortcode']}.{ext}"
        try:
            download_file(post["url"], dest)
            saved += 1
            time.sleep(0.5)
        except Exception as exc:
            print(f"Failed {post['shortcode']}: {exc}")

    print(f"\nDone. Saved {saved} images to {OUT_DIR}")


if __name__ == "__main__":
    main()
