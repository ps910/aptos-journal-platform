import { useCursorPosition } from '../hooks/useCursorPosition';

const AnimatedBackground = () => {
  const { x, y } = useCursorPosition();

  return (
    <>
      <div className="animated-bg"></div>
      <div
        className="cursor-light"
        style={{
          left: `${x - 150}px`,
          top: `${y - 150}px`,
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      ></div>
    </>
  );
};

export default AnimatedBackground;
