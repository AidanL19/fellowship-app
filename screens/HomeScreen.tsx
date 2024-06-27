import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { measurements, test } from '../components/lists';
import { displaySpending, databaseReady } from '../components/db';
import { useSpendingGoals } from '../Context';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [timePeriod, setTimePeriod] = useState<string>("Day");
    const { spendingList, totalAmount, updateSpending } = useSpendingGoals();

    const fetchSpending = async () => {
        try {    
            const dbReady = await databaseReady();
            if (dbReady) {
                const results = await displaySpending(timePeriod);
                updateSpending(results);
            } 
        } 
        catch (error) {
            console.error('Failed to fetch spending data:', error);
        }
    };
    
    useEffect(() => {
        console.log('Fetching spending...');

        fetchSpending();
      }, [timePeriod]);

    useFocusEffect(
        useCallback(() => {
            console.log('Refreshing spending...');

            fetchSpending();
        }, [timePeriod])
    );

    return (
        <SafeAreaView style = {styles.overallContainer}>
            <View style = {styles.middleContainer}>
                <View style = {styles.centeredContainer}>
                    <View style = {styles.rowContainer}>
                        <Text style = {styles.h1Text}>Amount Spent This</Text>
                        <Pressable 
                            style = {({ pressed }) => [
                                { opacity: pressed ? 0.5 : 1 } 
                            ]}
                            onPress = {() => setModalVisible(true)}>
                            <Text style = {styles.dropdown}>{timePeriod}</Text>
                        </Pressable>
                        <Text style = {styles.h1Text}>:</Text>
                        <Modal
                            animationType = "slide"
                            transparent = {true}
                            visible = {modalVisible}
                            onRequestClose = {() => setModalVisible(false)}>
                            <View style = {styles.outerModalView}>
                                <View style = {styles.modalView}>
                                    <ScrollView style = {styles.scrollViewStyle}>
                                        {measurements.map((measure, index) => (
                                            <Pressable
                                                key = {index}
                                                style = {({ pressed }) => [
                                                    styles.optionsButton,
                                                    index < measurements.length && styles.optionBorder,
                                                    { opacity: pressed ? 0.5 : 1 }  
                                                ]}
                                                onPress = {() => {
                                                    setTimePeriod(measure);
                                                    setModalVisible(false); 
                                                }}>
                                                <Text style = {styles.optionsButton}>{measure}</Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                    <Pressable
                                        style = {({ pressed }) => [
                                            styles.cancelButton,
                                            { opacity: pressed ? 0.5 : 1 } 
                                        ]}
                                        onPress = {() => setModalVisible(false)}>
                                        <Text style = {styles.cancelText}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <Text style = {styles.amountText}>${totalAmount}</Text>
                    <Text style = {styles.h2Text}>Top Contributors For This {timePeriod}:</Text>
                    <View style = {styles.contributorsContainer}>
                        <ScrollView style = {styles.scrollViewStyle}>
                            {spendingList.map((spending: string, index: number) => (
                                <View key = {index} style = {[
                                    styles.optionsButton,
                                    index < spendingList.length && styles.optionBorder
                                ]}>
                                    <Text style = {styles.optionsButton}>{spending}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    overallContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 15,  
        borderColor: 'green',
    },
    centeredContainer: {
        flex: 1,
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    rowContainer: {
        flexDirection: 'row',  
        alignItems: 'center',
    },
    middleContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    h1Text: {
        fontSize: 28,
        textDecorationLine: 'underline',
        marginRight: 5,
        marginTop: 10,
    },
    h2Text: {
        fontSize: 22,
        width: '100%',  
        textAlign: 'center',
        marginTop: 50,  
    },
    amountText: {
        fontSize: 50,
        marginTop: 10,
    },
    dropdown: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        marginTop: 10,
        fontSize: 28,
        textDecorationLine: 'underline',
        marginRight: 5,
        textAlign: 'center',
        alignItems: 'center',
    },
    modalView: {
        height: '50%', 
        marginTop: 'auto',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        margin: 15,  
        borderWidth: 15,  
        borderColor: 'green',  
    },
    scrollViewStyle: {
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
    },
    optionsButton: {
        fontSize: 20,
        margin: 10,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 10,
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10, 
        backgroundColor: 'white', 
    },
    cancelText: {
        fontSize: 40,
    },
    optionBorder: {
        borderBottomWidth: 2,
        borderBottomColor: 'black', 
    },
    outerModalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    contributorsContainer: {
        flex: 0.96,
        width: '90%',
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 15,  
        borderColor: 'green',
        padding: 14,
    },
});

export default HomeScreen;