import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on the Register link to navigate to the registration page.
        frame = context.pages[-1]
        # Click on Register link to go to registration page
        elem = frame.locator('xpath=html/body/div/div[2]/nav/div/div/div[2]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Select role as Pharmacy from the role dropdown.
        frame = context.pages[-1]
        # Click on Role dropdown to select Pharmacy
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div[2]/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Retry filling the Full Name field using a different approach or verify the input element's readiness before input.
        frame = context.pages[-1]
        # Click Full Name input field to focus
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Retry filling Full Name field
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test Pharmacy User')
        

        # -> Fill Email field with 'pharmacyuser@example.com'.
        frame = context.pages[-1]
        # Fill Email field
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pharmacyuser@example.com')
        

        # -> Fill Phone Number field with '1234567890'.
        frame = context.pages[-1]
        # Fill Phone Number field
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1234567890')
        

        # -> Check the Terms & Conditions checkbox and submit the registration form.
        frame = context.pages[-1]
        # Check Terms & Conditions checkbox
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[5]/label/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click Register button to submit the form
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill all required fields correctly and check the Terms & Conditions checkbox before submitting the form again.
        frame = context.pages[-1]
        # Fill Full Name
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test Pharmacy User')
        

        frame = context.pages[-1]
        # Fill Email
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pharmacyuser@example.com')
        

        frame = context.pages[-1]
        # Fill Phone Number
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1234567890')
        

        # -> Submit the registration form with the available fields and verify if registration succeeds and license details validation is handled or prompted after submission.
        frame = context.pages[-1]
        # Click Register button to submit the form
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill all required fields correctly and check the Terms & Conditions checkbox before submitting the form again.
        frame = context.pages[-1]
        # Fill Full Name
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test Pharmacy User')
        

        frame = context.pages[-1]
        # Fill Email
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('pharmacyuser@example.com')
        

        frame = context.pages[-1]
        # Fill Phone Number
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1234567890')
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=MediTrack').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Create Account').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Register to start managing your medicine inventory').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Register').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    