import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { measurements, test, visualizationOptions } from "../components/lists";
import { displayVisualization } from "../components/db";
import { useFocusEffect } from "@react-navigation/native";
import { useSpendingGoals } from "../Context";

const VisualizationScreen: React.FC = () => {
  const [modalOneVisible, setModalOneVisible] = useState<boolean>(false);
  const [modalTwoVisible, setModalTwoVisible] = useState<boolean>(false);
  const [timePeriod, setTimePeriod] = useState<string>("Day");
  const [visualizationTopic, setVisualizationTopic] =
    useState<string>("Sections");
  const [subsectionNum, setSubsectionNum] = useState<number>(0);
  const {
    sectionSelected,
    setSectionSelected,
    visualizationList,
    updateVisualizationList,
  } = useSpendingGoals();

  const getSubName = (name: string) => {
    switch (name) {
      case "Sections":
        return 0;
      case "Food/Beverages Subsections":
        return 1;

      case "Self Care/Health Subsections":
        return 2;

      case "Clothes Subsections":
        return 3;

      case "Fun Subsections":
        return 4;

      case "Gifts Subsections":
        return 5;

      case "Technology Subsections":
        return 6;

      case "Housing Subsections":
        return 7;

      case "Transportation Subsections":
        return 8;

      case "Utilities Subsections":
        return 9;

      case "Insurance Subsections":
        return 10;

      case "Debt Subsections":
        return 11;

      case "Miscellaneous Subsections":
        return 12;
    }
    return 0;
  };

  const updateVisualization = async () => {
    try {
      console.log("Updating visualization data again...");

      setSectionSelected(false);
      if (visualizationTopic === "Sections") {
        console.log("Setting section...");
        setSectionSelected(true);
      }

      const sectionNum = getSubName(visualizationTopic);

      const results = await displayVisualization(
        timePeriod,
        visualizationTopic === "Sections",
        sectionNum
      );
      console.log("Results:", results);
      updateVisualizationList(results, visualizationTopic === "Sections");
    } catch (error) {
      console.error("Failed to update visualization data:", error);
    }
  };

  useEffect(() => {
    console.log("Visualization list:", visualizationList);

    updateVisualization();
    console.log("Visualization list:", visualizationList);
  }, [visualizationTopic, timePeriod]);

  useFocusEffect(
    useCallback(() => {
      updateVisualization();
      console.log("Visualization list:", visualizationList);
    }, [timePeriod, visualizationTopic])
  );

  return (
    <SafeAreaView style={styles.overallContainer}>
      <View style={styles.centeredContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.h1Text}>Visualization For This</Text>
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            onPress={() => setModalOneVisible(true)}
          >
            <Text style={styles.dropdown1}>{timePeriod}</Text>
          </Pressable>
          <Text style={styles.h1Text}>:</Text>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalOneVisible}
            onRequestClose={() => setModalOneVisible(false)}
          >
            <View style={styles.outerModalView}>
              <View style={styles.modalView}>
                <ScrollView style={styles.scrollViewStyle}>
                  {measurements.map((measure, index) => (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.optionsButton,
                        index < measurements.length && styles.optionBorder,
                        { opacity: pressed ? 0.5 : 1 },
                      ]}
                      onPress={() => {
                        setTimePeriod(measure);
                        setModalOneVisible(false);
                      }}
                    >
                      <Text style={styles.optionsButton}>{measure}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  onPress={() => setModalOneVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.h2Text}>Enter Topic:</Text>
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            onPress={() => setModalTwoVisible(true)}
          >
            <Text style={styles.dropdown2}>{visualizationTopic}</Text>
          </Pressable>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalTwoVisible}
            onRequestClose={() => setModalTwoVisible(false)}
          >
            <View style={styles.outerModalView}>
              <View style={styles.modalView}>
                <ScrollView style={styles.scrollViewStyle}>
                  {visualizationOptions.map((topic, index) => (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.optionsButton,
                        index < visualizationOptions.length &&
                          styles.optionBorder,
                        { opacity: pressed ? 0.5 : 1 },
                      ]}
                      onPress={() => {
                        setVisualizationTopic(topic);
                        setModalTwoVisible(false);
                      }}
                    >
                      <Text style={styles.optionsButton}>{topic}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  onPress={() => setModalTwoVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.contributorsContainer}>
          <ScrollView style={styles.scrollViewStyle}>
            {visualizationList.map((visual: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.optionsButton,
                  index < visualizationList.length && styles.optionBorder,
                ]}
              >
                <Text style={styles.optionsButton}>{visual}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 15,
    borderColor: "green",
  },
  centeredContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  h1Text: {
    fontSize: 25,
    textDecorationLine: "underline",
    marginRight: 5,
    marginTop: 10,
  },
  h2Text: {
    fontSize: 18,
    marginTop: 10,
    marginRight: 5,
  },
  dropdown1: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 25,
    textDecorationLine: "underline",
    marginRight: 5,
    textAlign: "center",
    alignItems: "center",
  },
  dropdown2: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 18,
    marginRight: 5,
    textAlign: "center",
    alignItems: "center",
  },
  modalView: {
    height: "50%",
    marginTop: "auto",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
    borderWidth: 15,
    borderColor: "green",
  },
  scrollViewStyle: {
    width: "100%",
    height: "100%",
    borderColor: "black",
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
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
  },
  cancelText: {
    fontSize: 40,
  },
  optionBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  outerModalView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contributorsContainer: {
    flex: 0.96,
    width: "90%",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 15,
    borderColor: "green",
    padding: 14,
  },
});

export default VisualizationScreen;
