export class ProductsPage {
    constructor(page) {
        this.page = page;
        this.productsTitle = page.getByText('Products');
    }

    async addItemToCart(price) {
        const productCard = this.page.locator('.inventory_item').filter({ hasText: price });
        await productCard.getByRole('button', { name: 'ADD TO CART' }).click();
    }

    async goToCart() {
        await this.page.locator('.shopping_cart_link').click();
    }
} 