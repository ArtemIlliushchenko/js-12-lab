import { test, expect } from '@playwright/test';

test.describe('Лабораторна робота 12 - Базовий рівень', () => {

    // Завдання 1. Відкриття сторінки
    test('Завдання 1: Перевірка URL, тексту та скриншот', async ({ page }) => {
        await page.goto("https://the-internet.herokuapp.com"); 
        
        // Перевірка URL сторінки
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/"); 
        
        // Перевірка наявності тексту "Welcome to the-internet"
        const heading = page.locator('h1.heading');
        await expect(heading).toContainText("Welcome to the-internet"); 
        
        // Збереження скриншота
        await page.screenshot({ path: 'screenshots/home.png' }); 
    });

    // Завдання 2. Логін (Негативний тест)
    test('Завдання 2: Логін з неправильним паролем', async ({ page }) => {
        await page.goto("https://the-internet.herokuapp.com/login"); 
        
        // Введення неправильних даних
        await page.locator("#username").fill("wrong_user"); 
        await page.locator("#password").fill("WrongPassword123!"); 
        await page.locator("button[type='submit']").click(); 
        
        // Перевірка тексту помилки
        const message = page.locator("#flash"); 
        await expect(message).toContainText("Your username is invalid!"); 
        
        await page.screenshot({ path: 'screenshots/login-error.png' }); 
    });

    // Завдання 3. Чекбокси
    test('Завдання 3: Робота з чекбоксами', async ({ page }) => {
        await page.goto("https://the-internet.herokuapp.com/checkboxes"); 
        
        const checkbox1 = page.locator("input[type='checkbox']").nth(0); 
        const checkbox2 = page.locator("input[type='checkbox']").nth(1);
        
        // Зняття прапорця з другого чекбокса
        await checkbox2.uncheck();
        await expect(checkbox2).not.toBeChecked();
        
        // Встановлення першого чекбокса
        await checkbox1.check();
        await expect(checkbox1).toBeChecked();
        
        await page.screenshot({ path: 'screenshots/checkboxes.png' });
    });

    // Завдання 4. Alerts
    test('Завдання 4: Обробка JavaScript Alerts', async ({ page }) => {
        await page.goto("https://the-internet.herokuapp.com/javascript_alerts"); 
        
        // Слухач для Alert-вікна
        page.on('dialog', async (dialog) => {
            // Перевірка тексту alert
            expect(dialog.message()).toBe('I am a JS Confirm'); 
            // Скасування (dismiss)
            await dialog.dismiss(); 
        });
        
        // Виклик Alert
        await page.getByText('Click for JS Confirm').click(); 
        
        // Перевірка результату після скасування alert
        const resultText = page.locator("#result");
        await expect(resultText).toHaveText("You clicked: Cancel");
    });

    // Завдання 5. Вкладки
    test('Завдання 5: Робота з новими вкладками', async ({ context, page }) => {
        await page.goto("https://the-internet.herokuapp.com/windows"); 
        
        // Паралельне очікування вкладки та клік
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.getByText('Click Here').click()
        ]);
        
        await newPage.waitForLoadState();
        
        // Перевірка URL нової вкладки та скриншот
        await expect(newPage).toHaveURL("https://the-internet.herokuapp.com/windows/new");
        await newPage.screenshot({ path: 'screenshots/new-tab.png' });
        
        // Закриття нової вкладки
        await newPage.close(); 
        
        // Повернення до першої вкладки
        await expect(page).toHaveTitle("The Internet"); 
    });
});