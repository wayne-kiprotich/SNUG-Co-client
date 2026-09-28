"""
Build optimised, responsive WebP images for the site.

Source photographs come from SNUG & Co.'s own Instagram (@snug_co_ke).
Each entry below maps an output image id to a source file and a vertical
focal point used when cropping to the 4:5 portrait ratio recommended in the PRD.

Usage:
    python3 scripts/build-images.py <source-dir>

<source-dir> must contain the Instagram originals named "<index>_<shortcode>.jpg".
Outputs:
    public/images/<id>-<width>.webp
    src/data/image-manifest.json   (widths + intrinsic size per id)
"""

import glob
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "images")
MANIFEST = os.path.join(ROOT, "src", "data", "image-manifest.json")

RATIO = 4 / 5
WIDTHS = [480, 800, 1080]
QUALITY = 78

# id: (source index, focal y 0..1)
IMAGES = {
    # Kenya collection
    "kenya-bomber-jacket-1": ("001", 0.42),
    "kenya-bomber-jacket-2": ("000", 0.58),
    "kenya-bomber-jacket-3": ("003", 0.55),
    "kenya-cosy-jersey-1": ("029", 0.42),
    "kenya-cosy-jersey-2": ("030", 0.5),
    "kenya-cosy-jersey-3": ("032", 0.5),
    "kenya-cosy-jersey-4": ("002", 0.55),
    # Lounge sets
    "tropical-vibes-short-set-1": ("004", 0.45),
    "striped-short-set-1": ("006", 0.45),
    "striped-short-set-2": ("005", 0.5),
    "all-white-cosy-set-1": ("011", 0.6),
    "black-and-white-set-1": ("038", 0.5),
    "black-and-white-set-2": ("043", 0.5),
    "black-and-white-set-3": ("041", 0.5),
    "black-and-white-set-4": ("042", 0.5),
    "colour-block-short-set-1": ("057", 0.5),
    "colour-block-short-set-2": ("056", 0.5),
    "colour-block-short-set-3": ("040", 0.5),
    "pastel-green-set-1": ("028", 0.5),
    "pastel-green-set-2": ("027", 0.4),
    "pastel-green-set-3": ("102", 0.55),
    "off-shoulder-jogger-set-1": ("021", 0.45),
    "zebra-print-set-1": ("075", 0.45),
    "zebra-print-set-2": ("076", 0.42),
    "snug-and-go-grey-set-1": ("100", 0.45),
    "blue-sleeveless-set-1": ("063", 0.5),
    "blue-sleeveless-set-2": ("047", 0.5),
    "beige-lounge-set-1": ("044", 0.5),
    "beige-lounge-set-2": ("046", 0.62),
    "beige-lounge-set-3": ("045", 0.5),
    # Tracksuits
    "the-black-tracksuit-1": ("009", 0.5),
    "the-black-tracksuit-2": ("007", 0.5),
    "the-black-tracksuit-3": ("008", 0.5),
    "green-tracksuit-1": ("050", 0.5),
    "green-tracksuit-2": ("051", 0.5),
    "green-tracksuit-3": ("052", 0.5),
    # Matchday
    "arsenal-retro-jacket-1": ("054", 0.45),
    "arsenal-retro-jacket-2": ("055", 0.5),
    "arsenal-retro-jacket-3": ("062", 0.4),
    "arsenal-retro-jacket-4": ("053", 0.45),
    "arsenal-champions-sweatshirt-1": ("019", 0.45),
    "arsenal-champions-sweatshirt-2": ("079", 0.5),
    "arsenal-champions-sweatshirt-3": ("078", 0.58),
    "arsenal-matchday-sweatshirt-1": ("087", 0.45),
    "arsenal-matchday-sweatshirt-2": ("026", 0.58),
    "arsenal-matchday-sweatshirt-3": ("024", 0.5),
    "arsenal-champions-hoodie-1": ("061", 0.45),
    "arsenal-champions-hoodie-2": ("064", 0.5),
    "manchester-united-retro-jacket-1": ("098", 0.5),
    "manchester-united-retro-jacket-2": ("097", 0.58),
    "club-puff-jacket-1": ("071", 0.5),
    "club-puff-jacket-2": ("059", 0.45),
    "club-puff-jacket-3": ("010", 0.5),
    "club-puff-jacket-4": ("072", 0.5),
    "argentina-hoodie-1": ("048", 0.45),
    "argentina-hoodie-2": ("066", 0.58),
    "argentina-hoodie-3": ("049", 0.5),
    "argentina-hoodie-4": ("036", 0.58),
    "argentina-jersey-1": ("034", 0.45),
    "argentina-jersey-2": ("035", 0.5),
    # Editorial / brand
    "editorial-his-hers-1": ("039", 0.5),
    "editorial-studio-bts": ("065", 0.5),
    "editorial-pressing-1": ("014", 0.5),
    "editorial-pressing-2": ("070", 0.5),
}


def crop_to_ratio(im, focal_y):
    w, h = im.size
    if w / h > RATIO:
        nw = round(h * RATIO)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / RATIO)
    y = round((h - nh) * focal_y)
    y = max(0, min(h - nh, y))
    return im.crop((0, y, w, y + nh))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_dir = sys.argv[1]
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}

    for image_id, (index, focal_y) in IMAGES.items():
        matches = glob.glob(os.path.join(src_dir, f"{index}_*.jpg"))
        if not matches:
            print(f"missing source {index} for {image_id}")
            continue
        im = crop_to_ratio(Image.open(matches[0]).convert("RGB"), focal_y)
        widths = [w for w in WIDTHS if w <= im.width] or [im.width]
        if im.width not in widths and im.width < WIDTHS[-1]:
            widths.append(im.width)
        for w in widths:
            h = round(w / RATIO)
            im.resize((w, h), Image.LANCZOS).save(
                os.path.join(OUT_DIR, f"{image_id}-{w}.webp"), "WEBP", quality=QUALITY, method=6
            )
        manifest[image_id] = {"widths": widths, "width": widths[-1], "height": round(widths[-1] / RATIO)}

    # Social sharing image (1200x630 JPEG for broad crawler support)
    hero = glob.glob(os.path.join(src_dir, "056_*.jpg"))
    if hero:
        im = Image.open(hero[0]).convert("RGB")
        w, h = im.size
        nh = round(w * 630 / 1200)
        y = round((h - nh) * 0.32)
        im.crop((0, y, w, y + nh)).resize((1200, 630), Image.LANCZOS).save(
            os.path.join(ROOT, "public", "og-default.jpg"), "JPEG", quality=82, optimize=True
        )

    # Brand logo (Instagram profile picture)
    logo = os.path.join(src_dir, "logo.jpg")
    if os.path.exists(logo):
        im = Image.open(logo).convert("RGB")
        im.resize((320, 320), Image.LANCZOS).save(os.path.join(OUT_DIR, "logo-320.webp"), "WEBP", quality=90)
        im.resize((180, 180), Image.LANCZOS).save(os.path.join(ROOT, "public", "apple-touch-icon.png"))
        im.resize((64, 64), Image.LANCZOS).save(os.path.join(ROOT, "public", "favicon.png"))

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
    print(f"built {len(manifest)} images")


if __name__ == "__main__":
    main()
