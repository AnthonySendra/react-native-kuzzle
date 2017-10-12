import React from 'react'
import { MapView } from 'expo'
import { StyleSheet } from 'react-native'

export default class MessageMap extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <MapView
        region={{
          ...this.props.userLocation,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        }}
        style={styles.map}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {this.props.data.map(message => {
          if (!message.location) {
            return (null)
          }

          return (
            <MapView.Marker
              key={message.id}
              coordinate={{
                latitude: message.location.lat,
                longitude: message.location.lon
              }}
              pinColor="rgba(255, 0, 0, 1)"
              title={message.nickname}
              description={message.content}
            />
          )
        })}

        <MapView.Circle
          center={{...this.props.userLocation}}
          radius={5}
          fillColor="rgba(38, 166, 154, 0.5)"
          strokeColor="rgba(0,0,255,1)"
          zIndex={2}
          strokeWidth={2}
        />
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})