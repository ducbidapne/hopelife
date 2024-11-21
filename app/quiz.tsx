import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

const questions = [
  {
    id: 1,
    question:
      "#1. Does your partner complain about your friends or family members or make it difficult for you to see them?",
    correctAnswer: "NO",
    explanation:
      "If your partner says horrible things about your friends or family or makes it awkward for you to be around them, this is a warning sign of abuse, and it can get worse.",
  },
  {
    id: 2,
    question: "#2. Does your partner accuse you of things that aren’t true?",
    correctAnswer: "NO",
    explanation:
      "This behaviour is about jealousy and control, and it generates mistrust and can lead to feelings that you are ‘walking on eggshells’.This is a warning sign that the abuse is escalating.",
  },
  {
    id: 3,
    question:
      "#3. Does your partner or someone close to you, criticise you, put you down, or call you names?",
    correctAnswer: "NO",
    explanation:
      "Your partner is not showing you the respect that you deserve in a relationship.People who are abusive may try to justify their behaviour and blame you for their abuse – name-calling and criticising you can be part of this.",
  },
  {
    id: 4,
    question: "#4. Does your partner have a say in everything that you do?",
    correctAnswer: "NO",
    explanation:
      "If your partner tries to control any aspect of your life, such as what you do, who you see, what you wear or even what you eat, this is abusive. If you feel that you are not able to have an equal say in activities this can be a warning sign that the relationship is abusive.",
  },
  {
    id: 5,
    question: "#5. Does your partner gaslight you, make you doubt yourself or question your version of events? ",
    correctAnswer: "NO",
    explanation:
      "Gaslighting is the slow and purposeful practice of undermining your own sense of reality until you no longer trust your own memory or judgement and rely heavily on your partner.",
  },
  {
    id: 6,
    question: "#6. Does your partner lie to you?",
    correctAnswer: "NO",
    explanation:
      "Lying in a relationship is unhealthy and can reduce the trust between you. Telling lies repeatedly can be a red flag that they are covering something up, they find it difficult to confront something in the relationship, or that they are trying to deceive or manipulate you.",
  },
  {
    id: 7,
    question: "#6. Does your partner lie to you?",
    correctAnswer: "NO",
    explanation:
      "Your partner is putting you at risk.People who are abusive may use violence, threats of violence or their physical presence to gain power and control over you. This can include throwing or breaking things as well as hitting, punching, pushing, or biting.",
  },
  {
    id: 8,
    question: "#8. Are you frightened of your partner but only when they have been drinking or taking drugs?",
    correctAnswer: "NO",
    explanation:
      "Alcohol and drug misuse is not an excuse for abusive behaviour. People who are abusive may blame alcohol or drugs for their behaviour. Alcohol and drugs can make someone more unpredictable; they may lose their inhibitions and behave in a more risky or unsafe way. However, alcohol or drug misuse doesn’t cause someone to become violent or abusive and the behaviour may continue when they are no longer under the influence.",
  },
  {
    id: 9,
    question: "#9. Does your partner check up on you, monitor where you go or make you check in with them?",
    correctAnswer: "NO",
    explanation:
      "Your partner is limiting your freedom. This is a form of control and could be abusive.Abusive people may expect regular calls and messages and for you to reply quickly, this can escalate to wanting to know where you are and what you’re doing.",
  },
  {
    id: 10,
    question: "#10. Are you ever worried that your children are seeing or hearing things that they shouldn’t be?",
    correctAnswer: "NO",
    explanation:
      "Children can be badly affected by hearing shouting, witnessing one of their parents being put down or seeing people being violent to each other. Children don’t have to be in the same room to feel the negative impacts of abusive behaviour and are recognised as victims in their own right.",
  },
];

export default function Quiz() {
  const {theme} = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const router = useRouter();

  const handleAnswer = (answer: string) => {
    const correct = questions[currentQuestion].correctAnswer === answer;
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push("/(tabs)");
    }
  };

  const previousQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const colors = theme === 'dark' ? ['#333333', '#1A1A1A'] : ['#C9E9D2', '#FEF9F2'];
  const textColor = theme === 'dark' ? '#FFFFFF' : '#4A6FA5';
  const inputBackgroundColor = theme === 'dark' ? '#666' : '#fff';
  const inputBorderColor = theme === 'dark' ? '#888' : '#ccc';
  const buttonColor = theme === 'dark' ? '#666' : '#4A6FA5';
  const buttonText = theme === 'dark' ? '#FFFFFF' : '#ffffff';

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color="#4CAF50"
        onPress={() => router.push("/(tabs)")}
        style={styles.backIcon}
      />
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, {color: textColor}]}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={[styles.question, {color: textColor}]}>
          {questions[currentQuestion].question}
        </Text>
      </View>

      {!showExplanation ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonYes]}
            onPress={() => handleAnswer("YES")}
          >
            <Text style={styles.buttonText}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonNo]}
            onPress={() => handleAnswer("NO")}
          >
            <Text style={styles.buttonText}>NO</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text
            style={[
              styles.answerHighlight,
              { color: isCorrect ? "#4CAF50" : "#F44336" },
            ]}
          >
            {isCorrect ? "Good!" : "Explanation:"}
          </Text>
          {!isCorrect && (
            <Text style={styles.explanation}>
              {questions[currentQuestion].explanation}
            </Text>
          )}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={nextQuestion}
          >
            <Text style={styles.buttonText}>
              {currentQuestion === questions.length - 1 ? "FINISH" : "CONTINUE"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {currentQuestion > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={previousQuestion}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1F8E9",
  },
  backIcon: {
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  question: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#37474F",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },
  buttonYes: {
    backgroundColor: "#FFCDD2",
  },
  buttonNo: {
    backgroundColor: "#BBDEFB",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#37474F",
  },
  answerHighlight: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  explanation: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    textAlign: "justify",
    color: "#37474F",
  },
  continueButton: {
    backgroundColor: "#A5D6A7",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
