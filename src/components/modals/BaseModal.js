import { useCallback } from 'react';
import classnames from 'classnames';
import InOutCSSTransition, { animationStates } from '../in-out-css-transition/InOutCSSTransition';
import styles from './BaseModal.module.css';

const getAnimationClassNames = (animationState) => {
  switch (animationState) {
    case animationStates.BEFORE_APPEARING:
      return [styles.wrapperBeforeAppearingAnimation, styles.contentBeforeAppearingAnimation];
    case animationStates.VISIBLE:
      return [styles.wrapperVisible, styles.contentVisible];
    case animationStates.LEAVING:
      return [styles.wrapperLeaving, styles.contentLeaving];
    default:
      return [];
  }
};

function Wrapper({ onClose, ...props }) {
  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );
  return <div {...props} onClick={onClick} />;
}

function Content(props) {
  const onClick = useCallback((event) => event.stopPropagation(), []);
  return <div {...props} onClick={onClick} />;
}

function BaseModal({ children, className, contentClassName, onClose, ...props }) {
  return (
    <InOutCSSTransition {...props}>
      {(animationState) => {
        const [animationWrapperClassName, animationContentClassName] = getAnimationClassNames(animationState);

        return (
          <Wrapper className={classnames(styles.wrapper, animationWrapperClassName, className)} onClose={onClose}>
            <Content className={classnames(animationContentClassName, contentClassName)}>{children}</Content>
          </Wrapper>
        );
      }}
    </InOutCSSTransition>
  );
}

export default BaseModal;
