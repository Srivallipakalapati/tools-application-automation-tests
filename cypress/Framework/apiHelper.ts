
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