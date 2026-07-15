Feature: view invoice after purchase

    Background:
        Given I create a new user account using API
        And I navigate to the tool shop application

    Scenario Outline:  view invoice after purchase
        # When I login with the newly created user account
        When I login with the user email "<userEmail>" and password "<userPassword>"
        And I Add a product "<productName>"  "<productQuantity>"to the cart
        And I proceed to checkout and complete the purchase


        Examples:
            | productName        | productQuantity | userEmail                             | userPassword |
            | Combination Pliers | 1               | customer2@practicesoftwaretesting.com | welcome01    |
