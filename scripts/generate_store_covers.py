#!/usr/bin/env python3
"""
Generate professional 1280x720 16:9 store cover banners for Anna AI OS apps.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

FONT_TITLE_PATH = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_MONO_PATH = "/System/Library/Fonts/SFNSMono.ttf"

def create_cmc_cover(output_path: str):
    W, H = 1280, 720
    img = Image.new("RGBA", (W, H), (10, 15, 29, 255))
    draw = ImageDraw.Draw(img)

    # Subtle background gradient grid
    for y in range(0, H, 40):
        draw.line([(0, y), (W, y)], fill=(18, 28, 50, 120), width=1)
    for x in range(0, W, 40):
        draw.line([(x, 0), (x, H)], fill=(18, 28, 50, 120), width=1)

    # Ambient glow on the left
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([(-100, 100), (500, 700)], fill=(245, 158, 11, 28))
    glow_draw.ellipse([(200, -100), (800, 500)], fill=(59, 130, 246, 22))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Try loading system fonts
    try:
        font_badge = ImageFont.truetype(FONT_MONO_PATH, 16)
        font_title = ImageFont.truetype(FONT_TITLE_PATH, 52, index=1)
        font_sub = ImageFont.truetype(FONT_TITLE_PATH, 24, index=0)
        font_pill = ImageFont.truetype(FONT_TITLE_PATH, 16, index=1)
        font_foot = ImageFont.truetype(FONT_MONO_PATH, 14)
    except Exception:
        font_badge = font_title = font_sub = font_pill = font_foot = ImageFont.load_default()

    # Category Pill
    draw.rounded_rectangle([(60, 60), (380, 92)], radius=16, fill=(30, 41, 59, 200), outline=(245, 158, 11, 180), width=1)
    draw.text((75, 68), "ANNA AI OS  •  INSTITUTIONAL DATA", font=font_badge, fill=(245, 158, 11, 255))

    # Main Title
    draw.text((60, 120), "CMC ALPHA", font=font_title, fill=(255, 255, 255, 255))
    draw.text((60, 180), "TERMINAL", font=font_title, fill=(245, 158, 11, 255))

    # Subtitle
    draw.text((60, 256), "Bitcoin & Crypto Quantitative Trading Desk", font=font_sub, fill=(148, 163, 184, 255))

    # Feature Badges
    features = [
        ("✦ Stat-Arb Cointegration Pairs", (245, 158, 11)),
        ("✦ L2 Microstructure & Order Book Imbalance", (59, 130, 246)),
        ("✦ Risk Parity & Parametric VaR (95%)", (16, 185, 129)),
        ("✦ Kyle's Lambda Slippage Modeling", (168, 85, 247)),
        ("✦ Real-Time Executa Screener Native", (236, 72, 153))
    ]
    y_pill = 320
    for feat, color in features:
        draw.rounded_rectangle([(60, y_pill), (490, y_pill + 38)], radius=8, fill=(15, 23, 42, 220), outline=(*color, 120), width=1)
        draw.text((75, y_pill + 10), feat, font=font_pill, fill=(241, 245, 249, 255))
        y_pill += 52

    # Footer note
    draw.text((60, 640), "VERIFIED DEVELOPER  |  100% AIR-GAPPED VAULT  |  MIT LICENSE", font=font_foot, fill=(100, 116, 139, 255))

    # Right side: App screenshot preview
    shot_path = "/Users/ishantpanchal/anna-cmc-terminal/assets/screenshot_1.png"
    if os.path.exists(shot_path):
        shot = Image.open(shot_path).convert("RGBA")
        # Resize preserving aspect ratio to fit inside 680x560
        shot.thumbnail((680, 560), Image.Resampling.LANCZOS)
        sw, sh = shot.size
        sx = 1220 - sw
        sy = (H - sh) // 2

        # Card shadow & border
        card_back = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        card_draw = ImageDraw.Draw(card_back)
        card_draw.rounded_rectangle([(sx - 4, sy - 4), (sx + sw + 4, sy + sh + 4)], radius=12, fill=(0, 0, 0, 180), outline=(245, 158, 11, 140), width=2)
        card_back = card_back.filter(ImageFilter.GaussianBlur(10))
        img = Image.alpha_composite(img, card_back)

        # Paste screenshot
        img.paste(shot, (sx, sy), shot)

        # Border around preview
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=8, outline=(245, 158, 11, 200), width=2)

    img.convert("RGB").save(output_path, "PNG", quality=95)
    print(f"CMC cover generated -> {output_path}")

def create_sentinel_cover(output_path: str):
    W, H = 1280, 720
    img = Image.new("RGBA", (W, H), (6, 10, 18, 255))
    draw = ImageDraw.Draw(img)

    # Subtle background cyber grid
    for y in range(0, H, 40):
        draw.line([(0, y), (W, y)], fill=(12, 28, 24, 120), width=1)
    for x in range(0, W, 40):
        draw.line([(x, 0), (x, H)], fill=(12, 28, 24, 120), width=1)

    # Ambient glow on the left
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([(-100, 100), (500, 700)], fill=(16, 185, 129, 28))
    glow_draw.ellipse([(200, -100), (800, 500)], fill=(6, 182, 212, 22))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Try loading system fonts
    try:
        font_badge = ImageFont.truetype(FONT_MONO_PATH, 16)
        font_title = ImageFont.truetype(FONT_TITLE_PATH, 52, index=1)
        font_sub = ImageFont.truetype(FONT_TITLE_PATH, 24, index=0)
        font_pill = ImageFont.truetype(FONT_TITLE_PATH, 16, index=1)
        font_foot = ImageFont.truetype(FONT_MONO_PATH, 14)
    except Exception:
        font_badge = font_title = font_sub = font_pill = font_foot = ImageFont.load_default()

    # Category Pill
    draw.rounded_rectangle([(60, 60), (410, 92)], radius=16, fill=(15, 30, 24, 200), outline=(16, 185, 129, 180), width=1)
    draw.text((75, 68), "ANNA AI OS  •  WEB3 UTILITY & SECURITY", font=font_badge, fill=(16, 185, 129, 255))

    # Main Title
    draw.text((60, 120), "SENTINEL WEB3", font=font_title, fill=(255, 255, 255, 255))
    draw.text((60, 180), "RISK SCANNER", font=font_title, fill=(16, 185, 129, 255))

    # Subtitle
    draw.text((60, 256), "AI Intent Divergence & EVM Exploit Firewall", font=font_sub, fill=(148, 163, 184, 255))

    # Feature Badges
    features = [
        ("✦ AI Intent Divergence Reasoning Engine", (16, 185, 129)),
        ("✦ Smart Contract Honeypot & Tax Audit", (6, 182, 212)),
        ("✦ Covert Drainer & Phishing Detection", (239, 68, 68)),
        ("✦ Automated Safe Calldata Synthesis", (59, 130, 246)),
        ("✦ Pre-Execution Bytecode Simulation", (168, 85, 247))
    ]
    y_pill = 320
    for feat, color in features:
        draw.rounded_rectangle([(60, y_pill), (490, y_pill + 38)], radius=8, fill=(15, 23, 42, 220), outline=(*color, 120), width=1)
        draw.text((75, y_pill + 10), feat, font=font_pill, fill=(241, 245, 249, 255))
        y_pill += 52

    # Footer note
    draw.text((60, 640), "VERIFIED DEVELOPER  |  EVM MULTI-CHAIN  |  PRE-SIGNING SHIELD", font=font_foot, fill=(100, 116, 139, 255))

    # Right side: App screenshot preview
    shot_path = "/Users/ishantpanchal/anna-sentinel-scanner/assets/screenshot_1.png"
    if os.path.exists(shot_path):
        shot = Image.open(shot_path).convert("RGBA")
        shot.thumbnail((680, 560), Image.Resampling.LANCZOS)
        sw, sh = shot.size
        sx = 1220 - sw
        sy = (H - sh) // 2

        card_back = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        card_draw = ImageDraw.Draw(card_back)
        card_draw.rounded_rectangle([(sx - 4, sy - 4), (sx + sw + 4, sy + sh + 4)], radius=12, fill=(0, 0, 0, 180), outline=(16, 185, 129, 140), width=2)
        card_back = card_back.filter(ImageFilter.GaussianBlur(10))
        img = Image.alpha_composite(img, card_back)

        img.paste(shot, (sx, sy), shot)

        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=8, outline=(16, 185, 129, 200), width=2)

    img.convert("RGB").save(output_path, "PNG", quality=95)
    print(f"Sentinel cover generated -> {output_path}")

if __name__ == "__main__":
    create_cmc_cover("/Users/ishantpanchal/anna-cmc-terminal/assets/cover.png")
    create_sentinel_cover("/Users/ishantpanchal/anna-sentinel-scanner/assets/cover.png")
