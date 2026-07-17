export class CheckoutOverviewPage {
    constructor(page) {
        this.page = page;
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async finishCheckout() {
        await this.finishButton.click();
    }
} 