
export function findOutOfStockProduct(page = 1) {
    cy.request({
        method: "GET",
        url: `https://api.practicesoftwaretesting.com/products?page=${page}`,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log("Products page:", String(page));
        expect(response.status).to.eq(200);

        const products = response.body.data as Product[];
        const outOfStockProduct = products.find((product) => !product.in_stock && !product.is_rental);

        if (outOfStockProduct) {
            cy.wrap(outOfStockProduct).as("outOfStockProduct");
        } else if (page < response.body.last_page) {
            findOutOfStockProduct(page + 1);
        } else {
            throw new Error("No out-of-stock product was found.");
        }
    });
}

export function findInStockProduct(page = 1) {
    cy.request({
        method: "GET",
        url: `https://api.practicesoftwaretesting.com/products?page=${page}`,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log("Products page:", String(page));
        expect(response.status).to.eq(200);

        const products = response.body.data as Product[];
        const inStockProduct = products.find((product) => product.in_stock && !product.is_rental);

        if (inStockProduct) {
            cy.wrap(inStockProduct).as("inStockProduct");
        } else if (page < response.body.last_page) {
            findInStockProduct(page + 1);
        } else {
            throw new Error("No in-stock product was found.");
        }
    });
}

export function findCategoryByName(categoryName: string) {
    cy.request({
        method: "GET",
        url: "https://api.practicesoftwaretesting.com/categories",
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(200);

        const categories = response.body as Category[];
        const category = categories.find((c) => c.name === categoryName);

        if (category) {
            cy.wrap(category).as("category");
        } else {
            throw new Error(`Category '${categoryName}' was not found.`);
        }
    });
}

export function createUserAccountViaAPI(userData: UserPayload) {
    cy.log("Request body:", JSON.stringify(userData));
    cy.request({
        method: "POST",
        url: "https://api.practicesoftwaretesting.com/users/register",
        body: userData,
        failOnStatusCode: false,
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        cy.log("Response body:", JSON.stringify(response.body));
        expect(response.status).to.eq(201);
        cy.log("User account created successfully via API");
    });
}

export interface UserPayload {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    password: string;
    address: UserAddress;
}

export interface UserAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    in_stock: boolean;
    is_rental: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
}