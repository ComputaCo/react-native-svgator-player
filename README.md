# react-native-svgator-player

`react-native-svgator-player` is a React Native library that provides a facade for playing SVG animations exported from [Svgator](https://www.svgator.com/).

## Installation

```sh
npm install react-native-svgator-player
```

## Usage

```jsx
import SvgatorPlayer from "react-native-svgator-player";

// ...

<SvgatorPlayer
  source={require("./animation.json")}
  style={{ width: 200, height: 200 }}
  loop={true}
  autoplay={true}
  fillMode="forwards"
  resizeMode="contain"
  onReady={() => console.log("ready")}
  onPlay={() => console.log("play")}
  onPause={() => console.log("pause")}
  onEnd={() => console.log("end")}
  onError={(error) => console.log(error)}
/>;
```

## Props

| Prop     | Type     | Default | Description                                                                                         |
| -------- | -------- | ------- | --------------------------------------------------------------------------------------------------- |
| `source` | `Object` |         | The source of the animation. Can be a local file path, a remote URL, or an object with a `uri` key. |

## License

MIT

**`react-native-svgator-player` is not affiliated with Svgator.**