Feature: view invoice after purchase

    Background:
        Given I create a new user account using API
        And I navigate to the tool shop application

    Scenario: view invoice after purchase
        Given I get an in stock product from the catalogue
        When I login with the newly created user account
        And I click on home button
        And I search for the in stock product
        And I click on the in stock product from the search results
        And I add the in stock product to the cart
        And I proceed to checkout and complete the purchase
        And I navigate to the invoice page
        Then I verify that invoice details are correct

    Scenario: Purchase cannot be completed with an invalid bank account number
        Given I get an in stock product from the catalogue
        When I login with the newly created user account
        And I click on home button
        And I search for the in stock product
        And I click on the in stock product from the search results
        And I add the in stock product to the cart
        And I proceed to checkout up to the payment step
        And I enter bank transfer details with an invalid account number
        Then I should see an invalid account number error
        And the confirm payment button should be disabled
