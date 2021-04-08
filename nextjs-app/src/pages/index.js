import { css } from '@emotion/react';
import { useCallback, useMemo, useState } from 'react';
import ExampleForm from '../components/ExampleForm';

const Styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
  `,
};

export default function IndexPage() {
  const [[submissionStatus, submissionPayload], setSubmissionStatus] = useState(['pristine']);
  const clearSubmissionStatus = useCallback(() => setSubmissionStatus(['pristine']), []);
  const onSubmit = useCallback(async (values, submitEvent) => {
    try {
      submitEvent.preventDefault();
      setSubmissionStatus(['pending']);
      console.log('submitted', values);
      window.Unity.call(JSON.stringify({ action: 'Initialize', payload: JSON.stringify(values) }));
      setSubmissionStatus(['success', values]);
    } catch (error) {
      setSubmissionStatus(['error', error]);
    }
  });
  const onChange = useMemo(() => (submissionStatus === 'error' ? clearSubmissionStatus : undefined), [submissionStatus === 'error']);
  const isSubmitting = submissionStatus === 'pending';
  const error = submissionStatus === 'error' ? submissionPayload.code : undefined;
  return (
    <div css={Styles.wrapper}>
      <ExampleForm onSubmit={onSubmit} onChange={onChange} isLoading={isSubmitting} error={error} />
    </div>
  );
}
