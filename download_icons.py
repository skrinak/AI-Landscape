import io
import os
import subprocess
import tempfile
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFont

IMAGES_DIR = Path("images")
IMAGES_DIR.mkdir(exist_ok=True)
SIZE = 128
RSVG = "/opt/homebrew/bin/rsvg-convert"
TIMEOUT = 12

ICONS: list[tuple[str, str | None, str | None, str, str]] = [
    # (filename, simple_icons_slug, clearbit_domain, fallback_color, abbr)
    ("anthropic.png",    "anthropic",         "anthropic.com",          "#D97757", "ANT"),
    ("openai.png",       "openai",            "openai.com",             "#412991", "OAI"),
    ("google.png",       "google",            "google.com",             "#4285F4", "GGL"),
    ("meta.png",         "meta",              "meta.com",               "#0081FB", "META"),
    ("microsoft.png",    "microsoft",         "microsoft.com",          "#737373", "MS"),
    ("xai.png",          "x",                 "x.ai",                   "#000000", "XAI"),
    ("mistral.png",      "mistralai",         "mistral.ai",             "#FF7000", "MIS"),
    ("deepseek.png",     "deepseek",          "deepseek.com",           "#4D6BFE", "DS"),
    ("cohere.png",       "cohere",            "cohere.com",             "#39594D", "COH"),
    ("aws.png",          "amazonaws",         "aws.amazon.com",         "#FF9900", "AWS"),
    ("azure.png",        "microsoftazure",    "azure.microsoft.com",    "#0089D6", "AZR"),
    ("googlecloud.png",  "googlecloud",       "cloud.google.com",       "#4285F4", "GCP"),
    ("huggingface.png",  "huggingface",       "huggingface.co",         "#FFD21E", "HF"),
    ("langchain.png",    "langchain",         "langchain.com",          "#1C3C3C", "LC"),
    ("ollama.png",       "ollama",            "ollama.com",             "#333333", "OLL"),
    ("groq.png",         "groq",              "groq.com",               "#F55036", "GRQ"),
    ("pinecone.png",     "pinecone",          "pinecone.io",            "#1C17FF", "PCN"),
    ("qdrant.png",       "qdrant",            "qdrant.tech",            "#DC244C", "QDR"),
    ("weaviate.png",     "weaviate",          "weaviate.io",            "#4CAF50", "WEA"),
    ("wandb.png",        "weightsandbiases",  "wandb.ai",               "#FFBE00", "W&B"),
    ("mlflow.png",       "mlflow",            "mlflow.org",             "#0194E2", "MLF"),
    ("n8n.png",          "n8n",               "n8n.io",                 "#EA4B71", "n8n"),
    ("github.png",       "github",            "github.com",             "#181717", "GH"),
    ("githubactions.png","githubactions",     "github.com",             "#2088FF", "GHA"),
    ("terraform.png",    "terraform",         "hashicorp.com",          "#7B42BC", "TF"),
    ("kafka.png",        "apachekafka",       "kafka.apache.org",       "#231F20", "KFK"),
    ("notion.png",       "notion",            "notion.so",              "#000000", "NOT"),
    ("grafana.png",      "grafana",           "grafana.com",            "#F46800", "GRF"),
    ("nvidia.png",       "nvidia",            "nvidia.com",             "#76B900", "NVD"),
    ("slack.png",        "slack",             "slack.com",              "#4A154B", "SLK"),
    ("milvus.png",       "milvus",            "milvus.io",              "#00A1EA", "MIL"),
    ("postgresql.png",   "postgresql",        "postgresql.org",         "#336791", "PG"),
    ("crewai.png",       "crewai",            "crewai.com",             "#FF0054", "CRW"),
    ("dify.png",         None,                "dify.ai",                "#9333EA", "DFY"),
    ("flowise.png",      None,                "flowiseai.com",          "#1E88E5", "FLW"),
    ("together.png",     None,                "together.ai",            "#0055FF", "TGT"),
    ("vllm.png",         None,                "vllm.ai",                "#4169E1", "VLM"),
    ("llamaindex.png",   None,                "llamaindex.ai",          "#6C3483", "LLI"),
    ("langfuse.png",     None,                "langfuse.com",           "#EC4899", "LNF"),
    ("arize.png",        None,                "arize.com",              "#7B61FF", "ARZ"),
    ("elevenlabs.png",   "elevenlabs",        "elevenlabs.io",          "#FFCC00", "E11"),
    ("runway.png",       None,                "runwayml.com",           "#0F0F0F", "RWY"),
    ("e2b.png",          None,                "e2b.dev",                "#FF6B35", "E2B"),
    ("opensearch.png",   None,                "opensearch.org",         "#005EB8", "OSS"),
    ("mem0.png",         None,                "mem0.ai",                "#6C3483", "M0"),
    ("lakera.png",       None,                "lakera.ai",              "#E63946", "LAK"),
    ("flux.png",         None,                "blackforestlabs.ai",     "#FF4040", "FLX"),
    ("strands.png",      None,                "aws.amazon.com",         "#FF9900", "STR"),
    ("generic.png",      None,                None,                     "#607D8B", "AI"),
]


