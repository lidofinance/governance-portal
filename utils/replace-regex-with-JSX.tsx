import { Fragment } from 'react';

type ReplaceRule = {
  regex: RegExp;
  replace: (substr: string) => JSX.Element;
};

export const replaceRegexWithJSX = (text: string, rules: ReplaceRule[]) => {
  let parts: (string | JSX.Element)[] = [text];

  rules.forEach((rule) => {
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') {
        return [part];
      }

      const replaced: (string | JSX.Element)[] = [];
      let lastIndex = 0;

      for (const match of part.matchAll(rule.regex)) {
        const index = match.index ?? 0;
        replaced.push(part.slice(lastIndex, index), rule.replace(match[0]));
        lastIndex = index + match[0].length;
      }

      replaced.push(part.slice(lastIndex));
      return replaced;
    });
  });

  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
};
