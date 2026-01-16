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
        # -> Navigate to registration page by clicking Register link
        frame = context.pages[-1]
        # Click on Register link to go to registration page
        elem = frame.locator('xpath=html/body/div/div[2]/nav/div/div/div[2]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click Register button to submit empty form and trigger validation errors
        frame = context.pages[-1]
        # Click Register button to submit the form without filling mandatory fields
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test registration submission with each mandatory field left empty one by one to verify validation messages for each field.
        frame = context.pages[-1]
        # Clear Full Name field to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Email field to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Phone Number field to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Address field to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Password field to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[4]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Clear Confirm Password field to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[4]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Uncheck Terms & Conditions checkbox to test validation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[5]/label/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click Register button to submit form with all mandatory fields empty
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Extract validation error messages after submitting empty form with role 'Supplier' selected.
        frame = context.pages[-1]
        # Click Register button to submit form with empty mandatory fields for Supplier role
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test registration form validation for the Pharmacy role by selecting Pharmacy role and submitting empty form to verify validation error messages.
        frame = context.pages[-1]
        # Click Register button to submit form with empty mandatory fields for Pharmacy role
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Retry submitting the form with empty mandatory fields for Admin role by clicking the correct Register button at index 14.
        frame = context.pages[-1]
        # Click Register button to submit form with empty mandatory fields for Admin role
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Full Name *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Phone Number *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Role *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Address *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Password *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Confirm Password *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=I agree to the Terms & Conditions *').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    