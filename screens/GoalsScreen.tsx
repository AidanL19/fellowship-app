import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, Pressable, 
    ScrollView, TextInput, Keyboard, Alert } from 'react-native';
import { measurements, measurementsForDays, measurementsForWeeks, measurementsForMonths, measurementsPlural, test, 
    days, weeks, months, years, sections, foodBeverages, 
    selfCareHealth, clothes, fun, gifts, technology, housing, 
    transportation, utilities, insurance, debt, miscellaneous } from '../components/lists';
import { addLimitPlan, addCutDownPlan } from '../components/db';
import { LimitInfo, CutDownInfo } from '../models/DatabaseEntryInfo';

const GoalsScreen: React.FC = () => {
    const [modalOneVisible, setModalOneVisible] = useState<boolean>(false);
    const [modalTwoVisible, setModalTwoVisible] = useState<boolean>(false);
    const [modalThreeVisible, setModalThreeVisible] = useState<boolean>(false);
    const [modalFourVisible, setModalFourVisible] = useState<boolean>(false);
    const [modalFiveVisible, setModalFiveVisible] = useState<boolean>(false);
    const [modalSixVisible, setModalSixVisible] = useState<boolean>(false);
    const [modalSevenVisible, setModalSevenVisible] = useState<boolean>(false);
    const [section, setSection] = useState<string>("Food/Beverages");
    const [subsection, setSubsection] = useState<string>("Groceries");
    const [timePeriod, setTimePeriod] = useState<string>("Day");
    const [timePeriods, setTimePeriods] = useState<string[]>(measurements);
    const [timePeriodPlural, setTimePeriodPlural] = useState<string>("Years");
    const [timeAmount, setTimeAmount] = useState<number>(1);
    const [timeAmounts, setTimeAmounts] = useState<number[]>(days);
    const [subsections, setSubsections] = useState<string[]>(foodBeverages);
    const [displayLimitPlan, setDisplayLimitPlan] = useState<boolean>(false);
    const [displayCutDownPlan, setDisplayCutDownPlan] = useState<boolean>(false);
    const [amountOne, setAmountOne] = useState<string>('');
    const [amountTwo, setAmountTwo] = useState<string>('');
    const [goal, setGoal] = useState<string | number>('');
    const [isFocused, setIsFocused] = useState(false);
    const [limitList, setLimitList] = useState<LimitInfo[]>([]);
    const [cutDownList, setCutDownList] = useState<CutDownInfo[]>([]);

    useEffect(() => {
        let initialSubsection: string = "Groceries";
        let newSubsections: string[] = foodBeverages;
        let initialTimeAmount: number = 1;
        let newTimeAmounts: number[] = days;
        let initialTimePeriod: string = "Day";
        let newTimePeriods: string[] = measurements;

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
        };

        switch (timePeriodPlural) {
            case "Days":
                initialTimeAmount = 1;
                newTimeAmounts = days;
                initialTimePeriod = "Day";
                newTimePeriods = measurementsForDays;
                break;
            case "Weeks":
                initialTimeAmount = 1;
                newTimeAmounts = weeks;
                initialTimePeriod = "Day";
                newTimePeriods = measurementsForWeeks;
                break;
            case "Months":
                initialTimeAmount = 1;
                newTimeAmounts = months;
                initialTimePeriod = "Day";
                newTimePeriods = measurementsForMonths;
                break;
            case "Years":
                initialTimeAmount = 1;
                newTimeAmounts = years;
                initialTimePeriod = "Day";
                break;
        };

        setSubsection(initialSubsection);
        setSubsections(newSubsections);
        setTimeAmount(initialTimeAmount);
        setTimeAmounts(newTimeAmounts);
        setTimePeriod(initialTimePeriod);
        setTimePeriods(newTimePeriods);

        console.log(limitList);
        console.log(cutDownList);

    }, [section, timePeriodPlural, limitList, cutDownList]); 

    let valid: boolean = true;

    const handleAmountOne = () => {
        const number = parseFloat(amountOne);

        const limitedNumber = Math.min(number, 999999);

        const formattedNumber = Math.round(limitedNumber * 100) / 100;

        setAmountOne(formattedNumber.toString());

        Keyboard.dismiss();
    };

    const handleAmountTwo = () => {
        const number = parseFloat(amountTwo);

        const limitedNumber = Math.min(number, 999999);

        const formattedNumber = Math.round(limitedNumber * 100) / 100;

        setAmountTwo(formattedNumber.toString());

        Keyboard.dismiss();
    };

    const handleSubmissionOne = () => {
        valid = true;

        if (/[^0-9.]/.test(amountOne) || (amountOne.match(/\./g) || []).length > 1) {
            Alert.alert("Invalid Input", "Please enter a valid number");
            valid = false;
            return;
        }

        const number = parseFloat(amountOne);

        if (isNaN(number)) {
            Alert.alert("Invalid Input", "Please enter a valid number");
            valid = false;
            return;
        }
    };

    const handleSubmissionTwo = () => {
        valid = true;

        if (/[^0-9.]/.test(amountTwo) || (amountTwo.match(/\./g) || []).length > 1) {
            Alert.alert("Invalid Input", "Please enter a valid number");
            valid = false;
            return;
        }

        const number = parseFloat(amountTwo);

        if (isNaN(number)) {
            Alert.alert("Invalid Input", "Please enter a valid number");
            valid = false;
            return;
        }
    };

    const handleLimitEntry = () => {
        handleSubmissionOne();  
        if (!valid) {
            return;  
        }

        const newEntry: LimitInfo = { limitAmount: amountOne, limitSection: section, limitSubsection: subsection, 
            limitTimePeriod: timePeriod };
        setLimitList([...limitList, newEntry]);

        addLimitPlan(newEntry);
    };

    const handleCutDownEntry = () => {
        handleSubmissionOne();  
        handleSubmissionTwo();
        if (!valid) {
            return;  
        }

        const newEntry: CutDownInfo = { cutDownAmount: amountOne, cutDownSection: section, cutDownSubsection: subsection, 
            cutDownTimePeriod: timePeriod, cutDownTimeAmount: timeAmount, cutDownTimePeriodPlural: timePeriodPlural,
            cutDownBaseAmount: amountTwo };
        setCutDownList([...cutDownList, newEntry]);

        addCutDownPlan(newEntry);
    };

    const toggleLimitPlan = () => {
        setDisplayLimitPlan(prevState => !prevState);
        if (displayCutDownPlan) setDisplayCutDownPlan(false);
    };

    const toggleCutDownPlan = () => {
        setDisplayCutDownPlan(prevState => !prevState);
        if (displayLimitPlan) setDisplayLimitPlan(false);
    };

    return (
        <SafeAreaView style = {styles.overallContainer}>
            <View style = {styles.centeredContainer}>
                <Text style = {styles.h1Text}>Enter and Review Goals:</Text>
                <Pressable
                    style = {({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1 } 
                    ]}
                    onPress = {toggleLimitPlan}>
                    <Text style = {styles.planText}>Limit Plan:</Text>
                </Pressable>
                {displayLimitPlan && (
                    <View style = {styles.limitCutDownDisplay}>
                        <View style = {styles.limitCutDownView}>
                            <View style = {styles.rowContainer}>
                                <Text style={styles.h2Text}>Spend less than $</Text>
                                <TextInput
                                    style = {[styles.dropdown, { opacity: isFocused ? 0.5 : 1 }]}
                                    keyboardType = "decimal-pad"
                                    placeholder = '0.00'
                                    placeholderTextColor = 'black'
                                    value = {amountOne}
                                    onChangeText = {setAmountOne}
                                    returnKeyType = "done"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onSubmitEditing = {handleAmountOne}/>
                                <Text style = {styles.h2Text}>on</Text>
                            </View>
                            <View style = {styles.rowContainer}>
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
                                <Text style = {styles.h2Text}>this</Text>
                                <Pressable 
                                    style = {({ pressed }) => [
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalThreeVisible(true)}>  
                                    <Text style = {styles.dropdown}>{timePeriod}</Text>
                                </Pressable>
                                <Modal
                                    animationType = "slide"
                                    transparent = {true}
                                    visible = {modalThreeVisible}
                                    onRequestClose = {() => setModalThreeVisible(false)}>
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
                                                            setModalThreeVisible(false); 
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
                                                onPress = {() => setModalThreeVisible(false)}>
                                                <Text style = {styles.cancelText}>Cancel</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            <View style = {styles.rowContainer}>
                                <View style = {styles.finishButton}>
                                    <View style = {styles.finishButtonView}>
                                        <Pressable 
                                            style = {({ pressed }) => [
                                                { opacity: pressed ? 0.5 : 1 } 
                                            ]}
                                            onPress={() => {
                                                handleSubmissionOne();
                                                if (valid) {
                                                    setModalFourVisible(true)
                                                    handleLimitEntry();
                                                }
                                            }}>
                                            <Text style = {styles.h2Text}>Finish Goal</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View style = {styles.rowContainer}>
                                    <Modal
                                        animationType = "slide"
                                        transparent = {true}
                                        visible = {modalFourVisible}
                                        onRequestClose = {() => setModalFourVisible(false)}>
                                        <View style = {styles.outerModalView}>
                                            <View style = {styles.modalView}>
                                                <View style = {styles.submittedViewStyle}>
                                                    <Text style = {styles.h3Text}>Goal Submitted Successfully</Text>
                                                </View>
                                                <Pressable
                                                    style = {({ pressed }) => [
                                                        styles.cancelButton,
                                                        { opacity: pressed ? 0.5 : 1 } 
                                                    ]}
                                                    onPress = {() => setModalFourVisible(false)}>
                                                    <Text style = {styles.cancelText}>Dismiss</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            </View>
                        </View>
                    </View>   
                )}
                <Pressable
                    style = {({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1 } 
                    ]}
                    onPress = {toggleCutDownPlan}>
                    <Text style = {styles.planText}>Cut Down Plan:</Text>
                </Pressable>
                {displayCutDownPlan && (
                    <View style = {styles.limitCutDownDisplay}>
                        <View style = {styles.limitCutDownView}>
                            <View style = {styles.rowContainer}>
                                <Text style={styles.h2Text}>Spend $</Text>
                                <TextInput
                                    style = {[styles.dropdown, { opacity: isFocused ? 0.5 : 1 }]}
                                    keyboardType = "decimal-pad"
                                    placeholder = '0.00'
                                    placeholderTextColor = 'black'
                                    value = {amountOne}
                                    onChangeText = {setAmountOne}
                                    returnKeyType = "done"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onSubmitEditing = {handleAmountOne}/>
                                <Text style = {styles.h2Text}>less on</Text>
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
                                <Pressable 
                                    style = {({ pressed }) => [
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalTwoVisible(true)}>
                                    <Text style = {styles.dropdown}>{subsection}</Text>
                                </Pressable>
                                <Text style = {styles.h2Text}>each</Text>
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
                                <Pressable 
                                    style = {({ pressed }) => [
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalThreeVisible(true)}>  
                                    <Text style = {styles.dropdown}>{timePeriod}</Text>
                                </Pressable>
                                <Modal
                                    animationType = "slide"
                                    transparent = {true}
                                    visible = {modalThreeVisible}
                                    onRequestClose = {() => setModalThreeVisible(false)}>
                                    <View style = {styles.outerModalView}>
                                        <View style = {styles.modalView}>
                                            <ScrollView style = {styles.scrollViewStyle}>
                                                {timePeriods.map((measure, index) => (
                                                    <Pressable
                                                        key = {index}
                                                        style = {({ pressed }) => [
                                                            styles.optionsButton,
                                                            index < timePeriods.length && styles.optionBorder,
                                                            { opacity: pressed ? 0.5 : 1 }  
                                                        ]}
                                                        onPress = {() => {
                                                            setTimePeriod(measure);
                                                            setModalThreeVisible(false); 
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
                                                onPress = {() => setModalThreeVisible(false)}>
                                                <Text style = {styles.cancelText}>Cancel</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            <View style = {styles.rowContainer}>
                                <Text style = {styles.h2Text}>for</Text>
                                <Pressable 
                                    style = {({ pressed }) => [
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalFiveVisible(true)}>  
                                    <Text style = {styles.dropdown}>{timeAmount}</Text>
                                </Pressable>
                                <Modal
                                    animationType = "slide"
                                    transparent = {true}
                                    visible = {modalFiveVisible}
                                    onRequestClose = {() => setModalFiveVisible(false)}>
                                    <View style = {styles.outerModalView}>
                                        <View style = {styles.modalView}>
                                            <ScrollView style = {styles.scrollViewStyle}>
                                                {timeAmounts.map((timeAmount, index) => (
                                                    <Pressable
                                                        key = {index}
                                                        style = {({ pressed }) => [
                                                            styles.optionsButton,
                                                            index < timeAmounts.length && styles.optionBorder,
                                                            { opacity: pressed ? 0.5 : 1 }  
                                                        ]}
                                                        onPress = {() => {
                                                            setTimeAmount(timeAmount);
                                                            setModalFiveVisible(false); 
                                                        }}>
                                                        <Text style = {styles.optionsButton}>{timeAmount}</Text>
                                                    </Pressable>
                                                ))}
                                            </ScrollView>
                                            <Pressable
                                                style = {({ pressed }) => [
                                                    styles.cancelButton,
                                                    { opacity: pressed ? 0.5 : 1 } 
                                                ]}
                                                onPress = {() => setModalFiveVisible(false)}>
                                                <Text style = {styles.cancelText}>Cancel</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                                <Pressable 
                                    style = {({ pressed }) => [
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalSixVisible(true)}>  
                                    <Text style = {styles.dropdown}>{timePeriodPlural}</Text>
                                </Pressable>
                                <Modal
                                    animationType = "slide"
                                    transparent = {true}
                                    visible = {modalSixVisible}
                                    onRequestClose = {() => setModalSixVisible(false)}>
                                    <View style = {styles.outerModalView}>
                                        <View style = {styles.modalView}>
                                            <ScrollView style = {styles.scrollViewStyle}>
                                                {measurementsPlural.map((timePlural, index) => (
                                                    <Pressable
                                                        key = {index}
                                                        style = {({ pressed }) => [
                                                            styles.optionsButton,
                                                            index < timePeriodPlural.length && styles.optionBorder,
                                                            { opacity: pressed ? 0.5 : 1 }  
                                                        ]}
                                                        onPress = {() => {
                                                            setTimePeriodPlural(timePlural);
                                                            setModalSixVisible(false); 
                                                        }}>
                                                        <Text style = {styles.optionsButton}>{timePlural}</Text>
                                                    </Pressable>
                                                ))}
                                            </ScrollView>
                                            <Pressable
                                                style = {({ pressed }) => [
                                                    styles.cancelButton,
                                                    { opacity: pressed ? 0.5 : 1 } 
                                                ]}
                                                onPress = {() => setModalSixVisible(false)}>
                                                <Text style = {styles.cancelText}>Cancel</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                                <Text style={styles.h2Text}>with base $</Text>
                                <TextInput
                                    style = {[styles.dropdown, { opacity: isFocused ? 0.5 : 1 }]}
                                    keyboardType = "decimal-pad"
                                    placeholder = '0.00'
                                    placeholderTextColor = 'black'
                                    value = {amountTwo}
                                    onChangeText = {setAmountTwo}
                                    returnKeyType = "done"
                                    onFocus = {() => setIsFocused(true)}
                                    onBlur = {() => setIsFocused(false)}
                                    onSubmitEditing = {handleAmountTwo}/>
                            </View>
                            <View style = {styles.rowContainer}>
                                <View style = {styles.finishButton}>
                                    <View style = {styles.finishButtonView}>
                                        <Pressable 
                                            style = {({ pressed }) => [
                                                { opacity: pressed ? 0.5 : 1 } 
                                            ]}
                                            onPress={() => {
                                                handleSubmissionTwo();
                                                if (valid) {
                                                    setModalFourVisible(true)
                                                    handleCutDownEntry();
                                                }
                                            }}>
                                            <Text style = {styles.h2Text}>Finish Goal</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View style = {styles.rowContainer}>
                                    <Modal
                                        animationType = "slide"
                                        transparent = {true}
                                        visible = {modalFourVisible}
                                        onRequestClose = {() => setModalFourVisible(false)}>
                                        <View style = {styles.outerModalView}>
                                            <View style = {styles.modalView}>
                                                <View style = {styles.submittedViewStyle}>
                                                    <Text style = {styles.h3Text}>Goal Submitted Successfully</Text>
                                                </View>
                                                <Pressable
                                                    style = {({ pressed }) => [
                                                        styles.cancelButton,
                                                        { opacity: pressed ? 0.5 : 1 } 
                                                    ]}
                                                    onPress = {() => setModalFourVisible(false)}>
                                                    <Text style = {styles.cancelText}>Dismiss</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            </View>
                        </View>
                    </View>   
                )}
                <Text style = {styles.goalsText}>Current Goals:</Text>
                <View style = {styles.goalsContainer}>
                    <ScrollView style = {styles.scrollViewStyle}>
                        {test.map((num, index) => (
                            <Pressable
                                key = {index}
                                style = {({ pressed }) => [
                                    styles.optionsButton,
                                    index < test.length && styles.optionBorder,
                                    { opacity: pressed ? 0.5 : 1 }  
                                ]}
                                onPress = {() => {
                                    setGoal(num);
                                    setModalSevenVisible(true); 
                                }}>
                                <Text style = {styles.optionsButton}>{num}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Modal
                        animationType = "slide"
                        transparent = {true}
                        visible = {modalSevenVisible}
                        onRequestClose = {() => setModalSevenVisible(false)}>
                        <View style = {styles.outerModalView}>
                            <View style = {styles.modalView}>
                                <View style = {styles.submittedViewStyle}>
                                    <Text style = {styles.h3Text}>{goal}</Text>
                                </View>
                                <Pressable
                                    style = {({ pressed }) => [
                                        styles.cancelButton,
                                        { opacity: pressed ? 0.5 : 1 } 
                                    ]}
                                    onPress = {() => setModalSevenVisible(false)}>
                                    <Text style = {styles.cancelText}>Cancel</Text>
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
        marginTop: 10,
        fontSize: 32,
        textDecorationLine: 'underline',
    },
    h2Text: {
        fontSize: 13,
        paddingHorizontal: 5,
        paddingVertical: 5,
        textAlign: 'center',
        alignItems: 'center',
    },
    goalsText: {
        fontSize: 18,
        paddingHorizontal: 5,
        paddingVertical: 5,
        textAlign: 'center',
        alignItems: 'center',
    },
    planText: {
        fontSize: 18,
        marginTop: 2,
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        textAlign: 'center',
        alignItems: 'center',
        margin: 8,
    },
    limitCutDownDisplay: {
        flex: 1,
        width: '90%',
        borderRadius: 10,
        borderWidth: 15,  
        borderColor: 'green',
        padding: 14,
        marginTop: 8,
        margin: 8,
    },
    limitCutDownView: {
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        alignItems: 'center',
    },
    scrollViewStyle: {
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
    },
    goalsContainer: {
        flex: 1,
        width: '90%',
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 15,  
        borderColor: 'green',
        padding: 14,
    },
    optionsButton: {
        fontSize: 20,
        margin: 10,
    },
    optionBorder: {
        borderBottomWidth: 2,
        borderBottomColor: 'black', 
    },
    dropdown: {
        paddingHorizontal: 1,
        paddingVertical: 1,
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        marginTop: 2,
        fontSize: 13,
        marginRight: 2,
        textAlign: 'center',
        alignItems: 'center',
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
    finishButton: {
        flex: 0.9,
        width: '90%',
        marginTop: -15,
    },
    finishButtonView: {
        width: '100%',
        height: '50%',
        borderColor: 'black',
        borderWidth: 2, 
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
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
    h3Text: {
        fontSize: 40,
        textAlign: 'center',
    },
});

export default GoalsScreen;