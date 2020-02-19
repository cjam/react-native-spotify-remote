import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    actionButton: {
      borderColor: "#0000BB",
      borderWidth: 2,
    },
    error: {
      color: "#AA0000",
      borderColor: "#AA0000",
      borderWidth: 2,
      fontSize: 18,
      padding: 10,
      margin: 10,
      marginTop: 20
    },
    connected: {
      color: "#00AA00",
      fontSize: 16,
    },
    disconnected: {
      color: "#880000",
      fontSize: 16
    },
    container: {
      height: "100%",
      width: "100%",
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    transportContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
      height: "100%",
      width: "100%",
      backgroundColor: "#EEE",
      borderColor: "#DDD",
      borderWidth: 1,
      paddingVertical: 5
    },
    textDuration: {
      width: 40,
    },
    textCentered: {
      textAlign: "center"
    },
    debugBorder: {
      borderWidth: 1,
      borderColor: 'red'
    }
  });

  export default styles;