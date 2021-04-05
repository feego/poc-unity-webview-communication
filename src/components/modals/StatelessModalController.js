import { TransitionGroup } from 'react-transition-group';
import classnames from 'classnames';

import styles from './StatelessModalController.module.css';

function StatelessModalController({ children, className, onKeyDown, onModalClose, openedModals }) {
  return (
    <div className={classnames(styles.wrapper, className)} role="presentation" onKeyDown={onKeyDown}>
      {children}
      <div className={styles.overlayContainer} tabIndex="0">
        <TransitionGroup>{openedModals.map((modal) => modal.renderer(modal.id, () => onModalClose(modal)))}</TransitionGroup>
      </div>
    </div>
  );
}

export default StatelessModalController;
