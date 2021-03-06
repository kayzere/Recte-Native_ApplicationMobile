import React from 'react'
import { StyleSheet, View, ActivityIndicator, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import { getMusiqueFromApiWithId } from '../API/FuzzApi'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

const audioBookPlaylist = [
  {
    title: 'Hamlet - Act I',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri: 'https://soundcloud.com/the-fuzz-and-drums/help-me-get-into-the-groove',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  //https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act1_shakespeare.mp3
  
]

class MusiqueDetail extends React.Component {
  
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: false
  }
  
    async componentDidMount() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: true
        })
   
        this.loadAudio()
      } catch (e) {
        console.log(e)
      }
    }

    async loadAudio() {
      const {currentIndex, isPlaying, volume} = this.state
     
      try {
        const playbackInstance = new Audio.Sound()
        const source = {
          uri: audioBookPlaylist[currentIndex].uri
        }
     
        const status = {
          shouldPlay: isPlaying,
          volume
        }
     
        playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)     
        await playbackInstance.loadAsync(source, status, false)
        this.setState({playbackInstance})
        } catch (e) {
          console.log(e)
        }
    }
     
    onPlaybackStatusUpdate = status => {
      this.setState({
        isBuffering: status.isBuffering
      })
    }

    handlePlayPause = async () => {
      const { isPlaying, playbackInstance } = this.state
      isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
   
      this.setState({
        isPlaying: !isPlaying
      })
    }
   
      handlePreviousTrack = async () => {
      let { playbackInstance, currentIndex } = this.state
      if (playbackInstance) {
        await playbackInstance.unloadAsync()
        currentIndex < audioBookPlaylist.length - 1 ? (currentIndex -= 1) : (currentIndex = 0)
        this.setState({
          currentIndex
        })
        this.loadAudio()
      }
    }
   
    handleNextTrack = async () => {
      let { playbackInstance, currentIndex } = this.state
      if (playbackInstance) {
        await playbackInstance.unloadAsync()
        currentIndex < audioBookPlaylist.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
        this.setState({
          currentIndex
        })
        this.loadAudio()
      }
    }

  renderFileInfo() {
      const { playbackInstance, currentIndex } = this.state
      return playbackInstance ? (
        <View style={styles.trackInfo}>
          <Text style={[styles.trackInfoText, styles.largeText]}>
            {audioBookPlaylist[currentIndex].title}
          </Text>
          <Text style={[styles.trackInfoText, styles.smallText]}>
            {audioBookPlaylist[currentIndex].author}
          </Text>
          <Text style={[styles.trackInfoText, styles.smallText]}>
            {audioBookPlaylist[currentIndex].source}
          </Text>
        </View>
      ) : null
    }

    render() {
      return (
        <View style={styles.container}>
          <Image
            style={styles.albumCover}
            source={{ uri: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg' }}
          />
          <View style={styles.controls}>
            <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
              <Ionicons name='ios-skip-backward' size={48} color='#444' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
              {this.state.isPlaying ? (
                <Ionicons name='ios-pause' size={48} color='#444' />
              ) : (
                <Ionicons name='ios-play-circle' size={48} color='#444' />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
              <Ionicons name='ios-skip-forward' size={48} color='#444' />
            </TouchableOpacity>
          </View>
          {this.renderFileInfo()}
        </View>
      )
    }
  }

// update the Stylesheet object 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  albumCover: {
    width: 250,
    height: 250
  },
  trackInfo: {
    padding: 40,
    backgroundColor: '#fff'
  },
  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#550088'
  },
  largeText: {
    fontSize: 22
  },
  smallText: {
    fontSize: 16
  },
  control: {
    margin: 20
  },
  controls: {
    flexDirection: 'row'
  }
})
  
  export default MusiqueDetail