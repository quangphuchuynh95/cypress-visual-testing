import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';
import { Box, BoxProps } from '@mantine/core';

export interface ZoomValue {
  zoom: number;
  translateX: number;
  translateY: number;
}

export interface ZoomAreaProps extends BoxProps {
  value: ZoomValue;
  onChange: Dispatch<SetStateAction<ZoomValue>>;
  maxZoom?: number;
  minZoom?: number;
}

export function ZoomArea({
  children,
  value,
  onChange,
  maxZoom = 10,
  minZoom = 0.1,
  ...props
}: PropsWithChildren<ZoomAreaProps>) {
  const mouseDownRef = useRef<
    ZoomValue & {
      x: number;
      y: number;
    }
  >();

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      mouseDownRef.current = {
        ...value,
        x: e.clientX,
        y: e.clientY,
      };
    },
    [value],
  );

  const onMouseUp = useCallback(() => {
    mouseDownRef.current = undefined;
  }, []);

  const onMouseMove = useCallback(
    (e: React.PointerEvent) => {
      if (mouseDownRef.current) {
        const translateX =
          mouseDownRef.current.translateX +
          (e.clientX - mouseDownRef.current.x) / mouseDownRef.current.zoom;
        const translateY =
          mouseDownRef.current.translateY +
          (e.clientY - mouseDownRef.current.y) / mouseDownRef.current.zoom;

        onChange((state) => ({
          ...state,
          translateX,
          translateY,
        }));
      }
    },
    [onChange],
  );

  const onWheelZoom = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation();
      if (e.metaKey) {
        onChange((state) => ({
          ...state,
          zoom: Math.min(
            Math.max(state.zoom - e.deltaY / 100, minZoom),
            maxZoom,
          ),
        }));
      } else {
        onChange((state) => ({
          ...state,
          translateX: state.translateX - e.deltaX,
          translateY: state.translateY - e.deltaY,
        }));
      }
    },
    [maxZoom, minZoom, onChange],
  );

  return (
    <Box
      {...props}
      style={{
        // transformOrigin: 'top left',
        transform: `scale(${value.zoom}, ${value.zoom}) translateX(${value.translateX}px) translateY(${value.translateY}px)`,
      }}
      sx={{ overflow: 'hidden' }}
      onWheel={onWheelZoom}
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
      onPointerLeave={onMouseUp}
      onPointerCancel={onMouseUp}
      onPointerMove={onMouseMove}
    >
      {children}
    </Box>
  );
}
