import RoundButton from '../RoundButton.vue';

describe('<RoundButton />', () => {
  it('renders and click is emitted', () => {
    const onClickSpy = cy.spy().as('onClickSpy');

    cy.mount(RoundButton, {
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
