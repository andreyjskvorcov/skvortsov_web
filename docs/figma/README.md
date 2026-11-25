# Промпты для Figma

Промпты для ИИ в Figma (First Draft / Figma Make) — по одному файлу на проект из [TODOPROJECTS.md](../../TODOPROJECTS.md).
В каждом файле: пара строк «что нужно перед ним» и блок `text`, который копируется в Figma целиком.

## Порядок

1. **Основа** — один раз, в файл «skvortsov.web Design System»:
   - [00-design-system.md](00-design-system.md) — переменные, типографика, базовые компоненты, Header, LinkCard;
   - [00-app-shell.md](00-app-shell.md) — каркас приложений и экраны обязательного минимума (вход, кабинет, wallet, поиск, политика, состояния);
   - [00-learning.md](00-learning.md) — блоки и страницы уроков (только для раздела «Обучение»).
2. **Проекты** — каждый на своей странице того же файла (или в отдельном файле с подключённой библиотекой):

| № | Промпт | Что нужно до него |
|---|---|---|
| 1 | [01-landing-developer.md](01-landing-developer.md) — лендинг разработчика (главная) | design-system |
| 2 | [02-bank.md](02-bank.md) — банк | design-system, app-shell |
| 3 | [03-payments.md](03-payments.md) — платёжки | design-system, app-shell |
| 4 | [04-bookstore.md](04-bookstore.md) — магазин книг и комиксов | design-system, app-shell |
| 5 | [05-focusify.md](05-focusify.md) — Focusify | design-system, app-shell |
| 6 | [06-games.md](06-games.md) — игровая платформа | design-system, app-shell |
| 7 | [07-grocery.md](07-grocery.md) — продукты | design-system, app-shell |
| 8 | [08-motion-showcase.md](08-motion-showcase.md) — motion-витрина на GSAP | design-system |
| 9 | [09-landing-focusify.md](09-landing-focusify.md) — промо-лендинг Focusify | design-system |
| 9 | [10-landing-course.md](10-landing-course.md) — лендинг курса | design-system |

Номера файлов совпадают с номерами проектов в TODOPROJECTS.md; два лендинга проекта 9 — файлы 09 и 10.

## Правила

- Приложения однотипные: всё общее (раскладка, вход, кабинет, wallet, поиск, состояния) — в app-shell,
  в промпте приложения — только его экраны и что своего в обязательном минимуме.
- Новых цветов и «похожих» компонентов не заводим: всё, чего не хватает, сначала добавляется в design-system / app-shell и в код кита.
- Если результат «плоский» — отдавайте блок по разделам.
