Feature: View Product Details

  Background:
    Given I navigate to the tool shop application

  Scenario: View the details of an in-stock product 
    Given I get an in stock product from the catalogue
    When I search for the in stock product
    And I click on the in stock product from the search results
    Then I should be redirected to the product details page
    And I should see the in stock product details as expected
    And I verify add to cart button is present and enabled

  Scenario: Out of stock product cannot be added to the cart
    When I open an out of stock product
    Then I should see an out of stock message
    And I verify add to cart button is present but disabled
