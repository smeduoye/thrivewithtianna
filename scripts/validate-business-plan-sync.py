#!/usr/bin/env python3
"""Validate business-plan.html section coverage vs docs/BUSINESS_PLAN_SUMMARY.md."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "docs" / "BUSINESS_PLAN_SUMMARY.md"
HTML_PATH = ROOT / "business-plan.html"

# Markdown ## headings → required HTML section ids
SECTION_MAP = {
    "1. Executive summary": "summary",
    "2. Mission and position": "position",
    "3. Target market": "market",
    "4. Service offerings": "offerings",
    "5. Pricing and monetisation": "pricing",
    "6. Client experience": "experience",
    "7. Coach operating model": "coach",
    "8. Technology overview": "technology",
    "9. Go-to-market": "gtm",
    "10. Compliance and trust": "compliance",
    "11. Roadmap": "roadmap",
    "12. Success metrics": "metrics",
    "13. Risks and mitigations": "risks",
    "14. Open decisions": "review",
}

# Flexible heading match (markdown uses slightly different titles)
HEADING_ALIASES = {
    "2. Mission and position": ["2. Mission and position", "2. Mission & position"],
    "5. Pricing and monetisation": ["5. Pricing and monetisation", "5. Pricing & monetisation"],
    "8. Technology overview": ["8. Technology overview", "8. Technology overview (non-technical)"],
    "10. Compliance and trust": ["10. Compliance and trust", "10. Compliance & trust"],
    "13. Risks and mitigations": ["13. Risks and mitigations", "13. Risks & mitigations"],
    "14. Open decisions": ["14. Open decisions", "14. Open decisions — review checklist"],
}


def read(path: Path) -> str:
    if not path.is_file():
        print(f"ERROR: missing {path.relative_to(ROOT)}")
        sys.exit(1)
    return path.read_text(encoding="utf-8")


def markdown_sections(md: str) -> list[str]:
    found = []
    for line in md.splitlines():
        m = re.match(r"^## (\d+\. .+)$", line.strip())
        if m:
            found.append(m.group(1))
    return found


def html_section_ids(html: str) -> set[str]:
    return set(re.findall(r'<section id="([^"]+)"', html))


def toc_hrefs(html: str) -> set[str]:
    refs = re.findall(r'class="bp-toc"[\s\S]*?</aside>', html)
    if not refs:
        return set()
    block = refs[0]
    return {h.lstrip("#") for h in re.findall(r'href="#([^"]+)"', block)}


def main() -> int:
    md = read(MD_PATH)
    html = read(HTML_PATH)

    md_headings = markdown_sections(md)
    html_ids = html_section_ids(html)
    toc_ids = toc_hrefs(html)

    errors: list[str] = []

    for canonical, section_id in SECTION_MAP.items():
        aliases = HEADING_ALIASES.get(canonical, [canonical])
        if not any(any(h.startswith(a.split(". ", 1)[0] + ".") for h in md_headings) for a in aliases):
            # Section removed from markdown — warn if HTML still has it
            if section_id in html_ids:
                errors.append(f"HTML still has #{section_id} but markdown section '{canonical}' is missing")
            continue

        if section_id not in html_ids:
            errors.append(f"Missing <section id=\"{section_id}\"> for markdown '{canonical}'")
        if section_id not in toc_ids:
            errors.append(f"Missing TOC link href=\"#{section_id}\" in .bp-toc")

    # HTML sections not mapped
    expected = set(SECTION_MAP.values())
    extra = html_ids - expected
    if extra:
        errors.append(f"Unexpected HTML section ids (update SECTION_MAP): {sorted(extra)}")

    if errors:
        print("Business plan sync validation FAILED:\n")
        for e in errors:
            print(f"  - {e}")
        print("\nFix business-plan.html or update scripts/validate-business-plan-sync.py")
        print("See .cursor/skills/sync-business-plan-html/SKILL.md")
        return 1

    print("OK: business-plan.html sections and TOC match BUSINESS_PLAN_SUMMARY.md structure.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
