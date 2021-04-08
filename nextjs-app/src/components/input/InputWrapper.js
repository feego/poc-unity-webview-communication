import { css } from '@emotion/react';

const Styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
  `,

  labelWrapper: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  label: css`
    font-size: 1.4rem;
  `,

  error: css`
    color: #d83e3e;
    font-size: 1.1rem;
    text-align: left;
    padding: 0.3rem 0 0;
    height: 2.3rem;
    font-weight: 600;
    opacity: 0;
    visibility: hidden;
    transition: visibility 0ms ease 500ms, opacity 500ms;

    @media (min-width: 374px) {
      font-size: 1.2rem;
    }
  `,

  errorVisible: css`
    opacity: 1;
    visibility: visible;
    transition: opacity 100ms;
  `,
};

function InputWrapper(props) {
  const errorCSS = props.error ? [Styles.error, Styles.errorVisible] : Styles.error;
  return (
    <label css={[Styles.wrapper, props.wrapperCSS]}>
      {/* <div className={classnames(styles.labelWrapper, props.labelWrapperClassName)}>
        <div className={classnames(styles.label, props.labelClassName)}>{props.label}</div>
        <div className={classnames(errorClassName, props.errorClassName)}>{props.error}</div>
      </div> */}
      {props.children}
      <div css={[errorCSS, props.errorCSS]}>{props.error}</div>
    </label>
  );
}

export default InputWrapper;
