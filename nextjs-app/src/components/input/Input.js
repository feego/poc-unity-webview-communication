import InputWrapper from './InputWrapper';
import { useCallback } from 'react';
import { css } from '@emotion/react';

const Styles = {
  input: css`
    background-color: transparent;
    display: block;
    resize: none;
    border: 0.2rem solid rgba(0, 0, 0, 0.4);
    color: rgba(0, 0, 0, 0.87);
    font-size: 1.3rem;
    padding: 1rem 2rem;
    transition: border-color 100ms ease-out;

    @media (min-width: 374px) {
      font-size: 1.4rem;
    }

    &:hover {
      border-color: rgba(0, 0, 0, 0.6);
    }

    &:focus {
      border-color: rgba(0, 0, 0, 1);
    }
  `,
};

function Input({ wrapperCSS, labelWrapperCSS, labelCSS, inputCSS, errorCSS, label, error, disabled, onChange: baseOnChange, ...props }) {
  const onChange = useCallback((event) => baseOnChange(event.target.value, event), [baseOnChange]);
  return (
    <InputWrapper
      wrapperCSS={wrapperCSS}
      labelWrapperCSS={labelWrapperCSS}
      labelCSS={labelCSS}
      errorCSS={errorCSS}
      label={label}
      error={error}>
      <input css={[Styles.input, inputCSS]} {...props} onChange={onChange} />
    </InputWrapper>
  );
}

export default Input;
