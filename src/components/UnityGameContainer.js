import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';

export const Styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
  `,
};

const createUnityContext = () =>
  new UnityContext({
    loaderUrl: '/unity_game/Build/unity_game.loader.js',
    dataUrl: '/unity_game/Build/unity_game.data',
    frameworkUrl: '/unity_game/Build/unity_game.framework.js',
    codeUrl: '/unity_game/Build/unity_game.wasm',
  });

const UnityGameContainer = ({ setupConfigurations }) => {
  const [progression, setProgression] = useState(0);
  const unityContextRef = useRef(createUnityContext());

  useEffect(() => {
    unityContextRef.current.on('progress', (progression) => setProgression(progression));
    unityContextRef.current.on('loaded', () => console.log('loaded'));
    unityContextRef.current.on('ConfigurationsControllerReadyEvent', () => {
      unityContextRef.current.send('Configurations', 'Initialize', JSON.stringify(setupConfigurations));
    });
  }, []);

  return <Unity unityContext={unityContextRef.current} style={{ width: '100%' }} />;
};

export default UnityGameContainer;
