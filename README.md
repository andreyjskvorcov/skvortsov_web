# skvortsov.web

UI-kit и уроки по JavaScript, Vue, React и фронтенду на [Astro 5](https://astro.build).

## Запуск

Нужен Node 20.3+ (или 22+).

```sh
npm install
npm run dev    # http://localhost:4321
npm run build
```

## Структура

```
src/
  components/
    ui/          # UI-kit: Button, Card, Badge, Callout, ThemeToggle
    blocks/      # Составные блоки: Header
    demos/vue/   # Vue-демки для уроков
    demos/react/ # React-демки (React подключён только для этой папки)
  content/lessons/{js,vue,react,frontend}/  # Уроки в MDX
  layouts/       # BaseLayout, DocsLayout
  lib/sections.ts
  pages/         # /, /learn, /learn/[section], /learn/[...slug], /ui-kit
  styles/        # tokens.css, global.css
```

## Как добавить урок

Создать `src/content/lessons/<section>/<slug>.mdx`:

```mdx
---
title: Название
description: Коротко о чём
section: js
order: 3
level: beginner   # beginner | middle | advanced
tags: [tag]
---
```

План работ — в [../TODO.md](../TODO.md).
