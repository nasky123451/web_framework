import React from 'react';
import { Slide, Grow } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';

const SlideGrowTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      <Grow in={props.in} timeout={400}>
        {props.children}
      </Grow>
    </Slide>
  );
});

export default SlideGrowTransition;
