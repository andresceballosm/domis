import React from 'react'
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';

export const LoadingSmall = () => {
    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={true}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                    animating={true} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#ffffff',
        height: 50,
        width: 50,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
})