def svg_to_png(svg_bytes: bytes) -> bytes | None:
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as tf:
        tf.write(svg_bytes)
        svg_path = tf.name
    png_path = svg_path.replace(".svg", ".png")
    try:
        result = subprocess.run(
            [RSVG, "-w", str(SIZE), "-h", str(SIZE), svg_path, "-o", png_path],
            capture_output=True,
            timeout=15,
        )
        if result.returncode == 0 and os.path.exists(png_path):
            img = Image.open(png_path).convert("RGBA")
            bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            out = io.BytesIO()
            bg.convert("RGB").save(out, "PNG")
            return out.getvalue()
    except Exception as e:
        print(f"    rsvg err: {e}", end="")
    finally:
        for p in (svg_path, png_path):
            if os.path.exists(p):
                os.unlink(p)
    return None


def try_simple_icons(slug: str) -> bytes | None:
    for url in [
        f"https://cdn.simpleicons.org/{slug}",
        f"https://simpleicons.org/icons/{slug}.svg",
    ]:
        try:
            r = requests.get(url, timeout=TIMEOUT)
            if r.status_code == 200 and b"<svg" in r.content:
                data = svg_to_png(r.content)
                if data:
                    return data
        except Exception as e:
            print(f"    si err: {e}", end="")
    return None


def try_clearbit(domain: str) -> bytes | None:
    try:
        r = requests.get(
            f"https://logo.clearbit.com/{domain}?size={SIZE}",
            timeout=TIMEOUT,
        )
        if r.status_code == 200 and "image" in r.headers.get("Content-Type", ""):
            img = Image.open(io.BytesIO(r.content)).convert("RGB")
            img = img.resize((SIZE, SIZE), Image.LANCZOS)
            out = io.BytesIO()
            img.save(out, "PNG")
            return out.getvalue()
    except Exception as e:
        print(f"    cb err: {e}", end="")
    return None


def make_fallback(color_hex: str, abbr: str) -> bytes:
    r, g, b = int(color_hex[1:3], 16), int(color_hex[3:5], 16), int(color_hex[5:7], 16)
    img = Image.new("RGB", (SIZE, SIZE), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    pad = 6
    draw.rounded_rectangle([pad, pad, SIZE - pad, SIZE - pad], radius=20, fill=(r, g, b))
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), abbr, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((SIZE - tw) // 2, (SIZE - th) // 2 - 4), abbr, fill=(255, 255, 255), font=font)
    out = io.BytesIO()
    img.save(out, "PNG")
    return out.getvalue()


if __name__ == "__main__":
    print(f"Downloading {len(ICONS)} icons to {IMAGES_DIR}/\n")
    downloaded, fallback_count, skipped = 0, 0, 0

    for filename, slug, domain, color, abbr in ICONS:
        path = IMAGES_DIR / filename
        if path.exists():
            print(f"  skip  {filename}")
            skipped += 1
            continue

        print(f"  {filename:<30}", end="", flush=True)
        data = None
        source = ""

        if slug:
            data = try_simple_icons(slug)
            if data:
                source = f"simple-icons:{slug}"

        if not data and domain:
            data = try_clearbit(domain)
            if data:
                source = f"clearbit:{domain}"

        if not data:
            data = make_fallback(color, abbr)
            source = f"fallback:{abbr}"
            fallback_count += 1
        else:
            downloaded += 1

        path.write_bytes(data)
        print(f" [{source}]")

    print(f"\n  {downloaded} downloaded  {fallback_count} generated  {skipped} skipped")
