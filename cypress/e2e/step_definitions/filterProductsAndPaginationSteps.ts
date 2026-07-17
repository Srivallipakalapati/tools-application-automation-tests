import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { searchBar, productListPage } from "../../pages";

Then("the product pagination is displayed", () => {
    productListPage.assertPaginationVisible();
});

Then("I am on the first page with the previous control disabled", () => {
    productListPage.assertOnFirstPageWithPrevDisabled();
});

When("I go to the next page of products", () => {
    productListPage.goToNextPage();
});

Then("the second page of products is shown", () => {
    productListPage.assertOnSecondPageWithNewProducts();
});

Then("I can return to the first page", () => {
    productListPage.returnToFirstPage();
});

When("I search the catalogue for {string}", (searchTerm: string) => {
    searchBar.searchImmediate(searchTerm);
});

Then("no products are shown and a no results message is displayed", () => {
    productListPage.assertNoProductsWithMessage();
});
