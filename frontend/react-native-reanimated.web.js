// Mock do react-native-reanimated para web
// Este arquivo é usado automaticamente quando a plataforma é web

export default {
  // Mocks vazios para evitar erros
  useSharedValue: (value) => ({ value }),
  useAnimatedStyle: (callback) => callback(),
  withTiming: (value) => value,
  withSpring: (value) => value,
  useAnimatedGestureHandler: () => ({}),
  useAnimatedScrollHandler: () => () => {},
  createAnimatedComponent: (component) => component,
  Easing: {
    linear: (x) => x,
    ease: (x) => x,
    quad: (x) => x,
    cubic: (x) => x,
  },
};