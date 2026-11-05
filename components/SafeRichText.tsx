import { Fragment, type ReactNode } from 'react';

export default function SafeRichText({ value }: { value: string }): ReactNode {
  const tokens = value.split(/(<\/?em>|<br\s*\/?>)/gi);
  let emphasize = false;

  return (
    <>
      {tokens.map((token, index) => {
        if (/^<br\s*\/?>$/i.test(token)) return <br key={index} />;
        if (/^<em>$/i.test(token)) { emphasize = true; return null; }
        if (/^<\/em>$/i.test(token)) { emphasize = false; return null; }
        return <Fragment key={index}>{emphasize ? <em>{token}</em> : token}</Fragment>;
      })}
    </>
  );
}
