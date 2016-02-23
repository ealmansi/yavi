package de.mpg.mpi.inf.d5.yavi.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import de.mpg.mpi.inf.d5.yavi.server.beans.DayNumberValuePair;

public class PageActivitySignalUtil {
  public static double computeSumOfValues(List<DayNumberValuePair> pageActivitySignal) {
    double sumOfValues = 0.0;
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      sumOfValues += dayNumberValuePair.getValue();
    }
    return sumOfValues;
  }

  public static double computeMaxValue(List<DayNumberValuePair> pageActivitySignal) {
    if (pageActivitySignal.isEmpty()) {
      return 0;
    }
    int maxValue = pageActivitySignal.get(0).getValue();
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      int value = dayNumberValuePair.getValue();
      if (value > maxValue) {
        maxValue = value;
      }
    }
    return maxValue;
  }

  public static double computeMaxValueWindow(List<DayNumberValuePair> pageActivitySignal, int windowSize) {
    int queueLength = windowSize + 1;
    List<Integer> dayQueue = new ArrayList<>(Collections.nCopies(queueLength, -1));
    List<Integer> valueQueue = new ArrayList<>(Collections.nCopies(queueLength, -1));
    int queueBegin = 0;
    int queueEnd = 0;
    int valueQueueSum = 0, maxValueQueueSum = 0;
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      int day = dayNumberValuePair.getDayNumber();
      int value = dayNumberValuePair.getValue();
      // Vacate elements no longer within the window.
      while (queueBegin != queueEnd && dayQueue.get(queueBegin) <= day - windowSize) {
        valueQueueSum -= valueQueue.get(queueBegin);
        queueBegin = (queueBegin + 1) % queueLength;
      }
      dayQueue.set(queueEnd, day);
      valueQueue.set(queueEnd, value);
      valueQueueSum += value;
      if (valueQueueSum > maxValueQueueSum) {
        maxValueQueueSum = valueQueueSum; 
      }
      queueEnd = (queueEnd + 1) % queueLength;
    }
    return maxValueQueueSum;
  }

  public static double computePercentageIncreaseInValues(List<DayNumberValuePair> pageActivitySignal) {
    if (pageActivitySignal.isEmpty()) {
      return 0.0;
    }
    double firstDayValue = pageActivitySignal.get(0).getValue();
    double lastDayValue = pageActivitySignal.get(pageActivitySignal.size() - 1).getValue();
    return computePercentageIncrease(firstDayValue, lastDayValue);
  }

  public static double computeAggregatedPercentageIncreaseInValues(List<DayNumberValuePair> pageActivitySignal) {
    if (pageActivitySignal.isEmpty()) {
      return 0.0;
    }
    double aggregatedPercentageIncrease = 0.0;
    for (int i = 0; i < pageActivitySignal.size() - 1; ++i) {
      double dayValue = pageActivitySignal.get(i).getValue();
      double nextDayValue = pageActivitySignal.get(i + 1).getValue();
      double percentageIncrease = computePercentageIncrease(dayValue, nextDayValue);
      if (percentageIncrease >= 0.0) {
        aggregatedPercentageIncrease += percentageIncrease;
      } else {
        aggregatedPercentageIncrease -= percentageIncrease;
      }
    }
    return aggregatedPercentageIncrease;
  }

  public static double computeSafePercentage(double numerator, double denominator) {
    double ratio = numerator / denominator;
    if (Double.isNaN(ratio)) {
      return 0.0;
    }
    return 100.0 * ratio;
  }

  public static double computePercentageIncrease(double value, double nextValue) {
    return computeSafePercentage(nextValue - value, value);
  }
}
