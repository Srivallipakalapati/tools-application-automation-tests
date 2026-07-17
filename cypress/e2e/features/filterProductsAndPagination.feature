Feature: Filter products and pagination
    As a customer, I would like to filter the products and browse them across pages.

    Background:
        Given I navigate to the tool shop application

    Scenario: Pagination navigates between pages of products
        Then the product pagination is displayed
        And I am on the first page with the previous control disabled
        When I go to the next page of products
        Then the second page of products is shown
        And I can return to the first page

    Scenario: Searching for a product that does not exist shows no results
        When I search the catalogue for "nonexistentproductxyz"
        Then no products are shown and a no results message is displayed
