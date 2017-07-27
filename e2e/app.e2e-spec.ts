import { SccLandingPage } from './app.po';

describe('scc-landing App', () => {
  let page: SccLandingPage;

  beforeEach(() => {
    page = new SccLandingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
