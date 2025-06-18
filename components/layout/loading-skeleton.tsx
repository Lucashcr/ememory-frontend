import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type LoadingSkeletonProps = {
  mode: "review" | "subjects"
};

export default function LoadingSkeleton({ mode }: LoadingSkeletonProps) {
  const skeletonItems = Array.from({ length: 3 }, (_, index) => index);
  const translateX = useSharedValue(-width);

  // Array de estilos para as linhas
  const lineStyles = [styles.line0, styles.line1, styles.line2];

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 1000,
      }),
      -1,
      false
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {skeletonItems.map((item) => (
        // <View key={item} style={styles.card}>
        //   {[0, 1, 2].map((line) => (
        //     <View key={line} style={[styles.skeletonContent, lineStyles[line]]}>
        //       <AnimatedLinearGradient
        //         style={[styles.gradientContent, animatedStyle]}
        //         colors={["#efefef", "#f7f7f7", "#efefef"]}
        //         start={{ x: 0, y: 0 }}
        //         end={{ x: 1, y: 0 }}
        //       />
        //     </View>
        //   ))}
        // </View>
        mode === "review" ? (
          <View key={item} style={styles.card}>
            {[0, 1, 2].map((line) => (
              <View key={line} style={[styles.skeletonContent, lineStyles[line]]}>
                <AnimatedLinearGradient
                  style={[styles.gradientContent, animatedStyle]}
                  colors={["#efefef", "#f7f7f7", "#efefef"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View key={item} style={styles.card}>
            {[2].map((line) => (
              <View key={line} style={[styles.skeletonContent, styles.lineUnique]}>
                <AnimatedLinearGradient
                  style={[styles.gradientContent, animatedStyle]}
                  colors={["#efefef", "#f7f7f7", "#efefef"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            ))}
          </View>
        )
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  skeletonContent: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#efefef',
  },
  line0: {
    width: '72%',
    height: 16,
  },
  line1: {
    width: '80%',
    height: 8,
  },
  line2: {
    width: '60%',
    height: 8,
    marginBottom: 0,
  },
  lineUnique: {
    width: '72%',
    height: 16,
    marginBottom: 0,
  },
  gradientContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
