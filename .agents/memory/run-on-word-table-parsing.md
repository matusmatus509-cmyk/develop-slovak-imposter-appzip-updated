---
name: Run-on word-table parsing
description: How to reliably split user-pasted concatenated word-bank tables (no delimiters) into per-column arrays.
---

Users sometimes paste large Slovak word-bank tables (e.g. Ľahké/Stredné/Ťažké difficulty tiers for party-game word banks) as raw run-on text with no delimiters between cells — entries are just concatenated, relying on capitalization to mark boundaries, in row-major order (col1, col2, col3, col1, col2, col3, ...).

**Why:** A simple regex splitting on every lowercase→uppercase transition works for ~99% of entries, but fails when an entry is a bare acronym or single capital letter with no lowercase (e.g. "ZOO", "Vitamín C") directly followed by the next entry — there's no lowercase char to anchor the split, so the two entries silently fuse into one token. This shows up as the total token count not being evenly divisible by 3 (the row width).

**How to apply:**
1. Tokenize with a lookbehind/lookahead regex: split before any uppercase letter immediately preceded (no space) by a lowercase letter. This safely leaves multi-word phrases with spaces (e.g. "Letisko Bratislava") and acronym+space+word entries (e.g. "USB kľúč", "LED žiarovka") intact as single tokens.
2. Check `tokens.length % 3` (or whatever the row width is) — if nonzero, there's a fused pair somewhere.
3. Don't trust header text claiming specific per-tier counts (e.g. "(170 slov)") — actual pasted content is frequently smaller/different; treat the real tokenized content as authoritative.
4. For finding the exact fusion point, pass the indexed token array (not raw text) to an LLM and ask it to find where the (easy, medium, hard) triple-cycle breaks and how to fix it — this is a much more tractable/accurate task for an LLM than parsing the raw run-on text from scratch (which had ~1% error rate in testing).
