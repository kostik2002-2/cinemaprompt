# CinemaPrompt

**CinemaPrompt** — визуальный гайд по использованию камер, кинооптики и фотографических стилей в промптах для AI-генерации изображений.

Сайт помогает сравнить визуальный характер разных систем — от смартфона и Canon до Leica, ARRI, Panavision, Hasselblad и IMAX — и собрать готовый промпт для генерации.

## Сайт

- Основной адрес: https://cinemaprompt.ru
- Cloudflare Pages: https://cinemaprompt.pages.dev
- GitHub: https://github.com/kostik2002-2/cinemaprompt

## Основные возможности

- 11 визуальных направлений, основанных на характере камер и оптики.
- Интерактивные слайд-шоу с примерами.
- Конструкторы промптов для каждого раздела.
- Просмотр изображений в лайтбоксе.
- Русская и английская версии интерфейса.
- Адаптивная мобильная версия.
- Open Graph и Twitter Card для веб-превью.
- SEO-разметка, sitemap и robots.txt.
- Cloudflare Web Analytics.
- Microsoft Clarity для записей сессий и карт кликов.

## Структура проекта

```text
assets/              изображения и Open Graph preview
css/
  styles.css         основные стили
js/
  data.js            данные для конструкторов и переводов
  main.js            логика интерфейса
favicon.ico
favicon.png
index.html
robots.txt
site.webmanifest
sitemap.xml
README.md
```

## Технологии

- HTML5
- CSS3
- JavaScript без фреймворков
- Tailwind CSS через CDN
- Cloudflare Pages
- GitHub
- Cloudflare Web Analytics
- Microsoft Clarity

## Локальный запуск

Проект не требует сборки.

Можно открыть `index.html` напрямую в браузере или запустить локальный сервер.

Пример через Python:

```bash
python -m http.server 8000
```

После запуска сайт будет доступен по адресу:

```text
http://localhost:8000
```

## Рабочий процесс

После внесения изменений:

```bash
git add .
git commit -m "Краткое описание изменений"
git push origin main
```

Cloudflare Pages автоматически получает новый коммит из ветки `main` и запускает публикацию.

## Деплой

Cloudflare Pages настроен на репозиторий:

```text
kostik2002-2/cinemaprompt
```

Параметры:

```text
Production branch: main
Framework preset: None
Build command: пусто
Build output directory: .
```

## SEO и веб-превью

В проекте настроены:

- `title` и `meta description`;
- canonical URL;
- Open Graph;
- Twitter Card;
- JSON-LD;
- `robots.txt`;
- `sitemap.xml`;
- `site.webmanifest`;
- изображение `assets/og-image.png` размером 1200×630.

## Аналитика

### Cloudflare Web Analytics

Используется для подсчёта:

- посещений;
- просмотров страниц;
- стран;
- устройств;
- браузеров;
- источников переходов.

### Microsoft Clarity

Project ID:

```text
xkttk46p6h
```

Clarity используется для:

- записей пользовательских сессий;
- карт кликов;
- карт прокрутки;
- анализа поведения посетителей.

## Важные замечания

- Не хранить в репозитории локальные `.env`, архивы и временные файлы.
- Файл `Запустить CodexPro.bat` исключён через `.gitignore`.
- Перед крупными изменениями проверять мобильную и десктопную версии.
- Внешний вид сайта должен сохраняться пиксель-в-пиксель при рефакторинге.

## Автор

Konstantin Piunov
