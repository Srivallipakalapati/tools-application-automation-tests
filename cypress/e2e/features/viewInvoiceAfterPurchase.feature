Feature: view invoice after purchase

    Background:
        Given I create a new user account using API
        And I navigate to the tool shop application

    Scenario Outline:  view invoice after purchase
        When I login with the newly created user account
        # And I Add a product "<productName>"  "<productQuantity>"to the cart
        # And I proceed to checkout and complete the purchase


        Examples:
            | productName        | productQuantity | 
            | Combination Pliers | 1               | 
