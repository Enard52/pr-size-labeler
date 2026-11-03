# PR Size Labeler Action 🏷️

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-PR%20Size%20Labeler-blue.svg)](https://github.com/marketplace)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A lightweight, zero-dependency GitHub Action that automatically categorizes and labels Pull Requests by size (`size/XS`, `size/S`, `size/M`, `size/L`, `size/XL`) based on the total number of lines changed (additions + deletions).

Encourages smaller, faster, and more reviewable pull requests for your team and open-source contributors!

---

## 🚀 Quick Start

Create a workflow file at `.github/workflows/pr-size-labeler.yml`:

```yaml
name: 'PR Size Labeler'

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  issues: write

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: Enard52/pr-size-labeler@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## ⚙️ Configuration (Optional)

You can customize the threshold boundaries:

```yaml
- uses: Enard52/pr-size-labeler@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    xs-max-size: 15     # Default: 10
    s-max-size: 75      # Default: 50
    m-max-size: 300     # Default: 250
    l-max-size: 800     # Default: 1000
    # Anything above l-max-size is labeled size/XL
```

---

## 🎨 Label Breakdown

| Label | Default Range | Ideal For |
| :--- | :--- | :--- |
| `size/XS` | 0 – 10 lines | Typo fixes, config tweaks, doc changes |
| `size/S` | 11 – 50 lines | Small bug fixes, minor additions |
| `size/M` | 51 – 250 lines | Standard feature / refactor PR |
| `size/L` | 251 – 1000 lines | Large feature PR |
| `size/XL` | > 1000 lines | Significant rework (recommend breaking up) |

---

## License

MIT © [Enard52](https://github.com/Enard52)
