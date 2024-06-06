import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, Pressable, 
    ScrollView, Alert, Keyboard, TextInput } from 'react-native';
import { sections, foodBeverages, selfCareHealth, clothes, fun, gifts, 
    technology, housing, transportation, utilities, insurance, debt, 
    miscellaneous } from '../components/lists'
import { addTransaction } from '../components/db';
import type { TransactionInfo } from '../models/TransactionInfo';

const TransactionsScreen: React.FC = () => {
    const [modalOneVisible, setModalOneVisible] = useState<boolean>(false);
    const [modalTwoVisible, setModalTwoVisible] = useState<boolean>(false);
    const [modalThreeVisible, setModalThreeVisible] = useState<boolean>(false);
    const [section, setSection] = useState<string>("Food/Beverages");
    const [subsection, setSubsection] = useState<string>("Groceries");
    const [subsections, setSubsections] = useState<string[]>(foodBeverages);
    const [amount, setAmount] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const [transactionList, setTransactionList] = useState<TransactionInfo[]>([]);

    useEffect(() => {
        let initialSubsection: string = "Groceries";
        let newSubsections: string[] = foodBeverages;

        switch (section) {
            case "Food/Beverages":
                initialSubsection = "Groceries";
                newSubsections = foodBeverages;
                break;
            case "Self Care/Health":
                initialSubsection = "Skin/Hair";
                newSubsections = selfCareHealth;
                break;
            case "Clothes":
                initialSubsection = "Overwear";
                newSubsections = clothes;
                break;
            case "Fun":
                initialSubsection = "Entertainment/Media";
                newSubsections = fun;
                break;
            case "Gifts":
                initialSubsection = "Personal Gifts";
                newSubsections = gifts;
                break;
            case "Technology":
                initialSubsection = "Hardware/Devices";
                newSubsections = technology;
                break;
            case "Housing":
                initialSubsection = "Mortgage/Rent";
                newSubsections = housing;
                break;
            case "Transportation":
                initialSubsection = "Fuel/Charging";
                newSubsections = transportation;
                break;
            case "Utilities":
                initialSubsection = "Electricity";
                newSubsections = utilities;
                break;
            case "Insurance":
                initialSubsection = "Personal Insurance";
                newSubsections = insurance;
                break;
            case "Debt":
                initialSubsection = "Secured Debt";
                newSubsections = debt;
                break;
            case "Miscellaneous":
                initialSubsection = "Other Expenses";
                newSubsections = miscellaneous;
                break;
        }

        setSubsection(initialSubsection);
        setSubsections(newSubsections);

        console.log(transactionList);

    }, [section, transactionList]); 

    let valid: boolean = true;

    const handleAmount = () => {
        const number = parseFloat(amount);

        const limitedNumber = Math.min(number, 999999);

        const formattedNumber = Math.round(limitedNumber * 100) / 100;

        setAmount(formattedNumber.toString());

        Keyboard.dismiss();
    };

    const handleSubmission = () => {
        valid = true;

        if (/[^0-9.]/.test(amount) || (amount.match(/\./g) || []).length > 1) {
            Alert.alert("Invalid Input", "Please enter a valid number");
            valid = false;
            return;
        }

        const number = parseFloat(amount);

        if (isNaN(number)) {
            Alert.alert("Invalid Input", "Please enter a valid number");
            valid = false;
            return;
        }
    };

    const handleAddEntry = () => {
        handleSubmission();  
        if (!valid) {
            return;  
        }
        const newEntry: TransactionInfo = { listSection: section, listSubsection: subsection, listAmount: amount };
        setTransactionList([...transactionList, newEntry]);

        addTransaction(newEntry);
    };

    return (
        <SafeAreaView style = {styles.overallContainer}>
            <View style = {styles.centeredContainer}>
                <Text style = {styles.h1Text}>Enter Transaction:</Text>
                <View style = {styles.rowContainer}>
                    <Text style = {styles.h2Text}>Enter Section:</Text>
                    <Pressable 
                        style = {({ pressed }) => [
                            { opacity: pressed ? 0.5 : 1 } 
                        ]}
                        onPress = {() => setModalOneVisible(true)}>
                        <Text style = {styles.dropdown}>{section}</Text>
                    </Pressable>
                    <Modal
                        animationType = "slide"
                        transparent = {true}
                        visible = {modalOneVisible}
                        onRequestClose = {() => setModalOneVisible(false)}>
                        <View style = {styles.outerModalView}>
                            <View style = {styles.modalView}>
                                <ScrollView style = {styles.scrollViewStyle}>
                                    {sections.map((section, index) => (
                                        <Pressable
                                            key = {index}
                                            style = {({ pressed }) => [
                                                styles.optionsButton,
                                                index < sections.length && styles.optionBorder,
                                                { opacity: pressed ? 0.5 : 1 }  
                                            ]}
                                            onPress = {() => {
                                                setSection(section);
                                                setModalOneVisible(false); 
                                            }}>
                                            <Text style = {styles.optionsButton}>{section}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                                <Pressable
                                    style = {({ pressed }) => [
                                        styles.cancelButton,
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalOneVisible(false)}>
                                    <Text style = {styles.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style = {styles.rowContainer}>
                    <Text style = {styles.h2Text}>Enter Subsection:</Text>
                    <Pressable 
                        style = {({ pressed }) => [
                            { opacity: pressed ? 0.5 : 1 } 
                        ]}
                        onPress = {() => setModalTwoVisible(true)}>
                        <Text style = {styles.dropdown}>{subsection}</Text>
                    </Pressable>
                    <Modal
                        animationType = "slide"
                        transparent = {true}
                        visible = {modalTwoVisible}
                        onRequestClose = {() => setModalTwoVisible(false)}>
                        <View style = {styles.outerModalView}>
                            <View style = {styles.modalView}>
                                <ScrollView style = {styles.scrollViewStyle}>
                                    {subsections.map((subsection, index) => (
                                        <Pressable
                                            key = {index}
                                            style = {({ pressed }) => [
                                                styles.optionsButton,
                                                index < subsections.length && styles.optionBorder,
                                                { opacity: pressed ? 0.5 : 1 }  
                                            ]}
                                            onPress = {() => {
                                                setSubsection(subsection);
                                                setModalTwoVisible(false); 
                                            }}>
                                            <Text style = {styles.optionsButton}>{subsection}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                                <Pressable
                                    style = {({ pressed }) => [
                                        styles.cancelButton,
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalTwoVisible(false)}>
                                    <Text style = {styles.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style = {styles.rowContainer}>
                    <Text style={styles.h2Text}>Enter Amount: $</Text>
                    <TextInput
                        style = {[styles.dropdown, { opacity: isFocused ? 0.5 : 1 }]}
                        keyboardType = "decimal-pad"
                        placeholder = '0.00'
                        placeholderTextColor = 'black'
                        value = {amount}
                        onChangeText = {setAmount}
                        returnKeyType = "done"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onSubmitEditing = {handleAmount}/>
                </View>
                <View style = {styles.finishButton}>
                    <View style = {styles.finishButtonView}>
                        <Pressable 
                            style = {({ pressed }) => [
                                { opacity: pressed ? 0.5 : 1 } 
                            ]}
                            onPress={() => {
                                handleSubmission();
                                if (valid) {
                                    setModalThreeVisible(true)
                                    handleAddEntry();
                                }
                            }}>
                            <Text style = {styles.h3Text}>Finish Transaction</Text>
                        </Pressable>
                    </View>
                </View>
                <View style = {styles.rowContainer}>
                    <Modal
                        animationType = "slide"
                        transparent = {true}
                        visible = {modalThreeVisible}
                        onRequestClose = {() => setModalThreeVisible(false)}>
                        <View style = {styles.outerModalView}>
                            <View style = {styles.modalView}>
                                <View style = {styles.submittedViewStyle}>
                                    <Text style = {styles.h4Text}>Transaction Submitted Successfully</Text>
                                </View>
                                <Pressable
                                    style = {({ pressed }) => [
                                        styles.cancelButton,
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => {
                                        setModalThreeVisible(false);
                                    }}>
                                    <Text style = {styles.cancelText}>Dismiss</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
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
    h1Text: {
        fontSize: 40,
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    h2Text: {
        fontSize: 18,
        marginTop: 60,
        marginRight: 5,
    },
    h3Text: {
        fontSize: 30,
        textAlign: 'center',
    },
    h4Text: {
        fontSize: 40,
        textAlign: 'center',
    },
    dropdown: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        marginTop: 60,
        fontSize: 18,
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
    outerModalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    scrollViewStyle: {
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
    },
    submittedViewStyle: {
        width: '100%',
        height: '70%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
    },
    optionsButton: {
        fontSize: 20,
        margin: 10,
    },
    optionBorder: {
        borderBottomWidth: 2,
        borderBottomColor: 'black', 
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
    finishButton: {
        flex: 0.4,
        width: '90%',
        borderRadius: 10,
        borderWidth: 15,  
        borderColor: 'green',
        padding: 14,
        marginTop: 60,
    },
    finishButtonView: {
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
    },
});

export default TransactionsScreen;