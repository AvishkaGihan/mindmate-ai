import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Typography } from "../common/Typography";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { formatDate, getDayName } from "../../utils/dateTime";

/**
 * MoodChart Component
 * Visualizes mood trends over time using a line chart.
 * Supports 7d, 30d, and 90d views based on the provided data context.
 */

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - Spacing.md * 2; // Full width minus container padding
const CHART_HEIGHT = 220;

export type ChartPeriod = "7d" | "30d" | "90d";

interface DailyStat {
  date: string; // ISO date string
  averageIntensity: number; // 1-10
  moodCount?: number;
}

interface MoodChartProps {
  data: DailyStat[];
  period: ChartPeriod;
  isLoading?: boolean;
}

export const MoodChart: React.FC<MoodChartProps> = ({
  data,
  period,
  isLoading = false,
}) => {
  // Memoize chart data preparation to prevent expensive recalculations
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Sort data by date ascending just in case
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filter/Format labels to prevent overcrowding on small screens
    const labels = sortedData.map((d, index) => {
      // For 7d, show Day Name (Mon, Tue)
      if (period === "7d") return getDayName(d.date, true);

      // For 30d, show every 5th date (Dec 1, Dec 6...)
      if (period === "30d" && index % 5 !== 0) return "";
      if (period === "30d") return formatDate(d.date).split(",")[0]; // "Dec 1"

      // For 90d, show sparse labels
      if (period === "90d" && index % 14 !== 0) return "";
      if (period === "90d") return formatDate(d.date).split(",")[0];

      return "";
    });

    const values = sortedData.map((d) => d.averageIntensity);

    return {
      labels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(27, 160, 152, ${opacity})`, // Teal
          strokeWidth: 3,
        },
      ],
    };
  }, [data, period]);

  // 1. Loading State
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </View>
    );
  }

  // 2. Empty State
  if (!chartData || data.length < 2) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Typography
          variant="body"
          color={Colors.light.textSecondary}
          style={{ textAlign: "center" }}
        >
          Not enough data yet.{"\n"}Log your mood for a few days to see trends!
        </Typography>
      </View>
    );
  }

  // 3. Render Chart
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        Emotional Trend
      </Typography>

      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: Colors.light.neutral,
          backgroundGradientFrom: Colors.light.neutral,
          backgroundGradientTo: Colors.light.neutral,
          decimalPlaces: 1,
          color: (opacity = 1) => Colors.light.primary,
          labelColor: (opacity = 1) => Colors.light.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: Colors.light.primary,
            fill: Colors.light.neutral,
          },
          propsForBackgroundLines: {
            strokeDasharray: "", // Solid lines
            stroke: "#F0F0F0",
          },
        }}
        bezier // Smooth curves
        style={styles.chart}
        withVerticalLines={false}
        fromZero
        segments={5} // 0, 2, 4, 6, 8, 10
      />

      <View style={styles.legend}>
        <Typography variant="caption" color={Colors.light.textSecondary}>
          Intensity (1-10) over time
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.neutral,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    alignSelf: "flex-start",
    marginBottom: Spacing.md,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 32, // Fix for clipped labels on the right
  },
  legend: {
    marginTop: Spacing.xs,
    alignSelf: "center",
  },
});
