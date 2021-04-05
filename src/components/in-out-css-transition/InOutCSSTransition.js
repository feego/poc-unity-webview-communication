import { useCallback, useState } from 'react';
import { Transition } from 'react-transition-group';


// The animation only works when we force the setState to be asynchronous.
// Modal fade animation states.
export const animationStates = {
  BEFORE_APPEARING: 'beforeAppearing',
  VISIBLE: 'visible',
  LEAVING: 'leaving',
};

// The animation only works when we force the setState to be asynchronous.
export const TICK = 17;

function InOutCSSTransition({ children, timeout = 300, onEnter, onExit, ...props }) {
  const [animationState, setAnimationState] = useState(animationStates.BEFORE_APPEARING);
  const handleEnter = useCallback(() => {
    setTimeout(() => setAnimationState(() => animationStates.VISIBLE), TICK);
    if (onEnter !== undefined) {
      onEnter();
    }
  }, [onEnter, setAnimationState]);
  const handleExit = useCallback(() => {
    setAnimationState(() => animationStates.LEAVING);
    if (onExit !== undefined) {
      onExit();
    }
  }, [setAnimationState, onExit]);

  return (
    <Transition {...props} timeout={timeout} onEnter={handleEnter} onExit={handleExit}>
      {children(animationState)}
    </Transition>
  );
}

export default InOutCSSTransition;
