import StandardButton from '../StandardButton.vue';

describe('<StandardButton />', () => {
  it('renders and click is emitted', () => {
    const onClickSpy = cy.spy().as('onClickSpy');

    cy.mount(StandardButton, {
      slots: {
        default: 'p',
      },
      props: {
        id: 'test',
        onClick: onClickSpy,
      },
    });

    cy.get('#test').should('be.visible');
    cy.get('#test').click();

    cy.get('@onClickSpy').should('have.been.calledOnce');
  });
});
