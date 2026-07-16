Feature: Update fields in account profile
  As a newly registered user, I would like to login and update my account information.

  Scenario: A newly registered user can log in and update their profile
    Given I register a new user account
    When I log in with my new account
    And I update my account first name to "Jane"
    Then I should see the profile updated successfully message
    And the account menu should display my updated name "Jane"

  Scenario Outline: Login with invalid credentials shows an error message
    When I log in with email "<userName>" and password "<password>"
    Then I should see a login error message

    Examples:
      | userName                | password          |
       | invalidUser@example.com | correctPassword1@ |
      | validEmail@exapmle.com  | WrongPassword1    |
