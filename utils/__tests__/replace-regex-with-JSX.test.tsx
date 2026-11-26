import { renderToStaticMarkup } from 'react-dom/server';
import { replaceRegexWithJSX } from '../replace-regex-with-JSX';

const render = (
  text: string,
  rules: Parameters<typeof replaceRegexWithJSX>[1],
) => renderToStaticMarkup(<>{replaceRegexWithJSX(text, rules)}</>);

const linkRule = {
  regex: /https:\/\/\S+/g,
  replace: (link: string) => <a>{link}</a>,
};

const addressRule = {
  regex: /0x[a-f0-9]+/g,
  replace: (address: string) => <b>{address}</b>,
};

describe('replaceRegexWithJSX', () => {
  it('should replace every match and keep the text around it', () => {
    const result = render('see https://a.io and https://b.io now', [linkRule]);
    expect(result).toEqual(
      'see <a>https://a.io</a> and <a>https://b.io</a> now',
    );
  });

  it('should keep placeholder-like text literal', () => {
    const result = render('0xabc __$0____$0__ __$1__', [addressRule]);
    expect(result).toEqual('<b>0xabc</b> __$0____$0__ __$1__');
  });

  it('should not apply a later rule inside an earlier match', () => {
    const result = render('https://0xabc.io 0xdef', [linkRule, addressRule]);
    expect(result).toEqual('<a>https://0xabc.io</a> <b>0xdef</b>');
  });
});
