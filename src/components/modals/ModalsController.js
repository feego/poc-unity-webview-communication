import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import StatelessModalController from './StatelessModalController';

const defaultContextValue = {
  openedModals: [],
  openModal: () => ({ id: -1, renderer: () => null }),
  closeModal: () => {},
};

const ModalsContext = createContext(defaultContextValue);

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        openedModals: [...state.openedModals, action.modal],
        counter: state.counter + 1,
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        openedModals: state.openedModals.filter((modal) => modal !== action.modal),
      };
    default:
      return state;
  }
};

function ModalsController({ className, onKeyDown: baseOnKeyDown, getInitialOpenedModals = () => [], children }) {
  const [state, dispatch] = useReducer(reducer, {
    openedModals: getInitialOpenedModals(),
    counter: 0,
  });
  const openModal = useCallback(
    (modalRenderer) => {
      const newModal = { id: state.counter, renderer: modalRenderer };
      dispatch({ type: 'OPEN_MODAL', modal: newModal });
      return newModal;
    },
    [state, dispatch]
  );
  const closeModal = useCallback((modal) => dispatch({ type: 'CLOSE_MODAL', modal }), [dispatch]);
  const contextAPI = useMemo(
    () => ({
      openedModals: state.openedModals,
      openModal,
      closeModal,
    }),
    [state.openedModals, openModal, closeModal]
  );
  const onKeyDown = useCallback(
    (event) => {
      const eventKeyCode = event.keyCode;
      const openedModalsCount = state.openedModals.length;

      if (eventKeyCode === 27 && openedModalsCount > 0) {
        event.preventDefault();
        closeModal(state.openedModals[state.openedModals.length - 1]);
      } else if (baseOnKeyDown !== undefined) {
        baseOnKeyDown(event);
      }
    },
    [state, closeModal, baseOnKeyDown]
  );

  return (
    <ModalsContext.Provider value={contextAPI}>
      <StatelessModalController className={className} onKeyDown={onKeyDown} onModalClose={closeModal} openedModals={state.openedModals}>
        {children}
      </StatelessModalController>
    </ModalsContext.Provider>
  );
}

export const useModalsAPI = () => useContext(ModalsContext);

export default ModalsController;
