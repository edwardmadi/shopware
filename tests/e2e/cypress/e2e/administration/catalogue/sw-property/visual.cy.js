// / <reference types="Cypress" />

import PropertyPageObject from '../../../../support/pages/module/sw-property.page-object';

describe('Property: Visual tests', () => {
    beforeEach(() => {
        cy.createPropertyFixture({
            sortingType: 'position',
            options: [{
                name: 'Red',
                position: 2
            }, {
                name: 'Yellow',
                position: 3
            }, {
                name: 'Green',
                position: 1
            }]
        }).then(() => {
            cy.openInitialPage(Cypress.env('admin'));
            cy.get('.sw-skeleton').should('not.exist');
            cy.get('.sw-loader').should('not.exist');
        });
    });

    it('@visual: check appearance of basic property workflow', { tags: ['pa-inventory'] }, () => {
        const page = new PropertyPageObject();

        // Request we want to wait for later
        cy.intercept({
            url: `${Cypress.env('apiPath')}/search/property-group`,
            method: 'POST'
        }).as('saveData');
        cy.intercept({
            url: `${Cypress.env('apiPath')}/search/property-group`,
            method: 'POST'
        }).as('getData');
        cy.intercept({
            url: `${Cypress.env('apiPath')}/search/media-default-folder`,
            method: 'POST'
        }).as('getMediaFolder');

        cy.clickMainMenuItem({
            targetPath: '#/sw/property/index',
            mainMenuId: 'sw-catalogue',
            subMenuId: 'sw-property'
        });
        cy.wait('@getData')
            .its('response.statusCode').should('equal', 200);
        cy.get('.sw-skeleton').should('not.exist');
        cy.get('.sw-loader').should('not.exist');
        cy.get('.sw-property-list__content').should('exist');

        // Take snapshot for visual testing
        cy.get('.sw-skeleton__listing').should('not.exist');

        // Change color of the element to ensure consistent snapshots
        cy.changeElementStyling('.sw-data-grid__cell--options', 'color: #fff');

        cy.get('.sw-data-grid__cell--options')
            .should('have.css', 'color', 'rgb(255, 255, 255)');
        cy.prepareAdminForScreenshot();
        cy.takeSnapshot('[Property] Listing', '.sw-property-list', null, {percyCSS: '.sw-notification-center__context-button--new-available:after { display: none; }'});

        // Add option to property group
        cy.clickContextMenuItem(
            '.sw-property-list__edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );
        cy.get('.sw-page__main-content').should('be.visible');
        cy.get('.sw-skeleton__detail-bold').should('not.exist');
        cy.get('.sw-skeleton__detail').should('not.exist');
        cy.contains(page.elements.cardTitle, 'Basic information');

        // Take snapshot for visual testing
        cy.sortAndCheckListingAscViaColumn('Position', '1', '.sw-data-grid__cell--position');
        cy.contains('.sw-data-grid__row--0 .sw-data-grid__cell--position', '1').should('be.visible');
        cy.contains('.sw-data-grid__row--1 .sw-data-grid__cell--position', '2').should('be.visible');
        cy.contains('.sw-data-grid__row--2 .sw-data-grid__cell--position', '3').should('be.visible');
        cy.prepareAdminForScreenshot();
        cy.takeSnapshot('[Property] Detail, Group', '.sw-property-option-list', null, {percyCSS: '.sw-notification-center__context-button--new-available:after { display: none; }'});

        cy.get('.sw-property-option-list').scrollIntoView();
        cy.get('.sw-property-option-list__add-button').click();

        cy.get('.sw-modal').should('be.visible');
        cy.wait('@getMediaFolder').its('response.statusCode').should('equal', 200);

        // Take snapshot for visual testing
        cy.handleModalSnapshot('New value');
        cy.prepareAdminForScreenshot();
        cy.takeSnapshot('[Property] Detail, Option modal', '#sw-field--currentOption-name', null, {percyCSS: '.sw-notification-center__context-button--new-available:after { display: none; }'});
    });
});
