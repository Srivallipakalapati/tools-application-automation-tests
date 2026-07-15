Feature: View Product Details

  Background:
    Given I navigate to the tool shop application

  Scenario Outline:  View Product Details
    When I click on a product "<productName>"
    Then I should be redirected to the product details page
    And I should see the product details for "<productName>" as expected
    And I verify add to cart button is present and enabled



    Examples:
      | productName        |
      # | Combination Pliers |
      # | Pliers             |
      # | Bolt Cutters       |
      # | Long Nose Pliers   |
      # | Wood Saw           |
      
