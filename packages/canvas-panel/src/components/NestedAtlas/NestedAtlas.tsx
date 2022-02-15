import { Atlas, AtlasAuto, AtlasProps, useAtlas } from '@atlas-viewer/atlas';
import { Fragment, h } from 'preact';
import { createContext, useContext, useEffect, useState } from 'preact/compat';
import { AtlasDisplayOptions } from '../ViewCanvas/ViewCanvas.types';

const InAtlasContext = createContext(false);

function OnCreated(props: { onCreated: any }) {
  const atlas = useAtlas();

  useEffect(() => {
    if (atlas) {
      props.onCreated(atlas);
    }
  }, []);

  return null;
}

export function NestedAtlas({
  children,
  onCreated,
  responsive,
  viewport,
  ...props
}: AtlasDisplayOptions & { children: any }) {
  const [isCreated, setIsCreated] = useState(false);
  const inAtlas = useContext(InAtlasContext);

  if (inAtlas) {
    return (
      <Fragment>
        {onCreated ? <OnCreated onCreated={onCreated} /> : null}
        {children}
      </Fragment>
    );
  }

  return (
    <InAtlasContext.Provider value={true}>
      <AtlasAuto
        {...props}
        onCreated={(rt) => {
          setIsCreated(true);
          if (onCreated) {
            rt.runtime.updateNextFrame();
            return onCreated(rt);
          }
        }}
        unstable_noReconciler
      >
        {isCreated ? children : null}
      </AtlasAuto>
    </InAtlasContext.Provider>
  );
}
