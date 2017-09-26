import { TigikPage } from './app.po';

describe('tigik App', () => {
  let page: TigikPage;

  beforeEach(() => {
    page = new TigikPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
