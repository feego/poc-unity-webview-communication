import { css } from '@emotion/react';
import { useCallback } from 'react';
import Button from './Button';
import Input from './input/Input';
import { createForm, createField, useController, useGetPropsForField, identityValidator } from './react-form-hooks';

const Styles = {
  wrapper: css`
    opacity: 1;
    transition: opacity 500ms;
    display: flex;
    flex-direction: column;
    width: 35rem;
  `,

  submitting: css`
    opacity: 0.6;
  `,

  submitButton: css`
    display: block;
    background: none;
    border: none;
    color: rgba(0, 0, 0, 0.87);
    text-transform: uppercase;
    font-family: inherit;
    font-size: 1.3rem;
    font-weight: 600;
    padding: 1rem 2rem;
    border: 0.2rem solid rgba(0, 0, 0, 0.87);
    border-radius: 5rem;
    margin: 2rem auto 0;

    @media (min-width: 992px) {
      margin: 2rem 0 0;
    }
  `,

  input: css`
    background-color: transparent;
    display: block;
    resize: none;
  `,

  filledInput: css`
    border-color: #1a1a1a;

    &:focus,
    &:hover {
      border-color: #1a1a1a;
    }
  `,

  globalError: css`
    color: #d83e3e;
    font-size: 1.2rem;
    text-align: center;
    height: 2.3rem;
    font-weight: 600;
    opacity: 0;
    height: 0;
    position: relative;
    top: 0.6rem;
    left: 0rem;
    visibility: hidden;
    transition: visibility 0ms ease 500ms, opacity 500ms;
    white-space: pre-line;
    line-height: 1.5;

    @media (min-width: 992px) {
      text-align: left;
      font-size: 1.3rem;
      top: 1.6rem;
      white-space: pre;
    }
  `,

  globalErrorVisible: css`
    opacity: 1;
    visibility: visible;
    transition: opacity 100ms;
  `,
};

export const requiredValidator = (result, value) => (!value ? [false, 'Campo obrigatório'] : identityValidator(result));

export const schema = createForm([
  ['name', createField([requiredValidator])],
  ['player', createField([requiredValidator])],
]);

function ExampleForm(props) {
  const propsForForm = useController({ schema, onSubmit: props.onSubmit, onChange: props.onChange });
  const getPropsForField = useGetPropsForField(propsForForm);
  const propsForNameInput = getPropsForField('name');
  const propsForPlayerInput = getPropsForField('player');
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      propsForForm.onSubmit(event);
    },
    [propsForForm]
  );

  return (
    <form css={[Styles.wrapper, props.wrapperCSS, props.isLoading && Styles.submitting]} noValidate onSubmit={handleSubmit}>
      <Input
        {...propsForNameInput}
        inputCSS={[propsForForm.touched.name && !propsForNameInput.error && Styles.filledInput]}
        placeholder="Name"
      />
      <Input
        {...propsForPlayerInput}
        inputCSS={[propsForForm.touched.email && !propsForPlayerInput.error && Styles.filledInput]}
        placeholder="Player"
      />
      <Button type="submit" wrapperCSS={Styles.submitButton} isLoading={props.isLoading}>
        Submit
      </Button>
      <div css={[Styles.globalError, props.error && Styles.globalErrorVisible]}>{props.error}</div>
    </form>
  );
}

export default ExampleForm;
