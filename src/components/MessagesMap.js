import React from 'react'
import { MapView } from 'expo'
import { StyleSheet } from 'react-native'

export default class MessagesMap extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUpdate() {
    this.markers = []
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.markers.forEach((marker, index) => {
        if (index === this.markers.length - 1) {
          marker.showCallout()
        } else {
          marker.hideCallout()
        }
      })
    }, 0)
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
              ref={ref => {
                if (ref) {
                  this.markers.push(ref)
                }
              }}
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
          strokeColor="rgba(0,0,255, 0.5)"
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