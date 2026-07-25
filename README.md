# Wedding app

## Рассадка гостей

Публичная схема открывается по адресу `/seating`. Она читает только последнюю опубликованную версию. Ручной редактор доступен по адресу `/seating-admin`.

Создайте `.env.local`:

```env
VITE_SEATING_ADMIN_PIN=ваш-секретный-pin
```

После изменения переменной перезапустите Vite. PIN не имеет значения по умолчанию и не хранится в JSX. Успешный вход сохраняется только в `sessionStorage`.

Клиентский PIN скрывает интерфейс, но не защищает данные от технически подготовленного пользователя. Перед production-публикацией его необходимо заменить серверной авторизацией.

### Хранение и публикация

Черновик и опубликованная версия независимо хранятся в `localStorage`:

- редактор автоматически записывает `draft`;
- кнопка «Сохранить» принудительно сохраняет `draft`;
- кнопка «Опубликовать» после проверки копирует текущий черновик в `published`;
- `/seating` никогда не читает черновик.

UI работает через `src/features/seating/data/seatingRepository.js`. Чтобы перейти на Supabase или REST API, создайте реализацию с методами `getDraft`, `saveDraft`, `getPublished`, `publish`, `replaceDraft` и `exportData`, не меняя компоненты редактора.

### Импорт и экспорт

Редактор принимает JSON схемы версии 2 и CSV с минимальными колонками:

```csv
name,group,side,isChild,note
```

При импорте можно добавить данные к существующим или заменить их. Экспорт создаёт JSON полного черновика и CSV списка гостей.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
