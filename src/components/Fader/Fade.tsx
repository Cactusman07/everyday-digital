/* A component used to fade out animate components just before being removed from the DOM */

import React, {useEffect, useState} from "react";

type FadeProps = {
  show: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: React.ReactNode;
};

const Fade: React.FC<FadeProps> = ({show, fadeIn, fadeOut, children}) => {
  const [shouldRender, setRender] = useState<boolean>(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  }

  return (
    shouldRender && (
      <div style={{ animation: `${ show ? (fadeIn ? 'fadeIn' : '') : (fadeOut ? 'fadeOut' : '') } 1.5s` }} onAnimationEnd={onAnimationEnd}>
        {children}
      </div>
    )
  )

}

export default Fade;