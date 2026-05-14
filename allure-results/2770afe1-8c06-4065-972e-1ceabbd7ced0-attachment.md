# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lab12.spec.js >> Лабораторна робота 12 - Базовий рівень >> Завдання 5: Робота з новими вкладками
- Location: tests\lab12.spec.js:79:9

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://the-internet.herokuapp.com/windows", waiting until "load"

```

# Test source

```ts
  1   | // tests/lab12.spec.js
  2   | import { test, expect } from '@playwright/test';
  3   | 
  4   | test.describe('Лабораторна робота 12 - Базовий рівень', () => {
  5   | 
  6   |     // Завдання 1. Відкриття сторінки
  7   |     test('Завдання 1: Перевірка URL, тексту та скриншот', async ({ page }) => {
  8   |         await page.goto("https://the-internet.herokuapp.com"); // [cite: 614]
  9   |         
  10  |         // Крок 1: Перевірити URL сторінки [cite: 619]
  11  |         await expect(page).toHaveURL("https://the-internet.herokuapp.com/"); 
  12  |         
  13  |         // Крок 2: Перевірити наявність тексту "Welcome to the-internet" [cite: 620]
  14  |         const heading = page.locator('h1.heading');
  15  |         await expect(heading).toContainText("Welcome to the-internet"); 
  16  |         
  17  |         // Крок 3: Зробити screenshot сторінки [cite: 621]
  18  |         await page.screenshot({ path: 'screenshots/home.png' }); // [cite: 698-700]
  19  |     });
  20  | 
  21  |     // Завдання 2. Логін (Негативний тест)
  22  |     test('Завдання 2: Логін з неправильним паролем', async ({ page }) => {
  23  |         await page.goto("https://the-internet.herokuapp.com/login"); // [cite: 627]
  24  |         
  25  |         // Крок 1: Створити тест із неправильним паролем [cite: 636]
  26  |         await page.locator("#username").fill("tomsmith"); // [cite: 629]
  27  |         await page.locator("#password").fill("WrongPassword123!"); 
  28  |         await page.locator("button[type='submit']").click(); // [cite: 633]
  29  |         
  30  |         // Крок 2: Перевірити текст помилки [cite: 637]
  31  |         const message = page.locator("#flash"); // [cite: 634]
  32  |         await expect(message).toContainText("Your username is invalid!"); 
  33  |         
  34  |         // Крок 3: Додати screenshot після логіну [cite: 638]
  35  |         await page.screenshot({ path: 'screenshots/login-error.png' }); 
  36  |     });
  37  | 
  38  |     // Завдання 3. Чекбокси
  39  |     test('Завдання 3: Робота з чекбоксами', async ({ page }) => {
  40  |         await page.goto("https://the-internet.herokuapp.com/checkboxes"); // [cite: 644-645]
  41  |         
  42  |         const checkbox1 = page.locator("input[type='checkbox']").nth(0); // [cite: 648-651]
  43  |         const checkbox2 = page.locator("input[type='checkbox']").nth(1);
  44  |         
  45  |         // Крок 1: Використати uncheck() (для другого, бо він за замовчуванням checked) [cite: 653]
  46  |         await checkbox2.uncheck();
  47  |         await expect(checkbox2).not.toBeChecked();
  48  |         
  49  |         // Крок 2: Перевірити/встановити перший checkbox [cite: 654]
  50  |         await checkbox1.check();
  51  |         await expect(checkbox1).toBeChecked();
  52  |         
  53  |         // Крок 3: Зробити screenshot [cite: 655]
  54  |         await page.screenshot({ path: 'screenshots/checkboxes.png' });
  55  |     });
  56  | 
  57  |     // Завдання 4. Alerts
  58  |     test('Завдання 4: Обробка JavaScript Alerts', async ({ page }) => {
  59  |         await page.goto("https://the-internet.herokuapp.com/javascript_alerts"); // [cite: 661-662]
  60  |         
  61  |         // Налаштовуємо слухача ДО того, як натиснемо кнопку
  62  |         page.on('dialog', async (dialog) => {
  63  |             // Крок 2: Перевірити текст alert [cite: 671]
  64  |             expect(dialog.message()).toBe('I am a JS Confirm'); 
  65  |             
  66  |             // Крок 1: Використати dialog.dismiss() [cite: 670]
  67  |             await dialog.dismiss(); 
  68  |         });
  69  |         
  70  |         // Натискаємо кнопку, яка викликає Alert (Confirm)
  71  |         await page.locator("button[onclick='jsConfirm()']").click(); 
  72  |         
  73  |         // Крок 3: Перевірити текст результату після alert [cite: 672]
  74  |         const resultText = page.locator("#result");
  75  |         await expect(resultText).toHaveText("You clicked: Cancel");
  76  |     });
  77  | 
  78  |     // Завдання 5. Вкладки
  79  |     test('Завдання 5: Робота з новими вкладками', async ({ context, page }) => {
> 80  |         await page.goto("https://the-internet.herokuapp.com/windows"); // [cite: 678]
      |                    ^ Error: page.goto: Target page, context or browser has been closed
  81  |         
  82  |         // Очікуємо на відкриття нової вкладки [cite: 680]
  83  |         const pagePromise = context.waitForEvent('page'); 
  84  |         await page.locator("a[href='/windows/new']").click(); // [cite: 682]
  85  |         const newPage = await pagePromise; // Отримуємо об'єкт нової вкладки [cite: 684]
  86  |         
  87  |         await newPage.waitForLoadState();
  88  |         
  89  |         // Крок 2: Перевірити URL вкладки [cite: 688]
  90  |         await expect(newPage).toHaveURL("https://the-internet.herokuapp.com/windows/new");
  91  |         
  92  |         // Завдання 6, Крок 3: Зробити screenshot нової вкладки [cite: 703]
  93  |         await newPage.screenshot({ path: 'screenshots/new-tab.png' });
  94  |         
  95  |         // Крок 1: Закрити нову вкладку [cite: 687]
  96  |         await newPage.close(); 
  97  |         
  98  |         // Крок 3: Повернутися до першої вкладки (перевірити, що ми там) [cite: 689]
  99  |         await expect(page).toHaveTitle("The Internet"); 
  100 |     });
  101 | });
```