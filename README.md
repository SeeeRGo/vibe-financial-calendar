# Financial Calendar App

## English

This application is a personal financial calendar built with Vite, React, TailwindCSS, and Convex. It allows users to manage their income and expense events, organize them by categories, set spending caps, and visualize their financial activity on a calendar. The app supports recurring events, category management, and real-time projections of spending against category caps.

### Features

- **Authentication**: Secure login with Convex Auth.
- **Calendar View**: Visualize all financial events (income/expense) on a monthly calendar.
- **Event Management**: Add, edit, delete, enable/disable, and drag-and-drop events.
- **Recurring Events**: Create events that repeat daily, weekly, monthly, or yearly.
- **Categories**: Organize events by categories (income/expense), including nested categories.
- **Spending Caps**: Set spending limits per category for daily, weekly, monthly, or yearly periods.
- **Balance & Projections**: View remaining budget and projected spending for each category, with color-coded warnings for overspending.
- **Real-time Updates**: All changes are instantly reflected for the user.
- **E2E and Unit Tests**: Includes Playwright E2E tests and Vitest unit tests for calculations.

### How it works

- **Events**: Each event has a title, amount, date, type (income/expense), category, and optional recurrence.
- **Categories**: Each category can have a spending cap and can be nested.
- **Projections**: The app calculates projected spending for a category up to a selected date and warns if the cap will be exceeded.

---

## Русский

Это приложение — персональный финансовый календарь, созданный с использованием Vite, React, TailwindCSS и Convex. Оно позволяет пользователям управлять доходами и расходами, организовывать их по категориям, устанавливать лимиты расходов и визуализировать финансовую активность на календаре. Приложение поддерживает повторяющиеся события, управление категориями и прогнозирование расходов в реальном времени относительно лимитов.

### Возможности

- **Аутентификация**: Безопасный вход через Convex Auth.
- **Календарь**: Визуализация всех финансовых событий (доходы/расходы) на месячном календаре.
- **Управление событиями**: Добавление, редактирование, удаление, включение/отключение и перетаскивание событий.
- **Повторяющиеся события**: Создание событий с повторением (ежедневно, еженедельно, ежемесячно, ежегодно).
- **Категории**: Организация событий по категориям (доход/расход), поддержка вложенных категорий.
- **Лимиты расходов**: Установка лимитов на категории по дням, неделям, месяцам или годам.
- **Баланс и прогнозы**: Просмотр оставшегося бюджета и прогнозируемых расходов по каждой категории, цветовые предупреждения о перерасходе.
- **Обновления в реальном времени**: Все изменения мгновенно отображаются пользователю.
- **E2E и модульные тесты**: Включены E2E тесты на Playwright и модульные тесты на Vitest для расчетов.

### Как это работает

- **События**: Каждое событие содержит название, сумму, дату, тип (доход/расход), категорию и опциональное повторение.
- **Категории**: Каждая категория может иметь лимит расходов и быть вложенной.
- **Прогнозы**: Приложение рассчитывает прогнозируемые расходы по категории до выбранной даты и предупреждает о возможном превышении лимита.

---

## Project Structure

- `src/` — Frontend React components and utilities
- `convex/` — Convex backend functions and schema
- `e2e/` — Playwright end-to-end tests
- `src/utils/calculations.ts` — Core calculation logic with unit tests

---

## Running the App

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Run unit tests: `npm run test`
4. Run E2E tests: `npm run test:e2e`

---
