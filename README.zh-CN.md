# PR Size Labeler GitHub Action 🏷️

[English](README.md) | [简体中文](README.zh-CN.md)

轻量、零依赖的 GitHub Action，能够根据代码变更总行数（新增 + 删除）自动为 Pull Request 标记尺寸标签（`size/XS`、`size/S`、`size/M`、`size/L`、`size/XL`）。

鼓励团队与社区开发者提交体积极小、更易于审查的高质量 PR！

---

## 🚀 快速上手

在仓库中创建工作流文件 `.github/workflows/pr-size-labeler.yml`：

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

## ⚙️ 自定义配置

你可以自由修改标签前缀与各分级的阈值：

```yaml
- uses: Enard52/pr-size-labeler@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    label-prefix: 'pr/size-'   # 默认: 'size/'
    xs-max-size: 15           # 默认: 10
    s-max-size: 75            # 默认: 50
    m-max-size: 300           # 默认: 250
    l-max-size: 800           # 默认: 1000
```

---

## 许可证

MIT © [Enard52](https://github.com/Enard52)
